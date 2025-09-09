// =====================================================
// OpenEducat ERP Frontend - Supabase Client
// Supabase client configuration for frontend
// =====================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder-key';
const supabaseServiceKey = process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY || '';

// Validate configuration
console.log('🔍 Debug - Environment variables:');
console.log('REACT_APP_SUPABASE_URL:', process.env.REACT_APP_SUPABASE_URL);
console.log('REACT_APP_SUPABASE_ANON_KEY:', process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Present' : 'Missing');

if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase configuration missing. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env file');
  console.warn('⚠️ Using placeholder values - Supabase features will not work');
} else {
  console.log('✅ Supabase configuration loaded successfully');
}

// Create Supabase client (using anon key for client-side operations)
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
});

// Auth helper functions
export const authHelpers = {
  // Sign up with email and password
  signUp: async (email: string, password: string, userData?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    role?: string;
    avatar_url?: string;
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Get current session
  getCurrentSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    return { data, error };
  },

  // Update password
  updatePassword: async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    return { data, error };
  },

  // Update user profile
  updateProfile: async (updates: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    avatar_url?: string;
    role?: string;
    preferences?: Record<string, unknown>;
  }) => {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    });
    return { data, error };
  }
};

// Database helper functions
export const dbHelpers = {
  // Generic select function
  select: async <T = unknown>(
    table: string,
    columns = '*',
    filters?: Record<string, string | number | boolean | null>
  ) => {
    let query = supabase.from(table).select<string, T>(columns);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    
    const { data, error } = await query;
    return { data, error };
  },

  // Generic insert function
  insert: async <T = unknown>(table: string, data: Omit<T, 'id'>) => {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select<string, T>();
    return { result, error };
  },

  // Generic update function
  update: async <T = unknown>(
    table: string,
    id: string | number,
    updates: Partial<Omit<T, 'id'>>
  ) => {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select<string, T>();
    return { data, error };
  },

  // Generic delete function
  delete: async (table: string, id: string | number) => {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    return { error };
  },

  // Upload file to storage
  uploadFile: async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    return { data, error };
  },

  // Download file from storage
  downloadFile: async (bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);
    return { data, error };
  },

  // Get public URL for file
  getPublicUrl: (bucket: string, path: string) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return data.publicUrl;
  }
};

// Real-time subscription helpers
export const realtimeHelpers = {
  // Subscribe to table changes
  subscribe: <T = unknown>(
    table: string,
    callback: (payload: {
      eventType: 'INSERT' | 'UPDATE' | 'DELETE';
      new: T | null;
      old: T | null;
      schema: string;
      table: string;
      commit_timestamp: string;
    }) => void
  ) => {
    return supabase
      .channel(`${table}_changes`)
      .on('postgres_changes' as any, 
        { event: '*', schema: 'public', table }, 
        callback
      )
      .subscribe();
  },

  // Subscribe to specific record changes
  subscribeToRecord: <T = unknown>(
    table: string,
    id: string | number,
    callback: (payload: {
      eventType: 'INSERT' | 'UPDATE' | 'DELETE';
      new: T | null;
      old: T | null;
      schema: string;
      table: string;
      commit_timestamp: string;
    }) => void
  ) => {
    return supabase
      .channel(`${table}_${id}_changes`)
      .on('postgres_changes' as any, 
        { event: '*', schema: 'public', table, filter: `id=eq.${id}` }, 
        callback
      )
      .subscribe();
  }
};

// Create service role client (for admin operations that bypass RLS)
export const supabaseAdmin: SupabaseClient | null = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      db: {
        schema: 'public'
      }
    })
  : null;

// Admin helper functions (use service role key)
export const adminHelpers = {
  // Get all users (bypasses RLS)
  getAllUsers: async () => {
    if (!supabaseAdmin) {
      throw new Error('Service role key not configured');
    }
    const { data, error } = await supabaseAdmin.from('users').select('*');
    return { data, error };
  },

  // Create user directly (bypasses RLS)
  createUser: async (userData: any) => {
    if (!supabaseAdmin) {
      throw new Error('Service role key not configured');
    }
    const { data, error } = await supabaseAdmin.from('users').insert(userData).select();
    return { data, error };
  },

  // Update user directly (bypasses RLS)
  updateUser: async (id: string, updates: any) => {
    if (!supabaseAdmin) {
      throw new Error('Service role key not configured');
    }
    const { data, error } = await supabaseAdmin.from('users').update(updates).eq('id', id).select();
    return { data, error };
  },

  // Delete user directly (bypasses RLS)
  deleteUser: async (id: string) => {
    if (!supabaseAdmin) {
      throw new Error('Service role key not configured');
    }
    const { error } = await supabaseAdmin.from('users').delete().eq('id', id);
    return { error };
  },

  // Bulk operations
  bulkInsert: async (table: string, data: any[]) => {
    if (!supabaseAdmin) {
      throw new Error('Service role key not configured');
    }
    const { data: result, error } = await supabaseAdmin.from(table).insert(data);
    return { data: result, error };
  },

  // Execute raw SQL (if needed)
  executeSQL: async (query: string) => {
    if (!supabaseAdmin) {
      throw new Error('Service role key not configured');
    }
    const { data, error } = await supabaseAdmin.rpc('exec_sql', { query });
    return { data, error };
  }
};

// Export default client
export default supabase;
