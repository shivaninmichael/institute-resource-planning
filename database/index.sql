-- =====================================================
-- OpenEducat ERP Database Indexes for PostgreSQL
-- Version: 2.0.0 - Performance Optimization Indexes
-- Created: 2024
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- CORE TABLE INDEXES
-- =====================================================

-- Countries table indexes
CREATE INDEX IF NOT EXISTS idx_countries_code ON countries(code);
CREATE INDEX IF NOT EXISTS idx_countries_name ON countries(name);
CREATE INDEX IF NOT EXISTS idx_countries_active ON countries(active);

-- States table indexes
CREATE INDEX IF NOT EXISTS idx_states_country ON states(country_id);
CREATE INDEX IF NOT EXISTS idx_states_code ON states(code);
CREATE INDEX IF NOT EXISTS idx_states_name ON states(name);
CREATE INDEX IF NOT EXISTS idx_states_active ON states(active);

-- Currencies table indexes
CREATE INDEX IF NOT EXISTS idx_currencies_code ON currencies(code);
CREATE INDEX IF NOT EXISTS idx_currencies_name ON currencies(name);
CREATE INDEX IF NOT EXISTS idx_currencies_active ON currencies(active);

-- Companies table indexes
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_email ON companies(email);
CREATE INDEX IF NOT EXISTS idx_companies_state ON companies(state_id);
CREATE INDEX IF NOT EXISTS idx_companies_country ON companies(country_id);
CREATE INDEX IF NOT EXISTS idx_companies_currency ON companies(currency_id);
CREATE INDEX IF NOT EXISTS idx_companies_active ON companies(active);

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_company ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department_id);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);
CREATE INDEX IF NOT EXISTS idx_users_login_date ON users(last_login);
CREATE INDEX IF NOT EXISTS idx_users_admin ON users(is_admin);
CREATE INDEX IF NOT EXISTS idx_users_faculty ON users(is_faculty);
CREATE INDEX IF NOT EXISTS idx_users_student ON users(is_student);
CREATE INDEX IF NOT EXISTS idx_users_parent ON users(is_parent);

-- Partners table indexes
CREATE INDEX IF NOT EXISTS idx_partners_name ON partners(name);
CREATE INDEX IF NOT EXISTS idx_partners_email ON partners(email);
CREATE INDEX IF NOT EXISTS idx_partners_phone ON partners(phone);
CREATE INDEX IF NOT EXISTS idx_partners_mobile ON partners(mobile);
CREATE INDEX IF NOT EXISTS idx_partners_state ON partners(state_id);
CREATE INDEX IF NOT EXISTS idx_partners_country ON partners(country_id);
CREATE INDEX IF NOT EXISTS idx_partners_parent ON partners(parent_id);
CREATE INDEX IF NOT EXISTS idx_partners_user ON partners(user_id);
CREATE INDEX IF NOT EXISTS idx_partners_company ON partners(company_id);
CREATE INDEX IF NOT EXISTS idx_partners_active ON partners(active);
CREATE INDEX IF NOT EXISTS idx_partners_is_company ON partners(is_company);

-- Departments table indexes
CREATE INDEX IF NOT EXISTS idx_departments_code ON departments(code);
CREATE INDEX IF NOT EXISTS idx_departments_name ON departments(name);
CREATE INDEX IF NOT EXISTS idx_departments_parent ON departments(parent_id);
CREATE INDEX IF NOT EXISTS idx_departments_company ON departments(company_id);
CREATE INDEX IF NOT EXISTS idx_departments_active ON departments(active);

-- Categories table indexes
CREATE INDEX IF NOT EXISTS idx_categories_code ON categories(code);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_categories_company ON categories(company_id);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(active);

-- =====================================================
-- ACADEMIC STRUCTURE INDEXES
-- =====================================================

-- Program levels table indexes
CREATE INDEX IF NOT EXISTS idx_program_levels_code ON program_levels(code);
CREATE INDEX IF NOT EXISTS idx_program_levels_name ON program_levels(name);
CREATE INDEX IF NOT EXISTS idx_program_levels_sequence ON program_levels(sequence);
CREATE INDEX IF NOT EXISTS idx_program_levels_active ON program_levels(active);

-- Programs table indexes
CREATE INDEX IF NOT EXISTS idx_programs_code ON programs(code);
CREATE INDEX IF NOT EXISTS idx_programs_name ON programs(name);
CREATE INDEX IF NOT EXISTS idx_programs_level ON programs(program_level_id);
CREATE INDEX IF NOT EXISTS idx_programs_department ON programs(department_id);
CREATE INDEX IF NOT EXISTS idx_programs_active ON programs(active);

