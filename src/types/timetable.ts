export type TimetableStatus = 'active' | 'draft' | 'archived' | 'conflict';
export type TimetableType = 'regular' | 'exam' | 'special';

interface Course {
  id: string;
  name: string;
}

interface Faculty {
  id: string;
  name: string;
}

interface Classroom {
  id: string;
  name: string;
}

export interface Timetable {
  id: string;
  name: string;
  type: TimetableType;
  status: TimetableStatus;
  course?: Course;
  faculty?: Faculty;
  classroom?: Classroom;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}