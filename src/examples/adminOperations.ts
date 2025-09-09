// =====================================================
// Admin Operations Examples
// Examples of how to use the service role key for admin operations
// =====================================================

import { adminHelpers } from '../services/supabase';
import { isAdminConfigured } from '../config/supabase';

// Example: Bulk create users (admin operation)
export const bulkCreateUsers = async (usersData: any[]) => {
  if (!isAdminConfigured()) {
    throw new Error('Service role key not configured. Admin operations not available.');
  }

  try {
    const { data, error } = await adminHelpers.bulkInsert('users', usersData);
    
    if (error) {
      throw new Error(error.message);
    }

    console.log(`Successfully created ${data?.length || 0} users`);
    return { success: true, data };
  } catch (error: any) {
    console.error('Bulk user creation failed:', error);
    throw error;
  }
};

// Example: Get all users (admin operation)
export const getAllUsersAdmin = async () => {
  if (!isAdminConfigured()) {
    throw new Error('Service role key not configured. Admin operations not available.');
  }

  try {
    const { data, error } = await adminHelpers.getAllUsers();
    
    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Get all users failed:', error);
    throw error;
  }
};

// Example: Update user role (admin operation)
export const updateUserRole = async (userId: string, role: string) => {
  if (!isAdminConfigured()) {
    throw new Error('Service role key not configured. Admin operations not available.');
  }

  try {
    const updates = {
      role,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await adminHelpers.updateUser(userId, updates);
    
    if (error) {
      throw new Error(error.message);
    }

    console.log(`User ${userId} role updated to ${role}`);
    return { success: true, data };
  } catch (error: any) {
    console.error('User role update failed:', error);
    throw error;
  }
};

// Example: Delete user (admin operation)
export const deleteUserAdmin = async (userId: string) => {
  if (!isAdminConfigured()) {
    throw new Error('Service role key not configured. Admin operations not available.');
  }

  try {
    const { error } = await adminHelpers.deleteUser(userId);
    
    if (error) {
      throw new Error(error.message);
    }

    console.log(`User ${userId} deleted successfully`);
    return { success: true };
  } catch (error: any) {
    console.error('User deletion failed:', error);
    throw error;
  }
};

// Example: Check if admin operations are available
export const checkAdminAvailability = () => {
  const isAvailable = isAdminConfigured();
  console.log(`Admin operations available: ${isAvailable}`);
  return isAvailable;
};