-- Academic years table indexes
CREATE INDEX IF NOT EXISTS idx_academic_years_code ON academic_years(code);
CREATE INDEX IF NOT EXISTS idx_academic_years_name ON academic_years(name);
CREATE INDEX IF NOT EXISTS idx_academic_years_dates ON academic_years(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_academic_years_company ON academic_years(company_id);
CREATE INDEX IF NOT EXISTS idx_academic_years_active ON academic_years(active);
CREATE INDEX IF NOT EXISTS idx_academic_years_sequence ON academic_years(sequence);

-- Academic terms table indexes
CREATE INDEX IF NOT EXISTS idx_academic_terms_code ON academic_terms(code);
CREATE INDEX IF NOT EXISTS idx_academic_terms_name ON academic_terms(name);
CREATE INDEX IF NOT EXISTS idx_academic_terms_year ON academic_terms(academic_year_id);
CREATE INDEX IF NOT EXISTS idx_academic_terms_dates ON academic_terms(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_academic_terms_company ON academic_terms(company_id);
CREATE INDEX IF NOT EXISTS idx_academic_terms_active ON academic_terms(active);

-- Subjects table indexes
CREATE INDEX IF NOT EXISTS idx_subjects_code ON subjects(code);
CREATE INDEX IF NOT EXISTS idx_subjects_name ON subjects(name);
CREATE INDEX IF NOT EXISTS idx_subjects_department ON subjects(department_id);
CREATE INDEX IF NOT EXISTS idx_subjects_company ON subjects(company_id);
CREATE INDEX IF NOT EXISTS idx_subjects_type ON subjects(type);
CREATE INDEX IF NOT EXISTS idx_subjects_active ON subjects(active);

-- Courses table indexes
CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(code);
CREATE INDEX IF NOT EXISTS idx_courses_name ON courses(name);
CREATE INDEX IF NOT EXISTS idx_courses_parent ON courses(parent_id);
CREATE INDEX IF NOT EXISTS idx_courses_department ON courses(department_id);
CREATE INDEX IF NOT EXISTS idx_courses_program ON courses(program_id);
CREATE INDEX IF NOT EXISTS idx_courses_fees_term ON courses(fees_term_id);
CREATE INDEX IF NOT EXISTS idx_courses_evaluation_type ON courses(evaluation_type);
CREATE INDEX IF NOT EXISTS idx_courses_active ON courses(active);

-- Course-Subject relationship indexes
CREATE INDEX IF NOT EXISTS idx_course_subjects_course ON course_subjects(course_id);
CREATE INDEX IF NOT EXISTS idx_course_subjects_subject ON course_subjects(subject_id);

-- Batches table indexes
CREATE INDEX IF NOT EXISTS idx_batches_code ON batches(code);
CREATE INDEX IF NOT EXISTS idx_batches_name ON batches(name);
CREATE INDEX IF NOT EXISTS idx_batches_course ON batches(course_id);
CREATE INDEX IF NOT EXISTS idx_batches_year ON batches(academic_year_id);
CREATE INDEX IF NOT EXISTS idx_batches_dates ON batches(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_batches_active ON batches(active);

-- =====================================================
-- STUDENT TABLE INDEXES
-- =====================================================

-- Students table indexes
CREATE INDEX IF NOT EXISTS idx_students_gr_no ON students(gr_no);
CREATE INDEX IF NOT EXISTS idx_students_partner ON students(partner_id);
CREATE INDEX IF NOT EXISTS idx_students_user ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_nationality ON students(nationality_id);
CREATE INDEX IF NOT EXISTS idx_students_country ON students(country_id);
CREATE INDEX IF NOT EXISTS idx_students_state ON students(state_id);
CREATE INDEX IF NOT EXISTS idx_students_emergency_contact ON students(emergency_contact_id);
CREATE INDEX IF NOT EXISTS idx_students_category ON students(category_id);
CREATE INDEX IF NOT EXISTS idx_students_gender ON students(gender);
CREATE INDEX IF NOT EXISTS idx_students_blood_group ON students(blood_group);
CREATE INDEX IF NOT EXISTS idx_students_birth_date ON students(birth_date);
CREATE INDEX IF NOT EXISTS idx_students_active ON students(active);

-- Student courses table indexes
CREATE INDEX IF NOT EXISTS idx_student_courses_student ON student_courses(student_id);
CREATE INDEX IF NOT EXISTS idx_student_courses_course ON student_courses(course_id);
CREATE INDEX IF NOT EXISTS idx_student_courses_batch ON student_courses(batch_id);
CREATE INDEX IF NOT EXISTS idx_student_courses_year ON student_courses(academic_year_id);
CREATE INDEX IF NOT EXISTS idx_student_courses_term ON student_courses(academic_term_id);
CREATE INDEX IF NOT EXISTS idx_student_courses_roll_number ON student_courses(roll_number);
CREATE INDEX IF NOT EXISTS idx_student_courses_state ON student_courses(state);

-- Student course subjects table indexes
CREATE INDEX IF NOT EXISTS idx_student_course_subjects_course ON student_course_subjects(student_course_id);
CREATE INDEX IF NOT EXISTS idx_student_course_subjects_subject ON student_course_subjects(subject_id);

-- =====================================================
-- FACULTY TABLE INDEXES
-- =====================================================

-- Faculty table indexes
CREATE INDEX IF NOT EXISTS idx_faculty_partner ON faculty(partner_id);
CREATE INDEX IF NOT EXISTS idx_faculty_department ON faculty(main_department_id);
CREATE INDEX IF NOT EXISTS idx_faculty_nationality ON faculty(nationality_id);
CREATE INDEX IF NOT EXISTS idx_faculty_country ON faculty(country_id);
CREATE INDEX IF NOT EXISTS idx_faculty_state ON faculty(state_id);
CREATE INDEX IF NOT EXISTS idx_faculty_emergency_contact ON faculty(emergency_contact_id);
CREATE INDEX IF NOT EXISTS idx_faculty_gender ON faculty(gender);
CREATE INDEX IF NOT EXISTS idx_faculty_blood_group ON faculty(blood_group);
CREATE INDEX IF NOT EXISTS idx_faculty_birth_date ON faculty(birth_date);
CREATE INDEX IF NOT EXISTS idx_faculty_emp_id ON faculty(emp_id);
CREATE INDEX IF NOT EXISTS idx_faculty_active ON faculty(active);

-- Faculty subjects table indexes
CREATE INDEX IF NOT EXISTS idx_faculty_subjects_faculty ON faculty_subjects(faculty_id);
CREATE INDEX IF NOT EXISTS idx_faculty_subjects_subject ON faculty_subjects(subject_id);

-- Faculty departments table indexes
CREATE INDEX IF NOT EXISTS idx_faculty_departments_faculty ON faculty_departments(faculty_id);
CREATE INDEX IF NOT EXISTS idx_faculty_departments_department ON faculty_departments(department_id);
-- =====================================================
-- FACILITY TABLE INDEXES
-- =====================================================

-- Facilities table indexes
CREATE INDEX IF NOT EXISTS idx_facilities_code ON facilities(code);
CREATE INDEX IF NOT EXISTS idx_facilities_name ON facilities(name);
CREATE INDEX IF NOT EXISTS idx_facilities_type ON facilities(type);
CREATE INDEX IF NOT EXISTS idx_facilities_active ON facilities(active);

-- Products table indexes
CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);

-- Facility lines table indexes
CREATE INDEX IF NOT EXISTS idx_facility_lines_facility ON facility_lines(facility_id);
CREATE INDEX IF NOT EXISTS idx_facility_lines_product ON facility_lines(product_id);
CREATE INDEX IF NOT EXISTS idx_facility_lines_active ON facility_lines(active);

-- Classrooms table indexes
CREATE INDEX IF NOT EXISTS idx_classrooms_code ON classrooms(code);
CREATE INDEX IF NOT EXISTS idx_classrooms_name ON classrooms(name);
CREATE INDEX IF NOT EXISTS idx_classrooms_facility ON classrooms(facility_id);
CREATE INDEX IF NOT EXISTS idx_classrooms_capacity ON classrooms(capacity);
CREATE INDEX IF NOT EXISTS idx_classrooms_active ON classrooms(active);

-- Classroom facility lines table indexes
CREATE INDEX IF NOT EXISTS idx_classroom_facility_lines_classroom ON classroom_facility_lines(classroom_id);
CREATE INDEX IF NOT EXISTS idx_classroom_facility_lines_facility_line ON classroom_facility_lines(facility_line_id);

-- =====================================================
-- TIMETABLE TABLE INDEXES
-- =====================================================

-- Timings table indexes
CREATE INDEX IF NOT EXISTS idx_timings_name ON timings(name);
CREATE INDEX IF NOT EXISTS idx_timings_times ON timings(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_timings_active ON timings(active);

-- Timetables table indexes
CREATE INDEX IF NOT EXISTS idx_timetables_name ON timetables(name);
CREATE INDEX IF NOT EXISTS idx_timetables_course ON timetables(course_id);
CREATE INDEX IF NOT EXISTS idx_timetables_batch ON timetables(batch_id);
CREATE INDEX IF NOT EXISTS idx_timetables_subject ON timetables(subject_id);
CREATE INDEX IF NOT EXISTS idx_timetables_faculty ON timetables(faculty_id);
CREATE INDEX IF NOT EXISTS idx_timetables_classroom ON timetables(classroom_id);
CREATE INDEX IF NOT EXISTS idx_timetables_timing ON timetables(timing_id);
CREATE INDEX IF NOT EXISTS idx_timetables_datetime ON timetables(start_datetime, end_datetime);
CREATE INDEX IF NOT EXISTS idx_timetables_type ON timetables(type);
CREATE INDEX IF NOT EXISTS idx_timetables_state ON timetables(state);
CREATE INDEX IF NOT EXISTS idx_timetables_active ON timetables(active);

-- =====================================================
-- ATTENDANCE TABLE INDEXES
-- =====================================================

-- Attendance types table indexes
CREATE INDEX IF NOT EXISTS idx_attendance_types_name ON attendance_types(name);
CREATE INDEX IF NOT EXISTS idx_attendance_types_company ON attendance_types(company_id);
CREATE INDEX IF NOT EXISTS idx_attendance_types_present ON attendance_types(present);
CREATE INDEX IF NOT EXISTS idx_attendance_types_excused ON attendance_types(excused);
CREATE INDEX IF NOT EXISTS idx_attendance_types_absent ON attendance_types(absent);
CREATE INDEX IF NOT EXISTS idx_attendance_types_late ON attendance_types(late);
CREATE INDEX IF NOT EXISTS idx_attendance_types_active ON attendance_types(active);

-- Attendance registers table indexes
CREATE INDEX IF NOT EXISTS idx_attendance_registers_code ON attendance_registers(code);
CREATE INDEX IF NOT EXISTS idx_attendance_registers_name ON attendance_registers(name);
CREATE INDEX IF NOT EXISTS idx_attendance_registers_course ON attendance_registers(course_id);
CREATE INDEX IF NOT EXISTS idx_attendance_registers_batch ON attendance_registers(batch_id);
CREATE INDEX IF NOT EXISTS idx_attendance_registers_subject ON attendance_registers(subject_id);
CREATE INDEX IF NOT EXISTS idx_attendance_registers_faculty ON attendance_registers(faculty_id);
CREATE INDEX IF NOT EXISTS idx_attendance_registers_active ON attendance_registers(active);

-- Sessions table indexes
CREATE INDEX IF NOT EXISTS idx_sessions_code ON sessions(code);
CREATE INDEX IF NOT EXISTS idx_sessions_name ON sessions(name);
CREATE INDEX IF NOT EXISTS idx_sessions_course ON sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_sessions_batch ON sessions(batch_id);
CREATE INDEX IF NOT EXISTS idx_sessions_subject ON sessions(subject_id);
CREATE INDEX IF NOT EXISTS idx_sessions_faculty ON sessions(faculty_id);
CREATE INDEX IF NOT EXISTS idx_sessions_classroom ON sessions(classroom_id);
CREATE INDEX IF NOT EXISTS idx_sessions_timing ON sessions(timing_id);
CREATE INDEX IF NOT EXISTS idx_sessions_datetime ON sessions(start_datetime, end_datetime);
CREATE INDEX IF NOT EXISTS idx_sessions_state ON sessions(state);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON sessions(active);

-- Attendance sheets table indexes
CREATE INDEX IF NOT EXISTS idx_attendance_sheets_name ON attendance_sheets(name);
CREATE INDEX IF NOT EXISTS idx_attendance_sheets_register ON attendance_sheets(register_id);
CREATE INDEX IF NOT EXISTS idx_attendance_sheets_session ON attendance_sheets(session_id);
CREATE INDEX IF NOT EXISTS idx_attendance_sheets_faculty ON attendance_sheets(faculty_id);
CREATE INDEX IF NOT EXISTS idx_attendance_sheets_date ON attendance_sheets(attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_sheets_state ON attendance_sheets(state);
CREATE INDEX IF NOT EXISTS idx_attendance_sheets_active ON attendance_sheets(active);

-- Attendance lines table indexes
CREATE INDEX IF NOT EXISTS idx_attendance_lines_attendance ON attendance_lines(attendance_id);
CREATE INDEX IF NOT EXISTS idx_attendance_lines_student ON attendance_lines(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_lines_type ON attendance_lines(attendance_type_id);
CREATE INDEX IF NOT EXISTS idx_attendance_lines_date ON attendance_lines(attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_lines_present ON attendance_lines(present);
CREATE INDEX IF NOT EXISTS idx_attendance_lines_excused ON attendance_lines(excused);
CREATE INDEX IF NOT EXISTS idx_attendance_lines_absent ON attendance_lines(absent);
CREATE INDEX IF NOT EXISTS idx_attendance_lines_late ON attendance_lines(late);
CREATE INDEX IF NOT EXISTS idx_attendance_lines_active ON attendance_lines(active);

-- =====================================================
-- EXAM TABLE INDEXES
-- =====================================================

-- Exam types table indexes
CREATE INDEX IF NOT EXISTS idx_exam_types_code ON exam_types(code);
CREATE INDEX IF NOT EXISTS idx_exam_types_name ON exam_types(name);
CREATE INDEX IF NOT EXISTS idx_exam_types_active ON exam_types(active);

-- Exam sessions table indexes
CREATE INDEX IF NOT EXISTS idx_exam_sessions_name ON exam_sessions(name);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_course ON exam_sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_batch ON exam_sessions(batch_id);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_exam_code ON exam_sessions(exam_code);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_type ON exam_sessions(exam_type_id);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_venue ON exam_sessions(venue_id);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_dates ON exam_sessions(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_evaluation_type ON exam_sessions(evaluation_type);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_state ON exam_sessions(state);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_active ON exam_sessions(active);

-- Exam rooms table indexes
CREATE INDEX IF NOT EXISTS idx_exam_rooms_code ON exam_rooms(code);
CREATE INDEX IF NOT EXISTS idx_exam_rooms_name ON exam_rooms(name);
CREATE INDEX IF NOT EXISTS idx_exam_rooms_classroom ON exam_rooms(classroom_id);
CREATE INDEX IF NOT EXISTS idx_exam_rooms_capacity ON exam_rooms(capacity);
CREATE INDEX IF NOT EXISTS idx_exam_rooms_active ON exam_rooms(active);

-- Exams table indexes
CREATE INDEX IF NOT EXISTS idx_exams_name ON exams(name);
CREATE INDEX IF NOT EXISTS idx_exams_session ON exams(session_id);
CREATE INDEX IF NOT EXISTS idx_exams_subject ON exams(subject_id);
CREATE INDEX IF NOT EXISTS idx_exams_exam_code ON exams(exam_code);
CREATE INDEX IF NOT EXISTS idx_exams_datetime ON exams(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_exams_marks ON exams(total_marks, min_marks);
CREATE INDEX IF NOT EXISTS idx_exams_state ON exams(state);
CREATE INDEX IF NOT EXISTS idx_exams_active ON exams(active);

-- Exam responsible faculty table indexes
CREATE INDEX IF NOT EXISTS idx_exam_responsible_faculty_exam ON exam_responsible_faculty(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_responsible_faculty_faculty ON exam_responsible_faculty(faculty_id);

-- Exam attendees table indexes
CREATE INDEX IF NOT EXISTS idx_exam_attendees_student ON exam_attendees(student_id);
CREATE INDEX IF NOT EXISTS idx_exam_attendees_exam ON exam_attendees(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_attendees_room ON exam_attendees(room_id);
CREATE INDEX IF NOT EXISTS idx_exam_attendees_status ON exam_attendees(status);

-- Grade configurations table indexes
CREATE INDEX IF NOT EXISTS idx_grade_configurations_name ON grade_configurations(name);
CREATE INDEX IF NOT EXISTS idx_grade_configurations_marks ON grade_configurations(min_marks, max_marks);
CREATE INDEX IF NOT EXISTS idx_grade_configurations_grade ON grade_configurations(grade);
CREATE INDEX IF NOT EXISTS idx_grade_configurations_result ON grade_configurations(result);
CREATE INDEX IF NOT EXISTS idx_grade_configurations_active ON grade_configurations(active);

-- Result templates table indexes
CREATE INDEX IF NOT EXISTS idx_result_templates_name ON result_templates(name);
CREATE INDEX IF NOT EXISTS idx_result_templates_session ON result_templates(exam_session_id);
CREATE INDEX IF NOT EXISTS idx_result_templates_active ON result_templates(active);

-- Marksheet registers table indexes
CREATE INDEX IF NOT EXISTS idx_marksheet_registers_name ON marksheet_registers(name);
CREATE INDEX IF NOT EXISTS idx_marksheet_registers_session ON marksheet_registers(exam_session_id);
CREATE INDEX IF NOT EXISTS idx_marksheet_registers_course ON marksheet_registers(course_id);
CREATE INDEX IF NOT EXISTS idx_marksheet_registers_batch ON marksheet_registers(batch_id);
CREATE INDEX IF NOT EXISTS idx_marksheet_registers_template ON marksheet_registers(template_id);
CREATE INDEX IF NOT EXISTS idx_marksheet_registers_active ON marksheet_registers(active);

-- Marksheet lines table indexes
CREATE INDEX IF NOT EXISTS idx_marksheet_lines_student ON marksheet_lines(student_id);
CREATE INDEX IF NOT EXISTS idx_marksheet_lines_register ON marksheet_lines(marksheet_reg_id);
CREATE INDEX IF NOT EXISTS idx_marksheet_lines_exam ON marksheet_lines(exam_id);
CREATE INDEX IF NOT EXISTS idx_marksheet_lines_grade ON marksheet_lines(grade);
CREATE INDEX IF NOT EXISTS idx_marksheet_lines_active ON marksheet_lines(active);

-- Result lines table indexes
CREATE INDEX IF NOT EXISTS idx_result_lines_student ON result_lines(student_id);
CREATE INDEX IF NOT EXISTS idx_result_lines_session ON result_lines(exam_session_id);
CREATE INDEX IF NOT EXISTS idx_result_lines_register ON result_lines(marksheet_reg_id);
CREATE INDEX IF NOT EXISTS idx_result_lines_result ON result_lines(result);
CREATE INDEX IF NOT EXISTS idx_result_lines_grade ON result_lines(grade);
CREATE INDEX IF NOT EXISTS idx_result_lines_percentage ON result_lines(percentage);
CREATE INDEX IF NOT EXISTS idx_result_lines_active ON result_lines(active);

-- =====================================================
-- LIBRARY TABLE INDEXES
-- =====================================================

-- Media types table indexes
CREATE INDEX IF NOT EXISTS idx_media_types_code ON media_types(code);
CREATE INDEX IF NOT EXISTS idx_media_types_name ON media_types(name);
CREATE INDEX IF NOT EXISTS idx_media_types_active ON media_types(active);

-- Authors table indexes
CREATE INDEX IF NOT EXISTS idx_authors_name ON authors(name);
CREATE INDEX IF NOT EXISTS idx_authors_address ON authors(address_id);
CREATE INDEX IF NOT EXISTS idx_authors_active ON authors(active);

-- Publishers table indexes
CREATE INDEX IF NOT EXISTS idx_publishers_name ON publishers(name);
CREATE INDEX IF NOT EXISTS idx_publishers_address ON publishers(address_id);
CREATE INDEX IF NOT EXISTS idx_publishers_active ON publishers(active);

-- Tags table indexes
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
CREATE INDEX IF NOT EXISTS idx_tags_active ON tags(active);

-- Media table indexes
CREATE INDEX IF NOT EXISTS idx_media_name ON media(name);
CREATE INDEX IF NOT EXISTS idx_media_isbn ON media(isbn);
CREATE INDEX IF NOT EXISTS idx_media_internal_code ON media(internal_code);
CREATE INDEX IF NOT EXISTS idx_media_type ON media(media_type_id);
CREATE INDEX IF NOT EXISTS idx_media_edition ON media(edition);
CREATE INDEX IF NOT EXISTS idx_media_active ON media(active);

-- Media authors table indexes
CREATE INDEX IF NOT EXISTS idx_media_authors_media ON media_authors(media_id);
CREATE INDEX IF NOT EXISTS idx_media_authors_author ON media_authors(author_id);

-- Media publishers table indexes
CREATE INDEX IF NOT EXISTS idx_media_publishers_media ON media_publishers(media_id);
CREATE INDEX IF NOT EXISTS idx_media_publishers_publisher ON media_publishers(publisher_id);

-- Media tags table indexes
CREATE INDEX IF NOT EXISTS idx_media_tags_media ON media_tags(media_id);
CREATE INDEX IF NOT EXISTS idx_media_tags_tag ON media_tags(tag_id);

-- Media courses table indexes
CREATE INDEX IF NOT EXISTS idx_media_courses_media ON media_courses(media_id);
CREATE INDEX IF NOT EXISTS idx_media_courses_course ON media_courses(course_id);

-- Media subjects table indexes
CREATE INDEX IF NOT EXISTS idx_media_subjects_media ON media_subjects(media_id);
CREATE INDEX IF NOT EXISTS idx_media_subjects_subject ON media_subjects(subject_id);

-- Media units table indexes
CREATE INDEX IF NOT EXISTS idx_media_units_name ON media_units(name);
CREATE INDEX IF NOT EXISTS idx_media_units_media ON media_units(media_id);
CREATE INDEX IF NOT EXISTS idx_media_units_barcode ON media_units(barcode);
CREATE INDEX IF NOT EXISTS idx_media_units_state ON media_units(state);
CREATE INDEX IF NOT EXISTS idx_media_units_active ON media_units(active);

-- Library card types table indexes
CREATE INDEX IF NOT EXISTS idx_library_card_types_name ON library_card_types(name);
CREATE INDEX IF NOT EXISTS idx_library_card_types_allow_media ON library_card_types(allow_media);
CREATE INDEX IF NOT EXISTS idx_library_card_types_duration ON library_card_types(duration);
CREATE INDEX IF NOT EXISTS idx_library_card_types_penalty ON library_card_types(penalty_amt_per_day);
CREATE INDEX IF NOT EXISTS idx_library_card_types_active ON library_card_types(active);

-- Library cards table indexes
CREATE INDEX IF NOT EXISTS idx_library_cards_name ON library_cards(name);
CREATE INDEX IF NOT EXISTS idx_library_cards_number ON library_cards(number);
CREATE INDEX IF NOT EXISTS idx_library_cards_type ON library_cards(card_type_id);
CREATE INDEX IF NOT EXISTS idx_library_cards_student ON library_cards(student_id);
CREATE INDEX IF NOT EXISTS idx_library_cards_faculty ON library_cards(faculty_id);
CREATE INDEX IF NOT EXISTS idx_library_cards_issue_date ON library_cards(issue_date);
CREATE INDEX IF NOT EXISTS idx_library_cards_active ON library_cards(active);

-- Media movements table indexes
CREATE INDEX IF NOT EXISTS idx_media_movements_media ON media_movements(media_id);
CREATE INDEX IF NOT EXISTS idx_media_movements_unit ON media_movements(media_unit_id);
CREATE INDEX IF NOT EXISTS idx_media_movements_student ON media_movements(student_id);
CREATE INDEX IF NOT EXISTS idx_media_movements_faculty ON media_movements(faculty_id);
CREATE INDEX IF NOT EXISTS idx_media_movements_dates ON media_movements(issue_date, return_date);
CREATE INDEX IF NOT EXISTS idx_media_movements_due_date ON media_movements(due_date);
CREATE INDEX IF NOT EXISTS idx_media_movements_state ON media_movements(state);
CREATE INDEX IF NOT EXISTS idx_media_movements_active ON media_movements(active);

-- Media queue table indexes
CREATE INDEX IF NOT EXISTS idx_media_queues_media ON media_queues(media_id);
CREATE INDEX IF NOT EXISTS idx_media_queues_student ON media_queues(student_id);
CREATE INDEX IF NOT EXISTS idx_media_queues_faculty ON media_queues(faculty_id);
CREATE INDEX IF NOT EXISTS idx_media_queues_date ON media_queues(queue_date);
CREATE INDEX IF NOT EXISTS idx_media_queues_state ON media_queues(state);
CREATE INDEX IF NOT EXISTS idx_media_queues_active ON media_queues(active);

-- Media purchases table indexes
CREATE INDEX IF NOT EXISTS idx_media_purchases_name ON media_purchases(name);
CREATE INDEX IF NOT EXISTS idx_media_purchases_media ON media_purchases(media_id);
CREATE INDEX IF NOT EXISTS idx_media_purchases_vendor ON media_purchases(vendor_id);
CREATE INDEX IF NOT EXISTS idx_media_purchases_date ON media_purchases(purchase_date);
CREATE INDEX IF NOT EXISTS idx_media_purchases_price ON media_purchases(unit_price, total_price);
CREATE INDEX IF NOT EXISTS idx_media_purchases_active ON media_purchases(active);

-- =====================================================
-- FEES TABLE INDEXES
-- =====================================================

-- Fees terms table indexes
CREATE INDEX IF NOT EXISTS idx_fees_terms_name ON fees_terms(name);
CREATE INDEX IF NOT EXISTS idx_fees_terms_code ON fees_terms(code);
CREATE INDEX IF NOT EXISTS idx_fees_terms_company ON fees_terms(company_id);
CREATE INDEX IF NOT EXISTS idx_fees_terms_type ON fees_terms(fees_terms);
CREATE INDEX IF NOT EXISTS idx_fees_terms_day_type ON fees_terms(day_type);
CREATE INDEX IF NOT EXISTS idx_fees_terms_discount ON fees_terms(discount);
CREATE INDEX IF NOT EXISTS idx_fees_terms_active ON fees_terms(active);

-- Fees terms lines table indexes
CREATE INDEX IF NOT EXISTS idx_fees_terms_lines_name ON fees_terms_lines(name);
CREATE INDEX IF NOT EXISTS idx_fees_terms_lines_fees ON fees_terms_lines(fees_id);
CREATE INDEX IF NOT EXISTS idx_fees_terms_lines_due_days ON fees_terms_lines(due_days);
CREATE INDEX IF NOT EXISTS idx_fees_terms_lines_value ON fees_terms_lines(value);
CREATE INDEX IF NOT EXISTS idx_fees_terms_lines_active ON fees_terms_lines(active);

-- Fees elements table indexes
CREATE INDEX IF NOT EXISTS idx_fees_elements_product ON fees_elements(product_id);
CREATE INDEX IF NOT EXISTS idx_fees_elements_line ON fees_elements(fees_terms_line_id);
CREATE INDEX IF NOT EXISTS idx_fees_elements_sequence ON fees_elements(sequence);
CREATE INDEX IF NOT EXISTS idx_fees_elements_value ON fees_elements(value);
CREATE INDEX IF NOT EXISTS idx_fees_elements_active ON fees_elements(active);

-- Student fees details table indexes
CREATE INDEX IF NOT EXISTS idx_student_fees_student ON student_fees_details(student_id);
CREATE INDEX IF NOT EXISTS idx_student_fees_line ON student_fees_details(fees_line_id);
CREATE INDEX IF NOT EXISTS idx_student_fees_course ON student_fees_details(course_id);
CREATE INDEX IF NOT EXISTS idx_student_fees_batch ON student_fees_details(batch_id);
CREATE INDEX IF NOT EXISTS idx_student_fees_product ON student_fees_details(product_id);
CREATE INDEX IF NOT EXISTS idx_student_fees_company ON student_fees_details(company_id);
CREATE INDEX IF NOT EXISTS idx_student_fees_date ON student_fees_details(date);
CREATE INDEX IF NOT EXISTS idx_student_fees_state ON student_fees_details(state);
CREATE INDEX IF NOT EXISTS idx_student_fees_amount ON student_fees_details(amount);
CREATE INDEX IF NOT EXISTS idx_student_fees_after_discount ON student_fees_details(after_discount_amount);
CREATE INDEX IF NOT EXISTS idx_student_fees_invoice ON student_fees_details(invoice_id);
CREATE INDEX IF NOT EXISTS idx_student_fees_payment ON student_fees_details(payment_id);
CREATE INDEX IF NOT EXISTS idx_student_fees_active ON student_fees_details(active);

-- =====================================================
-- ASSIGNMENT TABLE INDEXES
-- =====================================================

-- Assignment types table indexes
CREATE INDEX IF NOT EXISTS idx_assignment_types_code ON assignment_types(code);
CREATE INDEX IF NOT EXISTS idx_assignment_types_name ON assignment_types(name);
CREATE INDEX IF NOT EXISTS idx_assignment_types_active ON assignment_types(active);

-- Assignments table indexes
CREATE INDEX IF NOT EXISTS idx_assignments_name ON assignments(name);
CREATE INDEX IF NOT EXISTS idx_assignments_course ON assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_batch ON assignments(batch_id);
CREATE INDEX IF NOT EXISTS idx_assignments_subject ON assignments(subject_id);
CREATE INDEX IF NOT EXISTS idx_assignments_type ON assignments(assignment_type_id);
CREATE INDEX IF NOT EXISTS idx_assignments_faculty ON assignments(faculty_id);
CREATE INDEX IF NOT EXISTS idx_assignments_dates ON assignments(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_assignments_marks ON assignments(marks);
CREATE INDEX IF NOT EXISTS idx_assignments_state ON assignments(state);
CREATE INDEX IF NOT EXISTS idx_assignments_active ON assignments(active);

-- Assignment submission lines table indexes
CREATE INDEX IF NOT EXISTS idx_assignment_sub_lines_assignment ON assignment_sub_lines(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_sub_lines_student ON assignment_sub_lines(student_id);
CREATE INDEX IF NOT EXISTS idx_assignment_sub_lines_submission_date ON assignment_sub_lines(submission_date);
CREATE INDEX IF NOT EXISTS idx_assignment_sub_lines_marks ON assignment_sub_lines(marks);
CREATE INDEX IF NOT EXISTS idx_assignment_sub_lines_state ON assignment_sub_lines(state);
CREATE INDEX IF NOT EXISTS idx_assignment_sub_lines_active ON assignment_sub_lines(active);

-- =====================================================
-- ADMISSION TABLE INDEXES
-- =====================================================

-- Admission registers table indexes
CREATE INDEX IF NOT EXISTS idx_admission_registers_name ON admission_registers(name);
CREATE INDEX IF NOT EXISTS idx_admission_registers_code ON admission_registers(code);
CREATE INDEX IF NOT EXISTS idx_admission_registers_course ON admission_registers(course_id);
CREATE INDEX IF NOT EXISTS idx_admission_registers_dates ON admission_registers(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_admission_registers_counts ON admission_registers(min_count, max_count);
CREATE INDEX IF NOT EXISTS idx_admission_registers_fees ON admission_registers(fees);
CREATE INDEX IF NOT EXISTS idx_admission_registers_active ON admission_registers(active);

-- Admissions table indexes
CREATE INDEX IF NOT EXISTS idx_admissions_name ON admissions(name);
CREATE INDEX IF NOT EXISTS idx_admissions_register ON admissions(register_id);
CREATE INDEX IF NOT EXISTS idx_admissions_application_number ON admissions(application_number);
CREATE INDEX IF NOT EXISTS idx_admissions_student ON admissions(student_id);
CREATE INDEX IF NOT EXISTS idx_admissions_course ON admissions(course_id);
CREATE INDEX IF NOT EXISTS idx_admissions_batch ON admissions(batch_id);
CREATE INDEX IF NOT EXISTS idx_admissions_application_date ON admissions(application_date);
CREATE INDEX IF NOT EXISTS idx_admissions_fees ON admissions(fees);
CREATE INDEX IF NOT EXISTS idx_admissions_state ON admissions(state);
CREATE INDEX IF NOT EXISTS idx_admissions_invoice ON admissions(invoice_id);
CREATE INDEX IF NOT EXISTS idx_admissions_payment ON admissions(payment_id);
CREATE INDEX IF NOT EXISTS idx_admissions_active ON admissions(active);

-- =====================================================
-- ACTIVITY TABLE INDEXES
-- =====================================================

-- Activity types table indexes
CREATE INDEX IF NOT EXISTS idx_activity_types_code ON activity_types(code);
CREATE INDEX IF NOT EXISTS idx_activity_types_name ON activity_types(name);
CREATE INDEX IF NOT EXISTS idx_activity_types_active ON activity_types(active);

-- Activities table indexes
CREATE INDEX IF NOT EXISTS idx_activities_name ON activities(name);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(activity_type_id);
CREATE INDEX IF NOT EXISTS idx_activities_course ON activities(course_id);
CREATE INDEX IF NOT EXISTS idx_activities_batch ON activities(batch_id);
CREATE INDEX IF NOT EXISTS idx_activities_faculty ON activities(faculty_id);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date);
CREATE INDEX IF NOT EXISTS idx_activities_times ON activities(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_activities_venue ON activities(venue);
CREATE INDEX IF NOT EXISTS idx_activities_state ON activities(state);
CREATE INDEX IF NOT EXISTS idx_activities_active ON activities(active);

-- Activity students table indexes
CREATE INDEX IF NOT EXISTS idx_activity_students_activity ON activity_students(activity_id);
CREATE INDEX IF NOT EXISTS idx_activity_students_student ON activity_students(student_id);

-- =====================================================
-- PARENT TABLE INDEXES
-- =====================================================

-- Parent relationship types table indexes
CREATE INDEX IF NOT EXISTS idx_parent_relationships_code ON parent_relationships(code);
CREATE INDEX IF NOT EXISTS idx_parent_relationships_name ON parent_relationships(name);
CREATE INDEX IF NOT EXISTS idx_parent_relationships_active ON parent_relationships(active);

-- Parents table indexes
CREATE INDEX IF NOT EXISTS idx_parents_partner ON parents(partner_id);
CREATE INDEX IF NOT EXISTS idx_parents_user ON parents(user_id);
CREATE INDEX IF NOT EXISTS idx_parents_nationality ON parents(nationality_id);
CREATE INDEX IF NOT EXISTS idx_parents_gender ON parents(gender);
CREATE INDEX IF NOT EXISTS idx_parents_birth_date ON parents(birth_date);
CREATE INDEX IF NOT EXISTS idx_parents_blood_group ON parents(blood_group);
CREATE INDEX IF NOT EXISTS idx_parents_occupation ON parents(occupation);
CREATE INDEX IF NOT EXISTS idx_parents_income ON parents(income);
CREATE INDEX IF NOT EXISTS idx_parents_active ON parents(active);

-- Student parent relationships table indexes
CREATE INDEX IF NOT EXISTS idx_student_parent_relations_student ON student_parent_relations(student_id);
CREATE INDEX IF NOT EXISTS idx_student_parent_relations_parent ON student_parent_relations(parent_id);
CREATE INDEX IF NOT EXISTS idx_student_parent_relations_relationship ON student_parent_relations(relationship_id);
CREATE INDEX IF NOT EXISTS idx_student_parent_relations_primary ON student_parent_relations(is_primary);
CREATE INDEX IF NOT EXISTS idx_student_parent_relations_active ON student_parent_relations(active);

-- =====================================================
-- ACCOUNTING TABLE INDEXES
-- =====================================================

-- Chart of Accounts table indexes
CREATE INDEX IF NOT EXISTS idx_chart_of_accounts_code ON chart_of_accounts(code);
CREATE INDEX IF NOT EXISTS idx_chart_of_accounts_name ON chart_of_accounts(name);
CREATE INDEX IF NOT EXISTS idx_chart_of_accounts_type ON chart_of_accounts(type);
CREATE INDEX IF NOT EXISTS idx_chart_of_accounts_parent ON chart_of_accounts(parent_id);
CREATE INDEX IF NOT EXISTS idx_chart_of_accounts_company ON chart_of_accounts(company_id);
CREATE INDEX IF NOT EXISTS idx_chart_of_accounts_active ON chart_of_accounts(active);

-- Account Journals table indexes
CREATE INDEX IF NOT EXISTS idx_account_journals_code ON account_journals(code);
CREATE INDEX IF NOT EXISTS idx_account_journals_name ON account_journals(name);
CREATE INDEX IF NOT EXISTS idx_account_journals_type ON account_journals(type);
CREATE INDEX IF NOT EXISTS idx_account_journals_company ON account_journals(company_id);
CREATE INDEX IF NOT EXISTS idx_account_journals_active ON account_journals(active);

-- Account Moves table indexes
CREATE INDEX IF NOT EXISTS idx_account_moves_name ON account_moves(name);
CREATE INDEX IF NOT EXISTS idx_account_moves_ref ON account_moves(ref);
CREATE INDEX IF NOT EXISTS idx_account_moves_journal ON account_moves(journal_id);
CREATE INDEX IF NOT EXISTS idx_account_moves_company ON account_moves(company_id);
CREATE INDEX IF NOT EXISTS idx_account_moves_date ON account_moves(date);
CREATE INDEX IF NOT EXISTS idx_account_moves_state ON account_moves(state);
CREATE INDEX IF NOT EXISTS idx_account_moves_amount ON account_moves(amount_total);
CREATE INDEX IF NOT EXISTS idx_account_moves_posted_by ON account_moves(posted_by);
CREATE INDEX IF NOT EXISTS idx_account_moves_posted_at ON account_moves(posted_at);
CREATE INDEX IF NOT EXISTS idx_account_moves_active ON account_moves(active);

-- Account Move Lines table indexes
CREATE INDEX IF NOT EXISTS idx_account_move_lines_move ON account_move_lines(move_id);
CREATE INDEX IF NOT EXISTS idx_account_move_lines_account ON account_move_lines(account_id);
CREATE INDEX IF NOT EXISTS idx_account_move_lines_partner ON account_move_lines(partner_id);
CREATE INDEX IF NOT EXISTS idx_account_move_lines_debit ON account_move_lines(debit);
CREATE INDEX IF NOT EXISTS idx_account_move_lines_credit ON account_move_lines(credit);
CREATE INDEX IF NOT EXISTS idx_account_move_lines_name ON account_move_lines(name);
CREATE INDEX IF NOT EXISTS idx_account_move_lines_reconciled ON account_move_lines(reconciled);
CREATE INDEX IF NOT EXISTS idx_account_move_lines_reconciled_line ON account_move_lines(reconciled_line_id);
CREATE INDEX IF NOT EXISTS idx_account_move_lines_active ON account_move_lines(active);

-- Account Invoices table indexes
CREATE INDEX IF NOT EXISTS idx_account_invoices_number ON account_invoices(number);
CREATE INDEX IF NOT EXISTS idx_account_invoices_partner ON account_invoices(partner_id);
CREATE INDEX IF NOT EXISTS idx_account_invoices_company ON account_invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_account_invoices_journal ON account_invoices(journal_id);
CREATE INDEX IF NOT EXISTS idx_account_invoices_move ON account_invoices(move_id);
CREATE INDEX IF NOT EXISTS idx_account_invoices_type ON account_invoices(type);
CREATE INDEX IF NOT EXISTS idx_account_invoices_state ON account_invoices(state);
CREATE INDEX IF NOT EXISTS idx_account_invoices_date ON account_invoices(date_invoice);
CREATE INDEX IF NOT EXISTS idx_account_invoices_due_date ON account_invoices(date_due);
CREATE INDEX IF NOT EXISTS idx_account_invoices_amounts ON account_invoices(amount_untaxed, amount_tax, amount_total);
CREATE INDEX IF NOT EXISTS idx_account_invoices_reference ON account_invoices(reference);
CREATE INDEX IF NOT EXISTS idx_account_invoices_active ON account_invoices(active);

-- Account Payments table indexes
CREATE INDEX IF NOT EXISTS idx_account_payments_name ON account_payments(name);
CREATE INDEX IF NOT EXISTS idx_account_payments_partner ON account_payments(partner_id);
CREATE INDEX IF NOT EXISTS idx_account_payments_company ON account_payments(company_id);
CREATE INDEX IF NOT EXISTS idx_account_payments_journal ON account_payments(journal_id);
CREATE INDEX IF NOT EXISTS idx_account_payments_move ON account_payments(move_id);
CREATE INDEX IF NOT EXISTS idx_account_payments_method ON account_payments(payment_method);
CREATE INDEX IF NOT EXISTS idx_account_payments_amount ON account_payments(amount);
CREATE INDEX IF NOT EXISTS idx_account_payments_date ON account_payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_account_payments_state ON account_payments(state);
CREATE INDEX IF NOT EXISTS idx_account_payments_reference ON account_payments(reference);
CREATE INDEX IF NOT EXISTS idx_account_payments_active ON account_payments(active);

-- Account Taxes table indexes
CREATE INDEX IF NOT EXISTS idx_account_taxes_code ON account_taxes(code);
CREATE INDEX IF NOT EXISTS idx_account_taxes_name ON account_taxes(name);
CREATE INDEX IF NOT EXISTS idx_account_taxes_amount ON account_taxes(amount);
CREATE INDEX IF NOT EXISTS idx_account_taxes_type ON account_taxes(type);
CREATE INDEX IF NOT EXISTS idx_account_taxes_company ON account_taxes(company_id);
CREATE INDEX IF NOT EXISTS idx_account_taxes_account ON account_taxes(account_id);
CREATE INDEX IF NOT EXISTS idx_account_taxes_active ON account_taxes(active);

-- =====================================================
-- STAFF & PAYROLL TABLE INDEXES
-- =====================================================

-- Staff table indexes
CREATE INDEX IF NOT EXISTS idx_staff_partner ON staff(partner_id);
CREATE INDEX IF NOT EXISTS idx_staff_employee_code ON staff(employee_code);
CREATE INDEX IF NOT EXISTS idx_staff_department ON staff(department_id);
CREATE INDEX IF NOT EXISTS idx_staff_designation ON staff(designation);
CREATE INDEX IF NOT EXISTS idx_staff_joining_date ON staff(joining_date);
CREATE INDEX IF NOT EXISTS idx_staff_active ON staff(active);

-- Salary Structure table indexes
CREATE INDEX IF NOT EXISTS idx_salary_structures_name ON salary_structures(name);
CREATE INDEX IF NOT EXISTS idx_salary_structures_company ON salary_structures(company_id);
CREATE INDEX IF NOT EXISTS idx_salary_structures_basic_salary ON salary_structures(basic_salary);
CREATE INDEX IF NOT EXISTS idx_salary_structures_active ON salary_structures(active);

-- Payroll table indexes
CREATE INDEX IF NOT EXISTS idx_payroll_staff ON payroll(staff_id);
CREATE INDEX IF NOT EXISTS idx_payroll_month ON payroll(month);
CREATE INDEX IF NOT EXISTS idx_payroll_year ON payroll(year);
CREATE INDEX IF NOT EXISTS idx_payroll_month_year ON payroll(month, year);
CREATE INDEX IF NOT EXISTS idx_payroll_company ON payroll(company_id);
CREATE INDEX IF NOT EXISTS idx_payroll_state ON payroll(state);
CREATE INDEX IF NOT EXISTS idx_payroll_basic_salary ON payroll(basic_salary);
CREATE INDEX IF NOT EXISTS idx_payroll_allowances ON payroll(allowances);
CREATE INDEX IF NOT EXISTS idx_payroll_deductions ON payroll(deductions);
CREATE INDEX IF NOT EXISTS idx_payroll_net_salary ON payroll(net_salary);
CREATE INDEX IF NOT EXISTS idx_payroll_tds ON payroll(tds_amount);
CREATE INDEX IF NOT EXISTS idx_payroll_tax ON payroll(tax_amount);
CREATE INDEX IF NOT EXISTS idx_payroll_move ON payroll(move_id);
CREATE INDEX IF NOT EXISTS idx_payroll_invoice ON payroll(invoice_id);

-- TDS Configuration table indexes
CREATE INDEX IF NOT EXISTS idx_tds_config_name ON tds_config(name);
CREATE INDEX IF NOT EXISTS idx_tds_config_company ON tds_config(company_id);
CREATE INDEX IF NOT EXISTS idx_tds_config_slab_from ON tds_config(slab_from);
CREATE INDEX IF NOT EXISTS idx_tds_config_slab_to ON tds_config(slab_to);
CREATE INDEX IF NOT EXISTS idx_tds_config_percentage ON tds_config(percentage);
CREATE INDEX IF NOT EXISTS idx_tds_config_active ON tds_config(active);

-- =====================================================
-- FISCAL YEAR MANAGEMENT TABLE INDEXES
-- =====================================================

-- Fiscal Years table indexes
CREATE INDEX IF NOT EXISTS idx_fiscal_years_name ON fiscal_years(name);
CREATE INDEX IF NOT EXISTS idx_fiscal_years_company ON fiscal_years(company_id);
CREATE INDEX IF NOT EXISTS idx_fiscal_years_dates ON fiscal_years(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_fiscal_years_state ON fiscal_years(state);
CREATE INDEX IF NOT EXISTS idx_fiscal_years_closing_date ON fiscal_years(closing_date);
CREATE INDEX IF NOT EXISTS idx_fiscal_years_closed_by ON fiscal_years(closed_by);
CREATE INDEX IF NOT EXISTS idx_fiscal_years_active ON fiscal_years(active);

-- Fiscal Periods table indexes
CREATE INDEX IF NOT EXISTS idx_fiscal_periods_name ON fiscal_periods(name);
CREATE INDEX IF NOT EXISTS idx_fiscal_periods_year ON fiscal_periods(fiscal_year_id);
CREATE INDEX IF NOT EXISTS idx_fiscal_periods_dates ON fiscal_periods(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_fiscal_periods_state ON fiscal_periods(state);
CREATE INDEX IF NOT EXISTS idx_fiscal_periods_closing_date ON fiscal_periods(closing_date);
CREATE INDEX IF NOT EXISTS idx_fiscal_periods_closed_by ON fiscal_periods(closed_by);
CREATE INDEX IF NOT EXISTS idx_fiscal_periods_active ON fiscal_periods(active);

-- Year End Closing table indexes
CREATE INDEX IF NOT EXISTS idx_year_end_closings_year ON year_end_closings(fiscal_year_id);
CREATE INDEX IF NOT EXISTS idx_year_end_closings_company ON year_end_closings(company_id);
CREATE INDEX IF NOT EXISTS idx_year_end_closings_date ON year_end_closings(closing_date);
CREATE INDEX IF NOT EXISTS idx_year_end_closings_closed_by ON year_end_closings(closed_by);
CREATE INDEX IF NOT EXISTS idx_year_end_closings_profit_loss ON year_end_closings(profit_loss_amount);
CREATE INDEX IF NOT EXISTS idx_year_end_closings_retained_earnings ON year_end_closings(retained_earnings_amount);

-- Closing Entries table indexes
CREATE INDEX IF NOT EXISTS idx_closing_entries_closing ON closing_entries(closing_id);
CREATE INDEX IF NOT EXISTS idx_closing_entries_account ON closing_entries(account_id);
CREATE INDEX IF NOT EXISTS idx_closing_entries_debit ON closing_entries(debit);
CREATE INDEX IF NOT EXISTS idx_closing_entries_credit ON closing_entries(credit);

-- Tax Deductions table indexes
CREATE INDEX IF NOT EXISTS idx_tax_deductions_partner ON tax_deductions(partner_id);
CREATE INDEX IF NOT EXISTS idx_tax_deductions_type ON tax_deductions(tax_type);
CREATE INDEX IF NOT EXISTS idx_tax_deductions_year ON tax_deductions(fiscal_year_id);
CREATE INDEX IF NOT EXISTS idx_tax_deductions_period ON tax_deductions(fiscal_period_id);
CREATE INDEX IF NOT EXISTS idx_tax_deductions_move_line ON tax_deductions(move_line_id);
CREATE INDEX IF NOT EXISTS idx_tax_deductions_company ON tax_deductions(company_id);
CREATE INDEX IF NOT EXISTS idx_tax_deductions_amount ON tax_deductions(amount);

-- =====================================================
-- AUDIT & MAIL TABLE INDEXES
-- =====================================================

-- Audit logs table indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record ON audit_logs(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);

-- Mail messages table indexes
CREATE INDEX IF NOT EXISTS idx_mail_messages_author ON mail_messages(author_id);
CREATE INDEX IF NOT EXISTS idx_mail_messages_parent ON mail_messages(parent_id);
CREATE INDEX IF NOT EXISTS idx_mail_messages_model ON mail_messages(model, res_id);
CREATE INDEX IF NOT EXISTS idx_mail_messages_type ON mail_messages(message_type);
CREATE INDEX IF NOT EXISTS idx_mail_messages_date ON mail_messages(date);
CREATE INDEX IF NOT EXISTS idx_mail_messages_active ON mail_messages(active);

-- Mail followers table indexes
CREATE INDEX IF NOT EXISTS idx_mail_followers_model ON mail_followers(res_model, res_id);
CREATE INDEX IF NOT EXISTS idx_mail_followers_partner ON mail_followers(partner_id);
CREATE INDEX IF NOT EXISTS idx_mail_followers_active ON mail_followers(active);

-- Mail activities table indexes
CREATE INDEX IF NOT EXISTS idx_mail_activities_model ON mail_activities(res_model, res_id);
CREATE INDEX IF NOT EXISTS idx_mail_activities_user ON mail_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_mail_activities_type ON mail_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_mail_activities_deadline ON mail_activities(date_deadline);
CREATE INDEX IF NOT EXISTS idx_mail_activities_state ON mail_activities(state);
CREATE INDEX IF NOT EXISTS idx_mail_activities_active ON mail_activities(active);

-- =====================================================
-- SYSTEM CONFIGURATION TABLE INDEXES
-- =====================================================

-- System parameters table indexes
CREATE INDEX IF NOT EXISTS idx_system_parameters_key ON system_parameters(key);
CREATE INDEX IF NOT EXISTS idx_system_parameters_active ON system_parameters(active);

-- Company settings table indexes
CREATE INDEX IF NOT EXISTS idx_company_settings_company ON company_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_company_settings_key ON company_settings(key);
CREATE INDEX IF NOT EXISTS idx_company_settings_active ON company_settings(active);

-- =====================================================
-- CERTIFICATE MANAGEMENT TABLE INDEXES
-- =====================================================

-- Certificate types table indexes
CREATE INDEX IF NOT EXISTS idx_certificate_types_company ON certificate_types(company_id);
CREATE INDEX IF NOT EXISTS idx_certificate_types_code ON certificate_types(code);
CREATE INDEX IF NOT EXISTS idx_certificate_types_name ON certificate_types(name);
CREATE INDEX IF NOT EXISTS idx_certificate_types_validity ON certificate_types(validity_period);
CREATE INDEX IF NOT EXISTS idx_certificate_types_digital ON certificate_types(is_digital);
CREATE INDEX IF NOT EXISTS idx_certificate_types_signature ON certificate_types(requires_signature);
CREATE INDEX IF NOT EXISTS idx_certificate_types_seal ON certificate_types(requires_seal);
CREATE INDEX IF NOT EXISTS idx_certificate_types_active ON certificate_types(active);

-- Certificate templates table indexes
CREATE INDEX IF NOT EXISTS idx_certificate_templates_company ON certificate_templates(company_id);
CREATE INDEX IF NOT EXISTS idx_certificate_templates_type ON certificate_templates(certificate_type_id);
CREATE INDEX IF NOT EXISTS idx_certificate_templates_name ON certificate_templates(name);
CREATE INDEX IF NOT EXISTS idx_certificate_templates_default ON certificate_templates(is_default);
CREATE INDEX IF NOT EXISTS idx_certificate_templates_active ON certificate_templates(active);

-- Certificates table indexes
CREATE INDEX IF NOT EXISTS idx_certificates_company ON certificates(company_id);
CREATE INDEX IF NOT EXISTS idx_certificates_type ON certificates(certificate_type_id);
CREATE INDEX IF NOT EXISTS idx_certificates_template ON certificates(template_id);
CREATE INDEX IF NOT EXISTS idx_certificates_student ON certificates(student_id);
CREATE INDEX IF NOT EXISTS idx_certificates_number ON certificates(certificate_number);
CREATE INDEX IF NOT EXISTS idx_certificates_verification ON certificates(verification_code);
CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates(status);
CREATE INDEX IF NOT EXISTS idx_certificates_issued_date ON certificates(issued_date);
CREATE INDEX IF NOT EXISTS idx_certificates_expiry_date ON certificates(expiry_date);
CREATE INDEX IF NOT EXISTS idx_certificates_issued_by ON certificates(issued_by);

-- =====================================================
-- COMPOSITE INDEXES FOR COMMON QUERIES
-- =====================================================

-- Multi-column indexes for frequently used query patterns
CREATE INDEX IF NOT EXISTS idx_students_active_company ON students(active, partner_id) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_faculty_active_department ON faculty(active, main_department_id) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_courses_active_program ON courses(active, program_id) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_batches_active_course ON batches(active, course_id) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_attendance_sheets_date_register ON attendance_sheets(attendance_date, register_id);
CREATE INDEX IF NOT EXISTS idx_exam_attendees_student_exam ON exam_attendees(student_id, exam_id);
CREATE INDEX IF NOT EXISTS idx_media_movements_dates_state ON media_movements(issue_date, return_date, state);
CREATE INDEX IF NOT EXISTS idx_student_fees_student_course ON student_fees_details(student_id, course_id);
CREATE INDEX IF NOT EXISTS idx_account_move_lines_move_account ON account_move_lines(move_id, account_id);
CREATE INDEX IF NOT EXISTS idx_payroll_staff_month_year ON payroll(staff_id, month, year);

-- =====================================================
-- INDEXES COMPLETION
-- =====================================================

-- Display completion message
SELECT 'SERP Database Indexes created successfully!' AS status;