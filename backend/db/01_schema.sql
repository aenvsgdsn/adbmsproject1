-- HiSUP 2.0 Complete Database Schema

-- Enums
CREATE TYPE user_role AS ENUM ('Admin', 'Student', 'Faculty', 'Finance');
CREATE TYPE student_status AS ENUM ('Active', 'Graduated', 'Suspended', 'Dropped');
CREATE TYPE enrollment_status AS ENUM ('Enrolled', 'Withdrawn', 'Completed');
CREATE TYPE attendance_status AS ENUM ('Present', 'Absent', 'Leave', 'Late');
CREATE TYPE fee_status AS ENUM ('Pending', 'Partial', 'Paid');
CREATE TYPE payment_status AS ENUM ('Pending', 'Verified', 'Rejected');
CREATE TYPE payment_method AS ENUM ('Bank Transfer', 'Credit Card', 'Cash');

-- Global Tables

CREATE TABLE user_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_accounts(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    audit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_accounts(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Academic Management Tables

CREATE TABLE departments (
    department_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_name VARCHAR(100) UNIQUE NOT NULL,
    department_code VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE programs (
    program_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID REFERENCES departments(department_id) ON DELETE CASCADE,
    program_name VARCHAR(100) NOT NULL,
    program_code VARCHAR(20) UNIQUE NOT NULL,
    total_semesters INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
    student_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES user_accounts(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(program_id) ON DELETE RESTRICT,
    department_id UUID REFERENCES departments(department_id) ON DELETE RESTRICT,
    cnic VARCHAR(20) UNIQUE NOT NULL,
    phone VARCHAR(20),
    status student_status DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE faculty (
    faculty_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_accounts(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(department_id) ON DELETE RESTRICT,
    designation VARCHAR(100) NOT NULL,
    hire_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    course_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    credit_hours INT NOT NULL CHECK (credit_hours > 0),
    department_id UUID REFERENCES departments(department_id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE course_prerequisites (
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    prerequisite_course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    PRIMARY KEY (course_id, prerequisite_course_id)
);

CREATE TABLE sections (
    section_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES faculty(faculty_id) ON DELETE RESTRICT,
    semester VARCHAR(20) NOT NULL, -- e.g., 'Fall 2026'
    capacity INT NOT NULL CHECK (capacity > 0),
    available_seats INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_available_seats CHECK (available_seats >= 0 AND available_seats <= capacity)
);

-- Enrollment System

CREATE TABLE enrollments (
    enrollment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(student_id) ON DELETE CASCADE,
    section_id UUID REFERENCES sections(section_id) ON DELETE CASCADE,
    status enrollment_status DEFAULT 'Enrolled',
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, section_id)
);

-- Attendance System

CREATE TABLE attendance_records (
    attendance_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(student_id) ON DELETE CASCADE,
    section_id UUID REFERENCES sections(section_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status attendance_status NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, section_id, date)
);

-- Result Management

CREATE TABLE grades (
    grade_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(student_id) ON DELETE CASCADE,
    section_id UUID REFERENCES sections(section_id) ON DELETE CASCADE,
    marks DECIMAL(5,2) CHECK (marks >= 0 AND marks <= 100),
    grade VARCHAR(5),
    grade_points DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, section_id)
);

CREATE TABLE results (
    result_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(student_id) ON DELETE CASCADE,
    semester VARCHAR(20) NOT NULL,
    semester_gpa DECIMAL(3,2),
    cgpa DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, semester)
);

-- Finance Module

CREATE TABLE fee_structures (
    fee_structure_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES programs(program_id) ON DELETE CASCADE,
    semester VARCHAR(20) NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (program_id, semester)
);

CREATE TABLE student_fees (
    student_fee_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(student_id) ON DELETE CASCADE,
    semester VARCHAR(20) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    paid DECIMAL(10,2) DEFAULT 0,
    remaining DECIMAL(10,2) NOT NULL,
    status fee_status DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_remaining CHECK (remaining >= 0)
);

CREATE TABLE fee_payments (
    payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(student_id) ON DELETE CASCADE,
    student_fee_id UUID REFERENCES student_fees(student_fee_id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    method payment_method NOT NULL,
    proof_url TEXT,
    status payment_status DEFAULT 'Pending',
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE receipts (
    receipt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES fee_payments(payment_id) ON DELETE CASCADE,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Library Module

CREATE TABLE library_items (
    book_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    copies INT NOT NULL CHECK (copies >= 0),
    available INT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_available_books CHECK (available >= 0 AND available <= copies)
);

CREATE TABLE library_issues (
    issue_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID REFERENCES library_items(book_id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_accounts(id) ON DELETE CASCADE,
    issue_date DATE DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    return_date DATE,
    status VARCHAR(20) DEFAULT 'Issued' -- 'Issued', 'Returned'
);

CREATE TABLE library_fines (
    fine_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID REFERENCES library_issues(issue_id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    status payment_status DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Hostel Module

CREATE TABLE hostels (
    hostel_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hostel_name VARCHAR(100) UNIQUE NOT NULL,
    total_capacity INT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rooms (
    room_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hostel_id UUID REFERENCES hostels(hostel_id) ON DELETE CASCADE,
    room_number VARCHAR(20) NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    occupied INT DEFAULT 0,
    UNIQUE (hostel_id, room_number),
    CONSTRAINT chk_room_occupancy CHECK (occupied >= 0 AND occupied <= capacity)
);

CREATE TABLE hostel_allotments (
    allotment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(student_id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(room_id) ON DELETE CASCADE,
    allotment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'Active', -- 'Active', 'Vacated'
    UNIQUE (student_id, status)
);

-- Indexes for performance on frequently queried columns
CREATE INDEX idx_user_role ON user_accounts(role);
CREATE INDEX idx_enrollment_student ON enrollments(student_id);
CREATE INDEX idx_enrollment_section ON enrollments(section_id);
CREATE INDEX idx_attendance_student ON attendance_records(student_id);
CREATE INDEX idx_attendance_section ON attendance_records(section_id);
CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_fee_student ON student_fees(student_id);
CREATE INDEX idx_audit_table ON audit_logs(table_name);
