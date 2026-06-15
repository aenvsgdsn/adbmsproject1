-- HiSUP 2.0 Database Views for Dashboards

-- ==========================================
-- VIEWS
-- ==========================================

-- Student Dashboard View
CREATE OR REPLACE VIEW vw_student_dashboard AS
SELECT 
    s.student_id,
    u.username,
    u.email,
    p.program_name,
    d.department_name,
    s.status,
    (SELECT cgpa FROM results WHERE student_id = s.student_id ORDER BY created_at DESC LIMIT 1) as current_cgpa,
    (SELECT SUM(remaining) FROM student_fees WHERE student_id = s.student_id) as outstanding_fee,
    (SELECT COUNT(*) FROM enrollments WHERE student_id = s.student_id AND status = 'Enrolled') as registered_courses,
    (SELECT COUNT(*) FROM library_issues WHERE user_id = s.user_id AND status = 'Issued') as books_issued,
    (SELECT COUNT(*) FROM notifications WHERE user_id = s.user_id AND is_read = false) as unread_notifications
FROM students s
JOIN user_accounts u ON s.user_id = u.id
JOIN programs p ON s.program_id = p.program_id
JOIN departments d ON s.department_id = d.department_id;


-- Faculty Dashboard View
CREATE OR REPLACE VIEW vw_faculty_dashboard AS
SELECT 
    f.faculty_id,
    u.username,
    u.email,
    d.department_name,
    f.designation,
    (SELECT COUNT(*) FROM sections WHERE faculty_id = f.faculty_id) as assigned_courses,
    (SELECT COUNT(e.*) FROM enrollments e JOIN sections s ON e.section_id = s.section_id WHERE s.faculty_id = f.faculty_id AND e.status = 'Enrolled') as total_students
FROM faculty f
JOIN user_accounts u ON f.user_id = u.id
JOIN departments d ON f.department_id = d.department_id;


-- Finance Dashboard View
CREATE OR REPLACE VIEW vw_finance_dashboard AS
SELECT 
    (SELECT COALESCE(SUM(amount), 0) FROM fee_payments WHERE status = 'Verified') as total_revenue,
    (SELECT COUNT(*) FROM fee_payments WHERE status = 'Pending') as pending_payments,
    (SELECT COALESCE(SUM(remaining), 0) FROM student_fees) as total_outstanding_fees,
    (SELECT COALESCE(SUM(amount), 0) FROM fee_payments WHERE status = 'Verified' AND EXTRACT(MONTH FROM paid_at) = EXTRACT(MONTH FROM CURRENT_DATE)) as monthly_collection
;


-- Admin Dashboard View
CREATE OR REPLACE VIEW vw_admin_dashboard AS
SELECT 
    (SELECT COUNT(*) FROM students WHERE status = 'Active') as total_students,
    (SELECT COUNT(*) FROM faculty) as total_faculty,
    (SELECT COUNT(*) FROM courses) as total_courses,
    (SELECT COALESCE(SUM(amount), 0) FROM fee_payments WHERE status = 'Verified') as total_revenue,
    (SELECT SUM(available) FROM library_items) as available_books,
    (SELECT SUM(occupied) FROM rooms) as hostel_occupancy,
    (SELECT SUM(capacity) FROM rooms) as total_hostel_capacity
;

-- View for Fee Defaulters
CREATE OR REPLACE VIEW vw_fee_defaulters AS
SELECT 
    s.student_id,
    u.username,
    s.roll_number,
    p.program_name,
    SUM(sf.remaining) as total_outstanding
FROM students s
JOIN user_accounts u ON s.user_id = u.id
JOIN programs p ON s.program_id = p.program_id
JOIN student_fees sf ON s.student_id = sf.student_id
WHERE sf.remaining > 0
GROUP BY s.student_id, u.username, s.roll_number, p.program_name
ORDER BY total_outstanding DESC;
