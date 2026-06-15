require('dotenv').config();
const supabase = require('./src/config/supabase');

async function fixDatabase() {
  // We will change the PROCEDURE to a FUNCTION so PostgREST RPC handles it perfectly
  const sql = `
    -- Add image_url to support the new UI
    ALTER TABLE library_items ADD COLUMN IF NOT EXISTS image_url TEXT;
    ALTER TABLE courses ADD COLUMN IF NOT EXISTS image_url TEXT;
    ALTER TABLE hostels ADD COLUMN IF NOT EXISTS image_url TEXT;

    DROP PROCEDURE IF EXISTS EnrollStudentInCourse(UUID, UUID, UUID);
    
    CREATE OR REPLACE FUNCTION enrollstudentincourse(
        p_student_id UUID,
        p_section_id UUID,
        p_user_id UUID
    ) RETURNS void
    LANGUAGE plpgsql
    AS $$
    DECLARE
        v_student_status student_status;
        v_outstanding_fee DECIMAL(10,2);
        v_available_seats INT;
        v_enrolled_count INT;
    BEGIN
        -- 1. Check Student Exists and Active
        SELECT status INTO v_student_status FROM students WHERE student_id = p_student_id;
        IF v_student_status IS NULL THEN RAISE EXCEPTION 'Student not found'; END IF;
        IF v_student_status != 'Active' THEN RAISE EXCEPTION 'Student is not active'; END IF;

        -- 2. Check Fee Cleared
        v_outstanding_fee := fn_outstanding_fee(p_student_id);
        IF v_outstanding_fee > 0 THEN RAISE EXCEPTION 'Student has outstanding fees'; END IF;

        -- 3. Check Seat Available
        SELECT available_seats INTO v_available_seats FROM sections WHERE section_id = p_section_id FOR UPDATE;
        IF v_available_seats <= 0 THEN RAISE EXCEPTION 'No seats available in this section'; END IF;

        -- 4. Check Duplicate Enrollment
        SELECT COUNT(*) INTO v_enrolled_count FROM enrollments WHERE student_id = p_student_id AND section_id = p_section_id;
        IF v_enrolled_count > 0 THEN RAISE EXCEPTION 'Student is already enrolled in this section'; END IF;

        -- 5. Execute Transaction
        INSERT INTO enrollments (student_id, section_id, status) VALUES (p_student_id, p_section_id, 'Enrolled');
        UPDATE sections SET available_seats = available_seats - 1 WHERE section_id = p_section_id;
        
        INSERT INTO audit_logs (user_id, action, table_name, record_id, new_data)
        VALUES (p_user_id, 'INSERT', 'enrollments', p_student_id, jsonb_build_object('student_id', p_student_id, 'section_id', p_section_id));
    END;
    $$;

    -- Also fix approvepayment
    DROP PROCEDURE IF EXISTS ApprovePayment(UUID, UUID);
    CREATE OR REPLACE FUNCTION approvepayment(p_payment_id UUID, p_user_id UUID) RETURNS void
    LANGUAGE plpgsql AS $$
    DECLARE
        v_student_id UUID;
        v_student_fee_id UUID;
        v_amount DECIMAL(10,2);
        v_status payment_status;
    BEGIN
        SELECT student_id, student_fee_id, amount, status INTO v_student_id, v_student_fee_id, v_amount, v_status
        FROM fee_payments WHERE payment_id = p_payment_id FOR UPDATE;

        IF v_status = 'Verified' THEN RAISE EXCEPTION 'Payment is already verified'; END IF;

        UPDATE fee_payments SET status = 'Verified', paid_at = CURRENT_TIMESTAMP WHERE payment_id = p_payment_id;
        
        UPDATE student_fees 
        SET paid = paid + v_amount, remaining = remaining - v_amount,
            status = CASE WHEN remaining - v_amount <= 0 THEN 'Paid'::fee_status ELSE 'Partial'::fee_status END
        WHERE student_fee_id = v_student_fee_id;

        INSERT INTO receipts (payment_id) VALUES (p_payment_id);
        INSERT INTO audit_logs (user_id, action, table_name, record_id, new_data)
        VALUES (p_user_id, 'UPDATE', 'fee_payments', p_payment_id, jsonb_build_object('status', 'Verified'));
    END;
    $$;

    -- Also fix library procedures to functions
    DROP PROCEDURE IF EXISTS IssueBook(UUID, UUID, UUID);
    CREATE OR REPLACE FUNCTION issuebook(p_book_id UUID, p_user_id UUID, p_admin_user_id UUID) RETURNS void LANGUAGE plpgsql AS $$
    DECLARE v_available INT; v_issue_id UUID;
    BEGIN
        SELECT available INTO v_available FROM library_items WHERE book_id = p_book_id FOR UPDATE;
        IF v_available <= 0 THEN RAISE EXCEPTION 'Book not available'; END IF;
        INSERT INTO library_issues (book_id, user_id, due_date) VALUES (p_book_id, p_user_id, CURRENT_DATE + INTERVAL '14 days') RETURNING issue_id INTO v_issue_id;
        UPDATE library_items SET available = available - 1 WHERE book_id = p_book_id;
        INSERT INTO audit_logs (user_id, action, table_name, record_id) VALUES (p_admin_user_id, 'INSERT', 'library_issues', v_issue_id);
    END; $$;

    DROP PROCEDURE IF EXISTS ReturnBook(UUID, UUID);
    CREATE OR REPLACE FUNCTION returnbook(p_issue_id UUID, p_admin_user_id UUID) RETURNS void LANGUAGE plpgsql AS $$
    DECLARE v_book_id UUID; v_fine DECIMAL(10,2);
    BEGIN
        SELECT book_id INTO v_book_id FROM library_issues WHERE issue_id = p_issue_id FOR UPDATE;
        v_fine := fn_library_fine(p_issue_id);
        UPDATE library_issues SET return_date = CURRENT_DATE, status = 'Returned' WHERE issue_id = p_issue_id;
        UPDATE library_items SET available = available + 1 WHERE book_id = v_book_id;
        IF v_fine > 0 THEN INSERT INTO library_fines (issue_id, amount) VALUES (p_issue_id, v_fine); END IF;
        INSERT INTO audit_logs (user_id, action, table_name, record_id) VALUES (p_admin_user_id, 'UPDATE', 'library_issues', p_issue_id);
    END; $$;

    -- Reload schema cache
    NOTIFY pgrst, 'reload schema';
  `;

  const { error } = await supabase.rpc('sql', { query: sql });
  if (error) {
    console.error('Failed to execute SQL via RPC. Using direct Postgres client if needed, or error:', error);
  } else {
    console.log('Database functions updated and schema cache reloaded!');
  }
}

fixDatabase();
