// =====================================================
// OpenEducat ERP Frontend - Type Definitions
// Comprehensive types for all entities and API responses
// =====================================================

// =====================================================
// API Response Types
// =====================================================

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'ASC' | 'DESC';
  filters?: Record<string, any>;
}

// =====================================================
// Authentication & User Types
// =====================================================

export interface MFAMethod {
  id: string;
  type: 'authenticator' | 'sms' | 'email';
  isEnabled: boolean;
  label?: string;
}

export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_admin: boolean;
  is_faculty: boolean;
  is_student: boolean;
  is_parent: boolean;
  company_id?: number;
  department_id?: number;
  active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
  mfa_methods?: MFAMethod[];
}

export interface UserCreateRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_admin?: boolean;
  is_faculty?: boolean;
  is_student?: boolean;
  is_parent?: boolean;
  company_id?: number;
  department_id?: number;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  user: Omit<User, 'password_hash'>;
  token: string;
  refreshToken: string;
  expires_in: number;
}

export interface JwtPayload {
  userId: number;
  email: string;
  isAdmin: boolean;
  isFaculty: boolean;
  isStudent: boolean;
  isParent: boolean;
  companyId?: number;
  departmentId?: number;
  iat: number;
  exp: number;
}

// =====================================================
// Student Types
// =====================================================

export interface Student {
  id: number;
  partner_id: number;
  user_id?: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  birth_date?: string;
  blood_group?: string;
  gender: 'm' | 'f' | 'o';
  nationality_id?: number;
  emergency_contact_id?: number;
  visa_info?: string;
  id_number?: string;
  gr_no?: string;
  category_id?: number;
  certificate_number?: string;
  library_card_id?: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  
  // Related data
  partner?: Partner;
  user?: User;
  nationality?: Country;
  emergency_contact?: Partner;
  category?: Category;
  library_card?: LibraryCard;
}

export interface StudentCreateRequest {
  first_name: string;
  middle_name?: string;
  last_name: string;
  birth_date?: string;
  blood_group?: string;
  gender: 'm' | 'f' | 'o';
  nationality_id?: number;
  emergency_contact_id?: number;
  visa_info?: string;
  id_number?: string;
  gr_no?: string;
  category_id?: number;
  certificate_number?: string;
  email?: string;
  phone?: string;
  address?: Address;
}

export interface StudentCourse {
  id: number;
  student_id: number;
  course_id: number;
  batch_id?: number;
  roll_number?: string;
  academic_year_id: number;
  academic_term_id: number;
  state: 'running' | 'finished';
  created_at: string;
  updated_at: string;
  
  // Related data
  student?: Student;
  course?: Course;
  batch?: Batch;
  academic_year?: AcademicYear;
  academic_term?: AcademicTerm;
}

export interface StudentCourseCreateRequest {
  student_id: number;
  course_id: number;
  batch_id?: number;
  roll_number?: string;
  academic_year_id?: number;
  academic_term_id?: number;
  state?: 'running' | 'finished';
  subject_ids?: number[];
}

// =====================================================
// Faculty Types
// =====================================================

export type FacultyStatus = 'active' | 'inactive' | 'terminated' | 'on_leave';

export type FacultyDepartment = 
  | 'computer_science' 
  | 'mathematics' 
  | 'physics' 
  | 'chemistry' 
  | 'biology' 
  | 'english' 
  | 'history' 
  | 'economics' 
  | 'engineering' 
  | 'medicine';

export interface Faculty {
  id: number;
  partner_id: number;
  user_id?: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  birth_date?: string;
  blood_group?: string;
  gender: 'male' | 'female';
  nationality_id?: number;
  emergency_contact_id?: number;
  visa_info?: string;
  id_number?: string;
  emp_id?: number;
  main_department_id?: number;
  joining_date?: string;
  status: FacultyStatus;
  created_at: string;
  updated_at: string;
  
  // Related data
  partner?: Partner;
  user?: User;
  nationality?: Country;
  emergency_contact?: Partner;
  main_department?: Department;
  subjects?: Subject[];
  departments?: Department[];
  
  // Additional properties found in components
  employee_id?: string;
  qualification?: string;
  email?: string;
  position?: string;
}

export interface FacultyCreateRequest {
  first_name: string;
  middle_name?: string;
  last_name: string;
  birth_date?: string;
  blood_group?: string;
  gender: 'male' | 'female';
  nationality_id?: number;
  emergency_contact_id?: number;
  visa_info?: string;
  id_number?: string;
  emp_id?: number;
  main_department_id?: number;
  joining_date?: string;
  email?: string;
  phone?: string;
  address?: Address;
  subject_ids?: number[];
  department_ids?: number[];
}

