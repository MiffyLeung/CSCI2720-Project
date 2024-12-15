// frontend/src/core/useApi.ts

import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const REACT_APP_API = process.env.REACT_APP_API || 'http://localhost:5000/api';

/**
 * Custom hook to handle API requests with token-based authentication.
 * Provides error handling and supports optional callback execution after requests.
 * @returns A function to perform API requests.
 */
export const useApi = () => {
    const { token, resetAuth } = useAuth();
    const navigate = useNavigate();

    /**
     * Handles API requests with token-based authentication, error handling, and optional callbacks.
     * @param endpoint - The API endpoint to call.
     * @param options - Additional fetch options (e.g., method, headers, body).
     * @param successCallback - Optional callback for handling a successful response.
     * @param errorCallback - Optional callback for handling errors.
     * @returns The parsed response data from the API.
     * @throws Will throw an error if the response is not OK or if an unknown error occurs.
     */
    const apiRequest = async (
        endpoint: string,
        options: RequestInit = {},
        successCallback?: (responseData: any) => void,
        errorCallback?: (error: any) => void
    ): Promise<any> => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>), // Ensure the headers are of the correct type
        };

        if (token && endpoint !== '/login') {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const requestOptions: RequestInit = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(`${REACT_APP_API}${endpoint}`, requestOptions);
            const data = await response.json();

            if (!response.ok) {
                // Handle known error codes
                switch (response.status) {
                    case 400:
                        alert('Unauthorized: No token provided. Please log in.');
                        resetAuth();
                        navigate('/login');
                        break;
                    case 401:
                        alert('Authentication failed. Please log in again.');
                        resetAuth();
                        navigate('/login');
                        break;
                    case 410:
                        alert('Account or Password Incorrect. Please contact support.');
                        resetAuth();
                        navigate('/login');
                        break;
                    case 423:
                        alert('Your account has been banned.');
                        resetAuth();
                        navigate('/login');
                        break;
                    case 403:
                        alert('You do not have sufficient permissions to perform this action.');
                        navigate('/');
                        break;
                    default:
                        if (errorCallback) errorCallback(data.message || 'Request failed');
                }
                throw new Error(data.message || 'Request failed.');
            }

            if (successCallback) successCallback(data.data);
            return data.data;
        } catch (error) {
            console.error('API error:', error);
            if (errorCallback) errorCallback(error);
            throw error;
        }
    };

    return apiRequest;
};
