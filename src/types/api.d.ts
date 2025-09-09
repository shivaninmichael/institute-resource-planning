import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Department, Course, Faculty, Student, Hostel, Room, Alumni, Fee, Exam, Attendance, Activity } from './index';

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiClient extends Record<string, any> {
  client: AxiosInstance;
  token: string | null;

  // Core Methods
  setToken(token: string): void;
  clearToken(): void;
  request<T = any>(config: AxiosRequestConfig): Promise<T>;
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  upload<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T>;
  download(url: string, filename?: string): Promise<void>;

  // Module APIs
  hostel: {
    getAllHostels(): Promise<ApiResponse<Hostel[]>>;
    getHostelById(id: number): Promise<ApiResponse<Hostel>>;
    createHostel(data: Partial<Hostel>): Promise<ApiResponse<Hostel>>;
    updateHostel(id: number, data: Partial<Hostel>): Promise<ApiResponse<Hostel>>;
    deleteHostel(id: number): Promise<ApiResponse<void>>;
    getRooms(hostelId: number): Promise<ApiResponse<Room[]>>;
    assignRoom(roomId: number, studentId: number): Promise<ApiResponse<Room>>;
    getAllRoomCategories(): Promise<ApiResponse<any[]>>;
    createRoom(data: any): Promise<ApiResponse<any>>;
    updateRoom(id: number, data: any): Promise<ApiResponse<any>>;
  };

  alumni: {
    getAllAlumni(): Promise<ApiResponse<Alumni[]>>;
    getAlumniById(id: number): Promise<ApiResponse<Alumni>>;
    createAlumni(data: Partial<Alumni>): Promise<ApiResponse<Alumni>>;
    updateAlumni(id: number, data: Partial<Alumni>): Promise<ApiResponse<Alumni>>;
    deleteAlumni(id: number): Promise<ApiResponse<void>>;
    getMentorshipPrograms(alumniId: number): Promise<ApiResponse<any[]>>;
    createMentorshipProgram(data: any): Promise<ApiResponse<any>>;
    updateMentorshipProgram(id: number, data: any): Promise<ApiResponse<any>>;
  } & {
    [key: string]: (...args: any[]) => Promise<any>;
  };

  students: {
    getAllStudents(): Promise<ApiResponse<Student[]>>;
    getStudentById(id: number): Promise<ApiResponse<Student>>;
    createStudent(data: Partial<Student>): Promise<ApiResponse<Student>>;
    updateStudent(id: number, data: Partial<Student>): Promise<ApiResponse<Student>>;
    deleteStudent(id: number): Promise<ApiResponse<void>>;
    getAttendance(studentId: number): Promise<ApiResponse<Attendance[]>>;
    getFees(studentId: number): Promise<ApiResponse<Fee[]>>;
    getExams(studentId: number): Promise<ApiResponse<Exam[]>>;
  };

  faculty: {
    getAllFaculty(): Promise<ApiResponse<Faculty[]>>;
    getFacultyById(id: number): Promise<ApiResponse<Faculty>>;
    createFaculty(data: Partial<Faculty>): Promise<ApiResponse<Faculty>>;
    updateFaculty(id: number, data: Partial<Faculty>): Promise<ApiResponse<Faculty>>;
    deleteFaculty(id: number): Promise<ApiResponse<void>>;
    getDepartments(facultyId: number): Promise<ApiResponse<Department[]>>;
    getCourses(facultyId: number): Promise<ApiResponse<Course[]>>;
  };

  attendance: {
    getAttendanceRegisters(): Promise<ApiResponse<Attendance[]>>;
    getAttendanceSheet(id: number): Promise<ApiResponse<Attendance>>;
    createAttendanceSheet(data: Partial<Attendance>): Promise<ApiResponse<Attendance>>;
    markAttendance(sheetId: number, data: any): Promise<ApiResponse<void>>;
    getAttendanceReport(params: any): Promise<ApiResponse<any>>;
    getStudentAttendance(studentId: number): Promise<ApiResponse<Attendance[]>>;
    getFacultyAttendance(facultyId: number): Promise<ApiResponse<Attendance[]>>;
  };

  activities: {
    getAllActivities(): Promise<ApiResponse<Activity[]>>;
    getActivityById(id: number): Promise<ApiResponse<Activity>>;
    createActivity(data: Partial<Activity>): Promise<ApiResponse<Activity>>;
    updateActivity(id: number, data: Partial<Activity>): Promise<ApiResponse<Activity>>;
    deleteActivity(id: number): Promise<ApiResponse<void>>;
    getParticipants(activityId: number): Promise<ApiResponse<Student[]>>;
  };
}