// =====================================================
// Course Types
// =====================================================

export type CourseStatus = 'active' | 'inactive' | 'completed' | 'cancelled';

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Course {
  id: number;
  name: string;
  code: string;
  parent_id?: number;
  evaluation_type?: 'normal' | 'GPA' | 'CWA' | 'CCE';
  max_unit_load?: number;
  min_unit_load?: number;
  department_id?: number;
  program_id?: number;
  fees_term_id?: number;
  status: CourseStatus;
  description?: string;
  duration?: number;
  duration_unit?: 'years' | 'months' | 'weeks';
  level?: CourseLevel;
  prerequisites?: string[];
  objectives?: string[];
  syllabus?: string;
  credits?: number;
  fee?: number;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  
  // Related data
  parent?: Course;
  department?: Department;
  program?: Program;
  fees_term?: FeesTerm;
  subjects?: Subject[];
  children?: Course[];
  instructor?: Faculty;
  enrolled_students?: number;
  assignments?: Assignment[];
  attendance_records?: Attendance[];
  studentsCount?: number;
  duration_hours?: number;
  max_students?: number;
  course_code?: string;
  course_name?: string;
}

export interface CourseCreateRequest {
  name: string;
  code: string;
  parent_id?: number;
  evaluation_type?: 'normal' | 'GPA' | 'CWA' | 'CCE';
  max_unit_load?: number;
  min_unit_load?: number;
  department_id?: number;
  program_id?: number;
  fees_term_id?: number;
  subject_ids?: number[];
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  type: 'theory' | 'practical' | 'both';
  credit_hours?: number;
  max_marks?: number;
  min_marks?: number;
  course_id?: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  
  // Related data
  course?: Course;
}

export interface Batch {
  id: number;
  name: string;
  code: string;
  course_id: number;
  start_date?: string;
  end_date?: string;
  max_strength?: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  
  // Related data
  course?: Course;
}

// =====================================================
// Department Types
// =====================================================

export type DepartmentStatus = 'active' | 'inactive' | 'archived';

export interface Department {
  id: number;
  name: string;
  code: string;
  parent_id?: number;
  company_id: number;
  manager_id?: number;
  status: DepartmentStatus;
  description?: string;
  established_date?: string;
  budget?: number;
  location?: string;
  phone?: string;
  email?: string;
  vision?: string;
  mission?: string;
  objectives?: string;
  created_at: string;
  updated_at: string;
  
  // Related data
  parent?: Department;
  company?: Company;
  manager?: Faculty;
  children?: Department[];
  courses?: Course[];
  faculty_count?: number;
  student_count?: number;
  total_faculty?: number;
  total_courses?: number;
  total_students?: number;
  head_name?: string;
  head_email?: string;
}

export interface DepartmentCreateRequest {
  name: string;
  code: string;
  parent_id?: number;
  company_id: number;
  manager_id?: number;
}

// =====================================================
// Academic Types
// =====================================================

export interface AcademicYear {
  id: number;
  name: string;
  code: string;
  start_date: string;
  end_date: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AcademicTerm {
  id: number;
  name: string;
  code: string;
  academic_year_id: number;
  start_date: string;
  end_date: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  
  // Related data
  academic_year?: AcademicYear;
}

// =====================================================
// Attendance Types
// =====================================================

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface Attendance {
  id: number;
  student_id: number;
  course_id: number;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
  created_at: string;
  updated_at: string;
  student?: Student;
  course?: Course;
  // Additional properties found in components
  class_id?: number;
  student_name?: string;
  course_code?: string;
  course_name?: string;
  time_in?: string;
  time_out?: string;
}

export interface AttendanceRegister {
  id: number;
  name: string;
  code: string;
  course_id: number;
  batch_id?: number;
  subject_id: number;
  academic_year_id: number;
  academic_term_id: number;
  faculty_id: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  
  // Related data
  course?: Course;
  batch?: Batch;
  subject?: Subject;
  academic_year?: AcademicYear;
  academic_term?: AcademicTerm;
  faculty?: Faculty;
}

export interface AttendanceSheet {
  id: number;
  register_id: number;
  session_id?: number;
  attendance_date: string;
  faculty_id: number;
  state: 'draft' | 'start' | 'done' | 'cancel';
  created_at: string;
  updated_at: string;
  
