-- =====================================================
-- OpenEducat ERP Complete Database Schema for PostgreSQL
-- Version: 2.0.0 - Complete with all Foreign Key Constraints
-- Created: 2024
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- SEQUENCES
-- =====================================================

-- Core sequences
CREATE SEQUENCE seq_users START 1000;
CREATE SEQUENCE seq_companies START 100;
CREATE SEQUENCE seq_partners START 10000;
CREATE SEQUENCE seq_departments START 100;
CREATE SEQUENCE seq_categories START 100;
CREATE SEQUENCE seq_programs START 100;
CREATE SEQUENCE seq_program_levels START 10;
CREATE SEQUENCE seq_academic_years START 100;
CREATE SEQUENCE seq_academic_terms START 100;
CREATE SEQUENCE seq_courses START 1000;
CREATE SEQUENCE seq_subjects START 1000;
CREATE SEQUENCE seq_batches START 1000;
CREATE SEQUENCE seq_students START 100000;
CREATE SEQUENCE seq_faculty START 10000;

-- Attendance sequences
CREATE SEQUENCE seq_attendance_registers START 1000;
CREATE SEQUENCE seq_attendance_sheets START 10000;
CREATE SEQUENCE seq_attendance_lines START 100000;
CREATE SEQUENCE seq_attendance_types START 100;
CREATE SEQUENCE seq_sessions START 1000;

-- Exam sequences
CREATE SEQUENCE seq_exam_types START 100;
CREATE SEQUENCE seq_exam_sessions START 1000;
CREATE SEQUENCE seq_exams START 10000;
CREATE SEQUENCE seq_exam_attendees START 100000;
CREATE SEQUENCE seq_exam_rooms START 1000;
CREATE SEQUENCE seq_marksheet_registers START 1000;
CREATE SEQUENCE seq_marksheet_lines START 100000;
CREATE SEQUENCE seq_result_templates START 100;
CREATE SEQUENCE seq_result_lines START 100000;
CREATE SEQUENCE seq_grade_configurations START 100;

-- Library sequences
CREATE SEQUENCE seq_media START 10000;
CREATE SEQUENCE seq_media_types START 100;
CREATE SEQUENCE seq_media_units START 100000;
CREATE SEQUENCE seq_media_movements START 100000;
CREATE SEQUENCE seq_media_purchases START 10000;
CREATE SEQUENCE seq_media_queues START 10000;
CREATE SEQUENCE seq_authors START 1000;
CREATE SEQUENCE seq_publishers START 1000;
CREATE SEQUENCE seq_tags START 1000;
CREATE SEQUENCE seq_library_cards START 10000;
CREATE SEQUENCE seq_library_card_types START 100;

-- Fees sequences
CREATE SEQUENCE seq_fees_terms START 1000;
CREATE SEQUENCE seq_fees_terms_lines START 10000;
CREATE SEQUENCE seq_fees_elements START 10000;
CREATE SEQUENCE seq_student_fees_details START 100000;

-- Assignment sequences
CREATE SEQUENCE seq_assignment_types START 100;
CREATE SEQUENCE seq_assignments START 10000;
CREATE SEQUENCE seq_assignment_sub_lines START 100000;

-- Admission sequences
CREATE SEQUENCE seq_admission_registers START 1000;
CREATE SEQUENCE seq_admissions START 10000;

-- Activity sequences
CREATE SEQUENCE seq_activity_types START 100;
CREATE SEQUENCE seq_activities START 10000;

-- Parent sequences
CREATE SEQUENCE seq_parent_relationships START 100;
CREATE SEQUENCE seq_parents START 10000;

-- Facility sequences
CREATE SEQUENCE seq_facilities START 1000;
CREATE SEQUENCE seq_facility_lines START 10000;

-- Classroom sequences
CREATE SEQUENCE seq_classrooms START 1000;

-- Timetable sequences
CREATE SEQUENCE seq_timings START 1000;
CREATE SEQUENCE seq_timetables START 10000;

-- Accounting sequences
CREATE SEQUENCE seq_chart_of_accounts START 1000;
CREATE SEQUENCE seq_account_journals START 100;
CREATE SEQUENCE seq_account_moves START 10000;
CREATE SEQUENCE seq_account_move_lines START 100000;
CREATE SEQUENCE seq_account_invoices START 10000;
CREATE SEQUENCE seq_account_payments START 10000;
CREATE SEQUENCE seq_account_taxes START 100;

-- Staff and Payroll sequences
CREATE SEQUENCE seq_staff START 10000;
CREATE SEQUENCE seq_salary_structures START 1000;
CREATE SEQUENCE seq_payroll START 100000;
CREATE SEQUENCE seq_tds_config START 100;

