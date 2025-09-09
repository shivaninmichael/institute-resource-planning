-- =====================================================
-- S-ERP Seed Data for PostgreSQL
-- Developed by: Punk Records
-- Application: S-ERP (Student Enterprise Resource Planning)
-- Country: India
-- Currency: INR (Indian Rupee)
-- Version: 2.0.0
-- Created: 2024
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- CORE REFERENCE DATA
-- =====================================================

-- Countries (India as primary)
INSERT INTO countries (name, code, active, created_at, updated_at) VALUES
('India', 'IN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('United States', 'US', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('United Kingdom', 'UK', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Canada', 'CA', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Australia', 'AU', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Indian States
INSERT INTO states (name, code, country_id, active, created_at, updated_at) VALUES
('Maharashtra', 'MH', (SELECT id FROM countries WHERE code = 'IN'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Karnataka', 'KA', (SELECT id FROM countries WHERE code = 'IN'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tamil Nadu', 'TN', (SELECT id FROM countries WHERE code = 'IN'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Delhi', 'DL', (SELECT id FROM countries WHERE code = 'IN'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gujarat', 'GJ', (SELECT id FROM countries WHERE code = 'IN'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Rajasthan', 'RJ', (SELECT id FROM countries WHERE code = 'IN'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Uttar Pradesh', 'UP', (SELECT id FROM countries WHERE code = 'IN'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('West Bengal', 'WB', (SELECT id FROM countries WHERE code = 'IN'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kerala', 'KL', (SELECT id FROM countries WHERE code = 'IN'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Punjab', 'PB', (SELECT id FROM countries WHERE code = 'IN'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Haryana', 'HR', (SELECT id FROM countries WHERE code = 'IN'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Madhya Pradesh', 'MP', (SELECT id FROM countries WHERE code = 'IN'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bihar', 'BR', (SELECT id FROM countries WHERE code = 'IN'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Odisha', 'OR', (SELECT id FROM countries WHERE code = 'IN'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Andhra Pradesh', 'AP', (SELECT id FROM countries WHERE code = 'IN'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Currencies (Indian Rupee as primary)
INSERT INTO currencies (name, symbol, code, rate, active, created_at, updated_at) VALUES
('Indian Rupee', '₹', 'INR', 1.0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('US Dollar', '$', 'USD', 83.25, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Euro', '€', 'EUR', 90.45, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('British Pound', '£', 'GBP', 105.30, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Canadian Dollar', 'C$', 'CAD', 61.20, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- COMPANY DATA
-- =====================================================

-- Main Company (Punk Records)
INSERT INTO companies (name, email, phone, website, street, city, state_id, country_id, zip, currency_id, active, created_at, updated_at) VALUES
('Punk Records Education Solutions', 'info@punkrecords.edu.in', '+91-22-12345678', 'https://www.punkrecords.edu.in', '123 Education Street, Andheri West', 'Mumbai', (SELECT id FROM states WHERE code = 'MH'), (SELECT id FROM countries WHERE code = 'IN'), '400058', (SELECT id FROM currencies WHERE code = 'INR'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- USER ACCOUNTS
-- =====================================================

-- Admin Users
INSERT INTO users (email, password_hash, first_name, last_name, phone, active, is_admin, is_faculty, is_student, is_parent, company_id, department_id, last_login, login_count, created_at, updated_at) VALUES
('admin@punkrecords.edu.in', crypt('admin123', gen_salt('bf')), 'Rajesh', 'Kumar', '+91-9876543210', true, true, false, false, false, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), NULL, CURRENT_TIMESTAMP, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('principal@punkrecords.edu.in', crypt('principal123', gen_salt('bf')), 'Dr. Priya', 'Sharma', '+91-9876543211', true, true, true, false, false, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), NULL, CURRENT_TIMESTAMP, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('vice.principal@punkrecords.edu.in', crypt('vice123', gen_salt('bf')), 'Prof. Amit', 'Patel', '+91-9876543212', true, true, true, false, false, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), NULL, CURRENT_TIMESTAMP, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- DEPARTMENTS
-- =====================================================

-- Academic Departments
INSERT INTO departments (name, code, parent_id, company_id, active, created_at, updated_at) VALUES
('Computer Science & Engineering', 'CSE', NULL, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Information Technology', 'IT', NULL, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Electronics & Communication', 'ECE', NULL, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mechanical Engineering', 'ME', NULL, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Civil Engineering', 'CE', NULL, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Business Administration', 'MBA', NULL, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mathematics', 'MATH', NULL, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Physics', 'PHY', NULL, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Chemistry', 'CHEM', NULL, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('English', 'ENG', NULL, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Sub-departments
INSERT INTO departments (name, code, parent_id, company_id, active, created_at, updated_at) VALUES
('Software Engineering', 'SE', (SELECT id FROM departments WHERE code = 'CSE'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Data Science', 'DS', (SELECT id FROM departments WHERE code = 'CSE'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Artificial Intelligence', 'AI', (SELECT id FROM departments WHERE code = 'CSE'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cybersecurity', 'CS', (SELECT id FROM departments WHERE code = 'CSE'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- CATEGORIES
-- =====================================================

-- Student Categories
INSERT INTO categories (name, code, company_id, active, created_at, updated_at) VALUES
('General', 'GEN', (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('OBC (Other Backward Classes)', 'OBC', (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SC (Scheduled Caste)', 'SC', (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ST (Scheduled Tribe)', 'ST', (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('EWS (Economically Weaker Section)', 'EWS', (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('PWD (Person with Disability)', 'PWD', (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('NRI (Non-Resident Indian)', 'NRI', (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('International Student', 'INTL', (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- PROGRAM LEVELS
-- =====================================================

-- Academic Program Levels
INSERT INTO program_levels (name, code, sequence, active, created_at, updated_at) VALUES
('Diploma', 'DIP', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bachelor''s Degree', 'BACHELOR', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Master''s Degree', 'MASTER', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Doctorate', 'PHD', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Certificate Course', 'CERT', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Post Graduate Diploma', 'PGD', 6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- PROGRAMS
-- =====================================================

-- Engineering Programs
INSERT INTO programs (name, code, program_level_id, department_id, active, created_at, updated_at) VALUES
('Bachelor of Technology in Computer Science', 'B.Tech-CSE', (SELECT id FROM program_levels WHERE code = 'BACHELOR'), (SELECT id FROM departments WHERE code = 'CSE'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bachelor of Technology in Information Technology', 'B.Tech-IT', (SELECT id FROM program_levels WHERE code = 'BACHELOR'), (SELECT id FROM departments WHERE code = 'IT'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bachelor of Technology in Electronics & Communication', 'B.Tech-ECE', (SELECT id FROM program_levels WHERE code = 'BACHELOR'), (SELECT id FROM departments WHERE code = 'ECE'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bachelor of Technology in Mechanical Engineering', 'B.Tech-ME', (SELECT id FROM program_levels WHERE code = 'BACHELOR'), (SELECT id FROM departments WHERE code = 'ME'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bachelor of Technology in Civil Engineering', 'B.Tech-CE', (SELECT id FROM program_levels WHERE code = 'BACHELOR'), (SELECT id FROM departments WHERE code = 'CE'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Master of Technology in Computer Science', 'M.Tech-CSE', (SELECT id FROM program_levels WHERE code = 'MASTER'), (SELECT id FROM departments WHERE code = 'CSE'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Master of Technology in Data Science', 'M.Tech-DS', (SELECT id FROM program_levels WHERE code = 'MASTER'), (SELECT id FROM departments WHERE code = 'DS'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Master of Technology in Artificial Intelligence', 'M.Tech-AI', (SELECT id FROM program_levels WHERE code = 'MASTER'), (SELECT id FROM departments WHERE code = 'AI'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Management Programs
INSERT INTO programs (name, code, program_level_id, department_id, active, created_at, updated_at) VALUES
('Master of Business Administration', 'MBA', (SELECT id FROM program_levels WHERE code = 'MASTER'), (SELECT id FROM departments WHERE code = 'MBA'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Post Graduate Diploma in Management', 'PGDM', (SELECT id FROM program_levels WHERE code = 'PGD'), (SELECT id FROM departments WHERE code = 'MBA'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bachelor of Business Administration', 'BBA', (SELECT id FROM program_levels WHERE code = 'BACHELOR'), (SELECT id FROM departments WHERE code = 'MBA'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- ACADEMIC YEARS
-- =====================================================

-- Academic Years
INSERT INTO academic_years (name, code, start_date, end_date, description, sequence, active, company_id, created_at, updated_at) VALUES
('Academic Year 2024-25', 'AY2024-25', '2024-06-01', '2025-05-31', 'Current Academic Year', 1, true, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Academic Year 2023-24', 'AY2023-24', '2023-06-01', '2024-05-31', 'Previous Academic Year', 2, true, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Academic Year 2022-23', 'AY2022-23', '2022-06-01', '2023-05-31', 'Completed Academic Year', 3, true, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- ACADEMIC TERMS
-- =====================================================

-- Academic Terms for 2024-25
INSERT INTO academic_terms (name, code, start_date, end_date, academic_year_id, company_id, active, created_at, updated_at) VALUES
('Semester 1 - 2024-25', 'SEM1-2024-25', '2024-06-01', '2024-11-30', (SELECT id FROM academic_years WHERE code = 'AY2024-25'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Semester 2 - 2024-25', 'SEM2-2024-25', '2024-12-01', '2025-05-31', (SELECT id FROM academic_years WHERE code = 'AY2024-25'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Academic Terms for 2023-24
INSERT INTO academic_terms (name, code, start_date, end_date, academic_year_id, company_id, active, created_at, updated_at) VALUES
('Semester 1 - 2023-24', 'SEM1-2023-24', '2023-06-01', '2023-11-30', (SELECT id FROM academic_years WHERE code = 'AY2023-24'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Semester 2 - 2023-24', 'SEM2-2023-24', '2023-12-01', '2024-05-31', (SELECT id FROM academic_years WHERE code = 'AY2023-24'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- SUBJECTS
-- =====================================================

-- Computer Science Subjects
INSERT INTO subjects (name, code, grade_weightage, type, department_id, company_id, active, created_at, updated_at) VALUES
('Programming in C', 'CSE101', 4.0, 'theory', (SELECT id FROM departments WHERE code = 'CSE'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Data Structures and Algorithms', 'CSE102', 4.0, 'theory', (SELECT id FROM departments WHERE code = 'CSE'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Database Management Systems', 'CSE103', 4.0, 'theory', (SELECT id FROM departments WHERE code = 'CSE'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Computer Networks', 'CSE104', 4.0, 'theory', (SELECT id FROM departments WHERE code = 'CSE'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Operating Systems', 'CSE105', 4.0, 'theory', (SELECT id FROM departments WHERE code = 'CSE'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Software Engineering', 'CSE106', 4.0, 'theory', (SELECT id FROM departments WHERE code = 'CSE'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Web Technologies', 'CSE107', 4.0, 'theory', (SELECT id FROM departments WHERE code = 'CSE'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Machine Learning', 'CSE108', 4.0, 'theory', (SELECT id FROM departments WHERE code = 'CSE'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Artificial Intelligence', 'CSE109', 4.0, 'theory', (SELECT id FROM departments WHERE code = 'CSE'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cybersecurity Fundamentals', 'CSE110', 4.0, 'theory', (SELECT id FROM departments WHERE code = 'CSE'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Mathematics Subjects
INSERT INTO subjects (name, code, grade_weightage, type, department_id, company_id, active, created_at, updated_at) VALUES
('Calculus', 'MATH101', 3.0, 'theory', (SELECT id FROM departments WHERE code = 'MATH'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Linear Algebra', 'MATH102', 3.0, 'theory', (SELECT id FROM departments WHERE code = 'MATH'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Discrete Mathematics', 'MATH103', 3.0, 'theory', (SELECT id FROM departments WHERE code = 'MATH'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Probability and Statistics', 'MATH104', 3.0, 'theory', (SELECT id FROM departments WHERE code = 'MATH'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Numerical Methods', 'MATH105', 3.0, 'theory', (SELECT id FROM departments WHERE code = 'MATH'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Physics Subjects
INSERT INTO subjects (name, code, grade_weightage, type, department_id, company_id, active, created_at, updated_at) VALUES
('Engineering Physics', 'PHY101', 3.0, 'theory', (SELECT id FROM departments WHERE code = 'PHY'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Physics Laboratory', 'PHY102', 1.0, 'practical', (SELECT id FROM departments WHERE code = 'PHY'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Chemistry Subjects
INSERT INTO subjects (name, code, grade_weightage, type, department_id, company_id, active, created_at, updated_at) VALUES
('Engineering Chemistry', 'CHEM101', 3.0, 'theory', (SELECT id FROM departments WHERE code = 'CHEM'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Chemistry Laboratory', 'CHEM102', 1.0, 'practical', (SELECT id FROM departments WHERE code = 'CHEM'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- English Subjects
INSERT INTO subjects (name, code, grade_weightage, type, department_id, company_id, active, created_at, updated_at) VALUES
('Technical Communication', 'ENG101', 2.0, 'theory', (SELECT id FROM departments WHERE code = 'ENG'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Professional English', 'ENG102', 2.0, 'theory', (SELECT id FROM departments WHERE code = 'ENG'), (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- COURSES
-- =====================================================

-- B.Tech CSE Course
INSERT INTO courses (name, code, parent_id, evaluation_type, max_unit_load, min_unit_load, department_id, program_id, active, created_at, updated_at) VALUES
('B.Tech Computer Science Engineering', 'BTECH-CSE', NULL, 'normal', 24.0, 18.0, (SELECT id FROM departments WHERE code = 'CSE'), (SELECT id FROM programs WHERE code = 'B.Tech-CSE'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('B.Tech Information Technology', 'BTECH-IT', NULL, 'normal', 24.0, 18.0, (SELECT id FROM departments WHERE code = 'IT'), (SELECT id FROM programs WHERE code = 'B.Tech-IT'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('B.Tech Electronics & Communication', 'BTECH-ECE', NULL, 'normal', 24.0, 18.0, (SELECT id FROM departments WHERE code = 'ECE'), (SELECT id FROM programs WHERE code = 'B.Tech-ECE'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('M.Tech Computer Science Engineering', 'MTECH-CSE', NULL, 'normal', 20.0, 16.0, (SELECT id FROM departments WHERE code = 'CSE'), (SELECT id FROM programs WHERE code = 'M.Tech-CSE'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('M.Tech Data Science', 'MTECH-DS', NULL, 'normal', 20.0, 16.0, (SELECT id FROM departments WHERE code = 'DS'), (SELECT id FROM programs WHERE code = 'M.Tech-DS'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('MBA', 'MBA', NULL, 'normal', 22.0, 18.0, (SELECT id FROM departments WHERE code = 'MBA'), (SELECT id FROM programs WHERE code = 'MBA'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- COURSE-SUBJECT RELATIONSHIPS
-- =====================================================

-- B.Tech CSE Course Subjects
INSERT INTO course_subjects (course_id, subject_id) VALUES
((SELECT id FROM courses WHERE code = 'BTECH-CSE'), (SELECT id FROM subjects WHERE code = 'CSE101')), -- Programming in C
((SELECT id FROM courses WHERE code = 'BTECH-CSE'), (SELECT id FROM subjects WHERE code = 'CSE102')), -- Data Structures and Algorithms
((SELECT id FROM courses WHERE code = 'BTECH-CSE'), (SELECT id FROM subjects WHERE code = 'CSE103')), -- Database Management Systems
((SELECT id FROM courses WHERE code = 'BTECH-CSE'), (SELECT id FROM subjects WHERE code = 'CSE104')), -- Computer Networks
((SELECT id FROM courses WHERE code = 'BTECH-CSE'), (SELECT id FROM subjects WHERE code = 'CSE105')), -- Operating Systems
((SELECT id FROM courses WHERE code = 'BTECH-CSE'), (SELECT id FROM subjects WHERE code = 'CSE106')), -- Software Engineering
((SELECT id FROM courses WHERE code = 'BTECH-CSE'), (SELECT id FROM subjects WHERE code = 'CSE107')), -- Web Technologies
((SELECT id FROM courses WHERE code = 'BTECH-CSE'), (SELECT id FROM subjects WHERE code = 'CSE108')), -- Machine Learning
((SELECT id FROM courses WHERE code = 'BTECH-CSE'), (SELECT id FROM subjects WHERE code = 'CSE109')), -- Artificial Intelligence
((SELECT id FROM courses WHERE code = 'BTECH-CSE'), (SELECT id FROM subjects WHERE code = 'CSE110')), -- Cybersecurity Fundamentals
((SELECT id FROM courses WHERE code = 'BTECH-CSE'), (SELECT id FROM subjects WHERE code = 'MATH101')), -- Calculus
((SELECT id FROM courses WHERE code = 'BTECH-CSE'), (SELECT id FROM subjects WHERE code = 'MATH102')), -- Linear Algebra
((SELECT id FROM courses WHERE code = 'BTECH-CSE'), (SELECT id FROM subjects WHERE code = 'MATH103')), -- Discrete Mathematics
((SELECT id FROM courses WHERE code = 'BTECH-CSE'), (SELECT id FROM subjects WHERE code = 'MATH104')), -- Probability and Statistics
((SELECT id FROM courses WHERE code = 'BTECH-CSE'), (SELECT id FROM subjects WHERE code = 'MATH105')), -- Numerical Methods
((SELECT id FROM courses WHERE code = 'BTECH-CSE'), (SELECT id FROM subjects WHERE code = 'PHY101')), -- Engineering Physics
((SELECT id FROM courses WHERE code = 'BTECH-CSE'), (SELECT id FROM subjects WHERE code = 'PHY102')), -- Physics Laboratory
((SELECT id FROM courses WHERE code = 'BTECH-CSE'), (SELECT id FROM subjects WHERE code = 'CHEM101')), -- Engineering Chemistry
((SELECT id FROM courses WHERE code = 'BTECH-CSE'), (SELECT id FROM subjects WHERE code = 'CHEM102')), -- Chemistry Laboratory
((SELECT id FROM courses WHERE code = 'BTECH-CSE'), (SELECT id FROM subjects WHERE code = 'ENG101')), -- Technical Communication
((SELECT id FROM courses WHERE code = 'BTECH-CSE'), (SELECT id FROM subjects WHERE code = 'ENG102')); -- Professional English

-- B.Tech IT Course Subjects
INSERT INTO course_subjects (course_id, subject_id) VALUES
((SELECT id FROM courses WHERE code = 'BTECH-IT'), (SELECT id FROM subjects WHERE code = 'CSE101')), -- Programming in C
((SELECT id FROM courses WHERE code = 'BTECH-IT'), (SELECT id FROM subjects WHERE code = 'CSE102')), -- Data Structures and Algorithms
((SELECT id FROM courses WHERE code = 'BTECH-IT'), (SELECT id FROM subjects WHERE code = 'CSE103')), -- Database Management Systems
((SELECT id FROM courses WHERE code = 'BTECH-IT'), (SELECT id FROM subjects WHERE code = 'CSE104')), -- Computer Networks
((SELECT id FROM courses WHERE code = 'BTECH-IT'), (SELECT id FROM subjects WHERE code = 'CSE107')), -- Web Technologies
((SELECT id FROM courses WHERE code = 'BTECH-IT'), (SELECT id FROM subjects WHERE code = 'CSE108')), -- Machine Learning
((SELECT id FROM courses WHERE code = 'BTECH-IT'), (SELECT id FROM subjects WHERE code = 'MATH101')), -- Calculus
((SELECT id FROM courses WHERE code = 'BTECH-IT'), (SELECT id FROM subjects WHERE code = 'MATH102')), -- Linear Algebra
((SELECT id FROM courses WHERE code = 'BTECH-IT'), (SELECT id FROM subjects WHERE code = 'MATH103')), -- Discrete Mathematics
((SELECT id FROM courses WHERE code = 'BTECH-IT'), (SELECT id FROM subjects WHERE code = 'MATH104')), -- Probability and Statistics
((SELECT id FROM courses WHERE code = 'BTECH-IT'), (SELECT id FROM subjects WHERE code = 'PHY101')), -- Engineering Physics
((SELECT id FROM courses WHERE code = 'BTECH-IT'), (SELECT id FROM subjects WHERE code = 'PHY102')), -- Physics Laboratory
((SELECT id FROM courses WHERE code = 'BTECH-IT'), (SELECT id FROM subjects WHERE code = 'CHEM101')), -- Engineering Chemistry
((SELECT id FROM courses WHERE code = 'BTECH-IT'), (SELECT id FROM subjects WHERE code = 'CHEM102')), -- Chemistry Laboratory
((SELECT id FROM courses WHERE code = 'BTECH-IT'), (SELECT id FROM subjects WHERE code = 'ENG101')), -- Technical Communication
((SELECT id FROM courses WHERE code = 'BTECH-IT'), (SELECT id FROM subjects WHERE code = 'ENG102')); -- Professional English

-- =====================================================
-- BATCHES
-- =====================================================

-- B.Tech CSE Batches
INSERT INTO batches (name, code, course_id, academic_year_id, start_date, end_date, max_strength, active, created_at, updated_at) VALUES
('B.Tech CSE 2024-28', 'CSE2024-28', (SELECT id FROM courses WHERE code = 'BTECH-CSE'), (SELECT id FROM academic_years WHERE code = 'AY2024-25'), '2024-06-01', '2028-05-31', 60, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('B.Tech CSE 2023-27', 'CSE2023-27', (SELECT id FROM courses WHERE code = 'BTECH-CSE'), (SELECT id FROM academic_years WHERE code = 'AY2023-24'), '2023-06-01', '2027-05-31', 60, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('B.Tech CSE 2022-26', 'CSE2022-26', (SELECT id FROM courses WHERE code = 'BTECH-CSE'), (SELECT id FROM academic_years WHERE code = 'AY2022-23'), '2022-06-01', '2026-05-31', 60, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- B.Tech IT Batches
INSERT INTO batches (name, code, course_id, academic_year_id, start_date, end_date, max_strength, active, created_at, updated_at) VALUES
('B.Tech IT 2024-28', 'IT2024-28', (SELECT id FROM courses WHERE code = 'BTECH-IT'), (SELECT id FROM academic_years WHERE code = 'AY2024-25'), '2024-06-01', '2028-05-31', 60, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('B.Tech IT 2023-27', 'IT2023-27', (SELECT id FROM courses WHERE code = 'BTECH-IT'), (SELECT id FROM academic_years WHERE code = 'AY2023-24'), '2023-06-01', '2027-05-31', 60, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- M.Tech CSE Batches
INSERT INTO batches (name, code, course_id, academic_year_id, start_date, end_date, max_strength, active, created_at, updated_at) VALUES
('M.Tech CSE 2024-26', 'MTECH-CSE2024-26', (SELECT id FROM courses WHERE code = 'MTECH-CSE'), (SELECT id FROM academic_years WHERE code = 'AY2024-25'), '2024-06-01', '2026-05-31', 30, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('M.Tech CSE 2023-25', 'MTECH-CSE2023-25', (SELECT id FROM courses WHERE code = 'MTECH-CSE'), (SELECT id FROM academic_years WHERE code = 'AY2023-24'), '2023-06-01', '2025-05-31', 30, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- MBA Batches
INSERT INTO batches (name, code, course_id, academic_year_id, start_date, end_date, max_strength, active, created_at, updated_at) VALUES
('MBA 2024-26', 'MBA2024-26', (SELECT id FROM courses WHERE code = 'MBA'), (SELECT id FROM academic_years WHERE code = 'AY2024-25'), '2024-06-01', '2026-05-31', 40, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('MBA 2023-25', 'MBA2023-25', (SELECT id FROM courses WHERE code = 'MBA'), (SELECT id FROM academic_years WHERE code = 'AY2023-24'), '2023-06-01', '2025-05-31', 40, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- PARTNERS (CONTACTS)
-- =====================================================

-- Student Partners
INSERT INTO partners (name, email, phone, mobile, website, title, function, street, street2, city, state_id, country_id, zip, is_company, parent_id, user_id, company_id, active, created_at, updated_at) VALUES
('Arjun Singh', 'arjun.singh@student.punkrecords.edu.in', '+91-9876543210', '+91-9876543210', NULL, 'Mr.', 'Student', '123 MG Road', 'Near Central Mall', 'Mumbai', (SELECT id FROM states WHERE code = 'MH'), (SELECT id FROM countries WHERE code = 'IN'), '400001', false, NULL, NULL, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Priya Patel', 'priya.patel@student.punkrecords.edu.in', '+91-9876543211', '+91-9876543211', NULL, 'Ms.', 'Student', '456 Linking Road', 'Bandra West', 'Mumbai', (SELECT id FROM states WHERE code = 'MH'), (SELECT id FROM countries WHERE code = 'IN'), '400050', false, NULL, NULL, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Rahul Kumar', 'rahul.kumar@student.punkrecords.edu.in', '+91-9876543212', '+91-9876543212', NULL, 'Mr.', 'Student', '789 Churchgate', 'Fort Area', 'Mumbai', (SELECT id FROM states WHERE code = 'MH'), (SELECT id FROM countries WHERE code = 'IN'), '400020', false, NULL, NULL, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sneha Sharma', 'sneha.sharma@student.punkrecords.edu.in', '+91-9876543213', '+91-9876543213', NULL, 'Ms.', 'Student', '321 Juhu Beach Road', 'Juhu', 'Mumbai', (SELECT id FROM states WHERE code = 'MH'), (SELECT id FROM countries WHERE code = 'IN'), '400049', false, NULL, NULL, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Vikram Gupta', 'vikram.gupta@student.punkrecords.edu.in', '+91-9876543214', '+91-9876543214', NULL, 'Mr.', 'Student', '654 Powai Lake', 'Powai', 'Mumbai', (SELECT id FROM states WHERE code = 'MH'), (SELECT id FROM countries WHERE code = 'IN'), '400076', false, NULL, NULL, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Faculty Partners
INSERT INTO partners (name, email, phone, mobile, website, title, function, street, street2, city, state_id, country_id, zip, is_company, parent_id, user_id, company_id, active, created_at, updated_at) VALUES
('Dr. Rajesh Kumar', 'rajesh.kumar@faculty.punkrecords.edu.in', '+91-9876543220', '+91-9876543220', 'https://www.punkrecords.edu.in/faculty/rajesh-kumar', 'Dr.', 'Professor', '123 Faculty Quarters', 'Campus Area', 'Mumbai', (SELECT id FROM states WHERE code = 'MH'), (SELECT id FROM countries WHERE code = 'IN'), '400058', false, NULL, NULL, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Prof. Priya Sharma', 'priya.sharma@faculty.punkrecords.edu.in', '+91-9876543221', '+91-9876543221', 'https://www.punkrecords.edu.in/faculty/priya-sharma', 'Prof.', 'Associate Professor', '456 Faculty Quarters', 'Campus Area', 'Mumbai', (SELECT id FROM states WHERE code = 'MH'), (SELECT id FROM countries WHERE code = 'IN'), '400058', false, NULL, NULL, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Dr. Amit Patel', 'amit.patel@faculty.punkrecords.edu.in', '+91-9876543222', '+91-9876543222', 'https://www.punkrecords.edu.in/faculty/amit-patel', 'Dr.', 'Assistant Professor', '789 Faculty Quarters', 'Campus Area', 'Mumbai', (SELECT id FROM states WHERE code = 'MH'), (SELECT id FROM countries WHERE code = 'IN'), '400058', false, NULL, NULL, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Prof. Sneha Singh', 'sneha.singh@faculty.punkrecords.edu.in', '+91-9876543223', '+91-9876543223', 'https://www.punkrecords.edu.in/faculty/sneha-singh', 'Prof.', 'Professor', '321 Faculty Quarters', 'Campus Area', 'Mumbai', (SELECT id FROM states WHERE code = 'MH'), (SELECT id FROM countries WHERE code = 'IN'), '400058', false, NULL, NULL, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Dr. Vikram Gupta', 'vikram.gupta@faculty.punkrecords.edu.in', '+91-9876543224', '+91-9876543224', 'https://www.punkrecords.edu.in/faculty/vikram-gupta', 'Dr.', 'Associate Professor', '654 Faculty Quarters', 'Campus Area', 'Mumbai', (SELECT id FROM states WHERE code = 'MH'), (SELECT id FROM countries WHERE code = 'IN'), '400058', false, NULL, NULL, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Parent Partners
INSERT INTO partners (name, email, phone, mobile, website, title, function, street, street2, city, state_id, country_id, zip, is_company, parent_id, user_id, company_id, active, created_at, updated_at) VALUES
('Mr. Ramesh Singh', 'ramesh.singh@parent.punkrecords.edu.in', '+91-9876543230', '+91-9876543230', NULL, 'Mr.', 'Parent', '123 MG Road', 'Near Central Mall', 'Mumbai', (SELECT id FROM states WHERE code = 'MH'), (SELECT id FROM countries WHERE code = 'IN'), '400001', false, NULL, NULL, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mrs. Sunita Patel', 'sunita.patel@parent.punkrecords.edu.in', '+91-9876543231', '+91-9876543231', NULL, 'Mrs.', 'Parent', '456 Linking Road', 'Bandra West', 'Mumbai', (SELECT id FROM states WHERE code = 'MH'), (SELECT id FROM countries WHERE code = 'IN'), '400050', false, NULL, NULL, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mr. Suresh Kumar', 'suresh.kumar@parent.punkrecords.edu.in', '+91-9876543232', '+91-9876543232', NULL, 'Mr.', 'Parent', '789 Churchgate', 'Fort Area', 'Mumbai', (SELECT id FROM states WHERE code = 'MH'), (SELECT id FROM countries WHERE code = 'IN'), '400020', false, NULL, NULL, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mrs. Geeta Sharma', 'geeta.sharma@parent.punkrecords.edu.in', '+91-9876543233', '+91-9876543233', NULL, 'Mrs.', 'Parent', '321 Juhu Beach Road', 'Juhu', 'Mumbai', (SELECT id FROM states WHERE code = 'MH'), (SELECT id FROM countries WHERE code = 'IN'), '400049', false, NULL, NULL, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mr. Ravi Gupta', 'ravi.gupta@parent.punkrecords.edu.in', '+91-9876543234', '+91-9876543234', NULL, 'Mr.', 'Parent', '654 Powai Lake', 'Powai', 'Mumbai', (SELECT id FROM states WHERE code = 'MH'), (SELECT id FROM countries WHERE code = 'IN'), '400076', false, NULL, NULL, (SELECT id FROM companies WHERE name = 'Punk Records Education Solutions'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- STUDENTS
-- =====================================================

-- Student Records
INSERT INTO students (partner_id, user_id, first_name, middle_name, last_name, birth_date, blood_group, gender, nationality_id, country_id, state_id, emergency_contact_id, visa_info, id_number, gr_no, category_id, certificate_number, active, created_at, updated_at) VALUES
((SELECT id FROM partners WHERE email = 'arjun.singh@student.punkrecords.edu.in'), NULL, 'Arjun', 'Kumar', 'Singh', '2005-03-15', 'B+', 'm', (SELECT id FROM countries WHERE code = 'IN'), (SELECT id FROM countries WHERE code = 'IN'), (SELECT id FROM states WHERE code = 'MH'), (SELECT id FROM partners WHERE email = 'ramesh.singh@parent.punkrecords.edu.in'), NULL, 'A1234567', 'GR2024001', (SELECT id FROM categories WHERE code = 'GEN'), 'CERT2024001', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
((SELECT id FROM partners WHERE email = 'priya.patel@student.punkrecords.edu.in'), NULL, 'Priya', 'Rajesh', 'Patel', '2005-07-22', 'A+', 'f', (SELECT id FROM countries WHERE code = 'IN'), (SELECT id FROM countries WHERE code = 'IN'), (SELECT id FROM states WHERE code = 'MH'), (SELECT id FROM partners WHERE email = 'sunita.patel@parent.punkrecords.edu.in'), NULL, 'A1234568', 'GR2024002', (SELECT id FROM categories WHERE code = 'OBC'), 'CERT2024002', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
((SELECT id FROM partners WHERE email = 'rahul.kumar@student.punkrecords.edu.in'), NULL, 'Rahul', 'Amit', 'Kumar', '2005-01-10', 'O+', 'm', (SELECT id FROM countries WHERE code = 'IN'), (SELECT id FROM countries WHERE code = 'IN'), (SELECT id FROM states WHERE code = 'MH'), (SELECT id FROM partners WHERE email = 'suresh.kumar@parent.punkrecords.edu.in'), NULL, 'A1234569', 'GR2024003', (SELECT id FROM categories WHERE code = 'GEN'), 'CERT2024003', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
((SELECT id FROM partners WHERE email = 'sneha.sharma@student.punkrecords.edu.in'), NULL, 'Sneha', 'Priya', 'Sharma', '2005-11-05', 'AB+', 'f', (SELECT id FROM countries WHERE code = 'IN'), (SELECT id FROM countries WHERE code = 'IN'), (SELECT id FROM states WHERE code = 'MH'), (SELECT id FROM partners WHERE email = 'geeta.sharma@parent.punkrecords.edu.in'), NULL, 'A1234570', 'GR2024004', (SELECT id FROM categories WHERE code = 'SC'), 'CERT2024004', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
((SELECT id FROM partners WHERE email = 'vikram.gupta@student.punkrecords.edu.in'), NULL, 'Vikram', 'Rajesh', 'Gupta', '2005-09-18', 'B-', 'm', (SELECT id FROM countries WHERE code = 'IN'), (SELECT id FROM countries WHERE code = 'IN'), (SELECT id FROM states WHERE code = 'MH'), (SELECT id FROM partners WHERE email = 'ravi.gupta@parent.punkrecords.edu.in'), NULL, 'A1234571', 'GR2024005', (SELECT id FROM categories WHERE code = 'GEN'), 'CERT2024005', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- FACULTY
-- =====================================================

-- Faculty Records
INSERT INTO faculty (partner_id, first_name, middle_name, last_name, birth_date, blood_group, gender, nationality_id, country_id, state_id, emergency_contact_id, visa_info, id_number, emp_id, main_department_id, active, created_at, updated_at) VALUES
((SELECT id FROM partners WHERE email = 'rajesh.kumar@faculty.punkrecords.edu.in'), 'Rajesh', 'Kumar', 'Singh', '1975-05-15', 'A+', 'male', (SELECT id FROM countries WHERE code = 'IN'), (SELECT id FROM countries WHERE code = 'IN'), (SELECT id FROM states WHERE code = 'MH'), NULL, NULL, 'F1234567', 10001, (SELECT id FROM departments WHERE code = 'CSE'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
((SELECT id FROM partners WHERE email = 'priya.sharma@faculty.punkrecords.edu.in'), 'Priya', 'Rajesh', 'Sharma', '1980-08-22', 'B+', 'female', (SELECT id FROM countries WHERE code = 'IN'), (SELECT id FROM countries WHERE code = 'IN'), (SELECT id FROM states WHERE code = 'MH'), NULL, NULL, 'F1234568', 10002, (SELECT id FROM departments WHERE code = 'CSE'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
((SELECT id FROM partners WHERE email = 'amit.patel@faculty.punkrecords.edu.in'), 'Amit', 'Kumar', 'Patel', '1985-03-10', 'O+', 'male', (SELECT id FROM countries WHERE code = 'IN'), (SELECT id FROM countries WHERE code = 'IN'), (SELECT id FROM states WHERE code = 'MH'), NULL, NULL, 'F1234569', 10003, (SELECT id FROM departments WHERE code = 'IT'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
((SELECT id FROM partners WHERE email = 'sneha.singh@faculty.punkrecords.edu.in'), 'Sneha', 'Priya', 'Singh', '1982-11-05', 'AB+', 'female', (SELECT id FROM countries WHERE code = 'IN'), (SELECT id FROM countries WHERE code = 'IN'), (SELECT id FROM states WHERE code = 'MH'), NULL, NULL, 'F1234570', 10004, (SELECT id FROM departments WHERE code = 'ECE'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
((SELECT id FROM partners WHERE email = 'vikram.gupta@faculty.punkrecords.edu.in'), 'Vikram', 'Rajesh', 'Gupta', '1978-09-18', 'B-', 'male', (SELECT id FROM countries WHERE code = 'IN'), (SELECT id FROM countries WHERE code = 'IN'), (SELECT id FROM states WHERE code = 'MH'), NULL, NULL, 'F1234571', 10005, (SELECT id FROM departments WHERE code = 'CSE'), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- FACULTY SUBJECTS
-- =====================================================

-- Faculty Subject Assignments
INSERT INTO faculty_subjects (faculty_id, subject_id) VALUES
((SELECT id FROM faculty WHERE id_number = 'F1234567'), (SELECT id FROM subjects WHERE code = 'CSE101')), -- Dr. Rajesh Kumar - Programming in C
((SELECT id FROM faculty WHERE id_number = 'F1234567'), (SELECT id FROM subjects WHERE code = 'CSE102')), -- Dr. Rajesh Kumar - Data Structures and Algorithms
((SELECT id FROM faculty WHERE id_number = 'F1234568'), (SELECT id FROM subjects WHERE code = 'CSE103')), -- Prof. Priya Sharma - Database Management Systems
((SELECT id FROM faculty WHERE id_number = 'F1234568'), (SELECT id FROM subjects WHERE code = 'CSE104')), -- Prof. Priya Sharma - Computer Networks
((SELECT id FROM faculty WHERE id_number = 'F1234569'), (SELECT id FROM subjects WHERE code = 'CSE105')), -- Dr. Amit Patel - Operating Systems
((SELECT id FROM faculty WHERE id_number = 'F1234569'), (SELECT id FROM subjects WHERE code = 'CSE106')), -- Dr. Amit Patel - Software Engineering
((SELECT id FROM faculty WHERE id_number = 'F1234570'), (SELECT id FROM subjects WHERE code = 'CSE107')), -- Prof. Sneha Singh - Web Technologies
((SELECT id FROM faculty WHERE id_number = 'F1234570'), (SELECT id FROM subjects WHERE code = 'CSE108')), -- Prof. Sneha Singh - Machine Learning
((SELECT id FROM faculty WHERE id_number = 'F1234571'), (SELECT id FROM subjects WHERE code = 'CSE109')), -- Dr. Vikram Gupta - Artificial Intelligence
((SELECT id FROM faculty WHERE id_number = 'F1234571'), (SELECT id FROM subjects WHERE code = 'CSE110')); -- Dr. Vikram Gupta - Cybersecurity Fundamentals

-- =====================================================
-- FACULTY DEPARTMENTS
-- =====================================================

-- Faculty Department Assignments
INSERT INTO faculty_departments (faculty_id, department_id) VALUES
((SELECT id FROM faculty WHERE id_number = 'F1234567'), (SELECT id FROM departments WHERE code = 'CSE')), -- Dr. Rajesh Kumar - Computer Science & Engineering
((SELECT id FROM faculty WHERE id_number = 'F1234568'), (SELECT id FROM departments WHERE code = 'CSE')), -- Prof. Priya Sharma - Computer Science & Engineering
((SELECT id FROM faculty WHERE id_number = 'F1234569'), (SELECT id FROM departments WHERE code = 'IT')), -- Dr. Amit Patel - Information Technology
((SELECT id FROM faculty WHERE id_number = 'F1234570'), (SELECT id FROM departments WHERE code = 'ECE')), -- Prof. Sneha Singh - Electronics & Communication
((SELECT id FROM faculty WHERE id_number = 'F1234571'), (SELECT id FROM departments WHERE code = 'CSE')); -- Dr. Vikram Gupta - Computer Science & Engineering

-- =====================================================
-- STUDENT COURSE ENROLLMENTS
-- =====================================================

-- Student Course Enrollments
INSERT INTO student_courses (student_id, course_id, batch_id, roll_number, academic_year_id, academic_term_id, state, created_at, updated_at) VALUES
((SELECT id FROM students WHERE gr_no = 'GR2024001'), (SELECT id FROM courses WHERE code = 'BTECH-CSE'), (SELECT id FROM batches WHERE code = 'CSE2024-28'), 'CSE2024001', (SELECT id FROM academic_years WHERE code = 'AY2024-25'), (SELECT id FROM academic_terms WHERE code = 'SEM1-2024-25'), 'running', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
((SELECT id FROM students WHERE gr_no = 'GR2024002'), (SELECT id FROM courses WHERE code = 'BTECH-CSE'), (SELECT id FROM batches WHERE code = 'CSE2024-28'), 'CSE2024002', (SELECT id FROM academic_years WHERE code = 'AY2024-25'), (SELECT id FROM academic_terms WHERE code = 'SEM1-2024-25'), 'running', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
((SELECT id FROM students WHERE gr_no = 'GR2024003'), (SELECT id FROM courses WHERE code = 'BTECH-CSE'), (SELECT id FROM batches WHERE code = 'CSE2024-28'), 'CSE2024003', (SELECT id FROM academic_years WHERE code = 'AY2024-25'), (SELECT id FROM academic_terms WHERE code = 'SEM1-2024-25'), 'running', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
((SELECT id FROM students WHERE gr_no = 'GR2024004'), (SELECT id FROM courses WHERE code = 'BTECH-IT'), (SELECT id FROM batches WHERE code = 'IT2024-28'), 'IT2024001', (SELECT id FROM academic_years WHERE code = 'AY2024-25'), (SELECT id FROM academic_terms WHERE code = 'SEM1-2024-25'), 'running', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
((SELECT id FROM students WHERE gr_no = 'GR2024005'), (SELECT id FROM courses WHERE code = 'BTECH-IT'), (SELECT id FROM batches WHERE code = 'IT2024-28'), 'IT2024002', (SELECT id FROM academic_years WHERE code = 'AY2024-25'), (SELECT id FROM academic_terms WHERE code = 'SEM1-2024-25'), 'running', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- STUDENT COURSE SUBJECTS
-- =====================================================

-- Student Course Subject Enrollments
INSERT INTO student_course_subjects (student_course_id, subject_id) VALUES
((SELECT id FROM student_courses WHERE roll_number = 'CSE2024001'), (SELECT id FROM subjects WHERE code = 'CSE101')), -- Arjun Singh - Programming in C
((SELECT id FROM student_courses WHERE roll_number = 'CSE2024001'), (SELECT id FROM subjects WHERE code = 'CSE102')), -- Arjun Singh - Data Structures and Algorithms
((SELECT id FROM student_courses WHERE roll_number = 'CSE2024001'), (SELECT id FROM subjects WHERE code = 'CSE103')), -- Arjun Singh - Database Management Systems
((SELECT id FROM student_courses WHERE roll_number = 'CSE2024001'), (SELECT id FROM subjects WHERE code = 'CSE104')), -- Arjun Singh - Computer Networks
((SELECT id FROM student_courses WHERE roll_number = 'CSE2024001'), (SELECT id FROM subjects WHERE code = 'CSE105')), -- Arjun Singh - Operating Systems
((SELECT id FROM student_courses WHERE roll_number = 'CSE2024001'), (SELECT id FROM subjects WHERE code = 'CSE106')), -- Arjun Singh - Software Engineering
((SELECT id FROM student_courses WHERE roll_number = 'CSE2024001'), (SELECT id FROM subjects WHERE code = 'CSE107')), -- Arjun Singh - Web Technologies
((SELECT id FROM student_courses WHERE roll_number = 'CSE2024001'), (SELECT id FROM subjects WHERE code = 'CSE108')), -- Arjun Singh - Machine Learning
((SELECT id FROM student_courses WHERE roll_number = 'CSE2024001'), (SELECT id FROM subjects WHERE code = 'CSE109')), -- Arjun Singh - Artificial Intelligence
((SELECT id FROM student_courses WHERE roll_number = 'CSE2024001'), (SELECT id FROM subjects WHERE code = 'CSE110')), -- Arjun Singh - Cybersecurity Fundamentals
((SELECT id FROM student_courses WHERE roll_number = 'CSE2024001'), (SELECT id FROM subjects WHERE code = 'MATH101')), -- Arjun Singh - Calculus
((SELECT id FROM student_courses WHERE roll_number = 'CSE2024001'), (SELECT id FROM subjects WHERE code = 'MATH102')), -- Arjun Singh - Linear Algebra
((SELECT id FROM student_courses WHERE roll_number = 'CSE2024001'), (SELECT id FROM subjects WHERE code = 'MATH103')), -- Arjun Singh - Discrete Mathematics
((SELECT id FROM student_courses WHERE roll_number = 'CSE2024001'), (SELECT id FROM subjects WHERE code = 'MATH104')), -- Arjun Singh - Probability and Statistics
((SELECT id FROM student_courses WHERE roll_number = 'CSE2024001'), (SELECT id FROM subjects WHERE code = 'MATH105')), -- Arjun Singh - Numerical Methods
((SELECT id FROM student_courses WHERE roll_number = 'CSE2024001'), (SELECT id FROM subjects WHERE code = 'PHY101')), -- Arjun Singh - Engineering Physics
((SELECT id FROM student_courses WHERE roll_number = 'CSE2024001'), (SELECT id FROM subjects WHERE code = 'PHY102')), -- Arjun Singh - Physics Laboratory
((SELECT id FROM student_courses WHERE roll_number = 'CSE2024001'), (SELECT id FROM subjects WHERE code = 'CHEM101')), -- Arjun Singh - Engineering Chemistry
((SELECT id FROM student_courses WHERE roll_number = 'CSE2024001'), (SELECT id FROM subjects WHERE code = 'CHEM102')), -- Arjun Singh - Chemistry Laboratory
((SELECT id FROM student_courses WHERE roll_number = 'CSE2024001'), (SELECT id FROM subjects WHERE code = 'ENG101')), -- Arjun Singh - Technical Communication
((SELECT id FROM student_courses WHERE roll_number = 'CSE2024001'), (SELECT id FROM subjects WHERE code = 'ENG102')); -- Arjun Singh - Professional English

-- Similar enrollments for other students...
INSERT INTO student_course_subjects (student_course_id, subject_id) VALUES
((SELECT id FROM student_courses WHERE roll_number = 'CSE2024002'), (SELECT id FROM subjects WHERE code = 'CSE101')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024002'), (SELECT id FROM subjects WHERE code = 'CSE102')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024002'), (SELECT id FROM subjects WHERE code = 'CSE103')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024002'), (SELECT id FROM subjects WHERE code = 'CSE104')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024002'), (SELECT id FROM subjects WHERE code = 'CSE105')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024002'), (SELECT id FROM subjects WHERE code = 'CSE106')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024002'), (SELECT id FROM subjects WHERE code = 'CSE107')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024002'), (SELECT id FROM subjects WHERE code = 'CSE108')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024002'), (SELECT id FROM subjects WHERE code = 'CSE109')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024002'), (SELECT id FROM subjects WHERE code = 'CSE110')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024002'), (SELECT id FROM subjects WHERE code = 'MATH101')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024002'), (SELECT id FROM subjects WHERE code = 'MATH102')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024002'), (SELECT id FROM subjects WHERE code = 'MATH103')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024002'), (SELECT id FROM subjects WHERE code = 'MATH104')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024002'), (SELECT id FROM subjects WHERE code = 'MATH105')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024002'), (SELECT id FROM subjects WHERE code = 'PHY101')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024002'), (SELECT id FROM subjects WHERE code = 'PHY102')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024002'), (SELECT id FROM subjects WHERE code = 'CHEM101')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024002'), (SELECT id FROM subjects WHERE code = 'CHEM102')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024002'), (SELECT id FROM subjects WHERE code = 'ENG101')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024002'), (SELECT id FROM subjects WHERE code = 'ENG102')),
((SELECT id FROM student_courses WHERE roll_number = 'CSE2024003'), (SELECT id FROM subjects WHERE code = 'CSE101')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024003'), (SELECT id FROM subjects WHERE code = 'CSE102')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024003'), (SELECT id FROM subjects WHERE code = 'CSE103')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024003'), (SELECT id FROM subjects WHERE code = 'CSE104')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024003'), (SELECT id FROM subjects WHERE code = 'CSE105')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024003'), (SELECT id FROM subjects WHERE code = 'CSE106')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024003'), (SELECT id FROM subjects WHERE code = 'CSE107')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024003'), (SELECT id FROM subjects WHERE code = 'CSE108')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024003'), (SELECT id FROM subjects WHERE code = 'CSE109')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024003'), (SELECT id FROM subjects WHERE code = 'CSE110')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024003'), (SELECT id FROM subjects WHERE code = 'MATH101')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024003'), (SELECT id FROM subjects WHERE code = 'MATH102')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024003'), (SELECT id FROM subjects WHERE code = 'MATH103')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024003'), (SELECT id FROM subjects WHERE code = 'MATH104')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024003'), (SELECT id FROM subjects WHERE code = 'MATH105')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024003'), (SELECT id FROM subjects WHERE code = 'PHY101')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024003'), (SELECT id FROM subjects WHERE code = 'PHY102')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024003'), (SELECT id FROM subjects WHERE code = 'CHEM101')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024003'), (SELECT id FROM subjects WHERE code = 'CHEM102')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024003'), (SELECT id FROM subjects WHERE code = 'ENG101')), ((SELECT id FROM student_courses WHERE roll_number = 'CSE2024003'), (SELECT id FROM subjects WHERE code = 'ENG102')),
((SELECT id FROM student_courses WHERE roll_number = 'IT2024001'), (SELECT id FROM subjects WHERE code = 'CSE101')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024001'), (SELECT id FROM subjects WHERE code = 'CSE102')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024001'), (SELECT id FROM subjects WHERE code = 'CSE103')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024001'), (SELECT id FROM subjects WHERE code = 'CSE104')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024001'), (SELECT id FROM subjects WHERE code = 'CSE107')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024001'), (SELECT id FROM subjects WHERE code = 'CSE108')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024001'), (SELECT id FROM subjects WHERE code = 'MATH101')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024001'), (SELECT id FROM subjects WHERE code = 'MATH102')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024001'), (SELECT id FROM subjects WHERE code = 'MATH103')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024001'), (SELECT id FROM subjects WHERE code = 'MATH104')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024001'), (SELECT id FROM subjects WHERE code = 'PHY101')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024001'), (SELECT id FROM subjects WHERE code = 'PHY102')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024001'), (SELECT id FROM subjects WHERE code = 'CHEM101')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024001'), (SELECT id FROM subjects WHERE code = 'CHEM102')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024001'), (SELECT id FROM subjects WHERE code = 'ENG101')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024001'), (SELECT id FROM subjects WHERE code = 'ENG102')),
((SELECT id FROM student_courses WHERE roll_number = 'IT2024002'), (SELECT id FROM subjects WHERE code = 'CSE101')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024002'), (SELECT id FROM subjects WHERE code = 'CSE102')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024002'), (SELECT id FROM subjects WHERE code = 'CSE103')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024002'), (SELECT id FROM subjects WHERE code = 'CSE104')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024002'), (SELECT id FROM subjects WHERE code = 'CSE107')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024002'), (SELECT id FROM subjects WHERE code = 'CSE108')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024002'), (SELECT id FROM subjects WHERE code = 'MATH101')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024002'), (SELECT id FROM subjects WHERE code = 'MATH102')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024002'), (SELECT id FROM subjects WHERE code = 'MATH103')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024002'), (SELECT id FROM subjects WHERE code = 'MATH104')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024002'), (SELECT id FROM subjects WHERE code = 'PHY101')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024002'), (SELECT id FROM subjects WHERE code = 'PHY102')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024002'), (SELECT id FROM subjects WHERE code = 'CHEM101')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024002'), (SELECT id FROM subjects WHERE code = 'CHEM102')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024002'), (SELECT id FROM subjects WHERE code = 'ENG101')), ((SELECT id FROM student_courses WHERE roll_number = 'IT2024002'), (SELECT id FROM subjects WHERE code = 'ENG102'));

-- =====================================================
-- FACILITIES
-- =====================================================

-- Educational Facilities
INSERT INTO facilities (id, name, code, type, description, active, created_at, updated_at) VALUES
(1000, 'Computer Lab 1', 'CL001', 'Laboratory', 'Main Computer Laboratory with 30 systems', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1001, 'Computer Lab 2', 'CL002', 'Laboratory', 'Advanced Computer Laboratory with 25 systems', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1002, 'Physics Laboratory', 'PL001', 'Laboratory', 'Physics experiments and equipment', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1003, 'Chemistry Laboratory', 'CL003', 'Laboratory', 'Chemistry experiments and equipment', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1004, 'Library', 'LIB001', 'Library', 'Main library with books and digital resources', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1005, 'Auditorium', 'AUD001', 'Hall', 'Main auditorium for events and presentations', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1006, 'Cafeteria', 'CAF001', 'Food', 'Student and staff cafeteria', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1007, 'Sports Complex', 'SP001', 'Sports', 'Indoor and outdoor sports facilities', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1008, 'Hostel Block A', 'HOST001', 'Accommodation', 'Boys hostel accommodation', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1009, 'Hostel Block B', 'HOST002', 'Accommodation', 'Girls hostel accommodation', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- PRODUCTS (FEES ELEMENTS)
-- =====================================================

-- Fee Products
INSERT INTO products (id, name, code, type, price, cost, active, created_at, updated_at) VALUES
(1000, 'Tuition Fee', 'TUITION', 'service', 50000.00, 0.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1001, 'Library Fee', 'LIBRARY', 'service', 2000.00, 0.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1002, 'Laboratory Fee', 'LAB', 'service', 5000.00, 0.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1003, 'Examination Fee', 'EXAM', 'service', 3000.00, 0.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1004, 'Development Fee', 'DEV', 'service', 10000.00, 0.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1005, 'Sports Fee', 'SPORTS', 'service', 1500.00, 0.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1006, 'Hostel Fee', 'HOSTEL', 'service', 25000.00, 0.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1007, 'Mess Fee', 'MESS', 'service', 15000.00, 0.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1008, 'Transport Fee', 'TRANSPORT', 'service', 8000.00, 0.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1009, 'Medical Fee', 'MEDICAL', 'service', 1000.00, 0.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- FACILITY LINES
-- =====================================================

-- Facility Product Lines
INSERT INTO facility_lines (id, facility_id, product_id, quantity, active, created_at, updated_at) VALUES
(1000, 1000, 1002, 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Computer Lab 1 - Laboratory Fee
(1001, 1001, 1002, 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Computer Lab 2 - Laboratory Fee
(1002, 1002, 1002, 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Physics Lab - Laboratory Fee
(1003, 1003, 1002, 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Chemistry Lab - Laboratory Fee
(1004, 1004, 1001, 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Library - Library Fee
(1005, 1007, 1005, 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Sports Complex - Sports Fee
(1006, 1008, 1006, 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Hostel Block A - Hostel Fee
(1007, 1009, 1006, 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Hostel Block B - Hostel Fee
(1008, 1008, 1007, 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Hostel Block A - Mess Fee
(1009, 1009, 1007, 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); -- Hostel Block B - Mess Fee

-- =====================================================
-- CLASSROOMS
-- =====================================================

-- Classroom Facilities
INSERT INTO classrooms (id, name, code, capacity, asset_ids, facility_id, active, created_at, updated_at) VALUES
(1000, 'Classroom 101', 'CR101', 60, 'PROJ001,WHITE001,AC001', 1000, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1001, 'Classroom 102', 'CR102', 60, 'PROJ002,WHITE002,AC002', 1000, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1002, 'Classroom 103', 'CR103', 60, 'PROJ003,WHITE003,AC003', 1000, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1003, 'Classroom 201', 'CR201', 60, 'PROJ004,WHITE004,AC004', 1000, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1004, 'Classroom 202', 'CR202', 60, 'PROJ005,WHITE005,AC005', 1000, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1005, 'Computer Lab 1', 'CL101', 30, 'PC001-PC030,PROJ006,AC006', 1000, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1006, 'Computer Lab 2', 'CL102', 25, 'PC031-PC055,PROJ007,AC007', 1001, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1007, 'Physics Lab', 'PL101', 30, 'PHY001-PHY030,AC008', 1002, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1008, 'Chemistry Lab', 'CL103', 30, 'CHEM001-CHEM030,AC009', 1003, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1009, 'Auditorium', 'AUD101', 200, 'PROJ008,SOUND001,AC010', 1005, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- CLASSROOM FACILITY LINES
-- =====================================================

-- Classroom Facility Line Assignments
INSERT INTO classroom_facility_lines (classroom_id, facility_line_id) VALUES
(1000, 1000), -- Classroom 101 - Computer Lab 1 Facility Line
(1001, 1000), -- Classroom 102 - Computer Lab 1 Facility Line
(1002, 1000), -- Classroom 103 - Computer Lab 1 Facility Line
(1003, 1000), -- Classroom 201 - Computer Lab 1 Facility Line
(1004, 1000), -- Classroom 202 - Computer Lab 1 Facility Line
(1005, 1000), -- Computer Lab 1 - Computer Lab 1 Facility Line
(1006, 1001), -- Computer Lab 2 - Computer Lab 2 Facility Line
(1007, 1002), -- Physics Lab - Physics Lab Facility Line
(1008, 1003), -- Chemistry Lab - Chemistry Lab Facility Line
(1009, 1005); -- Auditorium - Sports Complex Facility Line

-- =====================================================
-- TIMINGS
-- =====================================================

-- Class Timings
INSERT INTO timings (id, name, start_time, end_time, active, created_at, updated_at) VALUES
(1000, 'Period 1', '09:00:00', '09:50:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1001, 'Period 2', '10:00:00', '10:50:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1002, 'Period 3', '11:00:00', '11:50:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1003, 'Period 4', '12:00:00', '12:50:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1004, 'Period 5', '14:00:00', '14:50:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1005, 'Period 6', '15:00:00', '15:50:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1006, 'Period 7', '16:00:00', '16:50:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1007, 'Period 8', '17:00:00', '17:50:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- ATTENDANCE TYPES
-- =====================================================

-- Attendance Type Definitions
INSERT INTO attendance_types (id, name, present, excused, absent, late, company_id, active, created_at, updated_at) VALUES
(100, 'Present', true, false, false, false, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(101, 'Absent', false, false, true, false, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(102, 'Late', true, false, false, true, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(103, 'Excused Absence', false, true, false, false, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(104, 'Medical Leave', false, true, false, false, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- EXAM TYPES
-- =====================================================

-- Examination Types
INSERT INTO exam_types (id, name, code, active, created_at, updated_at) VALUES
(100, 'Mid Semester Examination', 'MID', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(101, 'End Semester Examination', 'END', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(102, 'Quiz', 'QUIZ', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(103, 'Assignment', 'ASSIGN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(104, 'Project', 'PROJECT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(105, 'Viva Voce', 'VIVA', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(106, 'Practical Examination', 'PRACTICAL', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- GRADE CONFIGURATIONS
-- =====================================================

-- Grade Configuration System
INSERT INTO grade_configurations (id, name, min_marks, max_marks, grade, result, active, created_at, updated_at) VALUES
(100, 'A+ Grade', 90, 100, 'A+', 'Pass', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(101, 'A Grade', 80, 89, 'A', 'Pass', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(102, 'B+ Grade', 70, 79, 'B+', 'Pass', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(103, 'B Grade', 60, 69, 'B', 'Pass', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(104, 'C+ Grade', 50, 59, 'C+', 'Pass', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(105, 'C Grade', 40, 49, 'C', 'Pass', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(106, 'D Grade', 33, 39, 'D', 'Pass', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(107, 'F Grade', 0, 32, 'F', 'Fail', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- MEDIA TYPES
-- =====================================================

-- Library Media Types
INSERT INTO media_types (id, name, code, active, created_at, updated_at) VALUES
(100, 'Textbook', 'TEXT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(101, 'Reference Book', 'REF', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(102, 'Journal', 'JOUR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(103, 'Magazine', 'MAG', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(104, 'E-Book', 'EBOOK', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(105, 'CD/DVD', 'CD', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(106, 'Thesis', 'THESIS', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(107, 'Report', 'REPORT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- AUTHORS
-- =====================================================

-- Book Authors
INSERT INTO authors (id, name, address_id, active, created_at, updated_at) VALUES
(1000, 'Dr. Rajesh Kumar', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1001, 'Prof. Priya Sharma', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1002, 'Dr. Amit Patel', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1003, 'Prof. Sneha Singh', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1004, 'Dr. Vikram Gupta', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1005, 'Thomas H. Cormen', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1006, 'Charles E. Leiserson', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1007, 'Ronald L. Rivest', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1008, 'Clifford Stein', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1009, 'Abraham Silberschatz', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- PUBLISHERS
-- =====================================================

-- Book Publishers
INSERT INTO publishers (id, name, address_id, active, created_at, updated_at) VALUES
(1000, 'McGraw Hill Education', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1001, 'Pearson Education', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1002, 'Wiley India', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1003, 'Prentice Hall', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1004, 'MIT Press', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1005, 'O''Reilly Media', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1006, 'Springer', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1007, 'Elsevier', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1008, 'IEEE Press', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1009, 'ACM Press', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- TAGS
-- =====================================================

-- Library Tags
INSERT INTO tags (id, name, active, created_at, updated_at) VALUES
(1000, 'Programming', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1001, 'Data Structures', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1002, 'Algorithms', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1003, 'Database', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1004, 'Networks', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1005, 'Operating Systems', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1006, 'Software Engineering', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1007, 'Web Development', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1008, 'Machine Learning', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1009, 'Artificial Intelligence', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- MEDIA (BOOKS)
-- =====================================================

-- Library Books
INSERT INTO media (id, name, isbn, edition, description, internal_code, media_type_id, active, created_at, updated_at) VALUES
(10000, 'Introduction to Algorithms', '978-0262033848', '3rd Edition', 'Comprehensive textbook on algorithms and data structures', 'ALG001', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10001, 'Database System Concepts', '978-0073523323', '7th Edition', 'Fundamental concepts of database systems', 'DB001', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10002, 'Computer Networks', '978-0132856204', '5th Edition', 'Comprehensive guide to computer networking', 'NET001', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10003, 'Operating System Concepts', '978-1118063330', '9th Edition', 'Core concepts of operating systems', 'OS001', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10004, 'Software Engineering', '978-0133943030', '10th Edition', 'Principles and practices of software engineering', 'SE001', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10005, 'Web Technologies', '978-0132145374', '4th Edition', 'Modern web development technologies', 'WEB001', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10006, 'Machine Learning', '978-0136042594', '1st Edition', 'Introduction to machine learning concepts', 'ML001', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10007, 'Artificial Intelligence', '978-0136042594', '3rd Edition', 'Modern approach to artificial intelligence', 'AI001', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10008, 'Cybersecurity Fundamentals', '978-0134834101', '2nd Edition', 'Essential cybersecurity concepts and practices', 'CS001', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10009, 'Data Structures and Algorithms in C', '978-0133976890', '2nd Edition', 'Implementation of data structures in C', 'DSC001', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- MEDIA AUTHORS
-- =====================================================

-- Book-Author Relationships
INSERT INTO media_authors (media_id, author_id) VALUES
(10000, 1005), (10000, 1006), (10000, 1007), (10000, 1008), -- Introduction to Algorithms
(10001, 1009), -- Database System Concepts
(10002, 1000), -- Computer Networks
(10003, 1001), -- Operating System Concepts
(10004, 1002), -- Software Engineering
(10005, 1003), -- Web Technologies
(10006, 1004), -- Machine Learning
(10007, 1000), -- Artificial Intelligence
(10008, 1001), -- Cybersecurity Fundamentals
(10009, 1002); -- Data Structures and Algorithms in C

-- =====================================================
-- MEDIA PUBLISHERS
-- =====================================================

-- Book-Publisher Relationships
INSERT INTO media_publishers (media_id, publisher_id) VALUES
(10000, 1004), -- Introduction to Algorithms - MIT Press
(10001, 1000), -- Database System Concepts - McGraw Hill
(10002, 1001), -- Computer Networks - Pearson
(10003, 1002), -- Operating System Concepts - Wiley
(10004, 1003), -- Software Engineering - Prentice Hall
(10005, 1005), -- Web Technologies - O'Reilly
(10006, 1006), -- Machine Learning - Springer
(10007, 1007), -- Artificial Intelligence - Elsevier
(10008, 1008), -- Cybersecurity Fundamentals - IEEE Press
(10009, 1009); -- Data Structures and Algorithms in C - ACM Press

-- =====================================================
-- MEDIA TAGS
-- =====================================================

-- Book-Tag Relationships
INSERT INTO media_tags (media_id, tag_id) VALUES
(10000, 1001), (10000, 1002), -- Introduction to Algorithms - Data Structures, Algorithms
(10001, 1003), -- Database System Concepts - Database
(10002, 1004), -- Computer Networks - Networks
(10003, 1005), -- Operating System Concepts - Operating Systems
(10004, 1006), -- Software Engineering - Software Engineering
(10005, 1007), -- Web Technologies - Web Development
(10006, 1008), -- Machine Learning - Machine Learning
(10007, 1009), -- Artificial Intelligence - Artificial Intelligence
(10008, 1000), -- Cybersecurity Fundamentals - Programming
(10009, 1001), (10009, 1002); -- Data Structures and Algorithms in C - Data Structures, Algorithms

-- =====================================================
-- MEDIA COURSES
-- =====================================================

-- Book-Course Relationships
INSERT INTO media_courses (media_id, course_id) VALUES
(10000, 1000), -- Introduction to Algorithms - B.Tech CSE
(10001, 1000), -- Database System Concepts - B.Tech CSE
(10002, 1000), -- Computer Networks - B.Tech CSE
(10003, 1000), -- Operating System Concepts - B.Tech CSE
(10004, 1000), -- Software Engineering - B.Tech CSE
(10005, 1000), -- Web Technologies - B.Tech CSE
(10006, 1000), -- Machine Learning - B.Tech CSE
(10007, 1000), -- Artificial Intelligence - B.Tech CSE
(10008, 1000), -- Cybersecurity Fundamentals - B.Tech CSE
(10009, 1000); -- Data Structures and Algorithms in C - B.Tech CSE

-- =====================================================
-- MEDIA SUBJECTS
-- =====================================================

-- Book-Subject Relationships
INSERT INTO media_subjects (media_id, subject_id) VALUES
(10000, 1001), -- Introduction to Algorithms - Data Structures and Algorithms
(10001, 1002), -- Database System Concepts - Database Management Systems
(10002, 1003), -- Computer Networks - Computer Networks
(10003, 1004), -- Operating System Concepts - Operating Systems
(10004, 1005), -- Software Engineering - Software Engineering
(10005, 1006), -- Web Technologies - Web Technologies
(10006, 1007), -- Machine Learning - Machine Learning
(10007, 1008), -- Artificial Intelligence - Artificial Intelligence
(10008, 1009), -- Cybersecurity Fundamentals - Cybersecurity Fundamentals
(10009, 1000); -- Data Structures and Algorithms in C - Programming in C

-- =====================================================
-- MEDIA UNITS
-- =====================================================

-- Library Book Units
INSERT INTO media_units (id, name, media_id, barcode, state, active, created_at, updated_at) VALUES
(100000, 'Introduction to Algorithms - Copy 1', 10000, 'ALG001-001', 'available', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100001, 'Introduction to Algorithms - Copy 2', 10000, 'ALG001-002', 'available', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100002, 'Introduction to Algorithms - Copy 3', 10000, 'ALG001-003', 'available', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100003, 'Database System Concepts - Copy 1', 10001, 'DB001-001', 'available', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100004, 'Database System Concepts - Copy 2', 10001, 'DB001-002', 'available', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100005, 'Computer Networks - Copy 1', 10002, 'NET001-001', 'available', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100006, 'Computer Networks - Copy 2', 10002, 'NET001-002', 'available', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100007, 'Operating System Concepts - Copy 1', 10003, 'OS001-001', 'available', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100008, 'Operating System Concepts - Copy 2', 10003, 'OS001-002', 'available', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100009, 'Software Engineering - Copy 1', 10004, 'SE001-001', 'available', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- LIBRARY CARD TYPES
-- =====================================================

-- Library Card Types
INSERT INTO library_card_types (id, name, allow_media, duration, penalty_amt_per_day, active, created_at, updated_at) VALUES
(100, 'Student Card', 5, 14, 5.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(101, 'Faculty Card', 10, 30, 2.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(102, 'Research Scholar Card', 8, 21, 3.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(103, 'Staff Card', 3, 7, 10.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- LIBRARY CARDS
-- =====================================================

-- Student Library Cards
INSERT INTO library_cards (id, name, number, card_type_id, student_id, faculty_id, issue_date, active, created_at, updated_at) VALUES
(10000, 'Arjun Singh Library Card', 'STU2024001', 100, 100000, NULL, '2024-06-01', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10001, 'Priya Patel Library Card', 'STU2024002', 100, 100001, NULL, '2024-06-01', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10002, 'Rahul Kumar Library Card', 'STU2024003', 100, 100002, NULL, '2024-06-01', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10003, 'Sneha Sharma Library Card', 'STU2024004', 100, 100003, NULL, '2024-06-01', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10004, 'Vikram Gupta Library Card', 'STU2024005', 100, 100004, NULL, '2024-06-01', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Faculty Library Cards
INSERT INTO library_cards (id, name, number, card_type_id, student_id, faculty_id, issue_date, active, created_at, updated_at) VALUES
(10010, 'Dr. Rajesh Kumar Library Card', 'FAC2024001', 101, NULL, 10000, '2024-06-01', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10011, 'Prof. Priya Sharma Library Card', 'FAC2024002', 101, NULL, 10001, '2024-06-01', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10012, 'Dr. Amit Patel Library Card', 'FAC2024003', 101, NULL, 10002, '2024-06-01', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10013, 'Prof. Sneha Singh Library Card', 'FAC2024004', 101, NULL, 10003, '2024-06-01', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10014, 'Dr. Vikram Gupta Library Card', 'FAC2024005', 101, NULL, 10004, '2024-06-01', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- FEES TERMS
-- =====================================================

-- Fee Structure Terms
INSERT INTO fees_terms (id, name, code, fees_terms, note, company_id, no_days, day_type, discount, active, created_at, updated_at) VALUES
(1000, 'B.Tech CSE Fee Structure', 'BTECH-CSE-FEES', 'fixed_days', 'Complete fee structure for B.Tech CSE program', 100, 30, 'before', 5.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1001, 'B.Tech IT Fee Structure', 'BTECH-IT-FEES', 'fixed_days', 'Complete fee structure for B.Tech IT program', 100, 30, 'before', 5.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1002, 'M.Tech CSE Fee Structure', 'MTECH-CSE-FEES', 'fixed_days', 'Complete fee structure for M.Tech CSE program', 100, 30, 'before', 10.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1003, 'MBA Fee Structure', 'MBA-FEES', 'fixed_days', 'Complete fee structure for MBA program', 100, 30, 'before', 8.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- FEES TERMS LINES
-- =====================================================

-- Fee Structure Lines
INSERT INTO fees_terms_lines (id, name, due_days, value, fees_id, active, created_at, updated_at) VALUES
(1000, 'Tuition Fee - Semester 1', 0, 100.00, 1000, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1001, 'Tuition Fee - Semester 2', 180, 100.00, 1000, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1002, 'Library Fee - Annual', 0, 100.00, 1000, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1003, 'Laboratory Fee - Annual', 0, 100.00, 1000, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1004, 'Examination Fee - Annual', 0, 100.00, 1000, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1005, 'Development Fee - Annual', 0, 100.00, 1000, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1006, 'Sports Fee - Annual', 0, 100.00, 1000, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1007, 'Hostel Fee - Annual', 0, 100.00, 1000, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1008, 'Mess Fee - Annual', 0, 100.00, 1000, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1009, 'Transport Fee - Annual', 0, 100.00, 1000, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- FEES ELEMENTS
-- =====================================================

-- Fee Structure Elements
INSERT INTO fees_elements (id, sequence, product_id, value, fees_terms_line_id, active, created_at, updated_at) VALUES
(1000, 1, 1000, 1.00, 1000, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Tuition Fee - Semester 1
(1001, 1, 1000, 1.00, 1001, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Tuition Fee - Semester 2
(1002, 1, 1001, 1.00, 1002, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Library Fee - Annual
(1003, 1, 1002, 1.00, 1003, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Laboratory Fee - Annual
(1004, 1, 1003, 1.00, 1004, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Examination Fee - Annual
(1005, 1, 1004, 1.00, 1005, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Development Fee - Annual
(1006, 1, 1005, 1.00, 1006, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Sports Fee - Annual
(1007, 1, 1006, 1.00, 1007, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Hostel Fee - Annual
(1008, 1, 1007, 1.00, 1008, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Mess Fee - Annual
(1009, 1, 1008, 1.00, 1009, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); -- Transport Fee - Annual

-- =====================================================
-- ASSIGNMENT TYPES
-- =====================================================

-- Assignment Types
INSERT INTO assignment_types (id, name, code, active, created_at, updated_at) VALUES
(100, 'Programming Assignment', 'PROG', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(101, 'Written Assignment', 'WRITTEN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(102, 'Project Assignment', 'PROJECT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(103, 'Research Assignment', 'RESEARCH', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(104, 'Presentation Assignment', 'PRESENTATION', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(105, 'Lab Assignment', 'LAB', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(106, 'Quiz Assignment', 'QUIZ', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- ACTIVITY TYPES
-- =====================================================

-- Activity Types
INSERT INTO activity_types (id, name, code, active, created_at, updated_at) VALUES
(100, 'Cultural Event', 'CULTURAL', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(101, 'Sports Event', 'SPORTS', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(102, 'Technical Event', 'TECHNICAL', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(103, 'Workshop', 'WORKSHOP', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(104, 'Seminar', 'SEMINAR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(105, 'Conference', 'CONFERENCE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(106, 'Field Trip', 'FIELDTRIP', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- PARENT RELATIONSHIPS
-- =====================================================

-- Parent Relationship Types
INSERT INTO parent_relationships (id, name, code, active, created_at, updated_at) VALUES
(100, 'Father', 'FATHER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(101, 'Mother', 'MOTHER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(102, 'Guardian', 'GUARDIAN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(103, 'Grandfather', 'GRANDFATHER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(104, 'Grandmother', 'GRANDMOTHER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(105, 'Uncle', 'UNCLE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(106, 'Aunt', 'AUNT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- PARENTS
-- =====================================================

-- Parent Records
INSERT INTO parents (id, partner_id, user_id, first_name, middle_name, last_name, birth_date, blood_group, gender, nationality_id, occupation, income, active, created_at, updated_at) VALUES
(10000, 10020, NULL, 'Ramesh', 'Kumar', 'Singh', '1970-05-15', 'A+', 'male', 1, 'Business Owner', 1500000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10001, 10021, NULL, 'Sunita', 'Ramesh', 'Patel', '1975-08-22', 'B+', 'female', 1, 'Teacher', 800000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10002, 10022, NULL, 'Suresh', 'Amit', 'Kumar', '1972-03-10', 'O+', 'male', 1, 'Engineer', 1200000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10003, 10023, NULL, 'Geeta', 'Priya', 'Sharma', '1978-11-05', 'AB+', 'female', 1, 'Doctor', 1800000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10004, 10024, NULL, 'Ravi', 'Rajesh', 'Gupta', '1975-09-18', 'B-', 'male', 1, 'Manager', 1000000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- STUDENT PARENT RELATIONS
-- =====================================================

-- Student-Parent Relationships
INSERT INTO student_parent_relations (id, student_id, parent_id, relationship_id, is_primary, active, created_at, updated_at) VALUES
(1000, 100000, 10000, 100, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Arjun Singh - Ramesh Singh (Father)
(1001, 100001, 10001, 101, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Priya Patel - Sunita Patel (Mother)
(1002, 100002, 10002, 100, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Rahul Kumar - Suresh Kumar (Father)
(1003, 100003, 10003, 101, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Sneha Sharma - Geeta Sharma (Mother)
(1004, 100004, 10004, 100, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); -- Vikram Gupta - Ravi Gupta (Father)

-- =====================================================
-- CHART OF ACCOUNTS
-- =====================================================

-- Chart of Accounts
INSERT INTO chart_of_accounts (id, code, name, type, parent_id, company_id, active, created_at, updated_at) VALUES
(1000, '1000', 'ASSETS', 'asset', NULL, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1001, '1100', 'Current Assets', 'asset', 1000, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1002, '1110', 'Cash and Cash Equivalents', 'asset', 1001, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1003, '1120', 'Accounts Receivable', 'asset', 1001, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1004, '1130', 'Inventory', 'asset', 1001, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1005, '1200', 'Fixed Assets', 'asset', 1000, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1006, '1210', 'Buildings', 'asset', 1005, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1007, '1220', 'Equipment', 'asset', 1005, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1008, '2000', 'LIABILITIES', 'liability', NULL, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1009, '2100', 'Current Liabilities', 'liability', 1008, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1010, '2110', 'Accounts Payable', 'liability', 1009, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1011, '2120', 'Accrued Expenses', 'liability', 1009, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1012, '3000', 'EQUITY', 'equity', NULL, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1013, '3100', 'Share Capital', 'equity', 1012, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1014, '3200', 'Retained Earnings', 'equity', 1012, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1015, '4000', 'REVENUE', 'revenue', NULL, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1016, '4100', 'Tuition Revenue', 'revenue', 1015, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1017, '4200', 'Other Revenue', 'revenue', 1015, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1018, '5000', 'EXPENSES', 'expense', NULL, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1019, '5100', 'Salaries and Wages', 'expense', 1018, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1020, '5200', 'Utilities', 'expense', 1018, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- ACCOUNT JOURNALS
-- =====================================================

-- Account Journals
INSERT INTO account_journals (id, name, code, type, company_id, active, created_at, updated_at) VALUES
(100, 'General Journal', 'GJ', 'general', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(101, 'Cash Journal', 'CJ', 'cash', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(102, 'Bank Journal', 'BJ', 'bank', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(103, 'Sales Journal', 'SJ', 'sale', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(104, 'Purchase Journal', 'PJ', 'purchase', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(105, 'Miscellaneous Journal', 'MJ', 'misc', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- ACCOUNT TAXES
-- =====================================================

-- Account Taxes
INSERT INTO account_taxes (id, name, code, amount, type, company_id, account_id, active, created_at, updated_at) VALUES
(100, 'GST 18%', 'GST18', 0.18, 'percent', 100, 1010, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(101, 'GST 12%', 'GST12', 0.12, 'percent', 100, 1010, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(102, 'GST 5%', 'GST5', 0.05, 'percent', 100, 1010, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(103, 'GST 0%', 'GST0', 0.00, 'percent', 100, 1010, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(104, 'TDS 10%', 'TDS10', 0.10, 'percent', 100, 1010, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(105, 'TDS 20%', 'TDS20', 0.20, 'percent', 100, 1010, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- STAFF
-- =====================================================

-- Staff Records
INSERT INTO staff (id, partner_id, employee_code, department_id, designation, joining_date, active, created_at, updated_at) VALUES
(10000, 10010, 'EMP001', 100, 'Professor', '2020-06-01', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10001, 10011, 'EMP002', 100, 'Associate Professor', '2021-06-01', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10002, 10012, 'EMP003', 101, 'Assistant Professor', '2022-06-01', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10003, 10013, 'EMP004', 102, 'Professor', '2019-06-01', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10004, 10014, 'EMP005', 100, 'Associate Professor', '2021-06-01', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- SALARY STRUCTURES
-- =====================================================

-- Salary Structures
INSERT INTO salary_structures (id, name, company_id, basic_salary, active, created_at, updated_at) VALUES
(1000, 'Professor Salary Structure', 100, 120000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1001, 'Associate Professor Salary Structure', 100, 90000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1002, 'Assistant Professor Salary Structure', 100, 70000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1003, 'Lecturer Salary Structure', 100, 50000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1004, 'Staff Salary Structure', 100, 30000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- TDS CONFIGURATION
-- =====================================================

-- TDS Configuration
INSERT INTO tds_config (id, name, slab_from, slab_to, percentage, company_id, active, created_at, updated_at) VALUES
(100, 'TDS Slab 1', 0.00, 250000.00, 0.00, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(101, 'TDS Slab 2', 250001.00, 500000.00, 5.00, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(102, 'TDS Slab 3', 500001.00, 1000000.00, 20.00, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(103, 'TDS Slab 4', 1000001.00, 999999999.99, 30.00, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- FISCAL YEARS
-- =====================================================

-- Fiscal Years
INSERT INTO fiscal_years (id, name, company_id, start_date, end_date, state, active, created_at, updated_at) VALUES
(100, 'FY 2024-25', 100, '2024-04-01', '2025-03-31', 'open', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(101, 'FY 2023-24', 100, '2023-04-01', '2024-03-31', 'closed', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(102, 'FY 2022-23', 100, '2022-04-01', '2023-03-31', 'closed', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- FISCAL PERIODS
-- =====================================================

-- Fiscal Periods for FY 2024-25
INSERT INTO fiscal_periods (id, name, fiscal_year_id, start_date, end_date, state, active, created_at, updated_at) VALUES
(1000, 'Q1 FY 2024-25', 100, '2024-04-01', '2024-06-30', 'closed', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1001, 'Q2 FY 2024-25', 100, '2024-07-01', '2024-09-30', 'closed', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1002, 'Q3 FY 2024-25', 100, '2024-10-01', '2024-12-31', 'open', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1003, 'Q4 FY 2024-25', 100, '2025-01-01', '2025-03-31', 'open', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- SYSTEM PARAMETERS
-- =====================================================

-- System Parameters
INSERT INTO system_parameters (id, key, value, description, active, created_at, updated_at) VALUES
(100, 'institution_name', 'Punk Records Education Solutions', 'Name of the educational institution', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(101, 'institution_address', '123 Education Street, Andheri West, Mumbai - 400058', 'Complete address of the institution', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(102, 'institution_phone', '+91-22-12345678', 'Primary phone number of the institution', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(103, 'institution_email', 'info@punkrecords.edu.in', 'Primary email address of the institution', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(104, 'institution_website', 'https://www.punkrecords.edu.in', 'Official website of the institution', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(105, 'academic_year_start_month', '6', 'Month when academic year starts (1-12)', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(106, 'academic_year_end_month', '5', 'Month when academic year ends (1-12)', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(107, 'default_currency', 'INR', 'Default currency code for the institution', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(108, 'default_timezone', 'Asia/Kolkata', 'Default timezone for the institution', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(109, 'max_attendance_percentage', '75', 'Minimum attendance percentage required', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- COMPANY SETTINGS
-- =====================================================

-- Company Settings
INSERT INTO company_settings (id, company_id, key, value, active, created_at, updated_at) VALUES
(100, 100, 'logo_url', '/static/images/logo.png', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(101, 100, 'theme_color', '#2196F3', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(102, 100, 'max_students_per_batch', '60', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(103, 100, 'max_faculty_per_department', '20', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(104, 100, 'library_max_books_per_student', '5', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(105, 100, 'library_max_books_per_faculty', '10', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(106, 100, 'library_book_return_days_student', '14', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(107, 100, 'library_book_return_days_faculty', '30', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(108, 100, 'exam_min_marks_for_pass', '33', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(109, 100, 'attendance_min_percentage', '75', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- CERTIFICATE TYPES
-- =====================================================

-- Certificate Types
INSERT INTO certificate_types (id, company_id, name, code, description, validity_period, is_digital, requires_signature, requires_seal, active, created_at, updated_at) VALUES
(100, 100, 'Degree Certificate', 'DEGREE', 'Official degree certificate for completed programs', 0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(101, 100, 'Course Completion Certificate', 'COURSE', 'Certificate for individual course completion', 0, true, true, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(102, 100, 'Attendance Certificate', 'ATTENDANCE', 'Certificate for attendance achievement', 0, true, false, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(103, 100, 'Merit Certificate', 'MERIT', 'Certificate for academic excellence', 0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(104, 100, 'Participation Certificate', 'PARTICIPATION', 'Certificate for event participation', 0, true, false, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- CERTIFICATE TEMPLATES
-- =====================================================

-- Certificate Templates
INSERT INTO certificate_templates (id, company_id, certificate_type_id, name, template_data, is_default, active, created_at, updated_at) VALUES
(100, 100, 100, 'Default Degree Certificate Template', '{"title": "Degree Certificate", "institution": "Punk Records Education Solutions", "border": "decorative", "signature_required": true, "seal_required": true}', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(101, 100, 101, 'Default Course Completion Template', '{"title": "Course Completion Certificate", "institution": "Punk Records Education Solutions", "border": "simple", "signature_required": true, "seal_required": false}', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(102, 100, 102, 'Default Attendance Certificate Template', '{"title": "Attendance Certificate", "institution": "Punk Records Education Solutions", "border": "minimal", "signature_required": false, "seal_required": false}', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(103, 100, 103, 'Default Merit Certificate Template', '{"title": "Merit Certificate", "institution": "Punk Records Education Solutions", "border": "premium", "signature_required": true, "seal_required": true}', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(104, 100, 104, 'Default Participation Certificate Template', '{"title": "Participation Certificate", "institution": "Punk Records Education Solutions", "border": "simple", "signature_required": false, "seal_required": false}', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- ADMISSION REGISTERS
-- =====================================================

-- Admission Registers
INSERT INTO admission_registers (id, name, code, start_date, end_date, course_id, min_count, max_count, fees, active, created_at, updated_at) VALUES
(1000, 'B.Tech CSE 2025 Admission', 'BTECH-CSE-2025', '2024-12-01', '2025-05-31', 1000, 30, 60, 50000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1001, 'B.Tech IT 2025 Admission', 'BTECH-IT-2025', '2024-12-01', '2025-05-31', 1001, 30, 60, 50000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1002, 'M.Tech CSE 2025 Admission', 'MTECH-CSE-2025', '2024-12-01', '2025-05-31', 1003, 15, 30, 75000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1003, 'MBA 2025 Admission', 'MBA-2025', '2024-12-01', '2025-05-31', 1005, 20, 40, 100000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- ADMISSIONS
-- =====================================================

-- Admission Applications
INSERT INTO admissions (id, name, register_id, application_number, application_date, student_id, course_id, batch_id, fees, state, active, created_at, updated_at) VALUES
(10000, 'Arjun Singh Admission', 1000, 'APP2025001', '2024-12-01', 100000, 1000, 1000, 50000.00, 'admission', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10001, 'Priya Patel Admission', 1000, 'APP2025002', '2024-12-01', 100001, 1000, 1000, 50000.00, 'admission', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10002, 'Rahul Kumar Admission', 1000, 'APP2025003', '2024-12-01', 100002, 1000, 1000, 50000.00, 'admission', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10003, 'Sneha Sharma Admission', 1001, 'APP2025004', '2024-12-01', 100003, 1001, 1003, 50000.00, 'admission', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10004, 'Vikram Gupta Admission', 1001, 'APP2025005', '2024-12-01', 100004, 1001, 1003, 50000.00, 'admission', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- ACTIVITIES
-- =====================================================

-- Activities
INSERT INTO activities (id, name, activity_type_id, course_id, batch_id, faculty_id, description, date, start_time, end_time, venue, state, active, created_at, updated_at) VALUES
(10000, 'Tech Fest 2024', 102, 1000, 1000, 10000, 'Annual technical festival showcasing student projects', '2024-12-15', '09:00:00', '17:00:00', 'Auditorium', 'open', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10001, 'Sports Day 2024', 101, NULL, NULL, NULL, 'Annual sports competition for all students', '2024-12-20', '08:00:00', '16:00:00', 'Sports Complex', 'open', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10002, 'Cultural Night 2024', 100, NULL, NULL, NULL, 'Annual cultural program with performances', '2024-12-25', '18:00:00', '22:00:00', 'Auditorium', 'open', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10003, 'Machine Learning Workshop', 103, 1000, 1000, 10001, 'Hands-on workshop on machine learning concepts', '2024-12-10', '10:00:00', '16:00:00', 'Computer Lab 1', 'open', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10004, 'Database Design Seminar', 104, 1000, 1000, 10002, 'Seminar on advanced database design principles', '2024-12-12', '14:00:00', '17:00:00', 'Classroom 101', 'open', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- ACTIVITY STUDENTS
-- =====================================================

-- Activity Student Participation
INSERT INTO activity_students (activity_id, student_id) VALUES
(10000, 100000), -- Tech Fest 2024 - Arjun Singh
(10000, 100001), -- Tech Fest 2024 - Priya Patel
(10000, 100002), -- Tech Fest 2024 - Rahul Kumar
(10001, 100000), -- Sports Day 2024 - Arjun Singh
(10001, 100001), -- Sports Day 2024 - Priya Patel
(10001, 100002), -- Sports Day 2024 - Rahul Kumar
(10001, 100003), -- Sports Day 2024 - Sneha Sharma
(10001, 100004), -- Sports Day 2024 - Vikram Gupta
(10002, 100000), -- Cultural Night 2024 - Arjun Singh
(10002, 100001), -- Cultural Night 2024 - Priya Patel
(10002, 100002), -- Cultural Night 2024 - Rahul Kumar
(10002, 100003), -- Cultural Night 2024 - Sneha Sharma
(10002, 100004), -- Cultural Night 2024 - Vikram Gupta
(10003, 100000), -- Machine Learning Workshop - Arjun Singh
(10003, 100001), -- Machine Learning Workshop - Priya Patel
(10003, 100002), -- Machine Learning Workshop - Rahul Kumar
(10004, 100000), -- Database Design Seminar - Arjun Singh
(10004, 100001), -- Database Design Seminar - Priya Patel
(10004, 100002); -- Database Design Seminar - Rahul Kumar

-- =====================================================
-- ASSIGNMENTS
-- =====================================================

-- Assignments
INSERT INTO assignments (id, name, course_id, batch_id, subject_id, assignment_type_id, faculty_id, description, marks, start_date, end_date, state, active, created_at, updated_at) VALUES
(10000, 'C Programming Assignment 1', 1000, 1000, 1000, 100, 10000, 'Write a C program to implement basic data structures', 100, '2024-12-01', '2024-12-15', 'open', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10001, 'Data Structures Project', 1000, 1000, 1001, 102, 10000, 'Implement a complete data structure library in C', 150, '2024-12-01', '2024-12-20', 'open', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10002, 'Database Design Assignment', 1000, 1000, 1002, 101, 10001, 'Design a database schema for a library management system', 100, '2024-12-05', '2024-12-18', 'open', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10003, 'Network Programming Lab', 1000, 1000, 1003, 105, 10001, 'Implement client-server communication using sockets', 100, '2024-12-08', '2024-12-22', 'open', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10004, 'Operating Systems Quiz', 1000, 1000, 1004, 106, 10002, 'Quiz on process management and memory management', 50, '2024-12-10', '2024-12-12', 'open', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- ASSIGNMENT SUBMISSIONS
-- =====================================================

-- Assignment Submissions
INSERT INTO assignment_sub_lines (id, assignment_id, student_id, submission_date, description, marks, state, active, created_at, updated_at) VALUES
(10000, 10000, 100000, '2024-12-10', 'Submitted C program with proper documentation', 85, 'accept', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10001, 10000, 100001, '2024-12-12', 'Submitted C program with advanced features', 92, 'accept', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10002, 10000, 100002, '2024-12-14', 'Submitted C program with good structure', 78, 'accept', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10003, 10001, 100000, '2024-12-18', 'Submitted complete data structure library', 88, 'accept', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10004, 10001, 100001, '2024-12-19', 'Submitted advanced data structure implementation', 95, 'accept', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10005, 10002, 100000, '2024-12-15', 'Submitted database schema design', 90, 'accept', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10006, 10002, 100001, '2024-12-16', 'Submitted comprehensive database design', 87, 'accept', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10007, 10003, 100000, '2024-12-20', 'Submitted network programming implementation', 82, 'accept', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10008, 10004, 100000, '2024-12-11', 'Submitted quiz answers', 45, 'accept', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10009, 10004, 100001, '2024-12-11', 'Submitted quiz answers', 48, 'accept', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- EXAM SESSIONS
-- =====================================================

-- Exam Sessions
INSERT INTO exam_sessions (id, name, course_id, batch_id, exam_code, start_date, end_date, exam_type_id, evaluation_type, venue_id, state, active, created_at, updated_at) VALUES
(1000, 'Mid Semester Exam - CSE 2024', 1000, 1000, 'MID-CSE-2024', '2024-12-01', '2024-12-15', 100, 'normal', NULL, 'held', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1001, 'End Semester Exam - CSE 2024', 1000, 1000, 'END-CSE-2024', '2024-12-20', '2025-01-05', 101, 'normal', NULL, 'held', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1002, 'Mid Semester Exam - IT 2024', 1001, 1003, 'MID-IT-2024', '2024-12-01', '2024-12-15', 100, 'normal', NULL, 'held', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1003, 'End Semester Exam - IT 2024', 1001, 1003, 'END-IT-2024', '2024-12-20', '2025-01-05', 101, 'normal', NULL, 'held', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- EXAM ROOMS
-- =====================================================

-- Exam Rooms
INSERT INTO exam_rooms (id, name, code, capacity, classroom_id, active, created_at, updated_at) VALUES
(1000, 'Exam Hall 1', 'EH001', 60, 1000, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1001, 'Exam Hall 2', 'EH002', 60, 1001, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1002, 'Exam Hall 3', 'EH003', 60, 1002, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1003, 'Computer Lab Exam', 'CLE001', 30, 1005, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1004, 'Auditorium Exam', 'AUE001', 200, 1009, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- EXAMS
-- =====================================================

-- Exams
INSERT INTO exams (id, name, session_id, subject_id, exam_code, start_time, end_time, total_marks, min_marks, note, state, active, created_at, updated_at) VALUES
(10000, 'C Programming Mid Exam', 1000, 1000, 'C-MID-001', '2024-12-01 09:00:00', '2024-12-01 12:00:00', 100, 33, 'Mid semester examination for C Programming', 'done', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10001, 'Data Structures Mid Exam', 1000, 1001, 'DS-MID-001', '2024-12-02 09:00:00', '2024-12-02 12:00:00', 100, 33, 'Mid semester examination for Data Structures', 'done', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10002, 'Database Systems Mid Exam', 1000, 1002, 'DB-MID-001', '2024-12-03 09:00:00', '2024-12-03 12:00:00', 100, 33, 'Mid semester examination for Database Systems', 'done', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10003, 'Computer Networks Mid Exam', 1000, 1003, 'CN-MID-001', '2024-12-04 09:00:00', '2024-12-04 12:00:00', 100, 33, 'Mid semester examination for Computer Networks', 'done', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10004, 'Operating Systems Mid Exam', 1000, 1004, 'OS-MID-001', '2024-12-05 09:00:00', '2024-12-05 12:00:00', 100, 33, 'Mid semester examination for Operating Systems', 'done', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- EXAM RESPONSIBLE FACULTY
-- =====================================================

-- Exam Responsible Faculty
INSERT INTO exam_responsible_faculty (exam_id, faculty_id) VALUES
(10000, 10000), -- C Programming Mid Exam - Dr. Rajesh Kumar
(10001, 10000), -- Data Structures Mid Exam - Dr. Rajesh Kumar
(10002, 10001), -- Database Systems Mid Exam - Prof. Priya Sharma
(10003, 10001), -- Computer Networks Mid Exam - Prof. Priya Sharma
(10004, 10002); -- Operating Systems Mid Exam - Dr. Amit Patel

-- =====================================================
-- EXAM ATTENDEES
-- =====================================================

-- Exam Attendees
INSERT INTO exam_attendees (id, student_id, exam_id, status, marks, note, room_id, created_at, updated_at) VALUES
(100000, 100000, 10000, 'present', 85, 'Good performance', 1000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100001, 100001, 10000, 'present', 92, 'Excellent performance', 1000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100002, 100002, 10000, 'present', 78, 'Satisfactory performance', 1000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100003, 100000, 10001, 'present', 88, 'Very good performance', 1001, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100004, 100001, 10001, 'present', 95, 'Outstanding performance', 1001, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100005, 100002, 10001, 'present', 82, 'Good performance', 1001, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100006, 100000, 10002, 'present', 90, 'Excellent performance', 1002, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100007, 100001, 10002, 'present', 87, 'Very good performance', 1002, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100008, 100002, 10002, 'present', 85, 'Good performance', 1002, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100009, 100000, 10003, 'present', 88, 'Very good performance', 1003, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100010, 100001, 10003, 'present', 92, 'Excellent performance', 1003, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100011, 100002, 10003, 'present', 80, 'Good performance', 1003, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100012, 100000, 10004, 'present', 85, 'Good performance', 1004, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100013, 100001, 10004, 'present', 90, 'Very good performance', 1004, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100014, 100002, 10004, 'present', 82, 'Good performance', 1004, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- STUDENT FEES DETAILS
-- =====================================================

-- Student Fees Details
INSERT INTO student_fees_details (id, student_id, fees_line_id, course_id, batch_id, product_id, amount, fees_factor, discount, after_discount_amount, date, state, company_id, active, created_at, updated_at) VALUES
(100000, 100000, 1000, 1000, 1000, 1000, 50000.00, 1.00, 5.00, 47500.00, '2024-06-01', 'invoice', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100001, 100000, 1002, 1000, 1000, 1001, 2000.00, 1.00, 0.00, 2000.00, '2024-06-01', 'invoice', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100002, 100000, 1003, 1000, 1000, 1002, 5000.00, 1.00, 0.00, 5000.00, '2024-06-01', 'invoice', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100003, 100000, 1004, 1000, 1000, 1003, 3000.00, 1.00, 0.00, 3000.00, '2024-06-01', 'invoice', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100004, 100000, 1005, 1000, 1000, 1004, 10000.00, 1.00, 0.00, 10000.00, '2024-06-01', 'invoice', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100005, 100001, 1000, 1000, 1000, 1000, 50000.00, 1.00, 5.00, 47500.00, '2024-06-01', 'invoice', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100006, 100001, 1002, 1000, 1000, 1001, 2000.00, 1.00, 0.00, 2000.00, '2024-06-01', 'invoice', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100007, 100001, 1003, 1000, 1000, 1002, 5000.00, 1.00, 0.00, 5000.00, '2024-06-01', 'invoice', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100008, 100001, 1004, 1000, 1000, 1003, 3000.00, 1.00, 0.00, 3000.00, '2024-06-01', 'invoice', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100009, 100001, 1005, 1000, 1000, 1004, 10000.00, 1.00, 0.00, 10000.00, '2024-06-01', 'invoice', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- MEDIA MOVEMENTS
-- =====================================================

-- Library Book Issues
INSERT INTO media_movements (id, media_id, media_unit_id, student_id, faculty_id, issue_date, due_date, return_date, state, note, active, created_at, updated_at) VALUES
(100000, 10000, 100000, 100000, NULL, '2024-12-01', '2024-12-15', NULL, 'issue', 'Issued for semester studies', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100001, 10001, 100003, 100001, NULL, '2024-12-01', '2024-12-15', NULL, 'issue', 'Issued for database course', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100002, 10002, 100005, 100002, NULL, '2024-12-02', '2024-12-16', NULL, 'issue', 'Issued for networking course', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100003, 10000, 100001, NULL, 10000, '2024-12-01', '2024-12-31', NULL, 'issue', 'Issued for faculty reference', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100004, 10001, 100004, NULL, 10001, '2024-12-01', '2024-12-31', NULL, 'issue', 'Issued for faculty reference', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- MEDIA PURCHASES
-- =====================================================

-- Library Book Purchases
INSERT INTO media_purchases (id, name, media_id, quantity, unit_price, total_price, purchase_date, vendor_id, active, created_at, updated_at) VALUES
(10000, 'Introduction to Algorithms Purchase', 10000, 5, 2500.00, 12500.00, '2024-06-01', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10001, 'Database System Concepts Purchase', 10001, 3, 1800.00, 5400.00, '2024-06-01', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10002, 'Computer Networks Purchase', 10002, 4, 2200.00, 8800.00, '2024-06-01', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10003, 'Operating System Concepts Purchase', 10003, 3, 2000.00, 6000.00, '2024-06-01', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10004, 'Software Engineering Purchase', 10004, 2, 1500.00, 3000.00, '2024-06-01', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- PAYROLL
-- =====================================================

-- Payroll Records
INSERT INTO payroll (id, staff_id, month, year, basic_salary, allowances, deductions, net_salary, tds_amount, tax_amount, state, company_id, created_at, updated_at) VALUES
(100000, 10000, 12, 2024, 120000.00, 20000.00, 10000.00, 130000.00, 15000.00, 0.00, 'confirmed', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100001, 10001, 12, 2024, 90000.00, 15000.00, 8000.00, 97000.00, 10000.00, 0.00, 'confirmed', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100002, 10002, 12, 2024, 70000.00, 12000.00, 6000.00, 76000.00, 8000.00, 0.00, 'confirmed', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100003, 10003, 12, 2024, 120000.00, 20000.00, 10000.00, 130000.00, 15000.00, 0.00, 'confirmed', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(100004, 10004, 12, 2024, 90000.00, 15000.00, 8000.00, 97000.00, 10000.00, 0.00, 'confirmed', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- Display completion message
SELECT 'S-ERP Seed Data created successfully! Punk Records Education Solutions is ready for use.' AS status;
