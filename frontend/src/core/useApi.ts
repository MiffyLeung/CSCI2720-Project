// FILEPATH: frontend/src/core/useApi.ts

import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

const REACT_APP_API = process.env.REACT_APP_API || 'http://localhost:5000/api';

/**
 * Custom hook to handle API requests with token-based authentication.
 * Supports AbortController for request cancellation, error handling, and optional callbacks.
 *
 * @returns {Function} A function to perform API requests with enhanced control.
 */
export const useApi = () => {
  const { token, resetAuth } = useAuth();
  const navigate = useNavigate();

  /**
   * Handles API requests with token authentication, error handling, and callbacks.
   * @param {string} endpoint - The API endpoint.
   * @param {RequestInit} options - Additional fetch options (e.g., method, headers, body).
   * @param {AbortSignal} signal - Optional AbortController signal for request cancellation.
   * @param {(responseData: any) => void} [successCallback] - Optional success callback.
   * @param {(error: any) => void} [errorCallback] - Optional error callback.
   * @returns {Promise<any>} The parsed response data.
   * @throws Will throw an error if request fails or is aborted.
   */
  const apiRequest = useCallback(
    async (
      endpoint: string,
      options: RequestInit = {},
      signal?: AbortSignal,
      successCallback?: (responseData: any) => void,
      errorCallback?: (error: any) => void
    ): Promise<any> => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };

      if (token && endpoint !== '/login') {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const requestOptions: RequestInit = {
        ...options,
        headers,
        signal, // Attach AbortController signal
      };

      try {
        const response = await fetch(`${REACT_APP_API}${endpoint}`, requestOptions);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Request failed');
        }
        if (successCallback) successCallback(data.data);
        return data.data;
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Request aborted.');
        } else {
          console.error('API Request Error:', error);
          if (errorCallback) errorCallback(error);
        }
        throw error;
      }
    },
    [token] // Add dependencies for useCallback
  );

  /**
   * Handles common error codes and invokes appropriate callbacks.
   * @param {number} status - HTTP status code.
   * @param {any} error - Error object.
   * @param {(error: any) => void} [errorCallback] - Optional error callback.
   */
  const handleError = (status: number, error: any, errorCallback?: (error: any) => void) => {
    switch (status) {
      case 400:
        alert('Bad Request. Please try again.');
        break;
      case 401:
        alert('Unauthorized. Please log in again.');
        resetAuth();
        navigate('/login');
        break;
      case 403:
        alert('Forbidden: Insufficient permissions.');
        navigate('/');
        break;
      case 410:
        alert('Invalid account or password.');
        resetAuth();
        navigate('/login');
        break;
      case 423:
        alert('Your account has been banned.');
        resetAuth();
        navigate('/login');
        break;
      default:
        if (errorCallback) errorCallback(error);
    }
  };

  return apiRequest;
};
