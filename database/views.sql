-- =====================================================
-- OpenEducat ERP Database Views for PostgreSQL
-- Version: 2.0.0 - Essential Views for Application Functionality
-- Created: 2024
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- CORE STUDENT MANAGEMENT VIEWS
-- =====================================================

-- Student complete information view (used in student search and dashboard)
CREATE VIEW v_student_complete_info AS
SELECT 
    s.id,
    s.gr_no,
    s.first_name,
    s.middle_name,
    s.last_name,
    TRIM(CONCAT(s.first_name, ' ', COALESCE(s.middle_name, ''), ' ', s.last_name)) as full_name,
    s.birth_date,
    calculate_age(s.birth_date) as age,
    s.gender,
    s.blood_group,
    s.nationality_id,
    c.name as nationality,
    s.category_id,
    cat.name as category,
    s.partner_id,
    p.email,
    p.phone,
    p.mobile,
    p.name as partner_name,
    s.active,
    s.created_at,
    s.updated_at
FROM students s
LEFT JOIN partners p ON s.partner_id = p.id
LEFT JOIN countries c ON s.nationality_id = c.id
LEFT JOIN categories cat ON s.category_id = cat.id;

-- Student course enrollment view (used in academic progress tracking)
CREATE VIEW v_student_course_enrollment AS
SELECT 
    sc.id,
    sc.student_id,
    sc.course_id,
    sc.batch_id,
    sc.academic_year_id,
    sc.academic_term_id,
    sc.roll_number,
    sc.state as enrollment_state,
    sc.created_at,
    s.first_name,
    s.middle_name,
    s.last_name,
    s.gr_no,
    c.name as course_name,
    c.code as course_code,
    c.department_id,
    d.name as department_name,
    b.name as batch_name,
    b.start_date as batch_start_date,
    b.end_date as batch_end_date,
    ay.name as academic_year,
    ay.start_date as academic_year_start,
    ay.end_date as academic_year_end,
    at.name as academic_term,
    at.start_date as academic_term_start,
    at.end_date as academic_term_end
FROM student_courses sc
LEFT JOIN students s ON sc.student_id = s.id
LEFT JOIN courses c ON sc.course_id = c.id
LEFT JOIN departments d ON c.department_id = d.id
LEFT JOIN batches b ON sc.batch_id = b.id
LEFT JOIN academic_years ay ON sc.academic_year_id = ay.id
LEFT JOIN academic_terms at ON sc.academic_term_id = at.id;

-- =====================================================
-- FACULTY MANAGEMENT VIEWS
-- =====================================================

-- Faculty complete information view (used in faculty management)
CREATE VIEW v_faculty_complete_info AS
SELECT 
    f.id,
    f.first_name,
    f.middle_name,
    f.last_name,
    TRIM(CONCAT(f.first_name, ' ', COALESCE(f.middle_name, ''), ' ', f.last_name)) as full_name,
    f.birth_date,
    calculate_age(f.birth_date) as age,
    f.gender,
    f.blood_group,
    f.nationality_id,
    c.name as nationality,
    f.main_department_id,
    d.name as main_department,
    f.partner_id,
    p.email,
    p.phone,
    p.mobile,
    p.name as partner_name,
    f.active,
    f.created_at,
    f.updated_at
FROM faculty f
LEFT JOIN partners p ON f.partner_id = p.id
LEFT JOIN countries c ON f.nationality_id = c.id
LEFT JOIN departments d ON f.main_department_id = d.id;

-- =====================================================
-- ATTENDANCE MANAGEMENT VIEWS
-- =====================================================

-- Attendance summary view (used in attendance tracking and reports)
CREATE VIEW v_attendance_summary AS
SELECT 
    al.id as attendance_line_id,
    al.attendance_id,
    al.student_id,
    s.first_name as student_first_name,
    s.last_name as student_last_name,
    s.gr_no,
    al.present,
    al.excused,
    al.absent,
    al.late,
    al.remark,
    al.attendance_date,
    ats.id as attendance_sheet_id,
    ats.session_id,
    ses.course_id,
    c.name as course_name,
    c.code as course_code,
    ses.batch_id,
    b.name as batch_name,
    ats.attendance_date as session_date,
    ses.start_datetime as session_start_time,
    ses.end_datetime as session_end_time
FROM attendance_lines al
LEFT JOIN students s ON al.student_id = s.id
LEFT JOIN attendance_sheets ats ON al.attendance_id = ats.id
LEFT JOIN sessions ses ON ats.session_id = ses.id
LEFT JOIN courses c ON ses.course_id = c.id
LEFT JOIN batches b ON ses.batch_id = b.id;

