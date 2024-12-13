// frontend/src/utils/api.ts
const REACT_APP_API = process.env.REACT_APP_API || 'http://localhost:5000/api';

/**
 * Handles API requests with token-based authentication and error handling.
 * @param endpoint API endpoint to call.
 * @param options Additional fetch options.
 * @param cleanAuth Function to clear authentication (injected from useAuthState).
 * @returns Parsed response data.
 */
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
  cleanAuth: () => void
): Promise<any> => {
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };
  
  // Add Authorization header only if the token exists
  if (typeof localStorage !== 'undefined' && endpoint !== '/login') {
    const token = localStorage.getItem('token');
    headers['Authorization'] = `Bearer ${token}`;
  }

  const requestOptions = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${REACT_APP_API}${endpoint}`, requestOptions);
    const data = await response.json();
    if (!response.ok) {
      // Handle known error codes from authMiddleware
      switch (response.status) {
        case 400:
          if (data.code === 'NO_TOKEN_PROVIDED') {
            alert('Unauthorized: No token provided. Please log in.');
            cleanAuth();
            window.location.href = '/login';
          }
          break;
        case 401:
          if (data.code === 'INVALID_TOKEN') {
            alert('Invalid token. Please log in again.');
            cleanAuth();
            window.location.href = '/login';
          }
          break;
        case 410:
          if (data.code === 'USER_NOT_FOUND') {
            alert('Account not found. Please contact support.');
            cleanAuth();
            window.location.href = '/login';
          }
          break;
        case 423:
          if (data.code === 'ACCOUNT_BANNED') {
            alert('Your account has been banned.');
            cleanAuth();
            window.location.href = '/login';
          }
          break;
        case 403:
          if (data.code === 'INSUFFICIENT_PERMISSIONS') {
            alert('You do not have sufficient permissions to perform this action.');
          }
          break;
        default:
          alert(data.message || 'An unknown error occurred.');
      }
      throw new Error(data.message || 'Request failed.');
    }
    
    return data.data; // Return the response data if successful
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};
