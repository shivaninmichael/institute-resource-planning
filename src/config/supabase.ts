// =====================================================
// OpenEducat ERP Frontend - Supabase Configuration
// Environment-based Supabase configuration
// =====================================================

export const supabaseConfig = {
  url: process.env.REACT_APP_SUPABASE_URL || '',
  anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || '',
  serviceRoleKey: process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY || '',
  useSupabaseAuth: process.env.REACT_APP_USE_SUPABASE_AUTH === 'true',
  appName: process.env.REACT_APP_APP_NAME || 'S-ERP',
  environment: process.env.REACT_APP_ENVIRONMENT || 'development',
  enableDebug: process.env.REACT_APP_ENABLE_DEBUG === 'true',
};

// Validate configuration
export const validateSupabaseConfig = () => {
  const errors: string[] = [];

  if (!supabaseConfig.url) {
    errors.push('REACT_APP_SUPABASE_URL is required');
  }

  if (!supabaseConfig.anonKey) {
    errors.push('REACT_APP_SUPABASE_ANON_KEY is required');
  }

  if (errors.length > 0) {
    console.error('❌ Supabase configuration errors:', errors);
    return false;
  }

  console.log('✅ Supabase configuration is valid');
  return true;
};

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseConfig.useSupabaseAuth && 
         supabaseConfig.url && 
         supabaseConfig.anonKey;
};

// Check if admin operations are available
export const isAdminConfigured = () => {
  return supabaseConfig.serviceRoleKey && 
         supabaseConfig.url;
};

export default supabaseConfig;
