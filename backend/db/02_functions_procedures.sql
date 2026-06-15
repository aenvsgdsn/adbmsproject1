-- HiSUP 2.0 Functions and Stored Procedures

-- ==========================================
-- FUNCTIONS
-- ==========================================

-- Calculate Attendance Percentage for a Student in a Section
CREATE OR REPLACE FUNCTION fn_attendance_percentage(p_student_id UUID, p_section_id UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    total_classes INT;
    attended_classes INT;
    percentage DECIMAL(5,2);
BEGIN
    SELECT COUNT(*) INTO total_classes
    FROM attendance_records
    WHERE student_id = p_student_id AND section_id = p_section_id;

    IF total_classes = 0 THEN
        RETURN 0.00;
    END IF;

    SELECT COUNT(*) INTO attended_classes
    FROM attendance_records
    WHERE student_id = p_student_id AND section_id = p_section_id AND status = 'Present';

    percentage := (attended_classes::DECIMAL / total_classes::DECIMAL) * 100;
    RETURN percentage;
END;
$$ LANGUAGE plpgsql;

-- Check Available Seats for a Section
CREATE OR REPLACE FUNCTION fn_available_seats(p_section_id UUID)
RETURNS INT AS $$
DECLARE
    seats INT;
BEGIN
    SELECT available_seats INTO seats FROM sections WHERE section_id = p_section_id;
    RETURN COALESCE(seats, 0);
END;
$$ LANGUAGE plpgsql;

-- Calculate Outstanding Fee for a Student
CREATE OR REPLACE FUNCTION fn_outstanding_fee(p_student_id UUID)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    total_outstanding DECIMAL(10,2);
BEGIN
    SELECT SUM(remaining) INTO total_outstanding
    FROM student_fees
    WHERE student_id = p_student_id;
    
    RETURN COALESCE(total_outstanding, 0.00);
END;
$$ LANGUAGE plpgsql;

-- Calculate Library Fine
CREATE OR REPLACE FUNCTION fn_library_fine(p_issue_id UUID)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    v_due_date DATE;
    v_return_date DATE;
    v_days_late INT;
    v_fine_per_day DECIMAL(10,2) := 50.00; -- Configurable fine rate
BEGIN
    SELECT due_date, COALESCE(return_date, CURRENT_DATE) INTO v_due_date, v_return_date
    FROM library_issues
    WHERE issue_id = p_issue_id;

    IF v_return_date > v_due_date THEN
        v_days_late := v_return_date - v_due_date;
        RETURN v_days_late * v_fine_per_day;
    END IF;

    RETURN 0.00;
END;
$$ LANGUAGE plpgsql;


-- ==========================================
-- STORED PROCEDURES
-- ==========================================

-- Enroll Student in Course (Transaction)
CREATE OR REPLACE PROCEDURE EnrollStudentInCourse(
    p_student_id UUID,
    p_section_id UUID,
    p_user_id UUID -- For audit log
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_student_status student_status;
    v_outstanding_fee DECIMAL(10,2);
    v_available_seats INT;
    v_prereq_count INT;
    v_course_id UUID;
    v_enrolled_count INT;
BEGIN
    -- 1. Check Student Exists and Active
    SELECT status INTO v_student_status FROM students WHERE student_id = p_student_id;
    IF v_student_status IS NULL THEN
        RAISE EXCEPTION 'Student not found';
    END IF;
    IF v_student_status != 'Active' THEN
        RAISE EXCEPTION 'Student is not active';
    END IF;

    -- 2. Check Fee Cleared
    v_outstanding_fee := fn_outstanding_fee(p_student_id);
    IF v_outstanding_fee > 0 THEN
        RAISE EXCEPTION 'Student has outstanding fees';
    END IF;

    -- 3. Check Seat Available
    SELECT available_seats, course_id INTO v_available_seats, v_course_id
    FROM sections WHERE section_id = p_section_id FOR UPDATE; -- Lock row for update
    
    IF v_available_seats <= 0 THEN
        RAISE EXCEPTION 'No seats available in this section';
    END IF;

    -- 4. Check Duplicate Enrollment
    SELECT COUNT(*) INTO v_enrolled_count FROM enrollments WHERE student_id = p_student_id AND section_id = p_section_id;
    IF v_enrolled_count > 0 THEN
        RAISE EXCEPTION 'Student is already enrolled in this section';
    END IF;

    -- 5. Execute Transaction
    -- INSERT enrollment
    INSERT INTO enrollments (student_id, section_id, status) VALUES (p_student_id, p_section_id, 'Enrolled');

    -- UPDATE seats
    UPDATE sections SET available_seats = available_seats - 1 WHERE section_id = p_section_id;

    -- INSERT audit log
    INSERT INTO audit_logs (user_id, action, table_name, record_id, new_data)
    VALUES (p_user_id, 'INSERT', 'enrollments', p_student_id, jsonb_build_object('student_id', p_student_id, 'section_id', p_section_id));

    -- Optional: Create Notification
    INSERT INTO notifications (user_id, title, message)
    SELECT user_id, 'Course Enrollment', 'Successfully enrolled in course section.'
    FROM students WHERE student_id = p_student_id;

    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;
$$;

-- Approve Payment
CREATE OR REPLACE PROCEDURE ApprovePayment(
    p_payment_id UUID,
    p_user_id UUID -- Admin/Finance User
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_student_id UUID;
    v_student_fee_id UUID;
    v_amount DECIMAL(10,2);
    v_status payment_status;
    v_receipt_id UUID;
BEGIN
    SELECT student_id, student_fee_id, amount, status INTO v_student_id, v_student_fee_id, v_amount, v_status
    FROM fee_payments WHERE payment_id = p_payment_id FOR UPDATE;

    IF v_status = 'Verified' THEN
        RAISE EXCEPTION 'Payment is already verified';
    END IF;

    -- Update Payment Status
    UPDATE fee_payments SET status = 'Verified', paid_at = CURRENT_TIMESTAMP WHERE payment_id = p_payment_id;

    -- Update Student Fee Balance
    UPDATE student_fees 
    SET paid = paid + v_amount, 
        remaining = remaining - v_amount,
        status = CASE WHEN remaining - v_amount <= 0 THEN 'Paid'::fee_status ELSE 'Partial'::fee_status END
    WHERE student_fee_id = v_student_fee_id;

    -- Generate Receipt
    INSERT INTO receipts (payment_id) VALUES (p_payment_id) RETURNING receipt_id INTO v_receipt_id;

    -- Create Notification
    INSERT INTO notifications (user_id, title, message)
    SELECT user_id, 'Payment Approved', 'Your fee payment has been verified and a receipt has been generated.'
    FROM students WHERE student_id = v_student_id;

    -- Create Audit Log
    INSERT INTO audit_logs (user_id, action, table_name, record_id, new_data)
    VALUES (p_user_id, 'UPDATE', 'fee_payments', p_payment_id, jsonb_build_object('status', 'Verified'));

    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;
$$;

-- Issue Book
CREATE OR REPLACE PROCEDURE IssueBook(
    p_book_id UUID,
    p_user_id UUID,
    p_admin_user_id UUID
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_available INT;
    v_issue_id UUID;
BEGIN
    SELECT available INTO v_available FROM library_items WHERE book_id = p_book_id FOR UPDATE;

    IF v_available <= 0 THEN
        RAISE EXCEPTION 'Book is currently not available';
    END IF;

    -- Insert Issue Record
    INSERT INTO library_issues (book_id, user_id, due_date)
    VALUES (p_book_id, p_user_id, CURRENT_DATE + INTERVAL '14 days')
    RETURNING issue_id INTO v_issue_id;

    -- Reduce Copies
    UPDATE library_items SET available = available - 1 WHERE book_id = p_book_id;

    -- Audit Log
    INSERT INTO audit_logs (user_id, action, table_name, record_id, new_data)
    VALUES (p_admin_user_id, 'INSERT', 'library_issues', v_issue_id, jsonb_build_object('book_id', p_book_id, 'user_id', p_user_id));

    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;
$$;

-- Return Book
CREATE OR REPLACE PROCEDURE ReturnBook(
    p_issue_id UUID,
    p_admin_user_id UUID
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_book_id UUID;
    v_fine DECIMAL(10,2);
BEGIN
    SELECT book_id INTO v_book_id FROM library_issues WHERE issue_id = p_issue_id FOR UPDATE;

    -- Calculate Fine
    v_fine := fn_library_fine(p_issue_id);

    -- Update Record
    UPDATE library_issues SET return_date = CURRENT_DATE, status = 'Returned' WHERE issue_id = p_issue_id;

    -- Increase Copies
    UPDATE library_items SET available = available + 1 WHERE book_id = v_book_id;

    -- If fine exists, insert into library_fines
    IF v_fine > 0 THEN
        INSERT INTO library_fines (issue_id, amount) VALUES (p_issue_id, v_fine);
    END IF;

    -- Audit Log
    INSERT INTO audit_logs (user_id, action, table_name, record_id, new_data)
    VALUES (p_admin_user_id, 'UPDATE', 'library_issues', p_issue_id, jsonb_build_object('status', 'Returned'));

    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;
$$;

-- Allocate Room
CREATE OR REPLACE PROCEDURE AllocateRoom(
    p_student_id UUID,
    p_room_id UUID,
    p_admin_user_id UUID
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_capacity INT;
    v_occupied INT;
    v_allotment_id UUID;
BEGIN
    SELECT capacity, occupied INTO v_capacity, v_occupied FROM rooms WHERE room_id = p_room_id FOR UPDATE;

    IF v_occupied >= v_capacity THEN
        RAISE EXCEPTION 'Room is at full capacity';
    END IF;

    -- Check if student already has a room
    IF EXISTS (SELECT 1 FROM hostel_allotments WHERE student_id = p_student_id AND status = 'Active') THEN
        RAISE EXCEPTION 'Student is already allocated to a room';
    END IF;

    -- Allocate Room
    INSERT INTO hostel_allotments (student_id, room_id) VALUES (p_student_id, p_room_id) RETURNING allotment_id INTO v_allotment_id;

    -- Update Occupancy
    UPDATE rooms SET occupied = occupied + 1 WHERE room_id = p_room_id;

    -- Audit Log
    INSERT INTO audit_logs (user_id, action, table_name, record_id, new_data)
    VALUES (p_admin_user_id, 'INSERT', 'hostel_allotments', v_allotment_id, jsonb_build_object('student_id', p_student_id, 'room_id', p_room_id));

    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;
$$;
