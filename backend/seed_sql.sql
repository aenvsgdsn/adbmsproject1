
-- SEED DATA (Copy and paste this into the Supabase SQL Editor and run it)

INSERT INTO user_accounts (username, email, password_hash, role, is_active) VALUES
('System Admin', 'admin@hisup.edu', '$2a$10$Tyv2L1WCULUkqFL7Cry4Ae70qNQWL1o6/31mFj1RTvzm0FIWaZteC', 'Admin', true),
('Test Student', 'student@hisup.edu', '$2a$10$Tyv2L1WCULUkqFL7Cry4AedSKUO3ZMn1oJr8YM4Zlt1UAOZbY3E9S', 'Student', true),
('Test Faculty', 'faculty@hisup.edu', '$2a$10$Tyv2L1WCULUkqFL7Cry4AeNprFCl0uKNaGF/nVVX/Q.EHEtOBiEmq', 'Faculty', true),
('Finance Officer', 'finance@hisup.edu', '$2a$10$Tyv2L1WCULUkqFL7Cry4Ae33ksHcRyZ5cCXGPNHm3/JToLP9uK7.i', 'Finance', true)
ON CONFLICT (email) DO NOTHING;

-- Insert dummy department
INSERT INTO departments (department_name, department_code)
VALUES ('Computer Science', 'CS')
ON CONFLICT (department_name) DO NOTHING;

-- Insert dummy program
INSERT INTO programs (department_id, program_name, program_code, total_semesters)
SELECT department_id, 'BS Computer Science', 'BSCS', 8
FROM departments WHERE department_code = 'CS'
ON CONFLICT (program_code) DO NOTHING;

-- Insert test student profile
INSERT INTO students (roll_number, user_id, program_id, department_id, cnic, phone)
SELECT 'CS-2026-001', 
       (SELECT id FROM user_accounts WHERE email = 'student@hisup.edu'),
       (SELECT program_id FROM programs WHERE program_code = 'BSCS'),
       (SELECT department_id FROM departments WHERE department_code = 'CS'),
       '12345-6789012-3', '03001234567'
WHERE NOT EXISTS (SELECT 1 FROM students WHERE roll_number = 'CS-2026-001');
