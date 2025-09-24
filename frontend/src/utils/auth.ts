// Auth utility functions for handling localStorage and other auth-related operations

// Since we're using HTTP-only cookies, we don't need to store tokens in localStorage
// But we can store user preferences and other auth-related data

export const authStorage = {
  // Store auth-related preferences
  setAuthPreferences: (preferences: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_preferences', JSON.stringify(preferences));
    }
  },

  getAuthPreferences: () => {
    if (typeof window !== 'undefined') {
      const prefs = localStorage.getItem('auth_preferences');
      return prefs ? JSON.parse(prefs) : {};
    }
    return {};
  },

  clearAuthPreferences: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_preferences');
    }
  },

  // Store temporary auth state (like remember login preference)
  setRememberLogin: (remember: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('remember_login', remember.toString());
    }
  },

  getRememberLogin: (): boolean => {
    if (typeof window !== 'undefined') {
      const remember = localStorage.getItem('remember_login');
      return remember === 'true';
    }
    return false;
  },

  // Clear all auth-related data (useful for logout)
  clearAll: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_preferences');
      localStorage.removeItem('remember_login');
    }
  }
};

// Check if user is on a secure connection (HTTPS)
export const isSecureConnection = (): boolean => {
  if (typeof window === 'undefined') return true; // SSR context
  return window.location.protocol === 'https:' || window.location.hostname === 'localhost';
};

// Format auth error messages
export const formatAuthError = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }

  // Default error messages based on status codes
  const status = error?.response?.status;
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Invalid credentials. Please try again.';
    case 403:
      return 'Access forbidden. You do not have permission to perform this action.';
    case 404:
      return 'Service not found. Please try again later.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'Server error. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};