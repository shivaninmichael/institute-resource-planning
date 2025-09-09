// Common Types
export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled';
export type Role = 'admin' | 'faculty' | 'student' | 'staff';
export type ResourceType = 'course' | 'exam' | 'attendance' | 'fee' | 'hostel' | 'activity';
export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'manage';

// Attendance Types
export interface Attendance {
  id: number;
  student_id: number;
  course_id: number;
  date: string;
  status: 'present' | 'absent' | 'late';
  time_in?: string;
  time_out?: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
  
  // Related data
  student?: {
    id: number;
    name: string;
    roll_number: string;
  };
  course?: {
    id: number;
    name: string;
    code: string;
  };
}

// Exam Types
export interface Exam {
  id: number;
  title: string;
  description: string;
  course_id: number;
  exam_date: string;
  duration: number;
  max_marks: number;
  passing_marks: number;
  type: 'midterm' | 'final' | 'quiz' | 'assignment';
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  
  // Related data
  course?: {
    id: number;
    name: string;
    code: string;
  };
  results?: ExamResult[];
  enrolled_students?: number;
}

// Faculty Types
export interface Faculty {
  id: number;
  name: string;
  employee_id: string;
  department_id: number;
  qualification: string;
  specialization?: string;
  experience?: number;
  position: string;
  email: string;
  phone?: string;
  joining_date: string;
  status: Status;
  created_at: string;
  updated_at: string;
  
  // Related data
  department?: Department;
  courses?: Course[];
}

// Fee Types
export interface Fee {
  id: number;
  name: string;
  student_id: number;
  course_id: number;
  amount: number;
  paid_amount: number;
  due_date: string;
  payment_date?: string;
  payment_method?: string;
  transaction_id?: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  category: string;
  type: string;
  created_at: string;
  updated_at: string;
  
  // Related data
  student?: {
    id: number;
    name: string;
    roll_number: string;
  };
  course?: {
    id: number;
    name: string;
    code: string;
  };
}

// Activity Types
export interface Activity {
  id: number;
  title: string;
  description: string;
  type: 'academic' | 'cultural' | 'sports' | 'other';
  start_date: string;
  end_date?: string;
  location?: string;
  max_participants?: number;
  status: Status;
  created_at: string;
  updated_at: string;
  
  // Related data
  participants?: {
    id: number;
    name: string;
    role: string;
  }[];
  organizer?: {
    id: number;
    name: string;
    role: string;
  };
}

// Report Types
export interface Report {
  id: number;
  title: string;
  description: string;
  type: 'attendance' | 'exam' | 'fee' | 'activity';
  parameters?: Record<string, any>;
  generated_by: number;
  generated_at: string;
  format: 'pdf' | 'excel' | 'csv';
  status: 'pending' | 'generated' | 'failed';
  download_url?: string;
  created_at: string;
  updated_at: string;
}
