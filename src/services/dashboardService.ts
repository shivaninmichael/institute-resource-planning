// =====================================================
// OpenEducat ERP Frontend - Dashboard Service
// Handles all dashboard-related API calls
// =====================================================

import { apiClient } from './api';
import { DashboardData, DashboardFilters } from '../types/dashboard';

interface DashboardSettings {
  layout: 'grid' | 'list';
  refreshInterval: number;
  defaultDateRange: 'today' | 'week' | 'month' | 'year' | 'custom';
  visibleWidgets: string[];
  widgetPreferences: Record<string, {
    size: 'small' | 'medium' | 'large';
    position: number;
    autoRefresh: boolean;
  }>;
  filters: DashboardFilters;
  theme: {
    chartColors: string[];
    showLegend: boolean;
    showGrid: boolean;
    animations: boolean;
  };
}

class DashboardService {
  // =====================================================
  // Dashboard Data
  // =====================================================

  async getDashboardData(filters?: DashboardFilters): Promise<DashboardData> {
    const response = await apiClient.get('/dashboard', { params: filters });
    return response.data;
  }

  // =====================================================
  // KPI Data
  // =====================================================

  async getStudentKPIs(filters?: DashboardFilters): Promise<DashboardData['kpis']['students']> {
    const response = await apiClient.get('/dashboard/kpis/students', { params: filters });
    return response.data;
  }

  async getFacultyKPIs(filters?: DashboardFilters): Promise<DashboardData['kpis']['faculty']> {
    const response = await apiClient.get('/dashboard/kpis/faculty', { params: filters });
    return response.data;
  }

  async getCourseKPIs(filters?: DashboardFilters): Promise<DashboardData['kpis']['courses']> {
    const response = await apiClient.get('/dashboard/kpis/courses', { params: filters });
    return response.data;
  }

  async getAttendanceKPIs(filters?: DashboardFilters): Promise<DashboardData['kpis']['attendance']> {
    const response = await apiClient.get('/dashboard/kpis/attendance', { params: filters });
    return response.data;
  }

  async getExamKPIs(filters?: DashboardFilters): Promise<DashboardData['kpis']['exams']> {
    const response = await apiClient.get('/dashboard/kpis/exams', { params: filters });
    return response.data;
  }

  async getLibraryKPIs(filters?: DashboardFilters): Promise<DashboardData['kpis']['library']> {
    const response = await apiClient.get('/dashboard/kpis/library', { params: filters });
    return response.data;
  }

  async getFeesKPIs(filters?: DashboardFilters): Promise<DashboardData['kpis']['fees']> {
    const response = await apiClient.get('/dashboard/kpis/fees', { params: filters });
    return response.data;
  }

  // =====================================================
  // Chart Data
  // =====================================================

  async getStudentEnrollmentChart(filters?: DashboardFilters): Promise<DashboardData['charts']['studentEnrollment']> {
    const response = await apiClient.get('/dashboard/charts/student-enrollment', { params: filters });
    return response.data;
  }

  async getAttendanceOverviewChart(filters?: DashboardFilters): Promise<DashboardData['charts']['attendanceOverview']> {
    const response = await apiClient.get('/dashboard/charts/attendance-overview', { params: filters });
    return response.data;
  }

  async getExamPerformanceChart(filters?: DashboardFilters): Promise<DashboardData['charts']['examPerformance']> {
    const response = await apiClient.get('/dashboard/charts/exam-performance', { params: filters });
    return response.data;
  }

  async getRevenueAnalysisChart(filters?: DashboardFilters): Promise<DashboardData['charts']['revenueAnalysis']> {
    const response = await apiClient.get('/dashboard/charts/revenue-analysis', { params: filters });
    return response.data;
  }

  async getDepartmentDistributionChart(filters?: DashboardFilters): Promise<DashboardData['charts']['departmentDistribution']> {
    const response = await apiClient.get('/dashboard/charts/department-distribution', { params: filters });
    return response.data;
  }

  async getCourseCompletionChart(filters?: DashboardFilters): Promise<DashboardData['charts']['courseCompletion']> {
    const response = await apiClient.get('/dashboard/charts/course-completion', { params: filters });
    return response.data;
  }

  // =====================================================
  // Table Data
  // =====================================================

  async getRecentAdmissionsTable(filters?: DashboardFilters): Promise<DashboardData['tables']['recentAdmissions']> {
    const response = await apiClient.get('/dashboard/tables/recent-admissions', { params: filters });
    return response.data;
  }

  async getUpcomingExamsTable(filters?: DashboardFilters): Promise<DashboardData['tables']['upcomingExams']> {
    const response = await apiClient.get('/dashboard/tables/upcoming-exams', { params: filters });
    return response.data;
  }

  async getPendingFeesTable(filters?: DashboardFilters): Promise<DashboardData['tables']['pendingFees']> {
    const response = await apiClient.get('/dashboard/tables/pending-fees', { params: filters });
    return response.data;
  }

  async getFacultyAttendanceTable(filters?: DashboardFilters): Promise<DashboardData['tables']['facultyAttendance']> {
    const response = await apiClient.get('/dashboard/tables/faculty-attendance', { params: filters });
    return response.data;
  }

  // =====================================================
  // Activity & Notifications
  // =====================================================

  async getActivities(limit?: number): Promise<DashboardData['activities']> {
    const response = await apiClient.get('/dashboard/activities', { params: { limit } });
    return response.data;
  }

  async getNotifications(limit?: number): Promise<DashboardData['notifications']> {
    const response = await apiClient.get('/dashboard/notifications', { params: { limit } });
    return response.data;
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await apiClient.put(`/dashboard/notifications/${notificationId}/read`);
  }

  async markAllNotificationsAsRead(): Promise<void> {
    await apiClient.put('/dashboard/notifications/read-all');
  }

  // =====================================================
  // Dashboard Settings
  // =====================================================

  async getDashboardSettings(): Promise<DashboardSettings> {
    const response = await apiClient.get('/dashboard/settings');
    return response.data;
  }

  async updateDashboardSettings(settings: Partial<DashboardSettings>): Promise<void> {
    await apiClient.put('/dashboard/settings', settings);
  }

  async resetDashboardSettings(): Promise<void> {
    await apiClient.post('/dashboard/settings/reset');
  }
}

export const dashboardService = new DashboardService();