  // Related data
  register?: AttendanceRegister;
  session?: Session;
  faculty?: Faculty;
  attendance_lines?: AttendanceLine[];
}

export interface AttendanceLine {
  id: number;
  attendance_id: number;
  student_id: number;
  present: boolean;
  absent: boolean;
  excused: boolean;
  late: boolean;
  remark?: string;
  attendance_type_id?: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  
  // Related data
  attendance?: AttendanceSheet;
  student?: Student;
  attendance_type?: AttendanceType;
}

export interface AttendanceType {
  id: number;
  name: string;
  code: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// =====================================================
// Class Types
// =====================================================

export interface Class {
  id: number;
  name: string;
  code: string;
  course_id: number;
  instructor_id?: number;
  schedule: string;
  room?: string;
  capacity?: number;
  start_time: string;
  end_time: string;
  days: string[];
  semester: string;
  academic_year: string;
  status: 'active' | 'inactive' | 'completed' | 'cancelled';
  description?: string;
  created_at: string;
  updated_at: string;
  
  // Related data
  course?: Course;
  instructor?: Faculty;
  enrolled_students?: number;
}

export interface ClassCreateRequest {
  name: string;
  code: string;
  course_id: number;
  instructor_id?: number;
  schedule: string;
  room?: string;
  capacity?: number;
  start_time: string;
  end_time: string;
  days: string[];
  semester: string;
  academic_year: string;
  status?: 'active' | 'inactive' | 'completed' | 'cancelled';
  description?: string;
}

// =====================================================
// Examination Types
// =====================================================

export type ExamStatus = 'draft' | 'scheduled' | 'ongoing' | 'completed' | 'cancelled';

export interface ExamSession {
  id: number;
  name: string;
  course_id: number;
  batch_id: number;
  exam_code: string;
  start_date: string;
  end_date: string;
  exam_type_id: number;
  evaluation_type?: 'normal' | 'grade';
  venue_id?: number;
  state: ExamStatus;
  created_at: string;
  updated_at: string;
  
  // Related data
  course?: Course;
  batch?: Batch;
  exam_type?: ExamType;
  venue?: Venue;
  exams?: Exam[];
}

export interface Exam {
  id: number;
  name: string;
  session_id: number;
  subject_id: number;
  exam_code: string;
  start_time: string;
  end_time: string;
  total_marks: number;
  min_marks: number;
  note?: string;
  state: 'draft' | 'schedule' | 'held' | 'result_updated' | 'cancel' | 'done';
  created_at: string;
  updated_at: string;
  
  // Related data
  session?: ExamSession;
  subject?: Subject;
  responsible_faculty?: Faculty[];
  
  // Additional properties found in components
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  type?: ExamType | string;
  code?: string;
  course_code?: string;
  course_name?: string;
  exam_date?: string;
  duration?: number;
  enrolled_students?: number;
}

export interface ExamType {
  id: number;
  name: string;
  code: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExamResult {
  id: number;
  exam_id: number;
  student_id: number;
  marks: number;
  status?: 'present' | 'absent';
  note?: string;
  room_id?: number;
  created_at: string;
  updated_at: string;
  
  // Related data
  exam?: Exam;
  student?: Student;
  room?: Room;
}

// =====================================================
// Library Types
// =====================================================

export interface Media {
  id: number;
  name: string;
  isbn?: string;
  edition?: string;
  description?: string;
  internal_code?: string;
  media_type_id: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  
  // Related data
  media_type?: MediaType;
  authors?: Author[];
  publishers?: Publisher[];
  tags?: Tag[];
  courses?: Course[];
  subjects?: Subject[];
}

export interface MediaType {
  id: number;
  name: string;
  code: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MediaUnit {
  id: number;
  media_id: number;
  barcode?: string;
  state: 'available' | 'issued' | 'lost' | 'damaged';
  active: boolean;
  created_at: string;
  updated_at: string;
  
  // Related data
  media?: Media;
}

export interface MediaIssue {
  id: number;
  media_id: number;
  media_unit_id?: number;
  student_id?: number;
  faculty_id?: number;
  issue_date: string;
  due_date: string;
  return_date?: string;
  fine_amount?: number;
  note?: string;
  state: 'issued' | 'returned' | 'overdue' | 'lost';
  created_at: string;
  updated_at: string;
  
