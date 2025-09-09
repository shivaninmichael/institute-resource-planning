-- =====================================================
-- OpenEducat ERP Database Functions for PostgreSQL
-- Version: 2.0.0 - Complete Business Logic Functions
-- Created: 2024
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- UTILITY FUNCTIONS
-- =====================================================

-- Function to generate unique codes
CREATE OR REPLACE FUNCTION generate_unique_code(
    prefix TEXT,
    table_name TEXT,
    column_name TEXT,
    length INTEGER DEFAULT 8
) RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    counter INTEGER := 1;
    max_attempts INTEGER := 1000;
BEGIN
    LOOP
        new_code := prefix || LPAD(counter::TEXT, length - LENGTH(prefix), '0');
        
        EXECUTE format('SELECT COUNT(*) FROM %I WHERE %I = %L', table_name, column_name, new_code) INTO counter;
        
        IF counter = 0 THEN
            RETURN new_code;
        END IF;
        
        counter := counter + 1;
        
        IF counter > max_attempts THEN
            RAISE EXCEPTION 'Unable to generate unique code after % attempts', max_attempts;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate age from birth date
CREATE OR REPLACE FUNCTION calculate_age(birth_date DATE) RETURNS INTEGER AS $$
BEGIN
    IF birth_date IS NULL THEN
        RETURN NULL;
    END IF;
    
    RETURN EXTRACT(YEAR FROM AGE(CURRENT_DATE, birth_date));
END;
$$ LANGUAGE plpgsql;

-- Function to format full name
CREATE OR REPLACE FUNCTION format_full_name(
    first_name TEXT,
    middle_name TEXT DEFAULT NULL,
    last_name TEXT DEFAULT NULL
) RETURNS TEXT AS $$
BEGIN
    RETURN TRIM(
        COALESCE(first_name, '') || 
        CASE WHEN middle_name IS NOT NULL AND middle_name != '' THEN ' ' || middle_name ELSE '' END ||
        CASE WHEN last_name IS NOT NULL AND last_name != '' THEN ' ' || last_name ELSE '' END
    );
END;
$$ LANGUAGE plpgsql;

-- Function to validate email format
CREATE OR REPLACE FUNCTION is_valid_email(email TEXT) RETURNS BOOLEAN AS $$
BEGIN
    RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STUDENT MANAGEMENT FUNCTIONS
-- =====================================================

-- Function to get student dashboard data
CREATE OR REPLACE FUNCTION get_student_dashboard(student_id INTEGER)
RETURNS JSON AS $$
DECLARE
    result JSON;
    student_data RECORD;
    course_count INTEGER;
    attendance_percentage DECIMAL;
    exam_count INTEGER;
    recent_assignments JSON;
