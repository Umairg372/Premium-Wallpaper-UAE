const ADMIN_AUTH_KEY = 'admin_token';
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Authenticate admin user with backend
 */
export const loginAdmin = async (password: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    console.log('DEBUG: Login response status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('DEBUG: Login response data:', data);
      if (data.success && data.token) {
        localStorage.setItem(ADMIN_AUTH_KEY, data.token);
        console.log('DEBUG: Token stored:', data.token);
        console.log('DEBUG: localStorage after setItem:', localStorage.getItem(ADMIN_AUTH_KEY));
        return true;
      }
    } else if (response.status === 401) {
      const errorData = await response.json();
      console.error('DEBUG: Login failed with status 401. Error data:', errorData);
      if (errorData.error && errorData.error.includes('No admin password has been set')) {
        throw new Error('PASSWORD_NOT_SET');
      }
    }

    return false;
  } catch (error) {
    console.error('DEBUG: Login error (catch block):', error);
    if (error instanceof Error && error.message === 'PASSWORD_NOT_SET') {
      throw error;
    }
    return false;
  }
};

/**
 * Logout admin user from backend
 */
export const logoutAdmin = async (): Promise<void> => {
  try {
    const token = localStorage.getItem(ADMIN_AUTH_KEY);
    if (token) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem(ADMIN_AUTH_KEY);
  }
};

/**
 * Check if admin is authenticated
 */
export const isAdminAuthenticated = (): boolean => {
  const token = localStorage.getItem(ADMIN_AUTH_KEY);
  return !!token;
};

/**
 * Get auth token for API requests
 */
export const getAuthToken = (): string | null => {
  const token = localStorage.getItem(ADMIN_AUTH_KEY);
  console.log('DEBUG: localStorage before getItem:', localStorage);
  console.log('DEBUG: localStorage.getItem("admin_token") result:', token);
  return token;
};

/**
 * Set auth token
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem(ADMIN_AUTH_KEY, token);
};

/**
 * Check if admin password is set
 */
export const checkAdminPasswordStatus = async (): Promise<{isPasswordSet: boolean}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/status`);

    if (response.ok) {
      const data = await response.json();
      return { isPasswordSet: data.isPasswordSet };
    } else {
      throw new Error('Could not check password status');
    }
  } catch (error) {
    console.error('Password status check error:', error);
    // If there's an error, assume no password is set for safety
    return { isPasswordSet: false };
  }
};