  // Related data
  media?: Media;
  media_unit?: MediaUnit;
  student?: Student;
  faculty?: Faculty;
}

// =====================================================
// Fees Types
// =====================================================

export interface FeesTerm {
  id: number;
  name: string;
  code: string;
  fees_terms?: 'fixed_days' | 'fixed_date';
  note?: string;
  company_id: number;
  no_days?: number;
  day_type?: 'before' | 'after';
  discount?: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  
  // Related data
  company?: Company;
}

export interface FeesDetail {
  id: number;
  student_id: number;
  fees_line_id?: number;
  course_id?: number;
  batch_id?: number;
  product_id?: number;
  amount: number;
  fees_factor?: number;
  discount?: number;
  date: string;
  state: 'draft' | 'invoice' | 'cancel';
  company_id: number;
  created_at: string;
  updated_at: string;
  
  // Related data
  student?: Student;
  fees_line?: FeesLine;
  course?: Course;
  batch?: Batch;
  product?: Product;
  company?: Company;
}

export interface FeesLine {
  id: number;
  name: string;
  code: string;
  fees_term_id: number;
  product_id?: number;
  amount: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  
  // Related data
  fees_term?: FeesTerm;
  product?: Product;
}

// =====================================================
// Assignment Types
// =====================================================

export interface Assignment {
  id: number;
  name: string;
  course_id: number;
  batch_id: number;
  subject_id: number;
  assignment_type_id: number;
  faculty_id: number;
  description?: string;
  marks: number;
  start_date: string;
  end_date: string;
  state: 'draft' | 'open' | 'close' | 'cancel';
  created_at: string;
  updated_at: string;
  
  // Related data
  course?: Course;
  batch?: Batch;
  subject?: Subject;
  assignment_type?: AssignmentType;
  faculty?: Faculty;
  
  // Additional properties found in components
  title?: string;
  courseId?: number;
  courseName?: string;
  maxMarks?: number;
  submissionsCount?: number;
  dueDate?: string;
  maxScore?: number;
  status?: string;
  submissions?: number;
  graded?: number;
}

export interface AssignmentType {
  id: number;
  name: string;
  code: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AssignmentSubmission {
  id: number;
  assignment_id: number;
  student_id: number;
  submission_date: string;
  description?: string;
  state: 'draft' | 'submit' | 'accept' | 'reject';
  marks?: number;
  remark?: string;
  created_at: string;
  updated_at: string;
  
  // Related data
  assignment?: Assignment;
  student?: Student;
}

// =====================================================
// Supporting Types
// =====================================================

export interface Partner {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  company_id: number;
  is_company: boolean;
  is_employee: boolean;
  is_student: boolean;
  is_faculty: boolean;
  is_parent: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
  
  // Related data
  company?: Company;
  address?: Address;
}

export interface Address {
  street?: string;
  street2?: string;
  city?: string;
  state_id?: number;
  country_id?: number;
  zip?: string;
  
