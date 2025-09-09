// =====================================================
// Session Configuration
// =====================================================

export const SESSION_CONFIG = {
  // Session timeout (30 minutes)
  SESSION_TIMEOUT: 30 * 60 * 1000,
  
  // Inactivity timeout (15 minutes)
  INACTIVITY_TIMEOUT: 15 * 60 * 1000,
  
  // Refresh interval (25 minutes - before session expires)
  REFRESH_INTERVAL: 25 * 60 * 1000,
  
  // Activity events to track
  ACTIVITY_EVENTS: [
    'mousedown',
    'keypress', 
    'keydown',
    'scroll',
    'touchstart',
    'click',
    'focus'
  ],
  
  // Session storage keys
  STORAGE_KEYS: {
    SESSION: 's-erp-session',
    REFRESH_TOKEN: 's-erp-refresh-token',
    LAST_ACTIVITY: 's-erp-last-activity'
  }
};

// Session utilities
export const sessionUtils = {
  // Get last activity time
  getLastActivity: (): number => {
    const lastActivity = localStorage.getItem(SESSION_CONFIG.STORAGE_KEYS.LAST_ACTIVITY);
    return lastActivity ? parseInt(lastActivity, 10) : Date.now();
  },

  // Update last activity time
  updateLastActivity: (): void => {
    localStorage.setItem(SESSION_CONFIG.STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
  },

  // Check if session is expired
  isSessionExpired: (): boolean => {
    const lastActivity = sessionUtils.getLastActivity();
    const now = Date.now();
    return (now - lastActivity) > SESSION_CONFIG.INACTIVITY_TIMEOUT;
  },

  // Clear session data
  clearSession: (): void => {
    Object.values(SESSION_CONFIG.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};
