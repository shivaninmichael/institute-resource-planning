// Course Types
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type CourseStatus = 'active' | 'inactive' | 'completed' | 'cancelled' | 'draft';

// Exam Types
export type ExamType = 'midterm' | 'final' | 'quiz' | 'assignment' | 'practical' | 'viva';

export type ExamStatus = 'draft' | 'scheduled' | 'ongoing' | 'completed' | 'cancelled';

// Faculty Types
export type FacultyDepartment = 'computer_science' | 'mathematics' | 'physics' | 'chemistry' | 'biology' | 'english' | 'history' | 'economics' | 'engineering' | 'medicine';

export type FacultyStatus = 'active' | 'inactive' | 'on_leave' | 'terminated';

// Department Types
export type DepartmentStatus = 'active' | 'inactive' | 'archived';

// Classroom Types
export interface Classroom {
  id: number;
  name: string;
  code: string;
  capacity: number;
  building: string;
  floor: number;
  type: string;
  status: string;
  facilities: string[];
  created_at: string;
  updated_at: string;
}