-- =====================================================
-- ASSIGNMENT MANAGEMENT VIEWS
-- =====================================================

-- Assignment submissions view (used in assignment grading system)
CREATE VIEW v_assignment_submissions AS
SELECT 
    asl.id as submission_id,
    asl.assignment_id,
    a.name as assignment_title,
    a.description as assignment_description,
    a.end_date as due_date,
    a.marks as max_marks,
    asl.student_id,
    s.first_name as student_first_name,
    s.last_name as student_last_name,
    s.gr_no,
    asl.submission_date,
    asl.marks,
    asl.description as feedback,
    asl.state as submission_state,
    a.course_id,
    c.name as course_name,
    c.code as course_code,
    a.batch_id,
    b.name as batch_name,
    a.faculty_id,
    f.first_name as faculty_first_name,
    f.last_name as faculty_last_name
FROM assignment_sub_lines asl
LEFT JOIN assignments a ON asl.assignment_id = a.id
LEFT JOIN students s ON asl.student_id = s.id
LEFT JOIN courses c ON a.course_id = c.id
LEFT JOIN batches b ON a.batch_id = b.id
LEFT JOIN faculty f ON a.faculty_id = f.id;

-- =====================================================
-- FEE MANAGEMENT VIEWS
-- =====================================================

-- Student fee details view (used in fee management and reporting)
CREATE VIEW v_student_fee_details AS
SELECT 
    sfd.id as fee_detail_id,
    sfd.student_id,
    s.first_name as student_first_name,
    s.last_name as student_last_name,
    s.gr_no,
    sfd.fees_line_id,
    ftl.name as fee_term_line_name,
    ftl.value as fee_term_amount,
    sfd.amount as student_fee_amount,
    sfd.after_discount_amount as paid_amount,
    sfd.discount,
    sfd.state as fee_state,
    sfd.date as due_date,
    ft.id as fees_terms_id,
    ft.name as fees_terms_name,
    sfd.course_id,
    c.name as course_name,
    sfd.batch_id,
    b.name as batch_name,
    sfd.created_at,
    sfd.updated_at
FROM student_fees_details sfd
LEFT JOIN students s ON sfd.student_id = s.id
LEFT JOIN fees_terms_lines ftl ON sfd.fees_line_id = ftl.id
LEFT JOIN fees_terms ft ON ftl.fees_id = ft.id
LEFT JOIN courses c ON sfd.course_id = c.id
LEFT JOIN batches b ON sfd.batch_id = b.id;

-- =====================================================
-- LIBRARY MANAGEMENT VIEWS
-- =====================================================

-- Media circulation view (used in library management functions)
CREATE VIEW v_media_circulation AS
SELECT 
    mm.id as movement_id,
    mm.media_id,
    m.name as media_name,
    m.isbn,
    m.edition,
    mm.media_unit_id,
    mu.name as unit_name,
    mu.barcode,
    mu.state as unit_state,
    mm.student_id,
    s.first_name as student_first_name,
    s.last_name as student_last_name,
    s.gr_no,
    mm.faculty_id,
    f.first_name as faculty_first_name,
    f.last_name as faculty_last_name,
    mm.issue_date,
    mm.due_date,
    mm.return_date,
    mm.state as movement_state,
    mm.note as remarks
FROM media_movements mm
LEFT JOIN media m ON mm.media_id = m.id
LEFT JOIN media_units mu ON mm.media_unit_id = mu.id
LEFT JOIN students s ON mm.student_id = s.id
LEFT JOIN faculty f ON mm.faculty_id = f.id;

-- =====================================================
-- PARENT MANAGEMENT VIEWS
-- =====================================================

-- Parent student relations view (used in parent portal functionality)
CREATE VIEW v_parent_student_relations AS
SELECT 
    spr.id as relation_id,
    spr.student_id,
    s.first_name as student_first_name,
    s.last_name as student_last_name,
    s.gr_no,
    s.birth_date as student_birth_date,
    spr.parent_id,
    p.first_name as parent_first_name,
    p.last_name as parent_last_name,
    p.birth_date as parent_birth_date,
    p.occupation,
    p.income,
    spr.relationship_id,
    pr.name as relationship_type,
    spr.is_primary,
    spr.active,
    spr.created_at,
    spr.updated_at
FROM student_parent_relations spr
LEFT JOIN students s ON spr.student_id = s.id
LEFT JOIN parents p ON spr.parent_id = p.id
LEFT JOIN parent_relationships pr ON spr.relationship_id = pr.id;

-- =====================================================
-- END OF VIEWS
-- =====================================================

-- Summary comment
SELECT 'SERP Database Views created successfully!' AS status;