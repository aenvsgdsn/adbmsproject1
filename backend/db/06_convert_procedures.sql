-- Drop old routines (handles both Procedures and Functions safely)
DROP ROUTINE IF EXISTS EnrollStudentInCourse(UUID, UUID, UUID);
DROP ROUTINE IF EXISTS ApprovePayment(UUID, UUID);
DROP ROUTINE IF EXISTS IssueBook(UUID, UUID, UUID);
DROP ROUTINE IF EXISTS ReturnBook(UUID, UUID);
DROP ROUTINE IF EXISTS AllocateRoom(UUID, UUID, UUID);

-- Recreate as Functions
CREATE OR REPLACE FUNCTION enrollstudentincourse(
    p_student_id UUID,
    p_section_id UUID,
    p_user_id UUID -- For audit log
)
RETURNS void
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
    SELECT status INTO v_student_status FROM students WHERE student_id = p_student_id;
    IF v_student_status IS NULL THEN RAISE EXCEPTION 'Student not found'; END IF;
    IF v_student_status != 'Active' THEN RAISE EXCEPTION 'Student is not active'; END IF;

    v_outstanding_fee := fn_outstanding_fee(p_student_id);
    IF v_outstanding_fee > 0 THEN RAISE EXCEPTION 'Student has outstanding fees'; END IF;

    SELECT available_seats, course_id INTO v_available_seats, v_course_id
    FROM sections WHERE section_id = p_section_id FOR UPDATE;
    
    IF v_available_seats <= 0 THEN RAISE EXCEPTION 'No seats available in this section'; END IF;

    SELECT COUNT(*) INTO v_enrolled_count FROM enrollments WHERE student_id = p_student_id AND section_id = p_section_id;
    IF v_enrolled_count > 0 THEN RAISE EXCEPTION 'Student is already enrolled in this section'; END IF;

    INSERT INTO enrollments (student_id, section_id, status) VALUES (p_student_id, p_section_id, 'Enrolled');
    UPDATE sections SET available_seats = available_seats - 1 WHERE section_id = p_section_id;

    INSERT INTO audit_logs (user_id, action, table_name, record_id, new_data)
    VALUES (p_user_id, 'INSERT', 'enrollments', p_student_id, jsonb_build_object('student_id', p_student_id, 'section_id', p_section_id));

    INSERT INTO notifications (user_id, title, message)
    SELECT user_id, 'Course Enrollment', 'Successfully enrolled in course section.'
    FROM students WHERE student_id = p_student_id;
END;
$$;


CREATE OR REPLACE FUNCTION approvepayment(
    p_payment_id UUID,
    p_user_id UUID -- Admin/Finance User
)
RETURNS void
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

    IF v_status = 'Verified' THEN RAISE EXCEPTION 'Payment is already verified'; END IF;

    UPDATE fee_payments SET status = 'Verified', paid_at = CURRENT_TIMESTAMP WHERE payment_id = p_payment_id;

    UPDATE student_fees 
    SET paid = paid + v_amount, 
        remaining = remaining - v_amount,
        status = CASE WHEN remaining - v_amount <= 0 THEN 'Paid'::fee_status ELSE 'Partial'::fee_status END
    WHERE student_fee_id = v_student_fee_id;

    INSERT INTO receipts (payment_id) VALUES (p_payment_id) RETURNING receipt_id INTO v_receipt_id;

    INSERT INTO notifications (user_id, title, message)
    SELECT user_id, 'Payment Approved', 'Your fee payment has been verified and a receipt has been generated.'
    FROM students WHERE student_id = v_student_id;

    INSERT INTO audit_logs (user_id, action, table_name, record_id, new_data)
    VALUES (p_user_id, 'UPDATE', 'fee_payments', p_payment_id, jsonb_build_object('status', 'Verified'));
END;
$$;


CREATE OR REPLACE FUNCTION issuebook(
    p_book_id UUID,
    p_user_id UUID,
    p_admin_user_id UUID
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    v_available INT;
    v_issue_id UUID;
BEGIN
    SELECT available INTO v_available FROM library_items WHERE book_id = p_book_id FOR UPDATE;

    IF v_available <= 0 THEN RAISE EXCEPTION 'Book is currently not available'; END IF;

    INSERT INTO library_issues (book_id, user_id, due_date)
    VALUES (p_book_id, p_user_id, CURRENT_DATE + INTERVAL '14 days')
    RETURNING issue_id INTO v_issue_id;

    UPDATE library_items SET available = available - 1 WHERE book_id = p_book_id;

    INSERT INTO audit_logs (user_id, action, table_name, record_id, new_data)
    VALUES (p_admin_user_id, 'INSERT', 'library_issues', v_issue_id, jsonb_build_object('book_id', p_book_id, 'user_id', p_user_id));
END;
$$;


CREATE OR REPLACE FUNCTION returnbook(
    p_issue_id UUID,
    p_admin_user_id UUID
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    v_book_id UUID;
    v_fine DECIMAL(10,2);
BEGIN
    SELECT book_id INTO v_book_id FROM library_issues WHERE issue_id = p_issue_id FOR UPDATE;

    v_fine := fn_library_fine(p_issue_id);

    UPDATE library_issues SET return_date = CURRENT_DATE, status = 'Returned' WHERE issue_id = p_issue_id;
    UPDATE library_items SET available = available + 1 WHERE book_id = v_book_id;

    IF v_fine > 0 THEN
        INSERT INTO library_fines (issue_id, amount) VALUES (p_issue_id, v_fine);
    END IF;

    INSERT INTO audit_logs (user_id, action, table_name, record_id, new_data)
    VALUES (p_admin_user_id, 'UPDATE', 'library_issues', p_issue_id, jsonb_build_object('status', 'Returned'));
END;
$$;


CREATE OR REPLACE FUNCTION allocateroom(
    p_student_id UUID,
    p_room_id UUID,
    p_admin_user_id UUID
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    v_capacity INT;
    v_occupied INT;
    v_allotment_id UUID;
BEGIN
    SELECT capacity, occupied INTO v_capacity, v_occupied FROM rooms WHERE room_id = p_room_id FOR UPDATE;

    IF v_occupied >= v_capacity THEN RAISE EXCEPTION 'Room is at full capacity'; END IF;

    IF EXISTS (SELECT 1 FROM hostel_allotments WHERE student_id = p_student_id AND status = 'Active') THEN
        RAISE EXCEPTION 'Student is already allocated to a room';
    END IF;

    INSERT INTO hostel_allotments (student_id, room_id) VALUES (p_student_id, p_room_id) RETURNING allotment_id INTO v_allotment_id;
    UPDATE rooms SET occupied = occupied + 1 WHERE room_id = p_room_id;

    INSERT INTO audit_logs (user_id, action, table_name, record_id, new_data)
    VALUES (p_admin_user_id, 'INSERT', 'hostel_allotments', v_allotment_id, jsonb_build_object('student_id', p_student_id, 'room_id', p_room_id));
END;
$$;
