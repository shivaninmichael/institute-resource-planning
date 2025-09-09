// =====================================================
// OpenEducat ERP Frontend - Dashboard Context
// Manages dashboard state and data fetching
// =====================================================

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { dashboardService } from '../services/dashboardService';
import { DashboardState, DashboardFilters, DashboardData } from '../types/dashboard';

// =====================================================
// Types
// =====================================================

type DashboardAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: DashboardData }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'UPDATE_FILTERS'; payload: Partial<DashboardFilters> }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LAST_UPDATED' };

interface DashboardContextType extends DashboardState {
  refreshDashboard: () => Promise<void>;
  updateFilters: (filters: Partial<DashboardFilters>) => void;
  clearError: () => void;
  loadKPIs: () => Promise<void>;
  loadCharts: () => Promise<void>;
  loadTables: () => Promise<void>;
  loadActivities: () => Promise<void>;
  loadNotifications: () => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
}

// =====================================================
// Initial State
// =====================================================

const initialState: DashboardState = {
  data: null,
  filters: {},
  isLoading: true,
  error: null,
  lastUpdated: null,
};

// =====================================================
// Reducer
// =====================================================

const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'FETCH_SUCCESS':
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        error: null,
        lastUpdated: new Date().toISOString(),
      };

    case 'FETCH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case 'UPDATE_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'SET_LAST_UPDATED':
      return {
        ...state,
        lastUpdated: new Date().toISOString(),
      };

    default:
      return state;
  }
};

// =====================================================
// Context
// =====================================================

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// =====================================================
// Provider Component
// =====================================================

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  // =====================================================
  // Effects
  // =====================================================

  // Load initial dashboard data
  useEffect(() => {
    refreshDashboard();
  }, [state.filters]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshDashboard();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // =====================================================
  // Methods
  // =====================================================

  const refreshDashboard = async (): Promise<void> => {
    try {
      dispatch({ type: 'FETCH_START' });
      const data = await dashboardService.getDashboardData(state.filters);
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to load dashboard data';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const updateFilters = (filters: Partial<DashboardFilters>): void => {
    dispatch({ type: 'UPDATE_FILTERS', payload: filters });
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const loadKPIs = async (): Promise<void> => {
    try {
      dispatch({ type: 'FETCH_START' });
      
      const [
        students,
        faculty,
        courses,
        attendance,
        exams,
        library,
        fees,
      ] = await Promise.all([
        dashboardService.getStudentKPIs(state.filters),
        dashboardService.getFacultyKPIs(state.filters),
        dashboardService.getCourseKPIs(state.filters),
        dashboardService.getAttendanceKPIs(state.filters),
        dashboardService.getExamKPIs(state.filters),
        dashboardService.getLibraryKPIs(state.filters),
        dashboardService.getFeesKPIs(state.filters),
      ]);

      dispatch({
        type: 'FETCH_SUCCESS',
        payload: {
          ...state.data!,
          kpis: {
            students,
            faculty,
            courses,
            attendance,
            exams,
            library,
            fees,
          },
        },
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to load KPIs';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const loadCharts = async (): Promise<void> => {
    try {
      dispatch({ type: 'FETCH_START' });
      
      const [
        studentEnrollment,
        attendanceOverview,
        examPerformance,
        revenueAnalysis,
        departmentDistribution,
        courseCompletion,
      ] = await Promise.all([
        dashboardService.getStudentEnrollmentChart(state.filters),
        dashboardService.getAttendanceOverviewChart(state.filters),
        dashboardService.getExamPerformanceChart(state.filters),
        dashboardService.getRevenueAnalysisChart(state.filters),
        dashboardService.getDepartmentDistributionChart(state.filters),
        dashboardService.getCourseCompletionChart(state.filters),
      ]);

      dispatch({
        type: 'FETCH_SUCCESS',
        payload: {
          ...state.data!,
          charts: {
            studentEnrollment,
            attendanceOverview,
            examPerformance,
            revenueAnalysis,
            departmentDistribution,
            courseCompletion,
          },
        },
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to load charts';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const loadTables = async (): Promise<void> => {
    try {
      dispatch({ type: 'FETCH_START' });
      
      const [
        recentAdmissions,
        upcomingExams,
        pendingFees,
        facultyAttendance,
      ] = await Promise.all([
        dashboardService.getRecentAdmissionsTable(state.filters),
        dashboardService.getUpcomingExamsTable(state.filters),
        dashboardService.getPendingFeesTable(state.filters),
        dashboardService.getFacultyAttendanceTable(state.filters),
      ]);

      dispatch({
        type: 'FETCH_SUCCESS',
        payload: {
          ...state.data!,
          tables: {
            recentAdmissions,
            upcomingExams,
            pendingFees,
            facultyAttendance,
          },
        },
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to load tables';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const loadActivities = async (): Promise<void> => {
    try {
      const activities = await dashboardService.getActivities();
      
      dispatch({
        type: 'FETCH_SUCCESS',
        payload: {
          ...state.data!,
          activities,
        },
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to load activities';
      toast.error(errorMessage);
    }
  };

  const loadNotifications = async (): Promise<void> => {
    try {
      const notifications = await dashboardService.getNotifications();
      
      dispatch({
        type: 'FETCH_SUCCESS',
        payload: {
          ...state.data!,
          notifications,
        },
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to load notifications';
      toast.error(errorMessage);
    }
  };

  const markNotificationAsRead = async (notificationId: string): Promise<void> => {
    try {
      await dashboardService.markNotificationAsRead(notificationId);
      
      if (state.data) {
        const updatedNotifications = state.data.notifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        );

        dispatch({
          type: 'FETCH_SUCCESS',
          payload: {
            ...state.data,
            notifications: updatedNotifications,
          },
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to mark notification as read';
      toast.error(errorMessage);
    }
  };

  const markAllNotificationsAsRead = async (): Promise<void> => {
    try {
      await dashboardService.markAllNotificationsAsRead();
      
      if (state.data) {
        const updatedNotifications = state.data.notifications.map(notification => ({
          ...notification,
          isRead: true,
        }));

        dispatch({
          type: 'FETCH_SUCCESS',
          payload: {
            ...state.data,
            notifications: updatedNotifications,
          },
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to mark all notifications as read';
      toast.error(errorMessage);
    }
  };

  // =====================================================
  // Context Value
  // =====================================================

  const contextValue: DashboardContextType = {
    ...state,
    refreshDashboard,
    updateFilters,
    clearError,
    loadKPIs,
    loadCharts,
    loadTables,
    loadActivities,
    loadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

// =====================================================
// Hook
// =====================================================

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export default DashboardContext;

