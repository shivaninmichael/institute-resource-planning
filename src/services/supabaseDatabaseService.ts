// =====================================================
// OpenEducat ERP Frontend - Supabase Database Service
// Supabase-based database operations for all entities
// =====================================================

import { dbHelpers, supabase } from './supabase';
import { toast } from 'react-hot-toast';

// =====================================================
// Types
// =====================================================

interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// =====================================================
// Generic Database Service
// =====================================================

class SupabaseDatabaseService {
  // =====================================================
  // Generic CRUD Operations
  // =====================================================

  async getAll<T = any>(
    table: string,
    filters?: Record<string, any>,
    orderBy?: string,
    limit?: number,
    offset?: number
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    try {
      let query = supabase.from(table).select('*', { count: 'exact' });

      // Apply filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              query = query.in(key, value);
            } else if (typeof value === 'string' && value.includes('%')) {
              query = query.like(key, value);
            } else {
              query = query.eq(key, value);
            }
          }
        });
      }

      // Apply ordering
      if (orderBy) {
        const [column, direction] = orderBy.split(' ');
        query = query.order(column, { ascending: direction !== 'desc' });
      }

      // Apply pagination
      if (limit) {
        query = query.limit(limit);
      }
      if (offset) {
        query = query.range(offset, offset + (limit || 10) - 1);
      }

      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return {
        data: {
          data: data || [],
          total: count || 0,
          page: Math.floor((offset || 0) / (limit || 10)) + 1,
          limit: limit || 10,
          totalPages: Math.ceil((count || 0) / (limit || 10)),
        },
        success: true,
      };
    } catch (error: any) {
      console.error(`Error fetching ${table}:`, error);
      toast.error(`Failed to fetch ${table}: ${error.message}`);
      return {
        data: { data: [], total: 0, page: 1, limit: 10, totalPages: 0 },
        success: false,
        message: error.message,
      };
    }
  }

  async getById<T = any>(table: string, id: string | number): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        data,
        success: true,
      };
    } catch (error: any) {
      console.error(`Error fetching ${table} by ID:`, error);
      toast.error(`Failed to fetch ${table}: ${error.message}`);
      return {
        data: null,
        success: false,
        message: error.message,
      };
    }
  }

  async create<T = any>(table: string, data: Omit<T, 'id'>): Promise<ApiResponse<T>> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      toast.success(`${table} created successfully`);
      return {
        data: result,
        success: true,
        message: `${table} created successfully`,
      };
    } catch (error: any) {
      console.error(`Error creating ${table}:`, error);
      toast.error(`Failed to create ${table}: ${error.message}`);
      return {
        data: null,
        success: false,
        message: error.message,
      };
    }
  }

  async update<T = any>(
    table: string,
    id: string | number,
    data: Partial<Omit<T, 'id'>>
  ): Promise<ApiResponse<T>> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      toast.success(`${table} updated successfully`);
      return {
        data: result,
        success: true,
        message: `${table} updated successfully`,
      };
    } catch (error: any) {
      console.error(`Error updating ${table}:`, error);
      toast.error(`Failed to update ${table}: ${error.message}`);
      return {
        data: null,
        success: false,
        message: error.message,
      };
    }
  }

  async delete(table: string, id: string | number): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      toast.success(`${table} deleted successfully`);
      return {
        data: true,
        success: true,
        message: `${table} deleted successfully`,
      };
    } catch (error: any) {
      console.error(`Error deleting ${table}:`, error);
      toast.error(`Failed to delete ${table}: ${error.message}`);
      return {
        data: false,
        success: false,
        message: error.message,
      };
    }
  }

  // =====================================================
  // Specific Entity Services
  // =====================================================

  // Students
  async getStudents(filters?: any, pagination?: any) {
    return this.getAll('students', filters, 'created_at desc', pagination?.limit, pagination?.offset);
  }

  async getStudent(id: string | number) {
    return this.getById('students', id);
  }

  async createStudent(data: any) {
    return this.create('students', data);
  }

  async updateStudent(id: string | number, data: any) {
    return this.update('students', id, data);
  }

  async deleteStudent(id: string | number) {
    return this.delete('students', id);
  }

  // Faculty
  async getFaculty(filters?: any, pagination?: any) {
    return this.getAll('faculty', filters, 'created_at desc', pagination?.limit, pagination?.offset);
  }

  async getFacultyMember(id: string | number) {
    return this.getById('faculty', id);
  }

  async createFacultyMember(data: any) {
    return this.create('faculty', data);
  }

  async updateFacultyMember(id: string | number, data: any) {
    return this.update('faculty', id, data);
  }

  async deleteFacultyMember(id: string | number) {
    return this.delete('faculty', id);
  }

  // Courses
  async getCourses(filters?: any, pagination?: any) {
    return this.getAll('courses', filters, 'created_at desc', pagination?.limit, pagination?.offset);
  }

  async getCourse(id: string | number) {
    return this.getById('courses', id);
  }

  async createCourse(data: any) {
    return this.create('courses', data);
  }

  async updateCourse(id: string | number, data: any) {
    return this.update('courses', id, data);
  }

  async deleteCourse(id: string | number) {
    return this.delete('courses', id);
  }

  // Departments
  async getDepartments(filters?: any, pagination?: any) {
    return this.getAll('departments', filters, 'name asc', pagination?.limit, pagination?.offset);
  }

  async getDepartment(id: string | number) {
    return this.getById('departments', id);
  }

  async createDepartment(data: any) {
    return this.create('departments', data);
  }

  async updateDepartment(id: string | number, data: any) {
    return this.update('departments', id, data);
  }

  async deleteDepartment(id: string | number) {
    return this.delete('departments', id);
  }

  // Attendance
  async getAttendance(filters?: any, pagination?: any) {
    return this.getAll('attendance_sheets', filters, 'date desc', pagination?.limit, pagination?.offset);
  }

  async getAttendanceRecord(id: string | number) {
    return this.getById('attendance_sheets', id);
  }

  async createAttendanceRecord(data: any) {
    return this.create('attendance_sheets', data);
  }

  async updateAttendanceRecord(id: string | number, data: any) {
    return this.update('attendance_sheets', id, data);
  }

  async deleteAttendanceRecord(id: string | number) {
    return this.delete('attendance_sheets', id);
  }

  // Exams
  async getExams(filters?: any, pagination?: any) {
    return this.getAll('exams', filters, 'exam_date desc', pagination?.limit, pagination?.offset);
  }

  async getExam(id: string | number) {
    return this.getById('exams', id);
  }

  async createExam(data: any) {
    return this.create('exams', data);
  }

  async updateExam(id: string | number, data: any) {
    return this.update('exams', id, data);
  }

  async deleteExam(id: string | number) {
    return this.delete('exams', id);
  }

  // =====================================================
  // Dashboard Data
  // =====================================================

  async getDashboardStats() {
    try {
      const [
        studentsResult,
        facultyResult,
        coursesResult,
        departmentsResult,
      ] = await Promise.all([
        this.getAll('students', { active: true }, undefined, 1, 0),
        this.getAll('faculty', { active: true }, undefined, 1, 0),
        this.getAll('courses', { active: true }, undefined, 1, 0),
        this.getAll('departments', { active: true }, undefined, 1, 0),
      ]);

      return {
        data: {
          totalStudents: studentsResult.data.total,
          totalFaculty: facultyResult.data.total,
          totalCourses: coursesResult.data.total,
          totalDepartments: departmentsResult.data.total,
        },
        success: true,
      };
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      return {
        data: {
          totalStudents: 0,
          totalFaculty: 0,
          totalCourses: 0,
          totalDepartments: 0,
        },
        success: false,
        message: error.message,
      };
    }
  }

  // =====================================================
  // Search and Filter
  // =====================================================

  async search(table: string, query: string, columns: string[] = ['name']) {
    try {
      let searchQuery = supabase.from(table).select('*');

      // Build search query
      const searchConditions = columns.map(column => `${column}.ilike.%${query}%`);
      searchQuery = searchQuery.or(searchConditions.join(','));

      const { data, error } = await searchQuery;

      if (error) {
        throw new Error(error.message);
      }

      return {
        data: data || [],
        success: true,
      };
    } catch (error: any) {
      console.error(`Error searching ${table}:`, error);
      return {
        data: [],
        success: false,
        message: error.message,
      };
    }
  }
}

// =====================================================
// Export Service Instance
// =====================================================

export const supabaseDatabaseService = new SupabaseDatabaseService();
export default supabaseDatabaseService;
