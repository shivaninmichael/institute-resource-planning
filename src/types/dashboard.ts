// =====================================================
// OpenEducat ERP Frontend - Dashboard Types
// Type definitions for dashboard analytics and KPIs
// =====================================================

export interface KPICard {
  id: string;
  title: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
  link?: string;
  permission?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

export interface ChartWidget {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  data: ChartData;
  options?: any;
  permission?: string;
}

export interface TableWidget {
  id: string;
  title: string;
  columns: {
    field: string;
    headerName: string;
    width?: number;
    flex?: number;
    renderCell?: (params: any) => JSX.Element;
  }[];
  rows: any[];
  permission?: string;
}

export interface ActivityItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  description: string;
  timestamp: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  link?: string;
}

export interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export interface DashboardData {
  kpis: {
    students: {
      total: number;
      active: number;
      newThisMonth: number;
      graduatingThisYear: number;
    };
    faculty: {
      total: number;
      active: number;
      onLeave: number;
      departments: number;
    };
    courses: {
      total: number;
      active: number;
      upcomingStart: number;
      completingThisMonth: number;
    };
    attendance: {
      averageRate: number;
      todayPresent: number;
      todayAbsent: number;
      todayLate: number;
    };
    exams: {
      scheduled: number;
      ongoing: number;
      completed: number;
      averageScore: number;
    };
    library: {
      totalBooks: number;
      booksIssued: number;
      booksOverdue: number;
      finesCollected: number;
    };
    fees: {
      totalCollected: number;
      pending: number;
      overdue: number;
      thisMonth: number;
    };
  };
  charts: {
    studentEnrollment: ChartData;
    attendanceOverview: ChartData;
    examPerformance: ChartData;
    revenueAnalysis: ChartData;
    departmentDistribution: ChartData;
    courseCompletion: ChartData;
  };
  tables: {
    recentAdmissions: TableWidget;
    upcomingExams: TableWidget;
    pendingFees: TableWidget;
    facultyAttendance: TableWidget;
  };
  activities: ActivityItem[];
  notifications: NotificationItem[];
}

export interface DashboardFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  department?: string;
  course?: string;
  batch?: string;
}

export interface DashboardState {
  data: DashboardData | null;
  filters: DashboardFilters;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

