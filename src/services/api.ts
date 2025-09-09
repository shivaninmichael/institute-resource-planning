
// =====================================================
// OpenEducat ERP Frontend - API Service Layer
// Centralized API communication with backend
// =====================================================

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

// =====================================================
// API Configuration
// =====================================================

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const USE_SUPABASE_AUTH = process.env.REACT_APP_USE_SUPABASE_AUTH === 'true';
const API_TIMEOUT = 30000; // 30 seconds

// =====================================================
// API Client Setup
// =====================================================

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.loadToken();
  }

  // Setup request/response interceptors
  private setupInterceptors(): void {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors globally
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        this.handleApiError(error);
        return Promise.reject(error);
      }
    );
  }

  // Load token from localStorage
  private loadToken(): void {
    this.token = localStorage.getItem('auth_token');
  }

  // Set authentication token
  public setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  // Clear authentication token
  public clearToken(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Handle API errors globally
  private handleApiError(error: any): void {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          this.clearToken();
          window.location.href = '/login';
          toast.error('Session expired. Please login again.');
          break;
        
        case 403:
          toast.error('Access denied. Insufficient permissions.');
          break;
        
        case 404:
          toast.error('Resource not found.');
          break;
        
        case 422:
          // Validation errors
          if (data.errors) {
            Object.values(data.errors).forEach((errorArray: any) => {
              if (Array.isArray(errorArray)) {
                errorArray.forEach((errorMsg: string) => {
                  toast.error(errorMsg);
                });
              }
            });
          } else {
            toast.error(data.message || 'Validation failed');
          }
          break;
        
        case 429:
          toast.error('Too many requests. Please try again later.');
          break;
        
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        
        default:
          toast.error(data.message || 'An error occurred');
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An unexpected error occurred');
    }
  }

  // Generic request method
  public async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.request(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // GET request
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  // POST request
  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  // PUT request
  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  // PATCH request
  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  // DELETE request
  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  // Upload file
  public async upload<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<T>({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }

  // Download file
  public async download(url: string, filename?: string): Promise<void> {
    try {
      const response = await this.client.get(url, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      toast.error('Download failed');
      throw error;
    }
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// =====================================================
// Authentication API
// =====================================================

export const authApi = {
  // Login
  login: async (credentials: { email: string; password: string }) => {
    return apiClient.post('/auth/login', credentials);
  },

  // Register
  register: async (userData: any) => {
    return apiClient.post('/auth/register', userData);
  },

  // Logout
  logout: async () => {
    return apiClient.post('/auth/logout');
  },

  // Refresh token
  refreshToken: async (refreshToken: string) => {
    return apiClient.post('/auth/refresh-token', { refreshToken });
  },

  // Get profile
  getProfile: async () => {
    return apiClient.get('/auth/profile');
  },

  // Update profile
  updateProfile: async (data: any) => {
    return apiClient.put('/auth/profile', data);
  },

  // Change password
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    return apiClient.post('/auth/change-password', data);
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    return apiClient.post('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: async (data: { resetToken: string; newPassword: string }) => {
    return apiClient.post('/auth/reset-password', data);
  },

  // Verify token
  verifyToken: async () => {
    return apiClient.post('/auth/verify-token');
  },
};

// =====================================================
// Student API
// =====================================================

export const studentApi = {
  // Get all students
  getStudents: async (params?: any) => {
    return apiClient.get('/students', { params });
  },

  // Get student by ID
  getStudent: async (id: number) => {
    return apiClient.get(`/students/${id}`);
  },

  // Create student
  createStudent: async (data: any) => {
    return apiClient.post('/students', data);
  },

  // Update student
  updateStudent: async (id: number, data: any) => {
    return apiClient.put(`/students/${id}`, data);
  },

  // Delete student
  deleteStudent: async (id: number) => {
    return apiClient.delete(`/students/${id}`);
  },

  // Search students
  searchStudents: async (query: string, filters?: any) => {
    return apiClient.get('/students/search', { params: { q: query, ...filters } });
  },

  // Enroll in course
  enrollInCourse: async (data: any) => {
    return apiClient.post('/students/enroll', data);
  },

  // Get student courses
  getStudentCourses: async (studentId: number) => {
    return apiClient.get(`/students/${studentId}/courses`);
  },

  // Get attendance summary
  getAttendanceSummary: async (studentId: number, filters?: any) => {
    return apiClient.get(`/students/${studentId}/attendance`, { params: filters });
  },

  // Get exam results
  getExamResults: async (studentId: number, filters?: any) => {
    return apiClient.get(`/students/${studentId}/exams`, { params: filters });
  },

  // Get academic performance
  getAcademicPerformance: async (studentId: number) => {
    return apiClient.get(`/students/${studentId}/performance`);
  },

  // Get student dashboard
  getStudentDashboard: async (studentId: number) => {
    return apiClient.get(`/students/${studentId}/dashboard`);
  },

  // Bulk create students
  bulkCreateStudents: async (data: any[]) => {
    return apiClient.post('/students/bulk', { students: data });
  },

  // Transfer student
  transferStudent: async (studentId: number, data: any) => {
    return apiClient.post(`/students/${studentId}/transfer`, data);
  },

  // Get students by course
  getStudentsByCourse: async (courseId: number, batchId?: number) => {
    return apiClient.get(`/students/course/${courseId}`, { params: { batch_id: batchId } });
  },

  // Get students by faculty
  getStudentsByFaculty: async (facultyId: number) => {
    return apiClient.get(`/students/faculty/${facultyId}`);
  },

  // Generate ID card
  generateIdCard: async (studentId: number) => {
    return apiClient.get(`/students/${studentId}/id-card`);
  },

  // Get student statistics
  getStudentStats: async () => {
    return apiClient.get('/students/stats');
  },
};

// =====================================================
// Faculty API
// =====================================================

export const facultyApi = {
  // Get all faculty
  getFaculty: async (params?: any) => {
    return apiClient.get('/faculty', { params });
  },

  // Get faculty by ID
  getFacultyById: async (id: number) => {
    return apiClient.get(`/faculty/${id}`);
  },

  // Create faculty
  createFaculty: async (data: any) => {
    return apiClient.post('/faculty', data);
  },

  // Update faculty
  updateFaculty: async (id: number, data: any) => {
    return apiClient.put(`/faculty/${id}`, data);
  },

  // Delete faculty
  deleteFaculty: async (id: number) => {
    return apiClient.delete(`/faculty/${id}`);
  },

  // Search faculty
  searchFaculty: async (query: string, filters?: any) => {
    return apiClient.get('/faculty/search', { params: { q: query, ...filters } });
  },

  // Get faculty by department
  getFacultyByDepartment: async (departmentId: number) => {
    return apiClient.get(`/faculty/department/${departmentId}`);
  },

  // Get faculty subjects
  getFacultySubjects: async (facultyId: number) => {
    return apiClient.get(`/faculty/${facultyId}/subjects`);
  },

  // Get faculty dashboard
  getFacultyDashboard: async (facultyId: number) => {
    return apiClient.get(`/faculty/${facultyId}/dashboard`);
  },

  // Get faculty courses
  getFacultyCourses: async (facultyId: string) => {
    return apiClient.get(`/faculty/${facultyId}/courses`);
  },

  // Alias for form compatibility
  getCourses: async (params?: any) => {
    return apiClient.get('/faculty', { params });
  },

  // Get assignments
  getAssignments: async (facultyId: string, params?: any) => {
    return apiClient.get(`/faculty/${facultyId}/assignments`, { params });
  },

  // Create assignment
  createAssignment: async (data: any) => {
    return apiClient.post('/assignments', data);
  },

  // Update assignment
  updateAssignment: async (id: string, data: any) => {
    return apiClient.put(`/assignments/${id}`, data);
  },

  // Delete assignment
  deleteFacultyAssignment: async (id: string) => {
    return apiClient.delete(`/assignments/${id}`);
  },

  // Get assignment submissions
  getAssignmentSubmissions: async (assignmentId: string) => {
    return apiClient.get(`/assignments/${assignmentId}/submissions`);
  },

  // Grade submission
  gradeSubmission: async (submissionId: string, data: any) => {
    return apiClient.put(`/submissions/${submissionId}/grade`, data);
  },

  // Get course exams
  getCourseExams: async (courseId: string) => {
    return apiClient.get(`/courses/${courseId}/exams`);
  },

  // Get exam grades
  getExamGrades: async (examId: string) => {
    return apiClient.get(`/exams/${examId}/grades`);
  },

  // Save grades
  saveGrades: async (examId: string, grades: any[]) => {
    return apiClient.put(`/exams/${examId}/grades`, { grades });
  },

  // Publish grades
  publishGrades: async (examId: string) => {
    return apiClient.post(`/exams/${examId}/publish-grades`);
  },

  // Get attendance for date
  getAttendanceForDate: async (courseId: string, date: string) => {
    return apiClient.get(`/attendance/course/${courseId}/date/${date}`);
  },

  // Mark attendance
  markAttendance: async (data: any) => {
    return apiClient.post('/attendance/mark', data);
  },
};

// =====================================================
// Course API
// =====================================================

export const courseApi = {
  // Get all courses
  getCourses: async (params?: any) => {
    return apiClient.get('/courses', { params });
  },

  // Get course by ID
  getCourse: async (id: number) => {
    return apiClient.get(`/courses/${id}`);
  },

  // Create course
  createCourse: async (data: any) => {
    return apiClient.post('/courses', data);
  },

  // Update course
  updateCourse: async (id: number, data: any) => {
    return apiClient.put(`/courses/${id}`, data);
  },

  // Delete course
  deleteCourse: async (id: number) => {
    return apiClient.delete(`/courses/${id}`);
  },

  // Search courses
  searchCourses: async (query: string, filters?: any) => {
    return apiClient.get('/courses/search', { params: { q: query, ...filters } });
  },

  // Get course subjects
  getCourseSubjects: async (courseId: number) => {
    return apiClient.get(`/courses/${courseId}/subjects`);
  },

  // Get course batches
  getCourseBatches: async (courseId: number) => {
    return apiClient.get(`/courses/${courseId}/batches`);
  },

  // Get course students
  getCourseStudents: async (courseId: number, batchId?: number) => {
    return apiClient.get(`/courses/${courseId}/students`, { params: { batch_id: batchId } });
  },
};

// =====================================================
// Department API
// =====================================================

export const departmentApi = {
  // Get all departments
  getDepartments: async (params?: any) => {
    return apiClient.get('/departments', { params });
  },

  // Get department by ID
  getDepartment: async (id: number) => {
    return apiClient.get(`/departments/${id}`);
  },

  // Create department
  createDepartment: async (data: any) => {
    return apiClient.post('/departments', data);
  },

  // Update department
  updateDepartment: async (id: number, data: any) => {
    return apiClient.put(`/departments/${id}`, data);
  },

  // Delete department
  deleteDepartment: async (id: number) => {
    return apiClient.delete(`/departments/${id}`);
  },

  // Get department hierarchy
  getDepartmentHierarchy: async () => {
    return apiClient.get('/departments/hierarchy');
  },

  // Get department faculty
  getDepartmentFaculty: async (departmentId: number) => {
    return apiClient.get(`/departments/${departmentId}/faculty`);
  },
};

// =====================================================
// Attendance API
// =====================================================

export const attendanceApi = {
  // Get attendance registers
  getAttendanceRegisters: async (params?: any) => {
    return apiClient.get('/attendance/registers', { params });
  },

  // Get attendance sheet
  getAttendanceSheet: async (id: number) => {
    return apiClient.get(`/attendance/sheets/${id}`);
  },

  // Create attendance sheet
  createAttendanceSheet: async (data: any) => {
    return apiClient.post('/attendance/sheets', data);
  },

  // Mark attendance
  markAttendance: async (sheetId: number, data: any) => {
    return apiClient.post(`/attendance/sheets/${sheetId}/mark`, data);
  },

  // Get attendance report
  getAttendanceReport: async (params: any) => {
    return apiClient.get('/attendance/report', { params });
  },

  // Get student attendance
  getStudentAttendance: async (studentId: number, params?: any) => {
    return apiClient.get(`/attendance/students/${studentId}`, { params });
  },

  // Delete attendance sheet
  deleteAttendanceSheet: async (id: number) => {
    return apiClient.delete(`/attendance/sheets/${id}`);
  },
};

// =====================================================
// Examination API
// =====================================================

export const examApi = {
  // Get exam sessions
  getExamSessions: async (params?: any) => {
    return apiClient.get('/exams/sessions', { params });
  },

  // Get exam session
  getExamSession: async (id: number) => {
    return apiClient.get(`/exams/sessions/${id}`);
  },

  // Create exam session
  createExamSession: async (data: any) => {
    return apiClient.post('/exams/sessions', data);
  },

  // Update exam session
  updateExamSession: async (id: number, data: any) => {
    return apiClient.put(`/exams/sessions/${id}`, data);
  },

  // Get exams
  getExams: async (params?: any) => {
    return apiClient.get('/exams', { params });
  },

  // Get exam
  getExam: async (id: number) => {
    return apiClient.get(`/exams/${id}`);
  },

  // Create exam
  createExam: async (data: any) => {
    return apiClient.post('/exams', data);
  },

  // Update exam
  updateExam: async (id: number, data: any) => {
    return apiClient.put(`/exams/${id}`, data);
  },

  // Mark exam results
  markExamResults: async (examId: number, data: any) => {
    return apiClient.post(`/exams/${examId}/results`, data);
  },

  // Get exam results
  getExamResults: async (examId: number) => {
    return apiClient.get(`/exams/${examId}/results`);
  },

  // Get exam statistics
  getExamStats: async (params?: any) => {
    return apiClient.get('/exams/stats', { params });
  },

  // Delete exam session
  deleteExamSession: async (id: number) => {
    return apiClient.delete(`/exams/sessions/${id}`);
  },

  // Delete exam
  deleteExam: async (id: number) => {
    return apiClient.delete(`/exams/${id}`);
  },
};

// =====================================================
// Library API
// =====================================================

export const libraryApi = {
  // Get media
  getMedia: async (params?: any) => {
    return apiClient.get('/library/media', { params });
  },

  // Get media by ID
  getMediaById: async (id: number) => {
    return apiClient.get(`/library/media/${id}`);
  },

  // Create media
  createMedia: async (data: any) => {
    return apiClient.post('/library/media', data);
  },

  // Update media
  updateMedia: async (id: number, data: any) => {
    return apiClient.put(`/library/media/${id}`, data);
  },

  // Delete media
  deleteMedia: async (id: number) => {
    return apiClient.delete(`/library/media/${id}`);
  },

  // Search media
  searchMedia: async (query: string, filters?: any) => {
    return apiClient.get('/library/media/search', { params: { q: query, ...filters } });
  },

  // Issue media
  issueMedia: async (data: any) => {
    return apiClient.post('/library/issues', data);
  },

  // Return media
  returnMedia: async (issueId: number) => {
    return apiClient.post(`/library/issues/${issueId}/return`);
  },

  // Get media issues
  getMediaIssues: async (params?: any) => {
    return apiClient.get('/library/issues', { params });
  },

  // Get overdue media
  getOverdueMedia: async () => {
    return apiClient.get('/library/overdue');
  },
};

// =====================================================
// Fees API
// =====================================================

export const feesApi = {
  // Get fees terms
  getFeesTerms: async (params?: any) => {
    return apiClient.get('/fees/terms', { params });
  },

  // Get fees term
  getFeesTerm: async (id: number) => {
    return apiClient.get(`/fees/terms/${id}`);
  },

  // Create fees term
  createFeesTerm: async (data: any) => {
    return apiClient.post('/fees/terms', data);
  },

  // Update fees term
  updateFeesTerm: async (id: number, data: any) => {
    return apiClient.put(`/fees/terms/${id}`, data);
  },

  // Delete fees term
  deleteFeesTerm: async (id: number) => {
    return apiClient.delete(`/fees/terms/${id}`);
  },

  // Get fees details
  getFeesDetails: async (params?: any) => {
    return apiClient.get('/fees/details', { params });
  },

  // Create fees detail
  createFeesDetail: async (data: any) => {
    return apiClient.post('/fees/details', data);
  },

  // Update fees detail
  updateFeesDetail: async (id: number, data: any) => {
    return apiClient.put(`/fees/details/${id}`, data);
  },

  // Get student fees
  getStudentFees: async (studentId: number) => {
    return apiClient.get(`/fees/students/${studentId}`);
  },

  // Get fees report
  getFeesReport: async (params: any) => {
    return apiClient.get('/fees/report', { params });
  },
};

// =====================================================
// Assignment API
// =====================================================

export const assignmentApi = {
  // Get assignments
  getAssignments: async (params?: any) => {
    return apiClient.get('/assignments', { params });
  },

  // Get assignment
  getAssignment: async (id: number) => {
    return apiClient.get(`/assignments/${id}`);
  },

  // Create assignment
  createAssignment: async (data: any) => {
    return apiClient.post('/assignments', data);
  },

  // Update assignment
  updateAssignment: async (id: number, data: any) => {
    return apiClient.put(`/assignments/${id}`, data);
  },

  // Delete assignment
  deleteAssignment: async (id: number) => {
    return apiClient.delete(`/assignments/${id}`);
  },

  // Get assignment submissions
  getSubmissions: async (assignmentId: number) => {
    return apiClient.get(`/assignments/${assignmentId}/submissions`);
  },

  // Submit assignment
  submitAssignment: async (assignmentId: number, data: any) => {
    return apiClient.post(`/assignments/${assignmentId}/submit`, data);
  },

  // Grade submission
  gradeSubmission: async (submissionId: number, data: any) => {
    return apiClient.put(`/assignments/submissions/${submissionId}/grade`, data);
  },
};

// =====================================================
// Common API
// =====================================================

export const commonApi = {
  // Get countries
  getCountries: async () => {
    return apiClient.get('/common/countries');
  },

  // Get states
  getStates: async (countryId: number) => {
    return apiClient.get(`/common/countries/${countryId}/states`);
  },

  // Get categories
  getCategories: async () => {
    return apiClient.get('/common/categories');
  },

  // Get academic years
  getAcademicYears: async () => {
    return apiClient.get('/common/academic-years');
  },

  // Get academic terms
  getAcademicTerms: async (yearId: number) => {
    return apiClient.get(`/common/academic-years/${yearId}/terms`);
  },

  // Get subjects
  getSubjects: async (params?: any) => {
    return apiClient.get('/common/subjects', { params });
  },

  // Get batches
  getBatches: async (params?: any) => {
    return apiClient.get('/common/batches', { params });
  },

  // Get venues
  getVenues: async () => {
    return apiClient.get('/common/venues');
  },

  // Get rooms
  getRooms: async () => {
    return apiClient.get('/common/rooms');
  },
};

// =====================================================
// Class API
// =====================================================

export const classApi = {
  // Get all classes
  getAll: async (params?: any) => {
    return apiClient.get('/classes', { params });
  },

  // Get class by ID
  getById: async (id: number) => {
    return apiClient.get(`/classes/${id}`);
  },

  // Create class
  create: async (data: any) => {
    return apiClient.post('/classes', data);
  },

  // Update class
  update: async (id: number, data: any) => {
    return apiClient.put(`/classes/${id}`, data);
  },

  // Delete class
  delete: async (id: number) => {
    return apiClient.delete(`/classes/${id}`);
  },

  // Get classes by course
  getByCourse: async (courseId: string) => {
    return apiClient.get(`/classes/course/${courseId}`);
  },

  // Get class schedule
  getSchedule: async (classId: number, params?: any) => {
    return apiClient.get(`/classes/${classId}/schedule`, { params });
  },

  // Get class attendance
  getAttendance: async (classId: number, params?: any) => {
    return apiClient.get(`/classes/${classId}/attendance`, { params });
  },

  // Get enrolled students
  getStudents: async (classId: number) => {
    return apiClient.get(`/classes/${classId}/students`);
  },
};

// =====================================================
// Export all APIs
// =====================================================

// =====================================================
// Admin API
// =====================================================

export const adminApi = {
  getAdminDashboard: (id: string) => apiClient.get(`/admin/${id}/dashboard`),
  getAllUsers: () => apiClient.get('/admin/users'),
  createUser: (data: any) => apiClient.post('/admin/users', data),
  updateUser: (id: string, data: any) => apiClient.put(`/admin/users/${id}`, data),
  deleteUser: (id: string) => apiClient.delete(`/admin/users/${id}`),
  getAllRoles: () => apiClient.get('/admin/roles'),
  createRole: (data: any) => apiClient.post('/admin/roles', data),
  updateRole: (id: string, data: any) => apiClient.put(`/admin/roles/${id}`, data),
  deleteRole: (id: string) => apiClient.delete(`/admin/roles/${id}`),
  getSystemSettings: () => apiClient.get('/admin/settings'),
  updateSystemSettings: (data: any) => apiClient.put('/admin/settings', data),
  getSystemStats: () => apiClient.get('/admin/stats'),
};

// =====================================================
// Reports API
// =====================================================

export const reportsApi = {
  getAvailableReports: () => apiClient.get('/reports'),
  generateReport: (reportId: string, parameters: any) => 
    apiClient.post(`/reports/${reportId}/generate`, parameters),
  exportReport: (reportId: string, format: string, parameters: any) =>
    apiClient.post(`/reports/${reportId}/export/${format}`, parameters, {
      responseType: 'blob',
    }),
  getReportHistory: (reportId: string) => apiClient.get(`/reports/${reportId}/history`),
  saveReportTemplate: (data: any) => apiClient.post('/reports/templates', data),
  getReportTemplates: () => apiClient.get('/reports/templates'),
};

// =====================================================
// Notifications API
// =====================================================

export const notificationsApi = {
  getAll: () => apiClient.get('/notifications'),
  send: (data: any) => apiClient.post('/notifications/send', data),
  getById: (id: string) => apiClient.get(`/notifications/${id}`),
  delete: (id: string) => apiClient.delete(`/notifications/${id}`),
  markAsRead: (id: string) => apiClient.put(`/notifications/${id}/read`),
  getTemplates: () => apiClient.get('/notifications/templates'),
  createTemplate: (data: any) => apiClient.post('/notifications/templates', data),
  updateTemplate: (id: string, data: any) => apiClient.put(`/notifications/templates/${id}`, data),
  deleteTemplate: (id: string) => apiClient.delete(`/notifications/templates/${id}`),
  getRecipients: () => apiClient.get('/notifications/recipients'),
  getSettings: () => apiClient.get('/notifications/settings'),
  updateSettings: (data: any) => apiClient.put('/notifications/settings', data),
};

// =====================================================
// Files API
// =====================================================

export const filesApi = {
  getFiles: (folderId: string = 'root') => apiClient.get(`/files?folder=${folderId}`),
  uploadFile: (formData: FormData, onProgress?: (progress: any) => void) => {
    // Create a custom axios instance for file uploads with progress
    const uploadClient = axios.create({
      baseURL: API_BASE_URL,
      timeout: 0, // No timeout for file uploads
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
    
    return uploadClient.post('/files/upload', formData, {
      onUploadProgress: onProgress,
    });
  },
  downloadFile: (fileId: string) => apiClient.get(`/files/${fileId}/download`, {
    responseType: 'blob',
  }),
  deleteFile: (fileId: string) => apiClient.delete(`/files/${fileId}`),
  renameFile: (fileId: string, newName: string) => 
    apiClient.put(`/files/${fileId}/rename`, { name: newName }),
  createFolder: (data: { name: string; parentId: string }) => 
    apiClient.post('/files/folders', data),
  shareFile: (fileId: string, data: any) => apiClient.post(`/files/${fileId}/share`, data),
  getSharedFiles: () => apiClient.get('/files/shared'),
  getFilePermissions: (fileId: string) => apiClient.get(`/files/${fileId}/permissions`),
  updateFilePermissions: (fileId: string, permissions: any) => 
    apiClient.put(`/files/${fileId}/permissions`, permissions),
};

// =====================================================
// Import/Export API
// =====================================================

export const importExportApi = {
  // Import functionality
  getImportTemplates: () => apiClient.get('/import/templates'),
  downloadTemplate: (templateId: string) => apiClient.get(`/import/templates/${templateId}/download`, {
    responseType: 'blob',
  }),
  previewImportFile: (formData: FormData) => apiClient.post('/import/preview', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  validateImportData: (data: any) => apiClient.post('/import/validate', data),
  startImport: (formData: FormData) => apiClient.post('/import/start', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getImportJobs: () => apiClient.get('/import/jobs'),
  getImportJobStatus: (jobId: string) => apiClient.get(`/import/jobs/${jobId}`),
  cancelImportJob: (jobId: string) => apiClient.post(`/import/jobs/${jobId}/cancel`),
  
  // Export functionality
  startExport: (data: any) => apiClient.post('/export/start', data),
  getExportJobs: () => apiClient.get('/export/jobs'),
  getExportJobStatus: (jobId: string) => apiClient.get(`/export/jobs/${jobId}`),
  downloadExport: (jobId: string) => apiClient.get(`/export/jobs/${jobId}/download`, {
    responseType: 'blob',
  }),
  cancelExportJob: (jobId: string) => apiClient.post(`/export/jobs/${jobId}/cancel`),
};

// =====================================================
// Transportation Management API
// =====================================================

export const transportationAPI = {
  // Dashboard
  getDashboardStats: () => apiClient.get('/transportation/dashboard/stats'),

  // Vehicle Management
  getVehicles: () => apiClient.get('/transportation/vehicles'),
  getVehicle: (id: number) => apiClient.get(`/transportation/vehicles/${id}`),
  createVehicle: (data: any) => apiClient.post('/transportation/vehicles', data),
  updateVehicle: (id: number, data: any) => apiClient.put(`/transportation/vehicles/${id}`, data),
  deleteVehicle: (id: number) => apiClient.delete(`/transportation/vehicles/${id}`),

  // Driver Management
  getDrivers: () => apiClient.get('/transportation/drivers'),
  createDriver: (data: any) => apiClient.post('/transportation/drivers', data),

  // Route Management
  getRoutes: () => apiClient.get('/transportation/routes'),
  createRoute: (data: any) => apiClient.post('/transportation/routes', data),
  createRouteStop: (data: any) => apiClient.post('/transportation/routes/stops', data),

  // Student Transport
  getStudentTransports: () => apiClient.get('/transportation/student-transport'),
  createStudentTransport: (data: any) => apiClient.post('/transportation/student-transport', data),

  // Vehicle Maintenance
  getMaintenanceRecords: () => apiClient.get('/transportation/maintenance'),
  createMaintenanceRecord: (data: any) => apiClient.post('/transportation/maintenance', data),
  updateMaintenanceStatus: (id: number, status: string) => 
    apiClient.patch(`/transportation/maintenance/${id}/status`, { status }),

  // Vehicle Route Assignment
  getVehicleRouteAssignments: () => apiClient.get('/transportation/vehicle-routes'),
  createVehicleRouteAssignment: (data: any) => apiClient.post('/transportation/vehicle-routes', data),

  // Certificate Management
  certificate: {
    // Dashboard
    getDashboardStats: () => apiClient.get('/certificate/dashboard/stats'),

    // Certificate Types
    getAllCertificateTypes: (filters?: any) => apiClient.get('/certificate/types', { params: filters }),
    getCertificateTypeById: (id: number) => apiClient.get(`/certificate/types/${id}`),
    createCertificateType: (data: any) => apiClient.post('/certificate/types', data),
    updateCertificateType: (id: number, data: any) => apiClient.put(`/certificate/types/${id}`, data),
    deleteCertificateType: (id: number) => apiClient.delete(`/certificate/types/${id}`),

    // Certificate Templates
    getAllCertificateTemplates: (filters?: any) => apiClient.get('/certificate/templates', { params: filters }),
    getCertificateTemplateById: (id: number) => apiClient.get(`/certificate/templates/${id}`),
    createCertificateTemplate: (data: any) => apiClient.post('/certificate/templates', data),
    updateCertificateTemplate: (id: number, data: any) => apiClient.put(`/certificate/templates/${id}`, data),
    deleteCertificateTemplate: (id: number) => apiClient.delete(`/certificate/templates/${id}`),

    // Certificates
    getAllCertificates: (filters?: any) => apiClient.get('/certificate/certificates', { params: filters }),
    getCertificateById: (id: number) => apiClient.get(`/certificate/certificates/${id}`),
    getCertificateByNumber: (number: string) => apiClient.get(`/certificate/certificates/number/${number}`),
    createCertificate: (data: any) => apiClient.post('/certificate/certificates', data),
    updateCertificate: (id: number, data: any) => apiClient.put(`/certificate/certificates/${id}`, data),
    deleteCertificate: (id: number) => apiClient.delete(`/certificate/certificates/${id}`),

    // Certificate Verification
    verifyCertificate: (data: any) => apiClient.post('/certificate/verify', data),
    verifyCertificateByCode: (code: string) => apiClient.get(`/certificate/verify/${code}`),

    // Batch Operations
    createCertificateBatch: (data: any) => apiClient.post('/certificate/batches', data),
    processCertificateBatch: (id: number) => apiClient.post(`/certificate/batches/${id}/process`),

    // Public Verification (No Authentication)
    publicVerifyCertificate: (code: string) => apiClient.get(`/certificate/verify/${code}`),
  },

  // Alumni Management
  alumni: {
    // Dashboard
    getDashboardStats: () => apiClient.get('/alumni/dashboard/stats'),

    // Alumni Management
    getAllAlumni: (filters?: any) => apiClient.get('/alumni/alumni', { params: filters }),
    getAlumniById: (id: number) => apiClient.get(`/alumni/alumni/${id}`),
    createAlumni: (data: any) => apiClient.post('/alumni/alumni', data),
    updateAlumni: (id: number, data: any) => apiClient.put(`/alumni/alumni/${id}`, data),
    deleteAlumni: (id: number) => apiClient.delete(`/alumni/alumni/${id}`),

    // Alumni Events
    getAllAlumniEvents: (filters?: any) => apiClient.get('/alumni/events', { params: filters }),
    getAlumniEventById: (id: number) => apiClient.get(`/alumni/events/${id}`),
    createAlumniEvent: (data: any) => apiClient.post('/alumni/events', data),
    updateAlumniEvent: (id: number, data: any) => apiClient.put(`/alumni/events/${id}`, data),
    deleteAlumniEvent: (id: number) => apiClient.delete(`/alumni/events/${id}`),

    // Alumni Donations
    getAllAlumniDonations: (filters?: any) => apiClient.get('/alumni/donations', { params: filters }),
    getAlumniDonationById: (id: number) => apiClient.get(`/alumni/donations/${id}`),
    createAlumniDonation: (data: any) => apiClient.post('/alumni/donations', data),
    updateAlumniDonation: (id: number, data: any) => apiClient.put(`/alumni/donations/${id}`, data),
    deleteAlumniDonation: (id: number) => apiClient.delete(`/alumni/donations/${id}`),

    // Mentorship Programs
    getAllMentorshipPrograms: (filters?: any) => apiClient.get('/alumni/mentorship-programs', { params: filters }),
    getMentorshipProgramById: (id: number) => apiClient.get(`/alumni/mentorship-programs/${id}`),
    createMentorshipProgram: (data: any) => apiClient.post('/alumni/mentorship-programs', data),
    updateMentorshipProgram: (id: number, data: any) => apiClient.put(`/alumni/mentorship-programs/${id}`, data),
    deleteMentorshipProgram: (id: number) => apiClient.delete(`/alumni/mentorship-programs/${id}`),

    // Alumni Job Posts
    getAllAlumniJobPosts: (filters?: any) => apiClient.get('/alumni/job-posts', { params: filters }),
    getAlumniJobPostById: (id: number) => apiClient.get(`/alumni/job-posts/${id}`),
    createAlumniJobPost: (data: any) => apiClient.post('/alumni/job-posts', data),
    updateAlumniJobPost: (id: number, data: any) => apiClient.put(`/alumni/job-posts/${id}`, data),
    deleteAlumniJobPost: (id: number) => apiClient.delete(`/alumni/job-posts/${id}`),

    // Utility Endpoints
    getAlumniByGraduationYear: (year: number) => apiClient.get(`/alumni/alumni/graduation-year/${year}`),
    getAlumniByIndustry: (industry: string) => apiClient.get(`/alumni/alumni/industry/${industry}`),
    getWillingMentors: () => apiClient.get('/alumni/mentors'),
    getUpcomingEvents: () => apiClient.get('/alumni/events/upcoming'),
  },

  // Hostel Management
  hostel: {
    // Dashboard
    getDashboardStats: () => apiClient.get('/hostel/dashboard/stats'),

    // Hostel Management
    getAllHostels: () => apiClient.get('/hostel/hostels'),
    getHostelById: (id: number) => apiClient.get(`/hostel/hostels/${id}`),
    createHostel: (data: any) => apiClient.post('/hostel/hostels', data),
    updateHostel: (id: number, data: any) => apiClient.put(`/hostel/hostels/${id}`, data),
    deleteHostel: (id: number) => apiClient.delete(`/hostel/hostels/${id}`),

    // Room Category Management
    getAllRoomCategories: () => apiClient.get('/hostel/room-categories'),
    createRoomCategory: (data: any) => apiClient.post('/hostel/room-categories', data),

    // Room Management
    getAllRooms: () => apiClient.get('/hostel/rooms'),
    createRoom: (data: any) => apiClient.post('/hostel/rooms', data),
    updateRoom: (id: number, data: any) => apiClient.put(`/hostel/rooms/${id}`, data),
    deleteRoom: (id: number) => apiClient.delete(`/hostel/rooms/${id}`),

    // Room Allocation Management
    getAllRoomAllocations: () => apiClient.get('/hostel/room-allocations'),
    createRoomAllocation: (data: any) => apiClient.post('/hostel/room-allocations', data),
    updateRoomAllocation: (id: number, data: any) => apiClient.put(`/hostel/room-allocations/${id}`, data),
    deleteRoomAllocation: (id: number) => apiClient.delete(`/hostel/room-allocations/${id}`),

    // Mess Menu Management
    getMessMenu: () => apiClient.get('/hostel/mess-menu'),
    createMessMenuItem: (data: any) => apiClient.post('/hostel/mess-menu', data),

    // Visitor Log Management
    getAllVisitorLogs: () => apiClient.get('/hostel/visitor-logs'),
    createVisitorLog: (data: any) => apiClient.post('/hostel/visitor-logs', data),
    updateVisitorLog: (id: number, data: any) => apiClient.put(`/hostel/visitor-logs/${id}`, data),
    deleteVisitorLog: (id: number) => apiClient.delete(`/hostel/visitor-logs/${id}`),
    checkOutVisitor: (id: number) => apiClient.patch(`/hostel/visitor-logs/${id}/checkout`),

    // Maintenance Request Management
    getAllMaintenanceRequests: () => apiClient.get('/hostel/maintenance-requests'),
    createMaintenanceRequest: (data: any) => apiClient.post('/hostel/maintenance-requests', data),
    updateMaintenanceRequest: (id: number, data: any) => apiClient.put(`/hostel/maintenance-requests/${id}`, data),
    deleteMaintenanceRequest: (id: number) => apiClient.delete(`/hostel/maintenance-requests/${id}`),
    updateMaintenanceRequestStatus: (id: number, status: string) => 
      apiClient.patch(`/hostel/maintenance-requests/${id}/status`, { status }),
  },
};

// Enhanced API client with all missing methods
class EnhancedApiClient extends ApiClient {
  // Students API methods
  students = {
    getStudents: (params?: any) => this.get('/students', { params }),
    getAllStudents: () => this.get('/students'),
    getStudent: (id: number) => this.get(`/students/${id}`),
    createStudent: (data: any) => this.post('/students', data),
    updateStudent: (id: number, data: any) => this.put(`/students/${id}`, data),
    deleteStudent: (id: number) => this.delete(`/students/${id}`),
    searchStudents: (query: string, filters?: any) => this.get('/students/search', { params: { q: query, ...filters } }),
    getStudentCourses: (studentId: number) => this.get(`/students/${studentId}/courses`),
    getAttendanceSummary: (studentId: number, filters?: any) => this.get(`/students/${studentId}/attendance`, { params: filters }),
    getExamResults: (studentId: number, filters?: any) => this.get(`/students/${studentId}/exams`, { params: filters }),
    getAcademicPerformance: (studentId: number) => this.get(`/students/${studentId}/performance`),
    getStudentDashboard: (studentId: number) => this.get(`/students/${studentId}/dashboard`),
    bulkCreateStudents: (data: any[]) => this.post('/students/bulk', { students: data }),
    transferStudent: (studentId: number, data: any) => this.post(`/students/${studentId}/transfer`, data),
    getStudentsByCourse: (courseId: number, batchId?: number) => this.get(`/students/course/${courseId}`, { params: { batch_id: batchId } }),
    getStudentsByFaculty: (facultyId: number) => this.get(`/students/faculty/${facultyId}`),
    generateIdCard: (studentId: number) => this.get(`/students/${studentId}/id-card`),
    getStudentStats: () => this.get('/students/stats'),
  };

  // Hostel API methods
  hostel = {
    // Dashboard
    getDashboardStats: () => this.get('/hostel/dashboard/stats'),

    // Hostel Management
    getAllHostels: () => this.get('/hostel/hostels'),
    getHostelById: (id: number) => this.get(`/hostel/hostels/${id}`),
    createHostel: (data: any) => this.post('/hostel/hostels', data),
    updateHostel: (id: number, data: any) => this.put(`/hostel/hostels/${id}`, data),
    deleteHostel: (id: number) => this.delete(`/hostel/hostels/${id}`),

    // Room Category Management
    getAllRoomCategories: () => this.get('/hostel/room-categories'),
    createRoomCategory: (data: any) => this.post('/hostel/room-categories', data),

    // Room Management
    getAllRooms: () => this.get('/hostel/rooms'),
    createRoom: (data: any) => this.post('/hostel/rooms', data),
    updateRoom: (id: number, data: any) => this.put(`/hostel/rooms/${id}`, data),
    deleteRoom: (id: number) => this.delete(`/hostel/rooms/${id}`),

    // Room Allocation Management
    getAllRoomAllocations: () => this.get('/hostel/room-allocations'),
    createRoomAllocation: (data: any) => this.post('/hostel/room-allocations', data),
    updateRoomAllocation: (id: number, data: any) => this.put(`/hostel/room-allocations/${id}`, data),
    deleteRoomAllocation: (id: number) => this.delete(`/hostel/room-allocations/${id}`),

    // Mess Menu Management
    getMessMenu: () => this.get('/hostel/mess-menu'),
    createMessMenuItem: (data: any) => this.post('/hostel/mess-menu', data),

    // Visitor Log Management
    getAllVisitorLogs: () => this.get('/hostel/visitor-logs'),
    createVisitorLog: (data: any) => this.post('/hostel/visitor-logs', data),
    updateVisitorLog: (id: number, data: any) => this.put(`/hostel/visitor-logs/${id}`, data),
    deleteVisitorLog: (id: number) => this.delete(`/hostel/visitor-logs/${id}`),
    checkOutVisitor: (id: number) => this.patch(`/hostel/visitor-logs/${id}/checkout`),

    // Maintenance Request Management
    getAllMaintenanceRequests: () => this.get('/hostel/maintenance-requests'),
    createMaintenanceRequest: (data: any) => this.post('/hostel/maintenance-requests', data),
    updateMaintenanceRequest: (id: number, data: any) => this.put(`/hostel/maintenance-requests/${id}`, data),
    deleteMaintenanceRequest: (id: number) => this.delete(`/hostel/maintenance-requests/${id}`),
    updateMaintenanceRequestStatus: (id: number, status: string) => 
      this.patch(`/hostel/maintenance-requests/${id}/status`, { status }),
  };
}

// Create enhanced API instance
const enhancedApiClient = new EnhancedApiClient();

// Add missing certificate methods to enhanced API client
(enhancedApiClient as any).certificate = {
  getCertificateTypes: (params?: any) => enhancedApiClient.get('/certificate-types', { params }),
  getCertificateType: (id: number) => enhancedApiClient.get(`/certificate-types/${id}`),
  createCertificateType: (data: any) => enhancedApiClient.post('/certificate-types', data),
  updateCertificateType: (id: number, data: any) => enhancedApiClient.put(`/certificate-types/${id}`, data),
  deleteCertificateType: (id: number) => enhancedApiClient.delete(`/certificate-types/${id}`),
  getCertificates: (params?: any) => enhancedApiClient.get('/certificates', { params }),
  getCertificate: (id: number) => enhancedApiClient.get(`/certificates/${id}`),
  createCertificate: (data: any) => enhancedApiClient.post('/certificates', data),
  updateCertificate: (id: number, data: any) => enhancedApiClient.put(`/certificates/${id}`, data),
  deleteCertificate: (id: number) => enhancedApiClient.delete(`/certificates/${id}`),
  getAllCertificateTypes: (params?: any) => enhancedApiClient.get('/certificate-types', { params }),
  getAllCertificateTemplates: (params?: any) => enhancedApiClient.get('/certificate-templates', { params }),
  getAllCertificates: (params?: any) => enhancedApiClient.get('/certificates', { params })
};

// Add missing API method aliases for form compatibility
(facultyApi as any).getCourses = facultyApi.getFaculty;
(facultyApi as any).getById = facultyApi.getFacultyById;
(facultyApi as any).create = facultyApi.createFaculty;
(facultyApi as any).update = facultyApi.updateFaculty;

(courseApi as any).getById = courseApi.getCourse;
(courseApi as any).create = courseApi.createCourse;
(courseApi as any).update = courseApi.updateCourse;

(departmentApi as any).getById = departmentApi.getDepartment;
(departmentApi as any).create = departmentApi.createDepartment;
(departmentApi as any).update = departmentApi.updateDepartment;

(examApi as any).getById = examApi.getExam;
(examApi as any).create = examApi.createExam;
(examApi as any).update = examApi.updateExam;

// Add more missing API methods
(enhancedApiClient as any).student = enhancedApiClient.students;
(enhancedApiClient as any).alumni = transportationAPI.alumni;
(enhancedApiClient as any).partner = {
  getAllPartners: () => enhancedApiClient.get('/partners')
};
(enhancedApiClient as any).department = {
  getAllDepartments: () => departmentApi.getDepartments()
};
(enhancedApiClient as any).program = {
  getAllPrograms: () => enhancedApiClient.get('/programs')
};
(enhancedApiClient as any).course = {
  getAllCourses: () => courseApi.getCourses(),
  getAllBatches: () => enhancedApiClient.get('/batches')
};

// Add missing attendance API methods
(attendanceApi as any).getById = attendanceApi.getAttendanceSheet;
(attendanceApi as any).create = attendanceApi.createAttendanceSheet;
(attendanceApi as any).update = (id: number, data: any) => enhancedApiClient.put(`/attendance/sheets/${id}`, data);

// Add missing student API method
(enhancedApiClient.students as any).getCourses = () => courseApi.getCourses();

// Export enhanced API instance
export const api = enhancedApiClient;
export default enhancedApiClient;