  // Related data
  state?: State;
  country?: Country;
}

export interface Country {
  id: number;
  name: string;
  code: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface State {
  id: number;
  name: string;
  code: string;
  country_id: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  
  // Related data
  country?: Country;
}

export interface Company {
  id: number;
  name: string;
  code: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  code: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  code: string;
  list_price: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Author {
  id: number;
  name: string;
  code: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Publisher {
  id: number;
  name: string;
  code: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
  code: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Program {
  id: number;
  name: string;
  code: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Venue {
  id: number;
  name: string;
  code: string;
  capacity?: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: number;
  name: string;
  code: string;
  capacity?: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: number;
  name: string;
  code: string;
  course_id: number;
  batch_id: number;
  subject_id: number;
  faculty_id: number;
  start_time: string;
  end_time: string;
  day_of_week: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  
  // Related data
  course?: Course;
  batch?: Batch;
  subject?: Subject;
  faculty?: Faculty;
}

export interface LibraryCard {
  id: number;
  name: string;
  code: string;
  student_id: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  
  // Related data
  student?: Student;
}

// =====================================================
// Form Types
// =====================================================

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'multiselect' | 'date' | 'datetime' | 'textarea' | 'checkbox' | 'radio' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: { value: any; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  disabled?: boolean;
  hidden?: boolean;
  multiline?: boolean;
  rows?: number;
  accept?: string;
  multiple?: boolean;
}

export interface FormConfig {
  fields: FormField[];
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  initialValues?: Record<string, any>;
  loading?: boolean;
}

// =====================================================
// Table Types
// =====================================================

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: number | string;
  render?: (value: any, row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface TableConfig<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
  };
  sorting?: {
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
    onSort: (key: string) => void;
  };
  filtering?: {
    filters: Record<string, any>;
    onFilterChange: (filters: Record<string, any>) => void;
  };
  selection?: {
    selectedRows: T[];
    onSelectionChange: (selected: T[]) => void;
    selectable?: boolean;
  };
  actions?: {
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    onView?: (row: T) => void;
    customActions?: (row: T) => React.ReactNode;
  };
}

// =====================================================
// Chart Types
// =====================================================

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea';
  data: ChartData;
  options?: any;
  height?: number | string;
  width?: number | string;
}

// =====================================================
// Navigation Types
// =====================================================

export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType<any>;
  path?: string;
  children?: MenuItem[];
  permission?: { action: string; resource: string } | string;
  badge?: string | number;
  disabled?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  active?: boolean;
}

// =====================================================
// Notification Types
// =====================================================

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// =====================================================
// File Upload Types
// =====================================================

export interface FileUpload {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

export interface FileUploadConfig {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  onUpload: (files: File[]) => void;
  onError?: (error: string) => void;
}

// =====================================================
// Search Types
// =====================================================

export interface SearchResult<T = any> {
  data: T[];
  total: number;
  query: string;
  filters: Record<string, any>;
}

export interface SearchConfig {
  placeholder?: string;
  onSearch: (query: string, filters?: Record<string, any>) => void;
  filters?: {
    name: string;
    label: string;
    type: 'select' | 'date' | 'number' | 'boolean';
    options?: { value: any; label: string }[];
  }[];
  loading?: boolean;
}

// =====================================================
// Dashboard Types
// =====================================================

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'chart' | 'metric' | 'table' | 'list';
  data: any;
  config?: any;
  size?: 'small' | 'medium' | 'large';
  refreshable?: boolean;
  onRefresh?: () => void;
}

export interface DashboardConfig {
  widgets: DashboardWidget[];
  layout?: 'grid' | 'flexible';
  columns?: number;
  onWidgetUpdate?: (widgetId: string, data: any) => void;
}

// =====================================================
// Export all types
// =====================================================

// Import from auth types
import { PermissionAction, ResourceType } from './auth';

// =====================================================
// Additional Types for Components
// =====================================================

export interface Activity {
  id: string | number;
  title: string;
  name?: string;
  description: string;
  type: string;
  status: string;
  start_date: string;
  startDate?: string;
  location: string;
  participants: number | { id: number; name: string; role: string; }[];
  created_at: string;
  updated_at: string;
}

export interface Fee {
  id: string | number;
  name: string;
  student: string;
  studentId: number;
  studentName: string;
  course: string;
  amount: number;
  paid: number;
  paidAmount: number;
  dueDate: string;
  status: string;
  category: string;
  feeType: string;
  createdAt: string;
}

export interface MaintenanceRequest {
  id: number;
  title?: string;
  description: string;
  hostel_id: number;
  room_id: number;
  priority: string;
  status: string;
  requested_date: string;
  completed_date?: string;
  estimated_cost?: number;
  actual_cost?: number;
  assigned_to?: string;
  notes?: string;
}

export interface RoomAllocation {
  id: number;
  room_id: number;
  student_id: number;
  allocation_date: string;
  deallocation_date?: string;
  status: string;
}

export interface VisitorLog {
  id: number;
  visitor_name: string;
  visitor_phone: string;
  hostel_id: number;
  student_id: number;
  purpose: string;
  check_in_time: string;
  check_out_time?: string;
  status: string;
}

export interface Hostel {
  id: number;
  name: string;
  code: string;
  type: string;
  capacity: number;
  address: string;
  description?: string;
  status: string;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
}

export interface Vehicle {
  id: number;
  vehicle_number: string;
  vehicle_type: string;
  capacity: number;
  driver_id?: number;
  route_id?: number;
  status: string;
}

export interface VehicleFormData {
  vehicle_number: string;
  vehicle_type: string;
  capacity: number;
  driver_id?: number;
  route_id?: number;
  status: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface Report {
  id: string;
  name: string;
  description: string;
  type: string;
  parameters: any;
  createdAt: string;
}

export interface Timetable {
  id: number;
  name: string;
  description: string;
  type: string;
  startDate: Date | null;
  endDate: Date | null;
  courseId: string;
  facultyId: string;
  classroomId: string;
  sessions?: TimetableSession[];
}

export interface TimetableSession {
  startTime: string;
  endTime: string;
  facultyId: string;
  classroomId: string;
  dayOfWeek: string;
  subjectId: string;
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

// Export all interfaces and types
export * from './auth';
