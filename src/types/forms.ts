import { Course, Department, Faculty, Exam, CourseLevel, CourseStatus, DepartmentStatus, FacultyDepartment, FacultyStatus, ExamType, ExamStatus } from './index';

// Form Data Interfaces
export interface CourseFormData {
  code: string;
  name: string;
  description: string;
  department_id: number;
  faculty_id: number;
  level: CourseLevel;
  credits: number;
  duration: number;
  max_students: number;
  prerequisites: string;
  syllabus: string;
  fees: number;
  status: CourseStatus;
  start_date: string;
  end_date: string;
  batch_code: string;
  academic_year: string;
  academic_term: string;
  notes: string;
  tags: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DepartmentFormData {
  code: string;
  name: string;
  description: string;
  head_id: number;
  parent_id?: number;
  budget: number;
  location: string;
  phone: string;
  email: string;
  website: string;
  established_date: string;
  status: DepartmentStatus;
  objectives: string;
  notes: string;
  is_active: boolean;
}

export interface ExamFormData {
  name: string;
  code: string;
  description: string;
  course_id: number;
  subject_id: number;
  faculty_id: number;
  type: ExamType;
  status: ExamStatus;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  duration: number;
  total_marks: number;
  passing_marks: number;
  instructions: string;
  venue: string;
  batch_id: number;
  semester: number;
  academic_year: string;
  academic_term: string;
  notes: string;
  is_published: boolean;
  allow_calculator: boolean;
  allow_books: boolean;
  is_active: boolean;
}

export interface FacultyFormData {
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  date_of_birth: string;
  gender: string;
  qualification: string;
  experience: number;
  specialization: string;
  department: FacultyDepartment;
  designation: string;
  joining_date: string;
  salary: number;
  status: FacultyStatus;
  emergency_contact: string;
  blood_group: string;
  photo_url: string;
  resume_url: string;
  notes: string;
}

export interface TimetableFormData {
  name: string;
  description: string;
  type: string;
  startDate?: Date;
  endDate?: Date;
  courseId: string;
  facultyId: string;
  classroomId: string;
  sessions: TimetableSession[];
}

export interface TimetableSession {
  startTime: string;
  endTime: string;
  facultyId: string;
  classroomId: string;
  dayOfWeek: string;
  subjectId: string;
}
