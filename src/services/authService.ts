// =====================================================
// OpenEducat ERP Frontend - Authentication Service
// Handles all authentication-related API calls
// =====================================================

import { apiClient } from './api';

interface LoginHistoryEntry {
  id: string;
  timestamp: string;
  ip_address: string;
  user_agent: string;
  location?: string;
  status: 'success' | 'failed';
  failure_reason?: string;
}

interface SecurityLogEntry {
  id: string;
  timestamp: string;
  event_type: 'password_change' | 'mfa_setup' | 'mfa_disable' | 'email_change' | 'phone_change' | 'security_preference_update';
  ip_address: string;
  user_agent: string;
  details?: Record<string, unknown>;
}

interface SecurityPreferences {
  mfa_required: boolean;
  allowed_ips?: string[];
  allowed_devices?: string[];
  login_notification: boolean;
  suspicious_activity_notification: boolean;
  password_expiry_days?: number;
  session_timeout_minutes?: number;
}
import {
  UserLoginRequest,
  UserLoginResponse,
  AuthUser,
  MFAMethod,
  UserSession,
  Permission,
  PermissionGroup,
  Role,
} from '../types/auth';

class AuthService {
  // =====================================================
  // Authentication
  // =====================================================

  async login(credentials: UserLoginRequest): Promise<UserLoginResponse> {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  }

  async logout(fromAllDevices: boolean = false): Promise<void> {
    await apiClient.post('/auth/logout', { fromAllDevices });
  }

  async register(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    role?: string;
  }): Promise<UserLoginResponse> {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<{ token: string; expiresIn: number }> {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  }

  async verifyToken(): Promise<void> {
    await apiClient.post('/auth/verify');
  }

  // =====================================================
  // Profile Management
  // =====================================================

  async getProfile(): Promise<{ data: AuthUser }> {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  }

  async updateProfile(data: Partial<AuthUser>): Promise<{ data: AuthUser }> {
    const response = await apiClient.put('/auth/profile', data);
    return response.data;
  }

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    await apiClient.post('/auth/change-password', data);
  }

  async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/reset-password', { token, newPassword });
  }

  // =====================================================
  // Multi-Factor Authentication
  // =====================================================

  async getMFAMethods(): Promise<MFAMethod[]> {
    const response = await apiClient.get('/auth/mfa/methods');
    return response.data;
  }

  async setupMFA(method: MFAMethod['type'], data?: {
    phone?: string;
    email?: string;
    deviceName?: string;
  }): Promise<{ secret?: string; qrCode?: string }> {
    const response = await apiClient.post('/auth/mfa/setup', { method, ...data });
    return response.data;
  }

  async verifyMFA(code: string, method: MFAMethod['type']): Promise<{ token: string }> {
    const response = await apiClient.post('/auth/mfa/verify', { code, method });
    return response.data;
  }

  async disableMFA(method: MFAMethod['type']): Promise<void> {
    await apiClient.delete(`/auth/mfa/${method}`);
  }

  // =====================================================
  // Session Management
  // =====================================================

  async getActiveSessions(): Promise<UserSession[]> {
    const response = await apiClient.get('/auth/sessions');
    return response.data;
  }

  async terminateSession(sessionId: string): Promise<void> {
    await apiClient.delete(`/auth/sessions/${sessionId}`);
  }

  async terminateAllOtherSessions(): Promise<void> {
    await apiClient.delete('/auth/sessions');
  }

  // =====================================================
  // Role & Permission Management
  // =====================================================

  async getRoles(): Promise<Role[]> {
    const response = await apiClient.get('/auth/roles');
    return response.data;
  }

  async getPermissions(): Promise<Permission[]> {
    const response = await apiClient.get('/auth/permissions');
    return response.data;
  }

  async getPermissionGroups(): Promise<PermissionGroup[]> {
    const response = await apiClient.get('/auth/permission-groups');
    return response.data;
  }

  async assignRole(userId: string, roleId: string): Promise<void> {
    await apiClient.post(`/auth/users/${userId}/roles`, { roleId });
  }

  async removeRole(userId: string, roleId: string): Promise<void> {
    await apiClient.delete(`/auth/users/${userId}/roles/${roleId}`);
  }

  async assignPermission(userId: string, permissionId: string): Promise<void> {
    await apiClient.post(`/auth/users/${userId}/permissions`, { permissionId });
  }

  async removePermission(userId: string, permissionId: string): Promise<void> {
    await apiClient.delete(`/auth/users/${userId}/permissions/${permissionId}`);
  }

  // =====================================================
  // Email & Phone Verification
  // =====================================================

  async sendEmailVerification(): Promise<void> {
    await apiClient.post('/auth/verify-email/send');
  }

  async verifyEmail(token: string): Promise<void> {
    await apiClient.post('/auth/verify-email', { token });
  }

  async sendPhoneVerification(): Promise<void> {
    await apiClient.post('/auth/verify-phone/send');
  }

  async verifyPhone(code: string): Promise<void> {
    await apiClient.post('/auth/verify-phone', { code });
  }

  // =====================================================
  // Security & Audit
  // =====================================================

  async getLoginHistory(userId: string): Promise<LoginHistoryEntry[]> {
    const response = await apiClient.get(`/auth/users/${userId}/login-history`);
    return response.data;
  }

  async getSecurityLog(userId: string): Promise<SecurityLogEntry[]> {
    const response = await apiClient.get(`/auth/users/${userId}/security-log`);
    return response.data;
  }

  async updateSecurityPreferences(preferences: SecurityPreferences): Promise<void> {
    await apiClient.put('/auth/security-preferences', preferences);
  }
}

export const authService = new AuthService();

