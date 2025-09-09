// =====================================================
// OpenEducat ERP Frontend - Authentication Types
// Comprehensive type definitions for auth system
// =====================================================

export type UserRole = 'admin' | 'faculty' | 'student' | 'parent' | 'staff';

export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'manage';

export type ResourceType = 
  | 'user'
  | 'student'
  | 'faculty'
  | 'course'
  | 'department'
  | 'attendance'
  | 'exam'
  | 'assignment'
  | 'grade'
  | 'fee'
  | 'library'
  | 'report'
  | 'notification'
  | 'document'
  | 'setting';

export interface Permission {
  id: string;
  name: string;
  description: string;
  action: PermissionAction;
  resource: ResourceType;
  conditions?: Record<string, any>;
}

export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Role {
  id: string;
  name: UserRole;
  description: string;
  permissionGroups: PermissionGroup[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  id: string;
  userId: string;
  deviceInfo: {
    browser: string;
    os: string;
    device: string;
    ip: string;
  };
  lastActive: string;
  expiresAt: string;
  isCurrentSession: boolean;
}

export interface MFAMethod {
  id: string;
  type: 'authenticator' | 'sms' | 'email';
  isEnabled: boolean;
  lastVerified?: string;
  phoneNumber?: string;
  email?: string;
}

import { User as BaseUser } from './index';

export interface AuthUser extends BaseUser {
  avatar_url?: string;
  roles: Role[];
  permissions: Permission[];
  is_staff: boolean;
  is_active: boolean;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  mfa_methods: MFAMethod[];
}

export interface UserLoginRequest {
  email: string;
  password: string;
  mfa_code?: string;
  remember_me?: boolean;
}

export interface UserLoginResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
  expiresIn: number;
  requiresMFA?: boolean;
  availableMFAMethods?: MFAMethod[];
}

export interface JwtPayload {
  sub: string;
  email: string;
  roles: UserRole[];
  permissions: string[];
  exp: number;
  iat: number;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  currentSession: UserSession | null;
  activeSessions: UserSession[];
  requiresMFA: boolean;
  mfaVerified: boolean;
}

export interface AuthAction {
  type: 
    | 'AUTH_START'
    | 'AUTH_SUCCESS'
    | 'AUTH_FAILURE'
    | 'AUTH_LOGOUT'
    | 'AUTH_REFRESH'
    | 'PROFILE_UPDATE'
    | 'CLEAR_ERROR'
    | 'SESSION_UPDATE'
    | 'MFA_REQUIRED'
    | 'MFA_VERIFIED'
    | 'MFA_FAILED';
  payload?: any;
}

export interface AuthContextType extends AuthState {
  login: (credentials: UserLoginRequest) => Promise<void>;
  logout: (fromAllDevices?: boolean) => Promise<void>;
  register: (userData: any) => Promise<void>;
  refreshAuth: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  changePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
  clearError: () => void;
  hasPermission: (action: PermissionAction, resource: ResourceType, conditions?: Record<string, any>) => boolean;
  hasRole: (role: UserRole) => boolean;
  verifyMFA: (code: string, method: MFAMethod['type']) => Promise<void>;
  setupMFA: (method: MFAMethod['type'], data?: Record<string, any>) => Promise<{ secret?: string; qrCode?: string; }>;
  disableMFA: (method: MFAMethod['type']) => Promise<void>;
  getActiveSessions: () => Promise<UserSession[]>;
  terminateSession: (sessionId: string) => Promise<void>;
  terminateAllOtherSessions: () => Promise<void>;
}

