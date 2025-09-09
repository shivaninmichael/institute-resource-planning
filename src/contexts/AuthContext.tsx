// =====================================================
// OpenEducat ERP Frontend - Authentication Context
// User authentication and authorization management
// =====================================================

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { apiClient } from '../services/api';
import { authService } from '../services/authService';
import {
  UserLoginRequest,
  UserLoginResponse,
  AuthState,
  AuthAction,
  AuthContextType,
  UserRole,
  PermissionAction,
  ResourceType,
  MFAMethod,
  UserSession,
} from '../types/auth';
import { User } from '../types';

// =====================================================
// Initial State
// =====================================================

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('auth_token'),
  refreshToken: localStorage.getItem('refresh_token'),
  isAuthenticated: false,
  isLoading: true,
  error: null,
  currentSession: null,
  activeSessions: [],
  requiresMFA: false,
  mfaVerified: false,
};

// =====================================================
// Reducer
// =====================================================

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        requiresMFA: action.payload.requiresMFA || false,
        mfaVerified: !action.payload.requiresMFA,
        currentSession: action.payload.currentSession,
      };

    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        currentSession: null,
        activeSessions: [],
        requiresMFA: false,
        mfaVerified: false,
      };

    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        currentSession: null,
        activeSessions: [],
        requiresMFA: false,
        mfaVerified: false,
      };

    case 'AUTH_REFRESH':
      return {
        ...state,
        token: action.payload.token,
        isLoading: false,
      };

    case 'PROFILE_UPDATE':
      return {
        ...state,
        user: { ...state.user!, ...action.payload },
      };

    case 'SESSION_UPDATE':
      return {
        ...state,
        currentSession: action.payload.currentSession,
        activeSessions: action.payload.activeSessions,
      };

    case 'MFA_REQUIRED':
      return {
        ...state,
        requiresMFA: true,
        mfaVerified: false,
      };

    case 'MFA_VERIFIED':
      return {
        ...state,
        requiresMFA: false,
        mfaVerified: true,
        token: action.payload.token,
      };

    case 'MFA_FAILED':
      return {
        ...state,
        error: action.payload,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// =====================================================
// Context
// =====================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =====================================================
// Provider Component
// =====================================================

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // =====================================================
  // Effects
  // =====================================================

  // Initialize authentication on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const refreshToken = localStorage.getItem('refresh_token');

      if (token && refreshToken) {
        try {
          // Verify token validity
          await authService.verifyToken();
          
          // Get user profile
          const profile = await authService.getProfile();
          
          // Get current session
          const sessions = await authService.getActiveSessions();
          const currentSession = sessions.find(s => s.isCurrentSession);
          
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: profile.data,
              token,
              refreshToken,
              currentSession,
              activeSessions: sessions,
            },
          });
        } catch (error) {
          // Token is invalid, try to refresh
          try {
            await refreshAuth();
          } catch (refreshError) {
            // Both tokens are invalid, logout
            logout();
          }
        }
      } else {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    initializeAuth();
  }, []);

  // =====================================================
  // Authentication Methods
  // =====================================================

  const login = async (credentials: UserLoginRequest): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });

      const response = await authService.login(credentials);
      
      if (response.requiresMFA) {
        dispatch({
          type: 'MFA_REQUIRED',
          payload: { availableMethods: response.availableMFAMethods },
        });
        return;
      }
      
      // Set token in API client
      apiClient.setToken(response.token);
      
      // Store tokens
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('refresh_token', response.refreshToken);

      // Get current session
      const sessions = await authService.getActiveSessions();
      const currentSession = sessions.find(s => s.isCurrentSession);

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          ...response,
          currentSession,
          activeSessions: sessions,
        },
      });

      toast.success('Login successful!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = async (fromAllDevices: boolean = false): Promise<void> => {
    try {
      if (state.token) {
        await authService.logout(fromAllDevices);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens
      apiClient.clearToken();
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');

      dispatch({ type: 'AUTH_LOGOUT' });
      toast.success('Logged out successfully');
    }
  };

  const register = async (userData: any): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });

      const response = await authService.register(userData);
      
      // Set token in API client
      apiClient.setToken(response.token);
      
      // Store tokens
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('refresh_token', response.refreshToken);

      // Get current session
      const sessions = await authService.getActiveSessions();
      const currentSession = sessions.find(s => s.isCurrentSession);

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          ...response,
          currentSession,
          activeSessions: sessions,
        },
      });

      toast.success('Registration successful!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const refreshAuth = async (): Promise<void> => {
    try {
      if (!state.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authService.refreshToken(state.refreshToken);
      
      // Update token in API client
      apiClient.setToken(response.token);
      
      // Update stored token
      localStorage.setItem('auth_token', response.token);

      dispatch({
        type: 'AUTH_REFRESH',
        payload: { token: response.token },
      });
    } catch (error) {
      // Refresh failed, logout user
      logout();
      throw error;
    }
  };

  const updateProfile = async (data: any): Promise<void> => {
    try {
      const response = await authService.updateProfile(data);
      
      dispatch({
        type: 'PROFILE_UPDATE',
        payload: response.data,
      });

      toast.success('Profile updated successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const changePassword = async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    try {
      await authService.changePassword(data);
      toast.success('Password changed successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Password change failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  // =====================================================
  // Multi-Factor Authentication Methods
  // =====================================================

  const verifyMFA = async (code: string, method: MFAMethod['type']): Promise<void> => {
    try {
      const response = await authService.verifyMFA(code, method);
      
      dispatch({
        type: 'MFA_VERIFIED',
        payload: { token: response.token },
      });

      toast.success('MFA verification successful');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'MFA verification failed';
      dispatch({ type: 'MFA_FAILED', payload: errorMessage });
      throw error;
    }
  };

  const setupMFA = async (method: MFAMethod['type'], data?: Record<string, any>): Promise<{ secret?: string; qrCode?: string }> => {
    try {
      const response = await authService.setupMFA(method, data);
      
      // Refresh user profile to get updated MFA methods
      const profile = await authService.getProfile();
      
      dispatch({
        type: 'PROFILE_UPDATE',
        payload: profile.data,
      });

      toast.success('MFA setup successful');
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'MFA setup failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const disableMFA = async (method: MFAMethod['type']): Promise<void> => {
    try {
      await authService.disableMFA(method);
      
      // Refresh user profile to get updated MFA methods
      const profile = await authService.getProfile();
      
      dispatch({
        type: 'PROFILE_UPDATE',
        payload: profile.data,
      });

      toast.success('MFA disabled successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to disable MFA';
      toast.error(errorMessage);
      throw error;
    }
  };

  // =====================================================
  // Session Management Methods
  // =====================================================

  const getActiveSessions = async (): Promise<UserSession[]> => {
    try {
      const sessions = await authService.getActiveSessions();
      const currentSession = sessions.find(s => s.isCurrentSession);
      
      dispatch({
        type: 'SESSION_UPDATE',
        payload: { currentSession, activeSessions: sessions },
      });

      return sessions;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to get active sessions';
      toast.error(errorMessage);
      throw error;
    }
  };

  const terminateSession = async (sessionId: string): Promise<void> => {
    try {
      await authService.terminateSession(sessionId);
      
      // If current session was terminated, logout
      if (state.currentSession?.id === sessionId) {
        await logout();
        return;
      }

      // Otherwise, refresh sessions list
      await getActiveSessions();
      
      toast.success('Session terminated successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to terminate session';
      toast.error(errorMessage);
      throw error;
    }
  };

  const terminateAllOtherSessions = async (): Promise<void> => {
    try {
      await authService.terminateAllOtherSessions();
      await getActiveSessions();
      toast.success('All other sessions terminated successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to terminate other sessions';
      toast.error(errorMessage);
      throw error;
    }
  };

  // =====================================================
  // Permission Methods
  // =====================================================

  const hasPermission = (
    action: PermissionAction,
    resource: ResourceType,
    conditions?: Record<string, any>
  ): boolean => {
    if (!state.user) return false;

    // Admin has all permissions
    if (state.user.is_admin) return true;

    // Check user's explicit permissions
    const hasExplicitPermission = state.user.permissions.some(permission => 
      permission.action === action &&
      permission.resource === resource &&
      (!conditions || Object.entries(conditions).every(([key, value]) => 
        permission.conditions?.[key] === value
      ))
    );

    if (hasExplicitPermission) return true;

    // Check permissions from roles
    return state.user.roles.some(role =>
      role.permissionGroups.some(group =>
        group.permissions.some(permission =>
          permission.action === action &&
          permission.resource === resource &&
          (!conditions || Object.entries(conditions).every(([key, value]) => 
            permission.conditions?.[key] === value
          ))
        )
      )
    );
  };

  const hasRole = (role: UserRole): boolean => {
    if (!state.user) return false;

    switch (role) {
      case 'admin':
        return state.user.is_admin;
      case 'faculty':
        return state.user.is_faculty || state.user.is_admin;
      case 'student':
        return state.user.is_student || state.user.is_admin;
      case 'parent':
        return state.user.is_parent || state.user.is_admin;
      case 'staff':
        return state.user.is_staff || state.user.is_admin;
      default:
        return false;
    }
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // =====================================================
  // Context Value
  // =====================================================

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    register,
    refreshAuth,
    updateProfile,
    changePassword,
    clearError,
    hasPermission,
    hasRole,
    verifyMFA,
    setupMFA,
    disableMFA,
    getActiveSessions,
    terminateSession,
    terminateAllOtherSessions,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// =====================================================
// Hook
// =====================================================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// =====================================================
// Higher-Order Components
// =====================================================

// HOC for protecting routes that require authentication
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> => {
  return (props: P) => {
    const { isAuthenticated, isLoading, requiresMFA } = useAuth();

    if (isLoading) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          <div>Loading...</div>
        </div>
      );
    }

    if (!isAuthenticated) {
      window.location.href = '/login';
      return null;
    }

    if (requiresMFA) {
      window.location.href = '/mfa';
      return null;
    }

    return <Component {...props} />;
  };
};

// HOC for protecting routes that require specific permissions
export const withPermission = <P extends object>(
  Component: React.ComponentType<P>,
  action: PermissionAction,
  resource: ResourceType,
  conditions?: Record<string, any>
): React.ComponentType<P> => {
  return (props: P) => {
    const { hasPermission, isAuthenticated, isLoading, requiresMFA } = useAuth();

    if (isLoading) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          <div>Loading...</div>
        </div>
      );
    }

    if (!isAuthenticated) {
      window.location.href = '/login';
      return null;
    }

    if (requiresMFA) {
      window.location.href = '/mfa';
      return null;
    }

    if (!hasPermission(action, resource, conditions)) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <h2>Access Denied</h2>
          <p>You don't have permission to perform this action.</p>
          <button onClick={() => window.history.back()}>Go Back</button>
        </div>
      );
    }

    return <Component {...props} />;
  };
};

// HOC for protecting routes that require specific roles
export const withRole = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRole: UserRole
): React.ComponentType<P> => {
  return (props: P) => {
    const { hasRole, isAuthenticated, isLoading, requiresMFA } = useAuth();

    if (isLoading) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          <div>Loading...</div>
        </div>
      );
    }

    if (!isAuthenticated) {
      window.location.href = '/login';
      return null;
    }

    if (requiresMFA) {
      window.location.href = '/mfa';
      return null;
    }

    if (!hasRole(requiredRole)) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <h2>Access Denied</h2>
          <p>This page is only accessible to {requiredRole}s.</p>
          <button onClick={() => window.history.back()}>Go Back</button>
        </div>
      );
    }

    return <Component {...props} />;
  };
};

export default AuthContext;