BEGIN
    -- Get student basic info
    SELECT 
        s.id,
        s.first_name,
        s.last_name,
        s.gr_no,
        s.active,
        p.name as partner_name,
        p.email,
        p.phone
    INTO student_data
    FROM students s
    LEFT JOIN partners p ON s.partner_id = p.id
    WHERE s.id = student_id;
    
    -- Get course count
    SELECT COUNT(*) INTO course_count
    FROM student_courses sc
    WHERE sc.student_id = student_id AND sc.state = 'running';
    
    -- Get attendance percentage (last 30 days)
    SELECT COALESCE(
        ROUND(
            (COUNT(CASE WHEN al.present = true THEN 1 END)::DECIMAL / 
             NULLIF(COUNT(*), 0)) * 100, 2
        ), 0
    ) INTO attendance_percentage
    FROM attendance_lines al
    JOIN attendance_sheets asheet ON al.attendance_id = asheet.id
    WHERE al.student_id = student_id 
    AND asheet.attendance_date >= CURRENT_DATE - INTERVAL '30 days';
    
    -- Get exam count (current academic year)
    SELECT COUNT(*) INTO exam_count
    FROM exam_attendees ea
    JOIN exams e ON ea.exam_id = e.id
    JOIN exam_sessions es ON e.session_id = es.id
    WHERE ea.student_id = student_id
    AND es.start_date >= (
        SELECT start_date FROM academic_years 
        WHERE active = true 
        ORDER BY start_date DESC LIMIT 1
    );
    
    -- Get recent assignments
    SELECT json_agg(
        json_build_object(
            'id', a.id,
            'name', a.name,
            'subject', sub.name,
            'due_date', a.end_date,
            'status', CASE 
                WHEN asl.id IS NOT NULL THEN asl.state
                ELSE 'not_submitted'
            END
        )
    ) INTO recent_assignments
    FROM assignments a
    JOIN subjects sub ON a.subject_id = sub.id
    LEFT JOIN assignment_sub_lines asl ON a.id = asl.assignment_id AND asl.student_id = student_id
    WHERE a.course_id IN (
        SELECT course_id FROM student_courses 
        WHERE student_id = student_id AND state = 'running'
    )
    AND a.end_date >= CURRENT_DATE
    ORDER BY a.end_date
    LIMIT 5;
    
    -- Build result
    result := json_build_object(
        'student', json_build_object(
            'id', student_data.id,
            'name', format_full_name(student_data.first_name, NULL, student_data.last_name),
            'gr_no', student_data.gr_no,
            'email', student_data.email,
            'phone', student_data.phone,
            'active', student_data.active
        ),
        'stats', json_build_object(
            'courses', course_count,
            'attendance_percentage', attendance_percentage,
            'exams', exam_count
        ),
        'recent_assignments', COALESCE(recent_assignments, '[]'::json)
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get student academic performance
CREATE OR REPLACE FUNCTION get_student_academic_performance(student_id INTEGER)
RETURNS JSON AS $$
DECLARE
    result JSON;
    performance_data JSON;
    subject_performance JSON;
BEGIN
    -- Get overall performance by subject
    SELECT json_agg(
        json_build_object(
            'subject_id', sub.id,
            'subject_name', sub.name,
            'subject_code', sub.code,
            'total_exams', exam_stats.total_exams,
            'average_marks', exam_stats.avg_marks,
            'highest_marks', exam_stats.max_marks,
            'lowest_marks', exam_stats.min_marks,
            'attendance_percentage', att_stats.attendance_percentage
        )
    ) INTO subject_performance
    FROM (
        SELECT DISTINCT sub.id, sub.name, sub.code
        FROM subjects sub
        JOIN student_course_subjects scs ON sub.id = scs.subject_id
        JOIN student_courses sc ON scs.student_course_id = sc.id
        WHERE sc.student_id = student_id AND sc.state = 'running'
    ) sub
    LEFT JOIN (
        SELECT 
            e.subject_id,
            COUNT(*) as total_exams,
            ROUND(AVG(ea.marks), 2) as avg_marks,
            MAX(ea.marks) as max_marks,
            MIN(ea.marks) as min_marks
        FROM exam_attendees ea
        JOIN exams e ON ea.exam_id = e.id
        WHERE ea.student_id = student_id AND ea.marks IS NOT NULL
        GROUP BY e.subject_id
    ) exam_stats ON sub.id = exam_stats.subject_id
    LEFT JOIN (
        SELECT 
            sub.id as subject_id,
            ROUND(
                (COUNT(CASE WHEN al.present = true THEN 1 END)::DECIMAL / 
                 NULLIF(COUNT(*), 0)) * 100, 2
            ) as attendance_percentage
        FROM subjects sub
        JOIN student_course_subjects scs ON sub.id = scs.subject_id
        JOIN student_courses sc ON scs.student_course_id = sc.id
        JOIN attendance_lines al ON al.student_id = sc.student_id
        JOIN attendance_sheets asheet ON al.attendance_id = asheet.id
        WHERE sc.student_id = student_id AND sc.state = 'running'
        AND asheet.attendance_date >= CURRENT_DATE - INTERVAL '90 days'
        GROUP BY sub.id
    ) att_stats ON sub.id = att_stats.subject_id;
    
    -- Build result
    result := json_build_object(
        'student_id', student_id,
        'subject_performance', COALESCE(subject_performance, '[]'::json),
        'generated_at', CURRENT_TIMESTAMP
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to enroll student in course
CREATE OR REPLACE FUNCTION enroll_student_in_course(
    p_student_id INTEGER,
    p_course_id INTEGER,
    p_batch_id INTEGER,
    p_academic_year_id INTEGER,
    p_academic_term_id INTEGER,
    p_roll_number TEXT DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
    enrollment_id INTEGER;
    generated_roll_number TEXT;
    result JSON;
BEGIN
    -- Generate roll number if not provided
    IF p_roll_number IS NULL OR p_roll_number = '' THEN
        generated_roll_number := generate_unique_code(
            'R', 'student_courses', 'roll_number', 8
        );
    ELSE
        generated_roll_number := p_roll_number;
    END IF;
    
    -- Check if student is already enrolled in this course and batch
    IF EXISTS (
        SELECT 1 FROM student_courses 
        WHERE student_id = p_student_id 
        AND course_id = p_course_id 
        AND batch_id = p_batch_id
    ) THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Student is already enrolled in this course and batch'
        );
    END IF;
    
    -- Insert enrollment
    INSERT INTO student_courses (
        student_id, course_id, batch_id, academic_year_id, 
        academic_term_id, roll_number, state
    ) VALUES (
        p_student_id, p_course_id, p_batch_id, p_academic_year_id,
        p_academic_term_id, generated_roll_number, 'running'
    ) RETURNING id INTO enrollment_id;
    
    -- Enroll in all subjects for the course
    INSERT INTO student_course_subjects (student_course_id, subject_id)
    SELECT enrollment_id, cs.subject_id
    FROM course_subjects cs
    WHERE cs.course_id = p_course_id;
    
    result := json_build_object(
        'success', true,
        'enrollment_id', enrollment_id,
        'roll_number', generated_roll_number,
        'message', 'Student enrolled successfully'
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get student attendance summary
CREATE OR REPLACE FUNCTION get_student_attendance_summary(
    p_student_id INTEGER,
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL,
    p_course_id INTEGER DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
    result JSON;
    attendance_summary JSON;
    start_date_filter DATE;
    end_date_filter DATE;
BEGIN
    -- Set default date range if not provided
    start_date_filter := COALESCE(p_start_date, CURRENT_DATE - INTERVAL '30 days');
    end_date_filter := COALESCE(p_end_date, CURRENT_DATE);
    
    -- Get attendance summary
    SELECT json_agg(
        json_build_object(
            'course_id', c.id,
            'course_name', c.name,
            'course_code', c.code,
            'total_sessions', session_stats.total_sessions,
            'present_sessions', session_stats.present_sessions,
            'absent_sessions', session_stats.absent_sessions,
            'late_sessions', session_stats.late_sessions,
            'attendance_percentage', ROUND(
                (session_stats.present_sessions::DECIMAL / 
                 NULLIF(session_stats.total_sessions, 0)) * 100, 2
            )
        )
    ) INTO attendance_summary
    FROM (
        SELECT DISTINCT c.id, c.name, c.code
        FROM courses c
        JOIN student_courses sc ON c.id = sc.course_id
        WHERE sc.student_id = p_student_id 
        AND sc.state = 'running'
        AND (p_course_id IS NULL OR c.id = p_course_id)
    ) c
    LEFT JOIN (
        SELECT 
            sc.course_id,
            COUNT(DISTINCT asheet.id) as total_sessions,
            COUNT(CASE WHEN al.present = true THEN 1 END) as present_sessions,
            COUNT(CASE WHEN al.absent = true THEN 1 END) as absent_sessions,
            COUNT(CASE WHEN al.late = true THEN 1 END) as late_sessions
        FROM student_courses sc
        JOIN attendance_sheets asheet ON asheet.register_id IN (
            SELECT ar.id FROM attendance_registers ar 
            WHERE ar.course_id = sc.course_id
        )
        JOIN attendance_lines al ON al.attendance_id = asheet.id
        WHERE sc.student_id = p_student_id
        AND asheet.attendance_date BETWEEN start_date_filter AND end_date_filter
        AND (p_course_id IS NULL OR sc.course_id = p_course_id)
        GROUP BY sc.course_id
    ) session_stats ON c.id = session_stats.course_id;
    
    result := json_build_object(
        'student_id', p_student_id,
        'date_range', json_build_object(
            'start_date', start_date_filter,
            'end_date', end_date_filter
        ),
        'attendance_summary', COALESCE(attendance_summary, '[]'::json),
        'generated_at', CURRENT_TIMESTAMP
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to search students
CREATE OR REPLACE FUNCTION search_students(
    p_query TEXT DEFAULT '',
    p_course_id INTEGER DEFAULT NULL,
    p_batch_id INTEGER DEFAULT NULL,
    p_department_id INTEGER DEFAULT NULL,
    p_active_only BOOLEAN DEFAULT true
) RETURNS JSON AS $$
DECLARE
    result JSON;
    search_condition TEXT;
BEGIN
    -- Build search condition
    search_condition := 'WHERE 1=1';
    
    IF p_active_only THEN
        search_condition := search_condition || ' AND s.active = true';
    END IF;
    
    IF p_course_id IS NOT NULL THEN
        search_condition := search_condition || ' AND sc.course_id = ' || p_course_id;
    END IF;
    
    IF p_batch_id IS NOT NULL THEN
        search_condition := search_condition || ' AND sc.batch_id = ' || p_batch_id;
    END IF;
    
    IF p_department_id IS NOT NULL THEN
        search_condition := search_condition || ' AND c.department_id = ' || p_department_id;
    END IF;
    
    IF p_query IS NOT NULL AND p_query != '' THEN
        search_condition := search_condition || ' AND (
            s.first_name ILIKE ''%' || p_query || '%'' OR
            s.last_name ILIKE ''%' || p_query || '%'' OR
            s.gr_no ILIKE ''%' || p_query || '%'' OR
            p.name ILIKE ''%' || p_query || '%'' OR
            p.email ILIKE ''%' || p_query || '%''
        )';
    END IF;
    
    -- Execute search
    EXECUTE format('
        SELECT json_agg(
            json_build_object(
                ''id'', s.id,
                ''name'', format_full_name(s.first_name, s.middle_name, s.last_name),
                ''gr_no'', s.gr_no,
                ''email'', p.email,
                ''phone'', p.phone,
                ''course_name'', c.name,
                ''batch_name'', b.name,
                ''roll_number'', sc.roll_number,
                ''active'', s.active
            )
        )
        FROM students s
        LEFT JOIN partners p ON s.partner_id = p.id
        LEFT JOIN student_courses sc ON s.id = sc.student_id AND sc.state = ''running''
        LEFT JOIN courses c ON sc.course_id = c.id
        LEFT JOIN batches b ON sc.batch_id = b.id
        %s
        ORDER BY s.first_name, s.last_name
    ', search_condition) INTO result;
    
    RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FACULTY MANAGEMENT FUNCTIONS
-- =====================================================

-- Function to get faculty dashboard data
CREATE OR REPLACE FUNCTION get_faculty_dashboard(faculty_id INTEGER)
RETURNS JSON AS $$
DECLARE
    result JSON;
    faculty_data RECORD;
    course_count INTEGER;
    student_count INTEGER;
    assignment_count INTEGER;
    recent_activities JSON;
BEGIN
    -- Get faculty basic info
    SELECT 
        f.id,
        f.first_name,
        f.last_name,
        f.emp_id,
        f.active,
        p.name as partner_name,
        p.email,
        p.phone,
        d.name as department_name
    INTO faculty_data
    FROM faculty f
    LEFT JOIN partners p ON f.partner_id = p.id
    LEFT JOIN departments d ON f.main_department_id = d.id
    WHERE f.id = faculty_id;
    
    -- Get course count
    SELECT COUNT(DISTINCT t.course_id) INTO course_count
    FROM timetables t
    WHERE t.faculty_id = faculty_id 
    AND t.active = true
    AND t.start_datetime >= CURRENT_DATE;
    
    -- Get student count
    SELECT COUNT(DISTINCT sc.student_id) INTO student_count
    FROM student_courses sc
    JOIN timetables t ON sc.course_id = t.course_id
    WHERE t.faculty_id = faculty_id 
    AND sc.state = 'running'
    AND t.active = true;
    
    -- Get assignment count (current month)
    SELECT COUNT(*) INTO assignment_count
    FROM assignments a
    WHERE a.faculty_id = faculty_id
    AND a.created_at >= DATE_TRUNC('month', CURRENT_DATE);
    
    -- Get recent activities
    SELECT json_agg(
        json_build_object(
            'type', 'assignment',
            'id', a.id,
            'name', a.name,
            'subject', sub.name,
            'due_date', a.end_date,
            'created_at', a.created_at
        )
    ) INTO recent_activities
    FROM assignments a
    JOIN subjects sub ON a.subject_id = sub.id
    WHERE a.faculty_id = faculty_id
    AND a.created_at >= CURRENT_DATE - INTERVAL '7 days'
    ORDER BY a.created_at DESC
    LIMIT 5;
    
    -- Build result
    result := json_build_object(
        'faculty', json_build_object(
            'id', faculty_data.id,
            'name', format_full_name(faculty_data.first_name, NULL, faculty_data.last_name),
            'emp_id', faculty_data.emp_id,
            'email', faculty_data.email,
            'phone', faculty_data.phone,
            'department', faculty_data.department_name,
            'active', faculty_data.active
        ),
        'stats', json_build_object(
            'courses', course_count,
            'students', student_count,
            'assignments', assignment_count
        ),
        'recent_activities', COALESCE(recent_activities, '[]'::json)
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get faculty courses
CREATE OR REPLACE FUNCTION get_faculty_courses(faculty_id INTEGER)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_agg(
        json_build_object(
            'course_id', c.id,
            'course_name', c.name,
            'course_code', c.code,
            'batch_id', b.id,
            'batch_name', b.name,
            'subject_id', sub.id,
            'subject_name', sub.name,
            'subject_code', sub.code,
            'timing', json_build_object(
                'start_time', t.start_time,
                'end_time', t.end_time,
                'days', array_agg(DISTINCT EXTRACT(DOW FROM tt.start_datetime))
            ),
            'classroom', json_build_object(
                'id', cl.id,
                'name', cl.name,
                'code', cl.code
            )
        )
    ) INTO result
    FROM timetables tt
    JOIN courses c ON tt.course_id = c.id
    JOIN batches b ON tt.batch_id = b.id
    JOIN subjects sub ON tt.subject_id = sub.id
    JOIN timings t ON tt.timing_id = t.id
    LEFT JOIN classrooms cl ON tt.classroom_id = cl.id
    WHERE tt.faculty_id = faculty_id
    AND tt.active = true
    AND tt.start_datetime >= CURRENT_DATE
    GROUP BY c.id, c.name, c.code, b.id, b.name, sub.id, sub.name, sub.code, t.start_time, t.end_time, cl.id, cl.name, cl.code
    ORDER BY c.name, b.name, sub.name;
    
    RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql;

-- Function to search faculty
CREATE OR REPLACE FUNCTION search_faculty(
    p_query TEXT DEFAULT '',
    p_department_id INTEGER DEFAULT NULL,
    p_active_only BOOLEAN DEFAULT true
) RETURNS JSON AS $$
DECLARE
    result JSON;
    search_condition TEXT;
BEGIN
    -- Build search condition
    search_condition := 'WHERE 1=1';
    
    IF p_active_only THEN
        search_condition := search_condition || ' AND f.active = true';
    END IF;
    
    IF p_department_id IS NOT NULL THEN
        search_condition := search_condition || ' AND f.main_department_id = ' || p_department_id;
    END IF;
    
    IF p_query IS NOT NULL AND p_query != '' THEN
        search_condition := search_condition || ' AND (
            f.first_name ILIKE ''%' || p_query || '%'' OR
            f.last_name ILIKE ''%' || p_query || '%'' OR
            f.emp_id::TEXT ILIKE ''%' || p_query || '%'' OR
            p.name ILIKE ''%' || p_query || '%'' OR
            p.email ILIKE ''%' || p_query || '%''
        )';
    END IF;
    
    -- Execute search
    EXECUTE format('
        SELECT json_agg(
            json_build_object(
                ''id'', f.id,
                ''name'', format_full_name(f.first_name, f.middle_name, f.last_name),
                ''emp_id'', f.emp_id,
                ''email'', p.email,
                ''phone'', p.phone,
                ''department'', d.name,
                ''active'', f.active
            )
        )
        FROM faculty f
        LEFT JOIN partners p ON f.partner_id = p.id
        LEFT JOIN departments d ON f.main_department_id = d.id
        %s
        ORDER BY f.first_name, f.last_name
    ', search_condition) INTO result;
    
    RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ATTENDANCE MANAGEMENT FUNCTIONS
-- =====================================================

-- Function to mark attendance
CREATE OR REPLACE FUNCTION mark_attendance(
    p_attendance_sheet_id INTEGER,
    p_attendance_data JSON
) RETURNS JSON AS $$
DECLARE
    result JSON;
    attendance_record JSON;
    student_id INTEGER;
    present BOOLEAN;
    excused BOOLEAN;
    absent BOOLEAN;
    late BOOLEAN;
    remark TEXT;
    attendance_type_id INTEGER;
    attendance_date DATE;
    attendance_line_id INTEGER;
BEGIN
    -- Get attendance sheet info
    SELECT asheet.attendance_date INTO attendance_date
    FROM attendance_sheets asheet
    WHERE asheet.id = p_attendance_sheet_id;
    
    -- Process each attendance record
    FOR attendance_record IN SELECT * FROM json_array_elements(p_attendance_data)
    LOOP
        student_id := (attendance_record->>'student_id')::INTEGER;
        present := COALESCE((attendance_record->>'present')::BOOLEAN, false);
        excused := COALESCE((attendance_record->>'excused')::BOOLEAN, false);
        absent := COALESCE((attendance_record->>'absent')::BOOLEAN, false);
        late := COALESCE((attendance_record->>'late')::BOOLEAN, false);
        remark := attendance_record->>'remark';
        attendance_type_id := (attendance_record->>'attendance_type_id')::INTEGER;
        
        -- Insert or update attendance line
        INSERT INTO attendance_lines (
            attendance_id, student_id, present, excused, absent, late,
            remark, attendance_date, attendance_type_id
        ) VALUES (
            p_attendance_sheet_id, student_id, present, excused, absent, late,
            remark, attendance_date, attendance_type_id
        )
        ON CONFLICT (student_id, attendance_id, attendance_date)
        DO UPDATE SET
            present = EXCLUDED.present,
            excused = EXCLUDED.excused,
            absent = EXCLUDED.absent,
            late = EXCLUDED.late,
            remark = EXCLUDED.remark,
            attendance_type_id = EXCLUDED.attendance_type_id,
            updated_at = CURRENT_TIMESTAMP
        RETURNING id INTO attendance_line_id;
    END LOOP;
    
    -- Update attendance sheet state
    UPDATE attendance_sheets 
    SET state = 'done', updated_at = CURRENT_TIMESTAMP
    WHERE id = p_attendance_sheet_id;
    
    result := json_build_object(
        'success', true,
        'message', 'Attendance marked successfully',
        'attendance_sheet_id', p_attendance_sheet_id
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get attendance report
CREATE OR REPLACE FUNCTION get_attendance_report(
    p_course_id INTEGER DEFAULT NULL,
    p_batch_id INTEGER DEFAULT NULL,
    p_subject_id INTEGER DEFAULT NULL,
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL,
    p_faculty_id INTEGER DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
    result JSON;
    report_data JSON;
    start_date_filter DATE;
    end_date_filter DATE;
BEGIN
    -- Set default date range if not provided
    start_date_filter := COALESCE(p_start_date, CURRENT_DATE - INTERVAL '30 days');
    end_date_filter := COALESCE(p_end_date, CURRENT_DATE);
    
    -- Get attendance report data
    SELECT json_agg(
        json_build_object(
            'student_id', s.id,
            'student_name', format_full_name(s.first_name, s.middle_name, s.last_name),
            'gr_no', s.gr_no,
            'roll_number', sc.roll_number,
            'course_name', c.name,
            'batch_name', b.name,
            'subject_name', sub.name,
            'total_sessions', session_stats.total_sessions,
            'present_sessions', session_stats.present_sessions,
            'absent_sessions', session_stats.absent_sessions,
            'late_sessions', session_stats.late_sessions,
            'attendance_percentage', ROUND(
                (session_stats.present_sessions::DECIMAL / 
                 NULLIF(session_stats.total_sessions, 0)) * 100, 2
            )
        )
    ) INTO report_data
    FROM students s
    JOIN student_courses sc ON s.id = sc.student_id
    JOIN courses c ON sc.course_id = c.id
    JOIN batches b ON sc.batch_id = b.id
    JOIN student_course_subjects scs ON sc.id = scs.student_course_id
    JOIN subjects sub ON scs.subject_id = sub.id
    LEFT JOIN (
        SELECT 
            al.student_id,
            sub.id as subject_id,
            COUNT(DISTINCT asheet.id) as total_sessions,
            COUNT(CASE WHEN al.present = true THEN 1 END) as present_sessions,
            COUNT(CASE WHEN al.absent = true THEN 1 END) as absent_sessions,
            COUNT(CASE WHEN al.late = true THEN 1 END) as late_sessions
        FROM attendance_lines al
        JOIN attendance_sheets asheet ON al.attendance_id = asheet.id
        JOIN attendance_registers ar ON asheet.register_id = ar.id
        JOIN subjects sub ON ar.subject_id = sub.id
        WHERE asheet.attendance_date BETWEEN start_date_filter AND end_date_filter
        AND (p_course_id IS NULL OR ar.course_id = p_course_id)
        AND (p_batch_id IS NULL OR ar.batch_id = p_batch_id)
        AND (p_subject_id IS NULL OR ar.subject_id = p_subject_id)
        AND (p_faculty_id IS NULL OR ar.faculty_id = p_faculty_id)
        GROUP BY al.student_id, sub.id
    ) session_stats ON s.id = session_stats.student_id AND sub.id = session_stats.subject_id
    WHERE sc.state = 'running'
    AND (p_course_id IS NULL OR c.id = p_course_id)
    AND (p_batch_id IS NULL OR b.id = p_batch_id)
    AND (p_subject_id IS NULL OR sub.id = p_subject_id)
    ORDER BY s.first_name, s.last_name;
    
    result := json_build_object(
        'filters', json_build_object(
            'course_id', p_course_id,
            'batch_id', p_batch_id,
            'subject_id', p_subject_id,
            'start_date', start_date_filter,
            'end_date', end_date_filter,
            'faculty_id', p_faculty_id
        ),
        'report_data', COALESCE(report_data, '[]'::json),
        'generated_at', CURRENT_TIMESTAMP
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- EXAM MANAGEMENT FUNCTIONS
-- =====================================================

-- Function to create exam session
CREATE OR REPLACE FUNCTION create_exam_session(
    p_name TEXT,
    p_course_id INTEGER,
    p_batch_id INTEGER,
    p_exam_code TEXT,
    p_start_date DATE,
    p_end_date DATE,
    p_exam_type_id INTEGER,
    p_evaluation_type TEXT DEFAULT 'normal',
    p_venue_id INTEGER DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
    exam_session_id INTEGER;
    result JSON;
BEGIN
    -- Generate exam code if not provided
    IF p_exam_code IS NULL OR p_exam_code = '' THEN
        p_exam_code := generate_unique_code('EX', 'exam_sessions', 'exam_code', 8);
    END IF;
    
    -- Insert exam session
    INSERT INTO exam_sessions (
        name, course_id, batch_id, exam_code, start_date, end_date,
        exam_type_id, evaluation_type, venue_id, state
    ) VALUES (
        p_name, p_course_id, p_batch_id, p_exam_code, p_start_date, p_end_date,
        p_exam_type_id, p_evaluation_type, p_venue_id, 'draft'
    ) RETURNING id INTO exam_session_id;
    
    result := json_build_object(
        'success', true,
        'exam_session_id', exam_session_id,
        'exam_code', p_exam_code,
        'message', 'Exam session created successfully'
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to mark exam results
CREATE OR REPLACE FUNCTION mark_exam_results(
    p_exam_id INTEGER,
    p_results_data JSON
) RETURNS JSON AS $$
DECLARE
    result JSON;
    result_record JSON;
    student_id INTEGER;
    marks INTEGER;
    grade TEXT;
    note TEXT;
    room_id INTEGER;
    status TEXT;
BEGIN
    -- Process each result record
    FOR result_record IN SELECT * FROM json_array_elements(p_results_data)
    LOOP
        student_id := (result_record->>'student_id')::INTEGER;
        marks := (result_record->>'marks')::INTEGER;
        grade := result_record->>'grade';
        note := result_record->>'note';
        room_id := (result_record->>'room_id')::INTEGER;
        status := COALESCE(result_record->>'status', 'present');
        
        -- Insert or update exam attendee
        INSERT INTO exam_attendees (
            student_id, exam_id, status, marks, note, room_id
        ) VALUES (
            student_id, p_exam_id, status, marks, note, room_id
        )
        ON CONFLICT (student_id, exam_id)
        DO UPDATE SET
            status = EXCLUDED.status,
            marks = EXCLUDED.marks,
            note = EXCLUDED.note,
            room_id = EXCLUDED.room_id,
            updated_at = CURRENT_TIMESTAMP;
    END LOOP;
    
    -- Update exam state
    UPDATE exams 
    SET state = 'result_updated', updated_at = CURRENT_TIMESTAMP
    WHERE id = p_exam_id;
    
    result := json_build_object(
        'success', true,
        'message', 'Exam results marked successfully',
        'exam_id', p_exam_id
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get exam statistics
CREATE OR REPLACE FUNCTION get_exam_statistics(
    p_exam_id INTEGER DEFAULT NULL,
    p_exam_session_id INTEGER DEFAULT NULL,
    p_course_id INTEGER DEFAULT NULL,
    p_batch_id INTEGER DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
    result JSON;
    exam_stats JSON;
BEGIN
    -- Get exam statistics
    SELECT json_agg(
        json_build_object(
            'exam_id', e.id,
            'exam_name', e.name,
            'subject_name', sub.name,
            'total_marks', e.total_marks,
            'min_marks', e.min_marks,
            'total_students', exam_stats.total_students,
            'present_students', exam_stats.present_students,
            'absent_students', exam_stats.absent_students,
            'average_marks', exam_stats.avg_marks,
            'highest_marks', exam_stats.max_marks,
            'lowest_marks', exam_stats.min_marks,
            'pass_percentage', ROUND(
                (exam_stats.passed_students::DECIMAL / 
                 NULLIF(exam_stats.present_students, 0)) * 100, 2
            )
        )
    ) INTO exam_stats
    FROM exams e
    JOIN subjects sub ON e.subject_id = sub.id
    LEFT JOIN (
        SELECT 
            ea.exam_id,
            COUNT(*) as total_students,
            COUNT(CASE WHEN ea.status = 'present' THEN 1 END) as present_students,
            COUNT(CASE WHEN ea.status = 'absent' THEN 1 END) as absent_students,
            ROUND(AVG(ea.marks), 2) as avg_marks,
            MAX(ea.marks) as max_marks,
            MIN(ea.marks) as min_marks,
            COUNT(CASE WHEN ea.marks >= e.min_marks THEN 1 END) as passed_students
        FROM exam_attendees ea
        JOIN exams e ON ea.exam_id = e.id
        WHERE ea.marks IS NOT NULL
        GROUP BY ea.exam_id
    ) exam_stats ON e.id = exam_stats.exam_id
    WHERE (p_exam_id IS NULL OR e.id = p_exam_id)
    AND (p_exam_session_id IS NULL OR e.session_id = p_exam_session_id)
    AND (p_course_id IS NULL OR e.session_id IN (
        SELECT id FROM exam_sessions WHERE course_id = p_course_id
    ))
    AND (p_batch_id IS NULL OR e.session_id IN (
        SELECT id FROM exam_sessions WHERE batch_id = p_batch_id
    ))
    ORDER BY e.start_time;
    
    result := json_build_object(
        'filters', json_build_object(
            'exam_id', p_exam_id,
            'exam_session_id', p_exam_session_id,
            'course_id', p_course_id,
            'batch_id', p_batch_id
        ),
        'exam_statistics', COALESCE(exam_stats, '[]'::json),
        'generated_at', CURRENT_TIMESTAMP
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate grade based on marks
CREATE OR REPLACE FUNCTION calculate_grade(
    p_marks INTEGER,
    p_total_marks INTEGER,
    p_grade_config_id INTEGER DEFAULT NULL
) RETURNS TEXT AS $$
DECLARE
    percentage DECIMAL;
    grade TEXT;
BEGIN
    IF p_marks IS NULL OR p_total_marks IS NULL OR p_total_marks = 0 THEN
        RETURN NULL;
    END IF;
    
    percentage := (p_marks::DECIMAL / p_total_marks) * 100;
    
    -- If grade configuration is provided, use it
    IF p_grade_config_id IS NOT NULL THEN
        SELECT gc.grade INTO grade
        FROM grade_configurations gc
        WHERE gc.id = p_grade_config_id
        AND percentage >= (gc.min_marks::DECIMAL / 100)
        AND percentage <= (gc.max_marks::DECIMAL / 100)
        ORDER BY gc.min_marks DESC
        LIMIT 1;
        
        IF grade IS NOT NULL THEN
            RETURN grade;
        END IF;
    END IF;
    
    -- Default grading system
    IF percentage >= 90 THEN
        RETURN 'A+';
    ELSIF percentage >= 80 THEN
        RETURN 'A';
    ELSIF percentage >= 70 THEN
        RETURN 'B+';
    ELSIF percentage >= 60 THEN
        RETURN 'B';
    ELSIF percentage >= 50 THEN
        RETURN 'C+';
    ELSIF percentage >= 40 THEN
        RETURN 'C';
    ELSIF percentage >= 33 THEN
        RETURN 'D';
    ELSE
        RETURN 'F';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- LIBRARY MANAGEMENT FUNCTIONS
-- =====================================================

-- Function to issue media
CREATE OR REPLACE FUNCTION issue_media(
    p_media_unit_id INTEGER,
    p_student_id INTEGER DEFAULT NULL,
    p_faculty_id INTEGER DEFAULT NULL,
    p_due_date DATE DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
    result JSON;
    media_data RECORD;
    card_data RECORD;
    due_date_calc DATE;
    movement_id INTEGER;
BEGIN
    -- Validate that either student_id or faculty_id is provided, but not both
    IF (p_student_id IS NULL AND p_faculty_id IS NULL) OR 
       (p_student_id IS NOT NULL AND p_faculty_id IS NOT NULL) THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Either student_id or faculty_id must be provided, but not both'
        );
    END IF;
    
    -- Get media unit data
    SELECT mu.id, mu.media_id, mu.state, m.name as media_name
    INTO media_data
    FROM media_units mu
    JOIN media m ON mu.media_id = m.id
    WHERE mu.id = p_media_unit_id;
    
    -- Check if media unit exists and is available
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Media unit not found'
        );
    END IF;
    
    IF media_data.state != 'available' THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Media unit is not available for issue'
        );
    END IF;
    
    -- Get library card data
    IF p_student_id IS NOT NULL THEN
        SELECT lc.id, lc.card_type_id, lct.duration
        INTO card_data
        FROM library_cards lc
        JOIN library_card_types lct ON lc.card_type_id = lct.id
        WHERE lc.student_id = p_student_id AND lc.active = true;
    ELSE
        SELECT lc.id, lc.card_type_id, lct.duration
        INTO card_data
        FROM library_cards lc
        JOIN library_card_types lct ON lc.card_type_id = lct.id
        WHERE lc.faculty_id = p_faculty_id AND lc.active = true;
    END IF;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'message', 'No active library card found'
        );
    END IF;
    
    -- Calculate due date
    due_date_calc := COALESCE(p_due_date, CURRENT_DATE + INTERVAL '1 day' * card_data.duration);
    
    -- Create media movement
    INSERT INTO media_movements (
        media_id, media_unit_id, student_id, faculty_id,
        issue_date, due_date, state
    ) VALUES (
        media_data.media_id, p_media_unit_id, p_student_id, p_faculty_id,
        CURRENT_DATE, due_date_calc, 'issue'
    ) RETURNING id INTO movement_id;
    
    -- Update media unit state
    UPDATE media_units 
    SET state = 'issued'
    WHERE id = p_media_unit_id;
    
    result := json_build_object(
        'success', true,
        'movement_id', movement_id,
        'media_name', media_data.media_name,
        'due_date', due_date_calc,
        'message', 'Media issued successfully'
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to return media
CREATE OR REPLACE FUNCTION return_media(p_movement_id INTEGER) RETURNS JSON AS $$
DECLARE
    result JSON;
    movement_data RECORD;
    penalty_amount DECIMAL := 0;
    days_overdue INTEGER;
BEGIN
    -- Get movement data
    SELECT mm.id, mm.media_unit_id, mm.due_date, mm.issue_date, mu.state
    INTO movement_data
    FROM media_movements mm
    JOIN media_units mu ON mm.media_unit_id = mu.id
    WHERE mm.id = p_movement_id AND mm.state = 'issue';
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Active media movement not found'
        );
    END IF;
    
    -- Calculate penalty if overdue
    IF CURRENT_DATE > movement_data.due_date THEN
        days_overdue := CURRENT_DATE - movement_data.due_date;
        
        -- Get penalty amount from library card type
        SELECT lct.penalty_amt_per_day INTO penalty_amount
        FROM media_movements mm2
        JOIN library_cards lc ON (mm2.student_id = lc.student_id OR mm2.faculty_id = lc.faculty_id)
        JOIN library_card_types lct ON lc.card_type_id = lct.id
        WHERE mm2.id = p_movement_id;
        
        penalty_amount := penalty_amount * days_overdue;
    END IF;
    
    -- Update movement
    UPDATE media_movements 
    SET state = 'return', return_date = CURRENT_DATE
    WHERE id = p_movement_id;
    
    -- Update media unit state
    UPDATE media_units 
    SET state = 'available'
    WHERE id = movement_data.media_unit_id;
    
    result := json_build_object(
        'success', true,
        'return_date', CURRENT_DATE,
        'days_overdue', COALESCE(days_overdue, 0),
        'penalty_amount', penalty_amount,
        'message', 'Media returned successfully'
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get overdue media
CREATE OR REPLACE FUNCTION get_overdue_media() RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_agg(
        json_build_object(
            'movement_id', mm.id,
            'media_name', m.name,
            'media_unit_id', mu.id,
            'barcode', mu.barcode,
            'student_name', format_full_name(s.first_name, s.middle_name, s.last_name),
            'faculty_name', format_full_name(f.first_name, f.middle_name, f.last_name),
            'issue_date', mm.issue_date,
            'due_date', mm.due_date,
            'days_overdue', CURRENT_DATE - mm.due_date,
            'penalty_amount', (CURRENT_DATE - mm.due_date) * lct.penalty_amt_per_day
        )
    ) INTO result
    FROM media_movements mm
    JOIN media m ON mm.media_id = m.id
    JOIN media_units mu ON mm.media_unit_id = mu.id
    LEFT JOIN students s ON mm.student_id = s.id
    LEFT JOIN faculty f ON mm.faculty_id = f.id
    LEFT JOIN library_cards lc ON (mm.student_id = lc.student_id OR mm.faculty_id = lc.faculty_id)
    LEFT JOIN library_card_types lct ON lc.card_type_id = lct.id
    WHERE mm.state = 'issue' AND mm.due_date < CURRENT_DATE
    ORDER BY mm.due_date;
    
    RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FEES MANAGEMENT FUNCTIONS
-- =====================================================

-- Function to calculate student fees
CREATE OR REPLACE FUNCTION calculate_student_fees(
    p_student_id INTEGER,
    p_course_id INTEGER,
    p_batch_id INTEGER,
    p_academic_year_id INTEGER
) RETURNS JSON AS $$
DECLARE
    result JSON;
    fees_data JSON;
    course_fees_term_id INTEGER;
    fees_term_data RECORD;
    fees_line_data RECORD;
    total_amount DECIMAL := 0;
    fees_detail_id INTEGER;
BEGIN
    -- Get course fees term
    SELECT fees_term_id INTO course_fees_term_id
    FROM courses
    WHERE id = p_course_id;
    
    IF course_fees_term_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'message', 'No fees structure defined for this course'
        );
    END IF;
    
    -- Get fees term data
    SELECT * INTO fees_term_data
    FROM fees_terms
    WHERE id = course_fees_term_id;
    
    -- Process each fees line
    FOR fees_line_data IN 
        SELECT * FROM fees_terms_lines 
        WHERE fees_id = course_fees_term_id AND active = true
        ORDER BY due_days
    LOOP
        -- Calculate amount for this line
        DECLARE
            line_amount DECIMAL := 0;
            element_data RECORD;
        BEGIN
            -- Process each element in the line
            FOR element_data IN
                SELECT fe.*, p.price, p.name as product_name
                FROM fees_elements fe
                JOIN products p ON fe.product_id = p.id
                WHERE fe.fees_terms_line_id = fees_line_data.id AND fe.active = true
            LOOP
                line_amount := line_amount + (element_data.price * element_data.value);
            END LOOP;
            
            -- Apply fees term line value
            line_amount := line_amount * (fees_line_data.value / 100);
            
            -- Create student fees detail
            INSERT INTO student_fees_details (
                student_id, fees_line_id, course_id, batch_id,
                academic_year_id, amount, fees_factor, after_discount_amount,
                company_id, state
            ) VALUES (
                p_student_id, fees_line_data.id, p_course_id, p_batch_id,
                p_academic_year_id, line_amount, 1.0, line_amount,
                (SELECT company_id FROM courses WHERE id = p_course_id), 'draft'
            ) RETURNING id INTO fees_detail_id;
            
            total_amount := total_amount + line_amount;
        END;
    END LOOP;
    
    result := json_build_object(
        'success', true,
        'student_id', p_student_id,
        'course_id', p_course_id,
        'batch_id', p_batch_id,
        'academic_year_id', p_academic_year_id,
        'total_amount', total_amount,
        'fees_term_name', fees_term_data.name,
        'message', 'Fees calculated successfully'
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to process fee payment
CREATE OR REPLACE FUNCTION process_fee_payment(
    p_fees_detail_id INTEGER,
    p_payment_amount DECIMAL,
    p_payment_method TEXT DEFAULT 'cash',
    p_reference TEXT DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
    result JSON;
    fees_data RECORD;
    remaining_amount DECIMAL;
    payment_id INTEGER;
BEGIN
    -- Get fees detail data
    SELECT * INTO fees_data
    FROM student_fees_details
    WHERE id = p_fees_detail_id AND state = 'draft';
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Fees detail not found or already processed'
        );
    END IF;
    
    -- Calculate remaining amount
    remaining_amount := fees_data.after_discount_amount - p_payment_amount;
    
    -- Create payment record
    INSERT INTO account_payments (
        name, partner_id, company_id, amount, payment_date,
        payment_method, reference, state
    ) VALUES (
        'Fee Payment - ' || fees_data.student_id, 
        (SELECT partner_id FROM students WHERE id = fees_data.student_id),
        fees_data.company_id,
        p_payment_amount,
        CURRENT_DATE,
        p_payment_method,
        p_reference,
        'posted'
    ) RETURNING id INTO payment_id;
    
    -- Update fees detail
    UPDATE student_fees_details
    SET 
        payment_id = payment_id,
        state = CASE 
            WHEN remaining_amount <= 0 THEN 'invoice'
            ELSE 'draft'
        END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_fees_detail_id;
    
    result := json_build_object(
        'success', true,
        'payment_id', payment_id,
        'remaining_amount', GREATEST(remaining_amount, 0),
        'payment_status', CASE 
            WHEN remaining_amount <= 0 THEN 'fully_paid'
            ELSE 'partially_paid'
        END,
        'message', 'Payment processed successfully'
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ASSIGNMENT MANAGEMENT FUNCTIONS
-- =====================================================

-- Function to create assignment
CREATE OR REPLACE FUNCTION create_assignment(
    p_name TEXT,
    p_course_id INTEGER,
    p_batch_id INTEGER,
    p_subject_id INTEGER,
    p_assignment_type_id INTEGER,
    p_faculty_id INTEGER,
    p_description TEXT DEFAULT NULL,
    p_marks INTEGER DEFAULT 0,
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
    assignment_id INTEGER;
    result JSON;
BEGIN
    -- Set default dates if not provided
    p_start_date := COALESCE(p_start_date, CURRENT_DATE);
    p_end_date := COALESCE(p_end_date, CURRENT_DATE + INTERVAL '7 days');
    
    -- Insert assignment
    INSERT INTO assignments (
        name, course_id, batch_id, subject_id, assignment_type_id,
        faculty_id, description, marks, start_date, end_date, state
    ) VALUES (
        p_name, p_course_id, p_batch_id, p_subject_id, p_assignment_type_id,
        p_faculty_id, p_description, p_marks, p_start_date, p_end_date, 'draft'
    ) RETURNING id INTO assignment_id;
    
    result := json_build_object(
        'success', true,
        'assignment_id', assignment_id,
        'message', 'Assignment created successfully'
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to submit assignment
CREATE OR REPLACE FUNCTION submit_assignment(
    p_assignment_id INTEGER,
    p_student_id INTEGER,
    p_description TEXT DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
    result JSON;
    submission_id INTEGER;
BEGIN
    -- Check if assignment exists and is open
    IF NOT EXISTS (
        SELECT 1 FROM assignments 
        WHERE id = p_assignment_id 
        AND state IN ('draft', 'open')
        AND end_date >= CURRENT_DATE
    ) THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Assignment not found or submission deadline has passed'
        );
    END IF;
    
    -- Insert or update submission
    INSERT INTO assignment_sub_lines (
        assignment_id, student_id, submission_date, description, state
    ) VALUES (
        p_assignment_id, p_student_id, CURRENT_DATE, p_description, 'submit'
    )
    ON CONFLICT (assignment_id, student_id)
    DO UPDATE SET
        submission_date = CURRENT_DATE,
        description = EXCLUDED.description,
        state = 'submit',
        updated_at = CURRENT_TIMESTAMP
    RETURNING id INTO submission_id;
    
    result := json_build_object(
        'success', true,
        'submission_id', submission_id,
        'message', 'Assignment submitted successfully'
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to grade assignment submission
CREATE OR REPLACE FUNCTION grade_assignment_submission(
    p_submission_id INTEGER,
    p_marks INTEGER,
    p_feedback TEXT DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
    result JSON;
    max_marks INTEGER;
    grade TEXT;
BEGIN
    -- Get assignment max marks
    SELECT a.marks INTO max_marks
    FROM assignment_sub_lines asl
    JOIN assignments a ON asl.assignment_id = a.id
    WHERE asl.id = p_submission_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Assignment submission not found'
        );
    END IF;
    
    -- Calculate grade
    grade := calculate_grade(p_marks, max_marks);
    
    -- Update submission
    UPDATE assignment_sub_lines
    SET 
        marks = p_marks,
        state = 'accept',
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_submission_id;
    
    result := json_build_object(
        'success', true,
        'marks', p_marks,
        'max_marks', max_marks,
        'grade', grade,
        'message', 'Assignment graded successfully'
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ADMISSION MANAGEMENT FUNCTIONS
-- =====================================================

-- Function to create admission application
CREATE OR REPLACE FUNCTION create_admission_application(
    p_name TEXT,
    p_register_id INTEGER,
    p_student_id INTEGER DEFAULT NULL,
    p_course_id INTEGER DEFAULT NULL,
    p_batch_id INTEGER DEFAULT NULL,
    p_fees DECIMAL DEFAULT 0
) RETURNS JSON AS $$
DECLARE
    result JSON;
    admission_id INTEGER;
    application_number TEXT;
    register_data RECORD;
BEGIN
    -- Get register data
    SELECT * INTO register_data
    FROM admission_registers
    WHERE id = p_register_id AND active = true;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Admission register not found or inactive'
        );
    END IF;
    
    -- Check if register is still open
    IF CURRENT_DATE > register_data.end_date THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Admission register is closed'
        );
    END IF;
    
    -- Generate application number
    application_number := generate_unique_code('APP', 'admissions', 'application_number', 10);
    
    -- Insert admission
    INSERT INTO admissions (
        name, register_id, application_number, student_id,
        course_id, batch_id, fees, state
    ) VALUES (
        p_name, p_register_id, application_number, p_student_id,
        p_course_id, p_batch_id, p_fees, 'draft'
    ) RETURNING id INTO admission_id;
    
    result := json_build_object(
        'success', true,
        'admission_id', admission_id,
        'application_number', application_number,
        'message', 'Admission application created successfully'
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to process admission
CREATE OR REPLACE FUNCTION process_admission(
    p_admission_id INTEGER,
    p_action TEXT -- 'confirm', 'admission', 'reject'
) RETURNS JSON AS $$
DECLARE
    result JSON;
    admission_data RECORD;
    student_course_id INTEGER;
BEGIN
    -- Get admission data
    SELECT * INTO admission_data
    FROM admissions
    WHERE id = p_admission_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Admission not found'
        );
    END IF;
    
    -- Update admission state
    UPDATE admissions
    SET state = p_action, updated_at = CURRENT_TIMESTAMP
    WHERE id = p_admission_id;
    
    -- If admission is approved, enroll student in course
    IF p_action = 'admission' AND admission_data.student_id IS NOT NULL THEN
        -- Enroll student in course
        SELECT * INTO student_course_id FROM enroll_student_in_course(
            admission_data.student_id,
            admission_data.course_id,
            admission_data.batch_id,
            (SELECT id FROM academic_years WHERE active = true ORDER BY start_date DESC LIMIT 1),
            (SELECT id FROM academic_terms WHERE active = true ORDER BY start_date DESC LIMIT 1)
        );
    END IF;
    
    result := json_build_object(
        'success', true,
        'admission_id', p_admission_id,
        'action', p_action,
        'message', 'Admission ' || p_action || 'ed successfully'
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;



-- =====================================================
-- ACCOUNTING MANAGEMENT FUNCTIONS
-- =====================================================

-- Function to create journal entry
CREATE OR REPLACE FUNCTION create_journal_entry(
    p_name TEXT,
    p_journal_id INTEGER,
    p_company_id INTEGER,
    p_ref TEXT DEFAULT NULL,
    p_narration TEXT DEFAULT NULL,
    p_lines JSON DEFAULT '[]'::json
) RETURNS JSON AS $$
DECLARE
    result JSON;
    move_id INTEGER;
    line_record JSON;
    total_debit DECIMAL := 0;
    total_credit DECIMAL := 0;
    line_debit DECIMAL;
    line_credit DECIMAL;
BEGIN
    -- Validate journal entry lines
    FOR line_record IN SELECT * FROM json_array_elements(p_lines)
    LOOP
        line_debit := COALESCE((line_record->>'debit')::DECIMAL, 0);
        line_credit := COALESCE((line_record->>'credit')::DECIMAL, 0);
        
        -- Validate that each line has either debit or credit, not both
        IF line_debit > 0 AND line_credit > 0 THEN
            RETURN json_build_object(
                'success', false,
                'message', 'Each line must have either debit or credit, not both'
            );
        END IF;
        
        total_debit := total_debit + line_debit;
        total_credit := total_credit + line_credit;
    END LOOP;
    
    -- Validate that total debit equals total credit
    IF total_debit != total_credit THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Total debit must equal total credit'
        );
    END IF;
    
    -- Create account move
    INSERT INTO account_moves (
        name, ref, journal_id, company_id, date, state, amount_total, narration
    ) VALUES (
        p_name, p_ref, p_journal_id, p_company_id, CURRENT_DATE, 'draft', total_debit, p_narration
    ) RETURNING id INTO move_id;
    
    -- Create account move lines
    FOR line_record IN SELECT * FROM json_array_elements(p_lines)
    LOOP
        INSERT INTO account_move_lines (
            move_id, account_id, partner_id, debit, credit, name
        ) VALUES (
            move_id,
            (line_record->>'account_id')::INTEGER,
            (line_record->>'partner_id')::INTEGER,
            COALESCE((line_record->>'debit')::DECIMAL, 0),
            COALESCE((line_record->>'credit')::DECIMAL, 0),
            line_record->>'name'
        );
    END LOOP;
    
    result := json_build_object(
        'success', true,
        'move_id', move_id,
        'total_amount', total_debit,
        'message', 'Journal entry created successfully'
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to post journal entry
CREATE OR REPLACE FUNCTION post_journal_entry(p_move_id INTEGER) RETURNS JSON AS $$
DECLARE
    result JSON;
    move_data RECORD;
BEGIN
    -- Get move data
    SELECT * INTO move_data
    FROM account_moves
    WHERE id = p_move_id AND state = 'draft';
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Journal entry not found or already posted'
        );
    END IF;
    
    -- Update move state
    UPDATE account_moves
    SET state = 'posted', posted_at = CURRENT_TIMESTAMP
    WHERE id = p_move_id;
    
    result := json_build_object(
        'success', true,
        'move_id', p_move_id,
        'message', 'Journal entry posted successfully'
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to create invoice
CREATE OR REPLACE FUNCTION create_invoice(
    p_partner_id INTEGER,
    p_company_id INTEGER,
    p_journal_id INTEGER,
    p_type TEXT, -- 'out_invoice' or 'in_invoice'
    p_date_invoice DATE,
    p_date_due DATE DEFAULT NULL,
    p_reference TEXT DEFAULT NULL,
    p_narration TEXT DEFAULT NULL,
    p_lines JSON DEFAULT '[]'::json
) RETURNS JSON AS $$
DECLARE
    result JSON;
    invoice_id INTEGER;
    move_id INTEGER;
    invoice_number TEXT;
    total_untaxed DECIMAL := 0;
    total_tax DECIMAL := 0;
    total_amount DECIMAL := 0;
    line_record JSON;
    line_amount DECIMAL;
BEGIN
    -- Generate invoice number
    invoice_number := generate_unique_code('INV', 'account_invoices', 'number', 10);
    
    -- Calculate totals
    FOR line_record IN SELECT * FROM json_array_elements(p_lines)
    LOOP
        line_amount := COALESCE((line_record->>'amount')::DECIMAL, 0);
        total_untaxed := total_untaxed + line_amount;
    END LOOP;
    
    total_amount := total_untaxed + total_tax;
    
    -- Create account move first
    SELECT * INTO move_id FROM create_journal_entry(
        'Invoice ' || invoice_number,
        p_journal_id,
        p_company_id,
        p_reference,
        p_narration,
        p_lines
    );
    
    -- Create invoice
    INSERT INTO account_invoices (
        number, partner_id, company_id, journal_id, move_id, type,
        date_invoice, date_due, amount_untaxed, amount_tax, amount_total,
        reference, narration, state
    ) VALUES (
        invoice_number, p_partner_id, p_company_id, p_journal_id, move_id, p_type,
        p_date_invoice, COALESCE(p_date_due, p_date_invoice + INTERVAL '30 days'),
        total_untaxed, total_tax, total_amount, p_reference, p_narration, 'draft'
    ) RETURNING id INTO invoice_id;
    
    result := json_build_object(
        'success', true,
        'invoice_id', invoice_id,
        'invoice_number', invoice_number,
        'move_id', move_id,
        'total_amount', total_amount,
        'message', 'Invoice created successfully'
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PAYROLL MANAGEMENT FUNCTIONS
-- =====================================================

-- Function to calculate payroll
CREATE OR REPLACE FUNCTION calculate_payroll(
    p_staff_id INTEGER,
    p_month INTEGER,
    p_year INTEGER
) RETURNS JSON AS $$
DECLARE
    result JSON;
    staff_data RECORD;
    basic_salary DECIMAL;
    allowances DECIMAL := 0;
    deductions DECIMAL := 0;
    net_salary DECIMAL;
    tds_amount DECIMAL := 0;
    tax_amount DECIMAL := 0;
    payroll_id INTEGER;
BEGIN
    -- Get staff data
    SELECT s.*, p.name as partner_name
    INTO staff_data
    FROM staff s
    LEFT JOIN partners p ON s.partner_id = p.id
    WHERE s.id = p_staff_id AND s.active = true;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Staff member not found or inactive'
        );
    END IF;
    
    -- Get basic salary (simplified - in real system, this would come from salary structure)
    basic_salary := 50000; -- Default basic salary
    
    -- Calculate TDS based on annual income
    DECLARE
        annual_income DECIMAL;
        tds_config_data RECORD;
    BEGIN
        annual_income := basic_salary * 12;
        
        SELECT * INTO tds_config_data
        FROM tds_config
        WHERE annual_income >= slab_from AND annual_income <= slab_to
        AND active = true
        ORDER BY slab_from DESC
        LIMIT 1;
        
        IF FOUND THEN
            tds_amount := (annual_income * tds_config_data.percentage / 100) / 12;
        END IF;
    END;
    
    -- Calculate net salary
    net_salary := basic_salary + allowances - deductions - tds_amount;
    
    -- Create or update payroll record
    INSERT INTO payroll (
        staff_id, month, year, basic_salary, allowances, deductions,
        net_salary, tds_amount, tax_amount, state, company_id
    ) VALUES (
        p_staff_id, p_month, p_year, basic_salary, allowances, deductions,
        net_salary, tds_amount, tax_amount, 'draft', staff_data.company_id
    )
    ON CONFLICT (staff_id, month, year)
    DO UPDATE SET
        basic_salary = EXCLUDED.basic_salary,
        allowances = EXCLUDED.allowances,
        deductions = EXCLUDED.deductions,
        net_salary = EXCLUDED.net_salary,
        tds_amount = EXCLUDED.tds_amount,
        tax_amount = EXCLUDED.tax_amount,
        updated_at = CURRENT_TIMESTAMP
    RETURNING id INTO payroll_id;
    
    result := json_build_object(
        'success', true,
        'payroll_id', payroll_id,
        'staff_name', staff_data.partner_name,
        'basic_salary', basic_salary,
        'allowances', allowances,
        'deductions', deductions,
        'tds_amount', tds_amount,
        'net_salary', net_salary,
        'message', 'Payroll calculated successfully'
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SYSTEM MANAGEMENT FUNCTIONS
-- =====================================================

-- Function to get system statistics
CREATE OR REPLACE FUNCTION get_system_statistics() RETURNS JSON AS $$
DECLARE
    result JSON;
    stats JSON;
BEGIN
    SELECT json_build_object(
        'students', (SELECT COUNT(*) FROM students WHERE active = true),
        'faculty', (SELECT COUNT(*) FROM faculty WHERE active = true),
        'courses', (SELECT COUNT(*) FROM courses WHERE active = true),
        'batches', (SELECT COUNT(*) FROM batches WHERE active = true),
        'departments', (SELECT COUNT(*) FROM departments WHERE active = true),
        'companies', (SELECT COUNT(*) FROM companies WHERE active = true),
        'active_users', (SELECT COUNT(*) FROM users WHERE active = true),
        'total_attendance_sessions', (SELECT COUNT(*) FROM attendance_sheets WHERE active = true),
        'total_exams', (SELECT COUNT(*) FROM exams WHERE active = true),
        'total_assignments', (SELECT COUNT(*) FROM assignments WHERE active = true),
        'total_library_items', (SELECT COUNT(*) FROM media WHERE active = true),
        'overdue_media', (SELECT COUNT(*) FROM media_movements WHERE state = 'issue' AND due_date < CURRENT_DATE)
    ) INTO stats;
    
    result := json_build_object(
        'statistics', stats,
        'generated_at', CURRENT_TIMESTAMP
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to generate report
CREATE OR REPLACE FUNCTION generate_report(
    p_report_type TEXT,
    p_filters JSON DEFAULT '{}'::json
) RETURNS JSON AS $$
DECLARE
    result JSON;
    report_data JSON;
    start_date DATE;
    end_date DATE;
    course_id INTEGER;
    batch_id INTEGER;
    department_id INTEGER;
BEGIN
    -- Extract filters
    start_date := COALESCE((p_filters->>'start_date')::DATE, CURRENT_DATE - INTERVAL '30 days');
    end_date := COALESCE((p_filters->>'end_date')::DATE, CURRENT_DATE);
    course_id := (p_filters->>'course_id')::INTEGER;
    batch_id := (p_filters->>'batch_id')::INTEGER;
    department_id := (p_filters->>'department_id')::INTEGER;
    
    -- Generate report based on type
    CASE p_report_type
        WHEN 'attendance_summary' THEN
            SELECT * INTO report_data FROM get_attendance_report(
                course_id, batch_id, NULL, start_date, end_date, NULL
            );
        WHEN 'exam_results' THEN
            SELECT * INTO report_data FROM get_exam_statistics(
                NULL, NULL, course_id, batch_id
            );
        WHEN 'student_performance' THEN
            SELECT json_agg(
                json_build_object(
                    'student_id', s.id,
                    'student_name', format_full_name(s.first_name, s.middle_name, s.last_name),
                    'gr_no', s.gr_no,
                    'course_name', c.name,
                    'batch_name', b.name,
                    'attendance_percentage', att_stats.attendance_percentage,
                    'average_marks', exam_stats.avg_marks
                )
            ) INTO report_data
            FROM students s
            JOIN student_courses sc ON s.id = sc.student_id
            JOIN courses c ON sc.course_id = c.id
            JOIN batches b ON sc.batch_id = b.id
            LEFT JOIN (
                SELECT 
                    al.student_id,
                    ROUND(
                        (COUNT(CASE WHEN al.present = true THEN 1 END)::DECIMAL / 
                         NULLIF(COUNT(*), 0)) * 100, 2
                    ) as attendance_percentage
                FROM attendance_lines al
                JOIN attendance_sheets asheet ON al.attendance_id = asheet.id
                WHERE asheet.attendance_date BETWEEN start_date AND end_date
                GROUP BY al.student_id
            ) att_stats ON s.id = att_stats.student_id
            LEFT JOIN (
                SELECT 
                    ea.student_id,
                    ROUND(AVG(ea.marks), 2) as avg_marks
                FROM exam_attendees ea
                WHERE ea.marks IS NOT NULL
                GROUP BY ea.student_id
            ) exam_stats ON s.id = exam_stats.student_id
            WHERE sc.state = 'running'
            AND (course_id IS NULL OR c.id = course_id)
            AND (batch_id IS NULL OR b.id = batch_id)
            AND (department_id IS NULL OR c.department_id = department_id);
        ELSE
            report_data := json_build_object('error', 'Unknown report type');
    END CASE;
    
    result := json_build_object(
        'report_type', p_report_type,
        'filters', p_filters,
        'data', COALESCE(report_data, '{}'::json),
        'generated_at', CURRENT_TIMESTAMP
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CERTIFICATE MANAGEMENT FUNCTIONS
-- =====================================================

-- Function to generate certificate
CREATE OR REPLACE FUNCTION generate_certificate(
    p_student_id INTEGER,
    p_certificate_type_id INTEGER,
    p_template_id INTEGER DEFAULT NULL,
    p_issued_by INTEGER DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
    result JSON;
    certificate_id INTEGER;
    certificate_number TEXT;
    verification_code TEXT;
    student_data RECORD;
    certificate_type_data RECORD;
    template_data RECORD;
BEGIN
    -- Get student data
    SELECT s.*, p.name as partner_name
    INTO student_data
    FROM students s
    LEFT JOIN partners p ON s.partner_id = p.id
    WHERE s.id = p_student_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Student not found'
        );
    END IF;
    
    -- Get certificate type data
    SELECT * INTO certificate_type_data
    FROM certificate_types
    WHERE id = p_certificate_type_id AND active = true;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Certificate type not found'
        );
    END IF;
    
    -- Get template data if provided
    IF p_template_id IS NOT NULL THEN
        SELECT * INTO template_data
        FROM certificate_templates
        WHERE id = p_template_id AND active = true;
    ELSE
        SELECT * INTO template_data
        FROM certificate_templates
        WHERE certificate_type_id = p_certificate_type_id AND is_default = true AND active = true
        LIMIT 1;
    END IF;
    
    -- Generate certificate number and verification code
    certificate_number := generate_unique_code('CERT', 'certificates', 'certificate_number', 12);
    verification_code := encode(gen_random_bytes(16), 'hex');
    
    -- Create certificate
    INSERT INTO certificates (
        company_id, certificate_type_id, template_id, student_id,
        certificate_number, verification_code, status, issued_date,
        issued_by, certificate_data
    ) VALUES (
        certificate_type_data.company_id, p_certificate_type_id, p_template_id, p_student_id,
        certificate_number, verification_code, 'issued', CURRENT_DATE,
        p_issued_by, json_build_object(
            'student_name', format_full_name(student_data.first_name, student_data.middle_name, student_data.last_name),
            'gr_no', student_data.gr_no,
            'issued_date', CURRENT_DATE,
            'certificate_type', certificate_type_data.name
        )
    ) RETURNING id INTO certificate_id;
    
    result := json_build_object(
        'success', true,
        'certificate_id', certificate_id,
        'certificate_number', certificate_number,
        'verification_code', verification_code,
        'student_name', format_full_name(student_data.first_name, student_data.middle_name, student_data.last_name),
        'message', 'Certificate generated successfully'
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to verify certificate
CREATE OR REPLACE FUNCTION verify_certificate(p_verification_code TEXT) RETURNS JSON AS $$
DECLARE
    result JSON;
    certificate_data RECORD;
BEGIN
    -- Get certificate data
    SELECT c.*, s.first_name, s.last_name, s.gr_no, ct.name as certificate_type_name
    INTO certificate_data
    FROM certificates c
    JOIN students s ON c.student_id = s.id
    JOIN certificate_types ct ON c.certificate_type_id = ct.id
    WHERE c.verification_code = p_verification_code AND c.status = 'issued';
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Certificate not found or invalid verification code'
        );
    END IF;
    
    result := json_build_object(
        'success', true,
        'certificate', json_build_object(
            'certificate_number', certificate_data.certificate_number,
            'student_name', format_full_name(certificate_data.first_name, NULL, certificate_data.last_name),
            'gr_no', certificate_data.gr_no,
            'certificate_type', certificate_data.certificate_type_name,
            'issued_date', certificate_data.issued_date,
            'expiry_date', certificate_data.expiry_date,
            'status', certificate_data.status
        ),
        'message', 'Certificate verified successfully'
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- AUDIT AND LOGGING FUNCTIONS
-- =====================================================

-- Function to log audit trail
CREATE OR REPLACE FUNCTION log_audit_trail(
    p_table_name TEXT,
    p_record_id INTEGER,
    p_action TEXT,
    p_old_values JSON DEFAULT NULL,
    p_new_values JSON DEFAULT NULL,
    p_user_id INTEGER DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO audit_logs (
        table_name, record_id, action, old_values, new_values, user_id
    ) VALUES (
        p_table_name, p_record_id, p_action, p_old_values, p_new_values, p_user_id
    );
END;
$$ LANGUAGE plpgsql;

-- Function to get audit trail
CREATE OR REPLACE FUNCTION get_audit_trail(
    p_table_name TEXT DEFAULT NULL,
    p_record_id INTEGER DEFAULT NULL,
    p_user_id INTEGER DEFAULT NULL,
    p_start_date TIMESTAMP DEFAULT NULL,
    p_end_date TIMESTAMP DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
    result JSON;
    where_clause TEXT := 'WHERE 1=1';
BEGIN
    -- Build where clause
    IF p_table_name IS NOT NULL THEN
        where_clause := where_clause || ' AND table_name = ''' || p_table_name || '''';
    END IF;
    
    IF p_record_id IS NOT NULL THEN
        where_clause := where_clause || ' AND record_id = ' || p_record_id;
    END IF;
    
    IF p_user_id IS NOT NULL THEN
        where_clause := where_clause || ' AND user_id = ' || p_user_id;
    END IF;
    
    IF p_start_date IS NOT NULL THEN
        where_clause := where_clause || ' AND timestamp >= ''' || p_start_date || '''';
    END IF;
    
    IF p_end_date IS NOT NULL THEN
        where_clause := where_clause || ' AND timestamp <= ''' || p_end_date || '''';
    END IF;
    
    -- Execute query
    EXECUTE format('
        SELECT json_agg(
            json_build_object(
                ''id'', id,
                ''table_name'', table_name,
                ''record_id'', record_id,
                ''action'', action,
                ''old_values'', old_values,
                ''new_values'', new_values,
                ''user_id'', user_id,
                ''timestamp'', timestamp
            )
        )
        FROM audit_logs
        %s
        ORDER BY timestamp DESC
    ', where_clause) INTO result;
    
    RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SYSTEM UTILITY FUNCTIONS
-- =====================================================

-- Function to clean up old data
CREATE OR REPLACE FUNCTION cleanup_old_data(p_days_old INTEGER DEFAULT 365) RETURNS JSON AS $$
DECLARE
    result JSON;
    deleted_count INTEGER := 0;
    table_name TEXT;
    table_count INTEGER;
BEGIN
    -- Clean up old audit logs
    DELETE FROM audit_logs 
    WHERE timestamp < CURRENT_DATE - INTERVAL '1 day' * p_days_old;
    GET DIAGNOSTICS table_count = ROW_COUNT;
    deleted_count := deleted_count + table_count;
    
    -- Clean up old mail messages
    DELETE FROM mail_messages 
    WHERE date < CURRENT_DATE - INTERVAL '1 day' * p_days_old;
    GET DIAGNOSTICS table_count = ROW_COUNT;
    deleted_count := deleted_count + table_count;
    
    -- Clean up old mail activities
    DELETE FROM mail_activities 
    WHERE created_at < CURRENT_DATE - INTERVAL '1 day' * p_days_old;
    GET DIAGNOSTICS table_count = ROW_COUNT;
    deleted_count := deleted_count + table_count;
    
    result := json_build_object(
        'success', true,
        'deleted_records', deleted_count,
        'cleanup_days', p_days_old,
        'message', 'Old data cleaned up successfully'
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get database health status
CREATE OR REPLACE FUNCTION get_database_health() RETURNS JSON AS $$
DECLARE
    result JSON;
    health_data JSON;
BEGIN
    SELECT json_build_object(
        'database_size', pg_size_pretty(pg_database_size(current_database())),
        'total_tables', (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'),
        'total_functions', (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public'),
        'total_indexes', (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public'),
        'active_connections', (SELECT COUNT(*) FROM pg_stat_activity),
        'max_connections', (SELECT setting::INTEGER FROM pg_settings WHERE name = 'max_connections'),
        'database_uptime', (SELECT EXTRACT(EPOCH FROM (now() - pg_postmaster_start_time()))::INTEGER),
        'last_vacuum', (SELECT MAX(last_vacuum) FROM pg_stat_user_tables),
        'last_analyze', (SELECT MAX(last_analyze) FROM pg_stat_user_tables)
    ) INTO health_data;
    
    result := json_build_object(
        'health_status', 'healthy',
        'health_data', health_data,
        'checked_at', CURRENT_TIMESTAMP
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTIONS COMPLETION
-- =====================================================

-- Display completion message
SELECT 'SERP Database Functions created successfully!' AS status;