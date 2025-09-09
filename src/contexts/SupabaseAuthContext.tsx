// =====================================================
// OpenEducat ERP Frontend - Supabase Authentication Context
// Supabase-based user authentication and authorization management
// =====================================================

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { supabase, authHelpers, dbHelpers } from '../services/supabase';
import { User } from '@supabase/supabase-js';
import {
  AuthState,
  AuthAction,
  AuthContextType,
  UserRole,
  PermissionAction,
  ResourceType,
} from '../types/auth';

// =====================================================
// Types
// =====================================================

interface SupabaseUser {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_admin?: boolean;
  is_faculty?: boolean;
  is_student?: boolean;
  is_parent?: boolean;
  is_staff?: boolean;
  company_id?: number;
  department_id?: number;
  created_at: string;
  updated_at: string;
}

// =====================================================
// Initial State
// =====================================================

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
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

const SupabaseAuthContext = createContext<AuthContextType | undefined>(undefined);

// =====================================================
// Provider Component
// =====================================================

interface SupabaseAuthProviderProps {
  children: ReactNode;
}

export const SupabaseAuthProvider: React.FC<SupabaseAuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // =====================================================
  // Effects
  // =====================================================

  // Session timeout configuration
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
  let inactivityTimer: NodeJS.Timeout | null = null;
  let sessionTimer: NodeJS.Timeout | null = null;

  // Activity tracking
  const resetInactivityTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    inactivityTimer = setTimeout(() => {
      console.log('User inactive for 15 minutes, logging out...');
      logout();
    }, INACTIVITY_TIMEOUT);
  };

  // Session refresh timer
  const startSessionTimer = () => {
    if (sessionTimer) {
      clearInterval(sessionTimer);
    }
    sessionTimer = setInterval(async () => {
      try {
        await refreshAuth();
        console.log('Session refreshed successfully');
      } catch (error) {
        console.error('Session refresh failed:', error);
        logout();
      }
    }, SESSION_TIMEOUT);
  };

  // Initialize authentication on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if Supabase is properly configured
        if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
          console.warn('⚠️ Supabase not configured - skipping auth initialization');
          dispatch({ type: 'AUTH_LOGOUT' });
          return;
        }

        // Get current session
        const { session, error } = await authHelpers.getCurrentSession();
        
        if (error) {
          console.error('Session error:', error);
          dispatch({ type: 'AUTH_LOGOUT' });
          return;
        }

        if (session?.user) {
          // Get user profile from users table
          const { data: userProfile, error: profileError } = await dbHelpers.select<SupabaseUser>(
            'users',
            '*',
            { email: session.user.email }
          );

          if (profileError || !userProfile || userProfile.length === 0) {
            console.error('Profile error:', profileError);
            dispatch({ type: 'AUTH_LOGOUT' });
            return;
          }

          const user = userProfile[0];
          
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                phone: user.phone,
                is_admin: user.is_admin || false,
                is_faculty: user.is_faculty || false,
                is_student: user.is_student || false,
                is_parent: user.is_parent || false,
                is_staff: user.is_staff || false,
                company_id: user.company_id,
                department_id: user.department_id,
                permissions: [], // TODO: Implement permissions
                roles: [], // TODO: Implement roles
              },
              token: session.access_token,
              refreshToken: session.refresh_token,
              currentSession: {
                id: session.user.id,
                device: navigator.userAgent,
                ip_address: 'Unknown', // TODO: Get real IP
                location: 'Unknown', // TODO: Get real location
                isCurrentSession: true,
                lastActivity: new Date().toISOString(),
                createdAt: session.user.created_at,
              },
            },
          });

          // Start timers for authenticated user
          resetInactivityTimer();
          startSessionTimer();
        } else {
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Get user profile
        const { data: userProfile, error: profileError } = await dbHelpers.select<SupabaseUser>(
          'users',
          '*',
          { email: session.user.email }
        );

        if (!profileError && userProfile && userProfile.length > 0) {
          const user = userProfile[0];
          
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                phone: user.phone,
                is_admin: user.is_admin || false,
                is_faculty: user.is_faculty || false,
                is_student: user.is_student || false,
                is_parent: user.is_parent || false,
                is_staff: user.is_staff || false,
                company_id: user.company_id,
                department_id: user.department_id,
                permissions: [],
                roles: [],
              },
              token: session.access_token,
              refreshToken: session.refresh_token,
              currentSession: {
                id: session.user.id,
                device: navigator.userAgent,
                ip_address: 'Unknown',
                location: 'Unknown',
                isCurrentSession: true,
                lastActivity: new Date().toISOString(),
                createdAt: session.user.created_at,
              },
            },
          });
        }

        // Start timers for authenticated user
        resetInactivityTimer();
        startSessionTimer();
      } else if (event === 'SIGNED_OUT') {
        // Clear timers on logout
        if (inactivityTimer) clearTimeout(inactivityTimer);
        if (sessionTimer) clearInterval(sessionTimer);
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    });

    // Add activity listeners
    const handleActivity = () => {
      if (state.isAuthenticated) {
        resetInactivityTimer();
      }
    };

    // Listen for user activity
    document.addEventListener('mousedown', handleActivity);
    document.addEventListener('keypress', handleActivity);
    document.addEventListener('scroll', handleActivity);
    document.addEventListener('touchstart', handleActivity);

    return () => {
      subscription.unsubscribe();
      if (inactivityTimer) clearTimeout(inactivityTimer);
      if (sessionTimer) clearInterval(sessionTimer);
      document.removeEventListener('mousedown', handleActivity);
      document.removeEventListener('keypress', handleActivity);
      document.removeEventListener('scroll', handleActivity);
      document.removeEventListener('touchstart', handleActivity);
    };
  }, [state.isAuthenticated]);

  // =====================================================
  // Authentication Methods
  // =====================================================

  const login = async (credentials: { email: string; password: string }): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });

      // Check if Supabase is properly configured
      if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
        throw new Error('Supabase not configured. Please check your environment variables.');
      }

      const { data, error } = await authHelpers.signIn(credentials.email, credentials.password);
      
      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Login failed');
      }

      // Get user profile
      const { data: userProfile, error: profileError } = await dbHelpers.select<SupabaseUser>(
        'users',
        '*',
        { email: data.user.email }
      );

      if (profileError || !userProfile || userProfile.length === 0) {
        throw new Error('User profile not found');
      }

      const user = userProfile[0];

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            is_admin: user.is_admin || false,
            is_faculty: user.is_faculty || false,
            is_student: user.is_student || false,
            is_parent: user.is_parent || false,
            is_staff: user.is_staff || false,
            company_id: user.company_id,
            department_id: user.department_id,
            permissions: [],
            roles: [],
          },
          token: data.session?.access_token || '',
          refreshToken: data.session?.refresh_token || '',
          currentSession: {
            id: data.user.id,
            device: navigator.userAgent,
            ip_address: 'Unknown',
            location: 'Unknown',
            isCurrentSession: true,
            lastActivity: new Date().toISOString(),
            createdAt: data.user.created_at,
          },
        },
      });

      toast.success('Login successful!');
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = async (fromAllDevices: boolean = false): Promise<void> => {
    try {
      // Clear timers
      if (inactivityTimer) clearTimeout(inactivityTimer);
      if (sessionTimer) clearInterval(sessionTimer);

      const { error } = await authHelpers.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'AUTH_LOGOUT' });
      toast.success('Logged out successfully');
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  }): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });

      const { data, error } = await authHelpers.signUp(
        userData.email,
        userData.password,
        {
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Registration failed');
      }

      // Create user profile in users table
      const { error: profileError } = await dbHelpers.insert('users', {
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        is_admin: false,
        is_faculty: false,
        is_student: false,
        is_parent: false,
        is_staff: false,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }

      toast.success('Registration successful! Please check your email to verify your account.');
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const refreshAuth = async (): Promise<void> => {
    try {
      const { data, error } = await authHelpers.getCurrentSession();
      
      if (error || !data.session) {
        throw new Error('No valid session');
      }

      dispatch({
        type: 'AUTH_REFRESH',
        payload: { token: data.session.access_token },
      });
    } catch (error) {
      logout();
      throw error;
    }
  };

  const updateProfile = async (data: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  }): Promise<void> => {
    try {
      if (!state.user) {
        throw new Error('No user logged in');
      }

      // Update Supabase auth user
      const { error: authError } = await authHelpers.updateProfile(data);
      if (authError) {
        throw new Error(authError.message);
      }

      // Update users table
      const { error: dbError } = await dbHelpers.update(
        'users',
        state.user.id,
        data
      );

      if (dbError) {
        throw new Error(dbError.message);
      }

      dispatch({
        type: 'PROFILE_UPDATE',
        payload: data,
      });

      toast.success('Profile updated successfully');
    } catch (error: any) {
      const errorMessage = error.message || 'Profile update failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const changePassword = async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    try {
      const { error } = await authHelpers.updatePassword(data.newPassword);
      if (error) {
        throw new Error(error.message);
      }
      toast.success('Password changed successfully');
    } catch (error: any) {
      const errorMessage = error.message || 'Password change failed';
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

    // TODO: Implement proper permission checking
    // For now, return true for basic functionality
    return true;
  };

  const hasRole = (role: UserRole): boolean => {
    if (!state.user) return false;

    switch (role) {
      case 'admin':
        return state.user.is_admin || false;
      case 'faculty':
        return state.user.is_faculty || state.user.is_admin || false;
      case 'student':
        return state.user.is_student || state.user.is_admin || false;
      case 'parent':
        return state.user.is_parent || state.user.is_admin || false;
      case 'staff':
        return state.user.is_staff || state.user.is_admin || false;
      default:
        return false;
    }
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // =====================================================
  // Placeholder Methods (for compatibility)
  // =====================================================

  const verifyMFA = async (code: string, method: any): Promise<void> => {
    throw new Error('MFA not implemented yet');
  };

  const setupMFA = async (method: any, data?: Record<string, any>): Promise<{ secret?: string; qrCode?: string }> => {
    throw new Error('MFA not implemented yet');
  };

  const disableMFA = async (method: any): Promise<void> => {
    throw new Error('MFA not implemented yet');
  };

  const getActiveSessions = async (): Promise<any[]> => {
    return [state.currentSession].filter(Boolean);
  };

  const terminateSession = async (sessionId: string): Promise<void> => {
    if (state.currentSession?.id === sessionId) {
      await logout();
    }
  };

  const terminateAllOtherSessions = async (): Promise<void> => {
    // Supabase handles this automatically
    toast.success('All other sessions terminated successfully');
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
    <SupabaseAuthContext.Provider value={contextValue}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

// =====================================================
// Hook
// =====================================================

export const useSupabaseAuth = (): AuthContextType => {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};

// =====================================================
// Higher-Order Components
// =====================================================

// HOC for protecting routes that require authentication
export const withSupabaseAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> => {
  return (props: P) => {
    const { isAuthenticated, isLoading, requiresMFA } = useSupabaseAuth();

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
export const withSupabasePermission = <P extends object>(
  Component: React.ComponentType<P>,
  action: PermissionAction,
  resource: ResourceType,
  conditions?: Record<string, any>
): React.ComponentType<P> => {
  return (props: P) => {
    const { hasPermission, isAuthenticated, isLoading, requiresMFA } = useSupabaseAuth();

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
export const withSupabaseRole = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRole: UserRole
): React.ComponentType<P> => {
  return (props: P) => {
    const { hasRole, isAuthenticated, isLoading, requiresMFA } = useSupabaseAuth();

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

export default SupabaseAuthContext;