-- Fiscal Management sequences
CREATE SEQUENCE seq_fiscal_years START 100;
CREATE SEQUENCE seq_fiscal_periods START 1000;
CREATE SEQUENCE seq_year_end_closings START 100;
CREATE SEQUENCE seq_closing_entries START 1000;
CREATE SEQUENCE seq_tax_deductions START 10000;

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Countries table (must be first as it's referenced by many tables)
CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    code VARCHAR(8) UNIQUE NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- States table
CREATE TABLE states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    code VARCHAR(8),
    country_id INTEGER NOT NULL REFERENCES countries(id) ON DELETE RESTRICT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Currencies table
CREATE TABLE currencies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    symbol VARCHAR(8) NOT NULL,
    code VARCHAR(8) UNIQUE NOT NULL,
    rate DECIMAL(12,6) DEFAULT 1.0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Companies table
CREATE TABLE companies (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_companies'),
    name VARCHAR(256) NOT NULL,
    email VARCHAR(256),
    phone VARCHAR(32),
    website VARCHAR(256),
    logo BYTEA,
    street VARCHAR(256),
    city VARCHAR(128),
    state_id INTEGER REFERENCES states(id) ON DELETE SET NULL,
    country_id INTEGER REFERENCES countries(id) ON DELETE SET NULL,
    zip VARCHAR(16),
    currency_id INTEGER REFERENCES currencies(id) ON DELETE SET NULL,
    total_users INTEGER DEFAULT 0,
    total_students INTEGER DEFAULT 0,
    total_faculty INTEGER DEFAULT 0,
    total_admins INTEGER DEFAULT 0,
    total_parents INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_users'),
    email VARCHAR(256) UNIQUE NOT NULL,
    password_hash VARCHAR(512) NOT NULL,
    first_name VARCHAR(128),
    last_name VARCHAR(128),
    phone VARCHAR(32),
    active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    is_faculty BOOLEAN DEFAULT FALSE,
    is_student BOOLEAN DEFAULT FALSE,
    is_parent BOOLEAN DEFAULT FALSE,
    company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
    department_id INTEGER,
    last_login TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Partners table (base for contacts)
CREATE TABLE partners (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_partners'),
    name VARCHAR(256) NOT NULL,
    email VARCHAR(256),
    phone VARCHAR(32),
    mobile VARCHAR(32),
    fax VARCHAR(32),
    website VARCHAR(256),
    title VARCHAR(32),
    function VARCHAR(128),
    street VARCHAR(256),
    street2 VARCHAR(256),
    city VARCHAR(128),
    state_id INTEGER REFERENCES states(id) ON DELETE SET NULL,
    country_id INTEGER REFERENCES countries(id) ON DELETE SET NULL,
    zip VARCHAR(16),
    is_company BOOLEAN DEFAULT FALSE,
    parent_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE departments (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_departments'),
    name VARCHAR(256) NOT NULL,
    code VARCHAR(16) UNIQUE NOT NULL,
    parent_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_categories'),
    name VARCHAR(256) NOT NULL,
    code VARCHAR(16) UNIQUE NOT NULL,
    company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ACADEMIC STRUCTURE TABLES
-- =====================================================

-- Program levels table
CREATE TABLE program_levels (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_program_levels'),
    name VARCHAR(256) NOT NULL,
    code VARCHAR(16) UNIQUE NOT NULL,
    sequence INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Programs table
CREATE TABLE programs (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_programs'),
    name VARCHAR(256) NOT NULL,
    code VARCHAR(16) UNIQUE NOT NULL,
    program_level_id INTEGER REFERENCES program_levels(id) ON DELETE SET NULL,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Academic years table
CREATE TABLE academic_years (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_academic_years'),
    name VARCHAR(256) NOT NULL,
    code VARCHAR(16) UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT,
    sequence INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_academic_year_dates CHECK (end_date > start_date)
);

-- Academic terms table
CREATE TABLE academic_terms (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_academic_terms'),
    name VARCHAR(256) NOT NULL,
    code VARCHAR(16) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    academic_year_id INTEGER REFERENCES academic_years(id) ON DELETE CASCADE,
    company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_academic_term_dates CHECK (end_date > start_date),
    CONSTRAINT unique_term_code_year UNIQUE(code, academic_year_id)
);

-- Subjects table
CREATE TABLE subjects (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_subjects'),
    name VARCHAR(256) NOT NULL,
    code VARCHAR(16) UNIQUE NOT NULL,
    grade_weightage DECIMAL(5,2) DEFAULT 0.0,
    type VARCHAR(32) DEFAULT 'theory',
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE courses (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_courses'),
    name VARCHAR(256) NOT NULL,
    code VARCHAR(16) UNIQUE NOT NULL,
    parent_id INTEGER REFERENCES courses(id) ON DELETE SET NULL,
    evaluation_type VARCHAR(32) DEFAULT 'normal' CHECK (evaluation_type IN ('normal', 'GPA', 'CWA', 'CCE')),
    max_unit_load DECIMAL(5,2) DEFAULT 0.0,
    min_unit_load DECIMAL(5,2) DEFAULT 0.0,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    program_id INTEGER REFERENCES programs(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Course-Subject relationship table
CREATE TABLE course_subjects (
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    PRIMARY KEY (course_id, subject_id)
);

-- Batches table
CREATE TABLE batches (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_batches'),
    name VARCHAR(256) NOT NULL,
    code VARCHAR(16) NOT NULL,
    course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL,
    academic_year_id INTEGER REFERENCES academic_years(id) ON DELETE SET NULL,
    start_date DATE,
    end_date DATE,
    max_strength INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_batch_code_course UNIQUE(code, course_id)
);

-- =====================================================
-- STUDENT TABLES
-- =====================================================

-- Students table
CREATE TABLE students (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_students'),
    partner_id INTEGER REFERENCES partners(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(256),
    middle_name VARCHAR(256),
    last_name VARCHAR(256),
    birth_date DATE,
    blood_group VARCHAR(8) CHECK (blood_group IN ('A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-')),
    gender VARCHAR(8) CHECK (gender IN ('m', 'f', 'o')) DEFAULT 'm',
    nationality_id INTEGER REFERENCES countries(id) ON DELETE SET NULL,
    country_id INTEGER REFERENCES countries(id) ON DELETE SET NULL,
    state_id INTEGER REFERENCES states(id) ON DELETE SET NULL,
    emergency_contact_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
    visa_info VARCHAR(64),
    id_number VARCHAR(64),
    gr_no VARCHAR(20) UNIQUE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    certificate_number VARCHAR(128),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student course details table
CREATE TABLE student_courses (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL,
    batch_id INTEGER REFERENCES batches(id) ON DELETE SET NULL,
    roll_number VARCHAR(64),
    academic_year_id INTEGER REFERENCES academic_years(id) ON DELETE SET NULL,
    academic_term_id INTEGER REFERENCES academic_terms(id) ON DELETE SET NULL,
    state VARCHAR(32) DEFAULT 'running' CHECK (state IN ('running', 'finished')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_roll_number_batch UNIQUE(roll_number, course_id, batch_id),
    CONSTRAINT unique_student_batch UNIQUE(student_id, course_id, batch_id)
);

-- Student course subjects table
CREATE TABLE student_course_subjects (
    student_course_id INTEGER REFERENCES student_courses(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    PRIMARY KEY (student_course_id, subject_id)
);

-- =====================================================
-- FACULTY TABLES
-- =====================================================

-- Faculty table
CREATE TABLE faculty (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_faculty'),
    partner_id INTEGER REFERENCES partners(id) ON DELETE CASCADE,
    first_name VARCHAR(256) NOT NULL,
    middle_name VARCHAR(128),
    last_name VARCHAR(128) NOT NULL,
    birth_date DATE NOT NULL,
    blood_group VARCHAR(8) CHECK (blood_group IN ('A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-')),
    gender VARCHAR(8) CHECK (gender IN ('male', 'female')) NOT NULL,
    nationality_id INTEGER REFERENCES countries(id) ON DELETE SET NULL,
    country_id INTEGER REFERENCES countries(id) ON DELETE SET NULL,
    state_id INTEGER REFERENCES states(id) ON DELETE SET NULL,
    emergency_contact_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
    visa_info VARCHAR(64),
    id_number VARCHAR(64),
    emp_id INTEGER,
    main_department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Faculty subjects table
CREATE TABLE faculty_subjects (
    faculty_id INTEGER REFERENCES faculty(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    PRIMARY KEY (faculty_id, subject_id)
);

-- Faculty departments table
CREATE TABLE faculty_departments (
    faculty_id INTEGER REFERENCES faculty(id) ON DELETE CASCADE,
    department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
    PRIMARY KEY (faculty_id, department_id)
);

-- =====================================================
-- FACILITY TABLES
-- =====================================================

-- Facilities table
CREATE TABLE facilities (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_facilities'),
    name VARCHAR(256) NOT NULL,
    code VARCHAR(16) UNIQUE NOT NULL,
    type VARCHAR(64),
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table (for fees elements and facilities)
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    code VARCHAR(32),
    type VARCHAR(32) DEFAULT 'service' CHECK (type IN ('product', 'service')),
    price DECIMAL(10,2) DEFAULT 0.0,
    cost DECIMAL(10,2) DEFAULT 0.0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Facility lines table
CREATE TABLE facility_lines (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_facility_lines'),
    facility_id INTEGER REFERENCES facilities(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Classrooms table
CREATE TABLE classrooms (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_classrooms'),
    name VARCHAR(256) NOT NULL,
    code VARCHAR(16) NOT NULL,
    capacity INTEGER DEFAULT 0,
    asset_ids TEXT,
    facility_id INTEGER REFERENCES facilities(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_classroom_code UNIQUE(code)
);

-- Classroom facility lines table
CREATE TABLE classroom_facility_lines (
    classroom_id INTEGER REFERENCES classrooms(id) ON DELETE CASCADE,
    facility_line_id INTEGER REFERENCES facility_lines(id) ON DELETE CASCADE,
    PRIMARY KEY (classroom_id, facility_line_id)
);

-- =====================================================
-- TIMETABLE TABLES
-- =====================================================

-- Timings table
CREATE TABLE timings (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_timings'),
    name VARCHAR(256) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_timing CHECK (end_time > start_time)
);

-- Timetables table
CREATE TABLE timetables (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_timetables'),
    name VARCHAR(256) NOT NULL,
    period VARCHAR(64),
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL,
    batch_id INTEGER REFERENCES batches(id) ON DELETE SET NULL,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
    faculty_id INTEGER REFERENCES faculty(id) ON DELETE SET NULL,
    classroom_id INTEGER REFERENCES classrooms(id) ON DELETE SET NULL,
    timing_id INTEGER REFERENCES timings(id) ON DELETE SET NULL,
    type VARCHAR(32) DEFAULT 'lecture' CHECK (type IN ('lecture', 'practical', 'tutorial')),
    state VARCHAR(32) DEFAULT 'draft' CHECK (state IN ('draft', 'confirm', 'cancel')),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_timetable_datetime CHECK (end_datetime > start_datetime)
);

-- =====================================================
-- ATTENDANCE TABLES
-- =====================================================

-- Attendance types table
CREATE TABLE attendance_types (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_attendance_types'),
    name VARCHAR(20) NOT NULL,
    present BOOLEAN DEFAULT FALSE,
    excused BOOLEAN DEFAULT FALSE,
    absent BOOLEAN DEFAULT FALSE,
    late BOOLEAN DEFAULT FALSE,
    company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance registers table
CREATE TABLE attendance_registers (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_attendance_registers'),
    name VARCHAR(16) NOT NULL,
    code VARCHAR(16) UNIQUE NOT NULL,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    batch_id INTEGER REFERENCES batches(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
    faculty_id INTEGER REFERENCES faculty(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_sessions'),
    name VARCHAR(256) NOT NULL,
    code VARCHAR(16) UNIQUE NOT NULL,
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL,
    batch_id INTEGER REFERENCES batches(id) ON DELETE SET NULL,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
    faculty_id INTEGER REFERENCES faculty(id) ON DELETE SET NULL,
    classroom_id INTEGER REFERENCES classrooms(id) ON DELETE SET NULL,
    timing_id INTEGER REFERENCES timings(id) ON DELETE SET NULL,
    state VARCHAR(32) DEFAULT 'draft' CHECK (state IN ('draft', 'confirm', 'done', 'cancel')),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_session_times CHECK (end_datetime > start_datetime)
);

-- Attendance sheets table
CREATE TABLE attendance_sheets (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_attendance_sheets'),
    name VARCHAR(32),
    register_id INTEGER REFERENCES attendance_registers(id) ON DELETE CASCADE,
    session_id INTEGER REFERENCES sessions(id) ON DELETE SET NULL,
    attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
    faculty_id INTEGER REFERENCES faculty(id) ON DELETE SET NULL,
    state VARCHAR(32) DEFAULT 'draft' CHECK (state IN ('draft', 'start', 'done', 'cancel')),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_register_session_date UNIQUE(register_id, session_id, attendance_date)
);

-- Attendance lines table
CREATE TABLE attendance_lines (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_attendance_lines'),
    attendance_id INTEGER REFERENCES attendance_sheets(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    present BOOLEAN DEFAULT FALSE,
    excused BOOLEAN DEFAULT FALSE,
    absent BOOLEAN DEFAULT FALSE,
    late BOOLEAN DEFAULT FALSE,
    remark VARCHAR(256),
    attendance_date DATE,
    attendance_type_id INTEGER REFERENCES attendance_types(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_attendance_date UNIQUE(student_id, attendance_id, attendance_date)
);

-- =====================================================
-- EXAM TABLES
-- =====================================================

-- Exam types table
CREATE TABLE exam_types (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_exam_types'),
    name VARCHAR(256) NOT NULL,
    code VARCHAR(16) UNIQUE NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exam sessions table
CREATE TABLE exam_sessions (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_exam_sessions'),
    name VARCHAR(256) NOT NULL,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    batch_id INTEGER REFERENCES batches(id) ON DELETE CASCADE,
    exam_code VARCHAR(16) UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    exam_type_id INTEGER REFERENCES exam_types(id) ON DELETE CASCADE,
    evaluation_type VARCHAR(32) DEFAULT 'normal' CHECK (evaluation_type IN ('normal', 'grade')),
    venue_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
    state VARCHAR(32) DEFAULT 'draft' CHECK (state IN ('draft', 'schedule', 'held', 'cancel', 'done')),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_exam_session_dates CHECK (end_date > start_date)
);

-- Exam rooms table
CREATE TABLE exam_rooms (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_exam_rooms'),
    name VARCHAR(256) NOT NULL,
    code VARCHAR(16) NOT NULL,
    capacity INTEGER DEFAULT 0,
    classroom_id INTEGER REFERENCES classrooms(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_exam_room_code UNIQUE(code)
);

-- Exams table
CREATE TABLE exams (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_exams'),
    name VARCHAR(256) NOT NULL,
    session_id INTEGER REFERENCES exam_sessions(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    exam_code VARCHAR(16) UNIQUE NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    total_marks INTEGER NOT NULL,
    min_marks INTEGER NOT NULL,
    note TEXT,
    state VARCHAR(32) DEFAULT 'draft' CHECK (state IN ('draft', 'schedule', 'held', 'result_updated', 'cancel', 'done')),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_exam_times CHECK (end_time > start_time),
    CONSTRAINT check_exam_marks CHECK (min_marks <= total_marks AND min_marks >= 0)
);

-- Exam responsible faculty table
CREATE TABLE exam_responsible_faculty (
    exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
    faculty_id INTEGER REFERENCES faculty(id) ON DELETE CASCADE,
    PRIMARY KEY (exam_id, faculty_id)
);

-- Exam attendees table
CREATE TABLE exam_attendees (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_exam_attendees'),
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
    status VARCHAR(32) DEFAULT 'present' CHECK (status IN ('present', 'absent')),
    marks INTEGER,
    note TEXT,
    room_id INTEGER REFERENCES exam_rooms(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_exam UNIQUE(student_id, exam_id)
);

-- Grade configurations table
CREATE TABLE grade_configurations (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_grade_configurations'),
    name VARCHAR(256) NOT NULL,
    min_marks INTEGER NOT NULL,
    max_marks INTEGER NOT NULL,
    grade VARCHAR(8) NOT NULL,
    result VARCHAR(32),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_grade_marks CHECK (max_marks >= min_marks AND min_marks >= 0)
);

-- Result templates table
CREATE TABLE result_templates (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_result_templates'),
    name VARCHAR(256) NOT NULL,
    exam_session_id INTEGER REFERENCES exam_sessions(id) ON DELETE CASCADE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Marksheet registers table
CREATE TABLE marksheet_registers (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_marksheet_registers'),
    name VARCHAR(256) NOT NULL,
    exam_session_id INTEGER REFERENCES exam_sessions(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    batch_id INTEGER REFERENCES batches(id) ON DELETE CASCADE,
    template_id INTEGER REFERENCES result_templates(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Marksheet lines table
CREATE TABLE marksheet_lines (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_marksheet_lines'),
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    marksheet_reg_id INTEGER REFERENCES marksheet_registers(id) ON DELETE CASCADE,
    exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
    marks INTEGER,
    grade VARCHAR(8),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Result lines table
CREATE TABLE result_lines (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_result_lines'),
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    exam_session_id INTEGER REFERENCES exam_sessions(id) ON DELETE CASCADE,
    marksheet_reg_id INTEGER REFERENCES marksheet_registers(id) ON DELETE CASCADE,
    result VARCHAR(32),
    percentage DECIMAL(5,2),
    grade VARCHAR(8),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- LIBRARY TABLES
-- =====================================================

-- Media types table
CREATE TABLE media_types (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_media_types'),
    name VARCHAR(256) NOT NULL,
    code VARCHAR(16) UNIQUE NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Authors table
CREATE TABLE authors (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_authors'),
    name VARCHAR(128) NOT NULL,
    address_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Publishers table
CREATE TABLE publishers (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_publishers'),
    name VARCHAR(128) NOT NULL,
    address_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE tags (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_tags'),
    name VARCHAR(64) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media table
CREATE TABLE media (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_media'),
    name VARCHAR(128) NOT NULL,
    isbn VARCHAR(64) UNIQUE,
    edition VARCHAR(64),
    description TEXT,
    internal_code VARCHAR(64) UNIQUE,
    media_type_id INTEGER REFERENCES media_types(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media authors table
CREATE TABLE media_authors (
    media_id INTEGER REFERENCES media(id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE,
    PRIMARY KEY (media_id, author_id)
);

-- Media publishers table
CREATE TABLE media_publishers (
    media_id INTEGER REFERENCES media(id) ON DELETE CASCADE,
    publisher_id INTEGER REFERENCES publishers(id) ON DELETE CASCADE,
    PRIMARY KEY (media_id, publisher_id)
);

-- Media tags table
CREATE TABLE media_tags (
    media_id INTEGER REFERENCES media(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (media_id, tag_id)
);

-- Media courses table
CREATE TABLE media_courses (
    media_id INTEGER REFERENCES media(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    PRIMARY KEY (media_id, course_id)
);

-- Media subjects table
CREATE TABLE media_subjects (
    media_id INTEGER REFERENCES media(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    PRIMARY KEY (media_id, subject_id)
);

-- Media units table
CREATE TABLE media_units (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_media_units'),
    name VARCHAR(256) NOT NULL,
    media_id INTEGER REFERENCES media(id) ON DELETE CASCADE,
    barcode VARCHAR(128) UNIQUE,
    state VARCHAR(32) DEFAULT 'available' CHECK (state IN ('available', 'issued', 'lost', 'damaged')),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Library card types table
CREATE TABLE library_card_types (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_library_card_types'),
    name VARCHAR(256) NOT NULL,
    allow_media INTEGER DEFAULT 10 NOT NULL,
    duration INTEGER NOT NULL,
    penalty_amt_per_day DECIMAL(10,2) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_card_type_values CHECK (allow_media >= 0 AND duration >= 0 AND penalty_amt_per_day >= 0)
);

-- Library cards table
CREATE TABLE library_cards (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_library_cards'),
    name VARCHAR(256) NOT NULL,
    number VARCHAR(128) UNIQUE NOT NULL,
    card_type_id INTEGER REFERENCES library_card_types(id) ON DELETE SET NULL,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    faculty_id INTEGER REFERENCES faculty(id) ON DELETE CASCADE,
    issue_date DATE DEFAULT CURRENT_DATE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_card_holder CHECK ((student_id IS NOT NULL AND faculty_id IS NULL) OR (student_id IS NULL AND faculty_id IS NOT NULL))
);

-- Media movements table
CREATE TABLE media_movements (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_media_movements'),
    media_id INTEGER REFERENCES media(id) ON DELETE CASCADE,
    media_unit_id INTEGER REFERENCES media_units(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    faculty_id INTEGER REFERENCES faculty(id) ON DELETE CASCADE,
    issue_date DATE DEFAULT CURRENT_DATE,
    return_date DATE,
    due_date DATE,
    state VARCHAR(32) DEFAULT 'issue' CHECK (state IN ('issue', 'return', 'reserve')),
    note TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_movement_holder CHECK ((student_id IS NOT NULL AND faculty_id IS NULL) OR (student_id IS NULL AND faculty_id IS NOT NULL))
);

-- Media queue table
CREATE TABLE media_queues (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_media_queues'),
    media_id INTEGER REFERENCES media(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    faculty_id INTEGER REFERENCES faculty(id) ON DELETE CASCADE,
    queue_date DATE DEFAULT CURRENT_DATE,
    state VARCHAR(32) DEFAULT 'waiting' CHECK (state IN ('waiting', 'available', 'cancel')),
    note TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_queue_holder CHECK ((student_id IS NOT NULL AND faculty_id IS NULL) OR (student_id IS NULL AND faculty_id IS NOT NULL))
);

-- Media purchases table
CREATE TABLE media_purchases (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_media_purchases'),
    name VARCHAR(256) NOT NULL,
    media_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) DEFAULT 0.0,
    total_price DECIMAL(10,2) DEFAULT 0.0,
    purchase_date DATE DEFAULT CURRENT_DATE,
    vendor_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- FEES TABLES
-- =====================================================

-- Fees terms table
CREATE TABLE fees_terms (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_fees_terms'),
    name VARCHAR(256) NOT NULL,
    code VARCHAR(16) NOT NULL,
    fees_terms VARCHAR(32) DEFAULT 'fixed_days' CHECK (fees_terms IN ('fixed_days', 'fixed_date')),
    note TEXT,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    no_days INTEGER,
    day_type VARCHAR(32) CHECK (day_type IN ('before', 'after')),
    discount DECIMAL(5,2) DEFAULT 0.0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fees terms lines table
CREATE TABLE fees_terms_lines (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_fees_terms_lines'),
    name VARCHAR(256) NOT NULL,
    due_days INTEGER DEFAULT 0,
    value DECIMAL(5,2) NOT NULL,
    fees_id INTEGER REFERENCES fees_terms(id) ON DELETE CASCADE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fees elements table
CREATE TABLE fees_elements (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_fees_elements'),
    sequence INTEGER DEFAULT 0,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    value DECIMAL(5,2) DEFAULT 0.0,
    fees_terms_line_id INTEGER REFERENCES fees_terms_lines(id) ON DELETE CASCADE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update courses table to include fees_term_id
ALTER TABLE courses ADD COLUMN fees_term_id INTEGER REFERENCES fees_terms(id) ON DELETE SET NULL;

-- Student fees details table
CREATE TABLE student_fees_details (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_student_fees_details'),
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    fees_line_id INTEGER REFERENCES fees_terms_lines(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL,
    batch_id INTEGER REFERENCES batches(id) ON DELETE SET NULL,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    amount DECIMAL(12,2) DEFAULT 0.0,
    fees_factor DECIMAL(8,4) DEFAULT 1.0,
    discount DECIMAL(5,2) DEFAULT 0.0,
    after_discount_amount DECIMAL(12,2) DEFAULT 0.0,
    date DATE,
    state VARCHAR(32) DEFAULT 'draft' CHECK (state IN ('draft', 'invoice', 'cancel')),
    company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ASSIGNMENT TABLES
-- =====================================================

-- Assignment types table
CREATE TABLE assignment_types (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_assignment_types'),
    name VARCHAR(256) NOT NULL,
    code VARCHAR(16) UNIQUE NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assignments table
CREATE TABLE assignments (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_assignments'),
    name VARCHAR(256) NOT NULL,
    course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL,
    batch_id INTEGER REFERENCES batches(id) ON DELETE SET NULL,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
    assignment_type_id INTEGER REFERENCES assignment_types(id) ON DELETE SET NULL,
    faculty_id INTEGER REFERENCES faculty(id) ON DELETE SET NULL,
    description TEXT,
    marks INTEGER DEFAULT 0,
    start_date DATE,
    end_date DATE,
    state VARCHAR(32) DEFAULT 'draft' CHECK (state IN ('draft', 'open', 'close', 'cancel')),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_assignment_dates CHECK (end_date >= start_date)
);

-- Assignment submission lines table
CREATE TABLE assignment_sub_lines (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_assignment_sub_lines'),
    assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    submission_date DATE,
    description TEXT,
    marks INTEGER,
    state VARCHAR(32) DEFAULT 'draft' CHECK (state IN ('draft', 'submit', 'accept', 'reject')),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_assignment UNIQUE(assignment_id, student_id)
);

-- =====================================================
-- ADMISSION TABLES
-- =====================================================

-- Admission registers table
CREATE TABLE admission_registers (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_admission_registers'),
    name VARCHAR(256) NOT NULL,
    code VARCHAR(16) UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL,
    min_count INTEGER DEFAULT 0,
    max_count INTEGER DEFAULT 0,
    fees DECIMAL(10,2) DEFAULT 0.0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_admission_register_dates CHECK (end_date > start_date),
    CONSTRAINT check_admission_counts CHECK (max_count >= min_count AND min_count >= 0)
);

-- Admissions table
CREATE TABLE admissions (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_admissions'),
    name VARCHAR(256) NOT NULL,
    register_id INTEGER REFERENCES admission_registers(id) ON DELETE SET NULL,
    application_number VARCHAR(64) UNIQUE,
    application_date DATE DEFAULT CURRENT_DATE,
    student_id INTEGER REFERENCES students(id) ON DELETE SET NULL,
    course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL,
    batch_id INTEGER REFERENCES batches(id) ON DELETE SET NULL,
    fees DECIMAL(10,2) DEFAULT 0.0,
    state VARCHAR(32) DEFAULT 'draft' CHECK (state IN ('draft', 'submit', 'confirm', 'admission', 'reject', 'cancel')),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ACTIVITY TABLES
-- =====================================================

-- Activity types table
CREATE TABLE activity_types (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_activity_types'),
    name VARCHAR(256) NOT NULL,
    code VARCHAR(16) UNIQUE NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activities table
CREATE TABLE activities (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_activities'),
    name VARCHAR(256) NOT NULL,
    activity_type_id INTEGER REFERENCES activity_types(id) ON DELETE SET NULL,
    course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL,
    batch_id INTEGER REFERENCES batches(id) ON DELETE SET NULL,
    faculty_id INTEGER REFERENCES faculty(id) ON DELETE SET NULL,
    description TEXT,
    date DATE,
    start_time TIME,
    end_time TIME,
    venue VARCHAR(256),
    state VARCHAR(32) DEFAULT 'draft' CHECK (state IN ('draft', 'open', 'close', 'cancel')),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity students table
CREATE TABLE activity_students (
    activity_id INTEGER REFERENCES activities(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    PRIMARY KEY (activity_id, student_id)
);

-- =====================================================
-- PARENT TABLES
-- =====================================================

-- Parent relationship types table
CREATE TABLE parent_relationships (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_parent_relationships'),
    name VARCHAR(256) NOT NULL,
    code VARCHAR(16) UNIQUE NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Parents table
CREATE TABLE parents (
    id INTEGER PRIMARY KEY DEFAULT nextval('seq_parents'),
    partner_id INTEGER REFERENCES partners(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(256),
    middle_name VARCHAR(256),
    last_name VARCHAR(256),
    birth_date DATE,
    blood_group VARCHAR(8) CHECK (blood_group IN ('A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-')),
    gender VARCHAR(8) CHECK (gender IN ('male', 'female')),
    nationality_id INTEGER REFERENCES countries(id) ON DELETE SET NULL,
    occupation VARCHAR(128),
    income DECIMAL(12,2),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student parent relationships table
CREATE TABLE student_parent_relations (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES parents(id) ON DELETE CASCADE,
    relationship_id INTEGER REFERENCES parent_relationships(id) ON DELETE SET NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_parent UNIQUE(student_id, parent_id)
);

-- =====================================================
-- ACCOUNTING TABLES
-- =====================================================

-- Chart of Accounts table
CREATE TABLE chart_of_accounts (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
    parent_id INTEGER REFERENCES chart_of_accounts(id) ON DELETE SET NULL,
    company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_account_code_company UNIQUE(code, company_id)
);

-- Account Journals table
CREATE TABLE account_journals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('sale', 'purchase', 'cash', 'bank', 'misc', 'general')),
    company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Account Moves table (General Ledger)
CREATE TABLE account_moves (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ref VARCHAR(100),
    journal_id INTEGER REFERENCES account_journals(id) ON DELETE SET NULL,
    company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    state VARCHAR(20) DEFAULT 'draft' CHECK (state IN ('draft', 'posted', 'cancelled')),
    amount_total DECIMAL(15,2) DEFAULT 0,
    narration TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    posted_at TIMESTAMP,
    posted_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Account Move Lines table (Journal Entries)
CREATE TABLE account_move_lines (
    id SERIAL PRIMARY KEY,
    move_id INTEGER REFERENCES account_moves(id) ON DELETE CASCADE,
    account_id INTEGER REFERENCES chart_of_accounts(id) ON DELETE CASCADE,
    partner_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
    debit DECIMAL(15,2) DEFAULT 0,
    credit DECIMAL(15,2) DEFAULT 0,
    amount_currency DECIMAL(15,2) DEFAULT 0,
    name VARCHAR(255),
    reconciled BOOLEAN DEFAULT FALSE,
    reconciled_line_id INTEGER REFERENCES account_move_lines(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_line_amount CHECK (debit >= 0 AND credit >= 0),
    CONSTRAINT check_line_balance CHECK (debit = 0 OR credit = 0)
);

-- Account Invoices table
CREATE TABLE account_invoices (
    id SERIAL PRIMARY KEY,
    number VARCHAR(100) UNIQUE NOT NULL,
    partner_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
    company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
    journal_id INTEGER REFERENCES account_journals(id) ON DELETE SET NULL,
    move_id INTEGER REFERENCES account_moves(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('out_invoice', 'in_invoice')),
    state VARCHAR(20) DEFAULT 'draft' CHECK (state IN ('draft', 'open', 'paid', 'cancelled')),
    date_invoice DATE NOT NULL,
    date_due DATE,
    amount_untaxed DECIMAL(15,2) DEFAULT 0,
    amount_tax DECIMAL(15,2) DEFAULT 0,
    amount_total DECIMAL(15,2) DEFAULT 0,
    reference VARCHAR(100),
    narration TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_invoice_due_date CHECK (date_due >= date_invoice)
);

-- Account Payments table
CREATE TABLE account_payments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    partner_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
    company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
    journal_id INTEGER REFERENCES account_journals(id) ON DELETE SET NULL,
    move_id INTEGER REFERENCES account_moves(id) ON DELETE SET NULL,
    payment_method VARCHAR(50) CHECK (payment_method IN ('cash', 'bank', 'check', 'credit_card', 'online')),
    amount DECIMAL(15,2) NOT NULL,
    payment_date DATE NOT NULL,
    state VARCHAR(20) DEFAULT 'draft' CHECK (state IN ('draft', 'posted', 'reconciled')),
    reference VARCHAR(100),
    narration TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Account Taxes table
CREATE TABLE account_taxes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    amount DECIMAL(5,4) NOT NULL, -- percentage as decimal (e.g., 0.15 for 15%)
    type VARCHAR(20) NOT NULL CHECK (type IN ('percent', 'fixed')),
    company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
    account_id INTEGER REFERENCES chart_of_accounts(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- STAFF & PAYROLL TABLES
-- =====================================================

-- Staff/Employee table
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER REFERENCES partners(id) ON DELETE CASCADE,
    employee_code VARCHAR(50) UNIQUE NOT NULL,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    designation VARCHAR(100),
    joining_date DATE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Salary Structure table
CREATE TABLE salary_structures (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
    basic_salary DECIMAL(12,2) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payroll table
CREATE TABLE payroll (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER REFERENCES staff(id) ON DELETE CASCADE,
    month INTEGER CHECK (month BETWEEN 1 AND 12),
    year INTEGER,
    basic_salary DECIMAL(12,2),
    allowances DECIMAL(12,2) DEFAULT 0,
    deductions DECIMAL(12,2) DEFAULT 0,
    net_salary DECIMAL(12,2),
    tds_amount DECIMAL(12,2) DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    state VARCHAR(20) DEFAULT 'draft' CHECK (state IN ('draft', 'confirmed', 'paid')),
    company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TDS Configuration table
CREATE TABLE tds_config (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slab_from DECIMAL(12,2),
    slab_to DECIMAL(12,2),
    percentage DECIMAL(5,2),
    company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- FISCAL YEAR MANAGEMENT TABLES
-- =====================================================

-- Fiscal Years table
CREATE TABLE fiscal_years (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    state VARCHAR(20) DEFAULT 'open' CHECK (state IN ('open', 'closing', 'closed')),
    closing_date DATE,
    closed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_fiscal_year_dates CHECK (end_date > start_date)
);

-- Fiscal Periods table
CREATE TABLE fiscal_periods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    fiscal_year_id INTEGER REFERENCES fiscal_years(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    state VARCHAR(20) DEFAULT 'open' CHECK (state IN ('open', 'closing', 'closed')),
    closing_date DATE,
    closed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_period_dates CHECK (end_date > start_date)
);

-- Year End Closing table
CREATE TABLE year_end_closings (
    id SERIAL PRIMARY KEY,
    fiscal_year_id INTEGER REFERENCES fiscal_years(id) ON DELETE CASCADE,
    company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
    closing_date DATE NOT NULL,
    closed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    profit_loss_amount DECIMAL(15,2),
    retained_earnings_amount DECIMAL(15,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Closing Entries table
CREATE TABLE closing_entries (
    id SERIAL PRIMARY KEY,
    closing_id INTEGER REFERENCES year_end_closings(id) ON DELETE CASCADE,
    account_id INTEGER REFERENCES chart_of_accounts(id) ON DELETE CASCADE,
    debit DECIMAL(15,2) DEFAULT 0,
    credit DECIMAL(15,2) DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tax Deductions table
CREATE TABLE tax_deductions (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER REFERENCES partners(id) ON DELETE CASCADE,
    tax_type VARCHAR(50) CHECK (tax_type IN ('TDS', 'GST', 'Income_Tax')),
    amount DECIMAL(15,2) NOT NULL,
    fiscal_year_id INTEGER REFERENCES fiscal_years(id) ON DELETE SET NULL,
    fiscal_period_id INTEGER REFERENCES fiscal_periods(id) ON DELETE SET NULL,
    move_line_id INTEGER REFERENCES account_move_lines(id) ON DELETE SET NULL,
    company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INTEGRATION ALTERATIONS
-- =====================================================

-- Link fees to accounting
ALTER TABLE student_fees_details ADD COLUMN invoice_id INTEGER REFERENCES account_invoices(id) ON DELETE SET NULL;
ALTER TABLE student_fees_details ADD COLUMN payment_id INTEGER REFERENCES account_payments(id) ON DELETE SET NULL;

-- Link admissions to accounting  
ALTER TABLE admissions ADD COLUMN invoice_id INTEGER REFERENCES account_invoices(id) ON DELETE SET NULL;
ALTER TABLE admissions ADD COLUMN payment_id INTEGER REFERENCES account_payments(id) ON DELETE SET NULL;

-- Link payroll to accounting
ALTER TABLE payroll ADD COLUMN move_id INTEGER REFERENCES account_moves(id) ON DELETE SET NULL;
ALTER TABLE payroll ADD COLUMN invoice_id INTEGER REFERENCES account_invoices(id) ON DELETE SET NULL;

-- =====================================================
-- AUDIT TABLES
-- =====================================================

-- Audit log table for tracking all changes
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(128) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(16) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- MAIL TRACKING TABLES
-- =====================================================

-- Mail messages table
CREATE TABLE mail_messages (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(512),
    body TEXT,
    message_type VARCHAR(32) DEFAULT 'notification',
    model VARCHAR(128),
    res_id INTEGER,
    author_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
    parent_id INTEGER REFERENCES mail_messages(id) ON DELETE SET NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE
);

-- Mail followers table
CREATE TABLE mail_followers (
    id SERIAL PRIMARY KEY,
    res_model VARCHAR(128) NOT NULL,
    res_id INTEGER NOT NULL,
    partner_id INTEGER REFERENCES partners(id) ON DELETE CASCADE,
    active BOOLEAN DEFAULT TRUE,
    CONSTRAINT unique_follower UNIQUE(res_model, res_id, partner_id)
);

-- Mail activities table
CREATE TABLE mail_activities (
    id SERIAL PRIMARY KEY,
    res_model VARCHAR(128) NOT NULL,
    res_id INTEGER NOT NULL,
    activity_type VARCHAR(64),
    summary VARCHAR(512),
    note TEXT,
    date_deadline DATE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    state VARCHAR(32) DEFAULT 'planned' CHECK (state IN ('planned', 'today', 'overdue', 'done', 'cancel')),
    active BOOLEAN DEFAULT TRUE
);

-- =====================================================
-- SYSTEM CONFIGURATION TABLES
-- =====================================================

-- System parameters table
CREATE TABLE system_parameters (
    id SERIAL PRIMARY KEY,
    key VARCHAR(256) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Company settings table
CREATE TABLE company_settings (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    key VARCHAR(256) NOT NULL,
    value TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_company_setting UNIQUE(company_id, key)
);

-- =====================================================
-- CERTIFICATE MANAGEMENT TABLES
-- =====================================================

-- Certificate types table
CREATE TABLE certificate_types (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    validity_period INTEGER DEFAULT 0, -- in days, 0 means never expires
    is_digital BOOLEAN DEFAULT FALSE,
    requires_signature BOOLEAN DEFAULT FALSE,
    requires_seal BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, code)
);

-- Certificate templates table
CREATE TABLE certificate_templates (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    certificate_type_id INTEGER NOT NULL REFERENCES certificate_types(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    template_data JSONB NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certificates table
CREATE TABLE certificates (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    certificate_type_id INTEGER NOT NULL REFERENCES certificate_types(id) ON DELETE CASCADE,
    template_id INTEGER REFERENCES certificate_templates(id) ON DELETE SET NULL,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    certificate_number VARCHAR(128) UNIQUE NOT NULL,
    verification_code VARCHAR(64) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'revoked')),
    issued_date DATE,
    expiry_date DATE,
    issued_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    certificate_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);