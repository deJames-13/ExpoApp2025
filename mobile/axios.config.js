import axios from 'axios';
import { STORAGE_KEYS, getCredentials } from './states/utils/authUtils';

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 30000,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'ngrok-ignore-browser-warning': '1',
    }
});

// Add auth token to requests
api.interceptors.request.use(
    async (config) => {
        try {
            // Get token from secure storage using the correct function
            const { token } = await getCredentials();
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error getting auth token:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Create a special instance for FCM token updates
export const fcmApi = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 30000,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Add auth token to FCM token update requests
fcmApi.interceptors.request.use(
    async (config) => {
        try {
            // Use getCredentials instead of getStorageItem
            const { token } = await getCredentials();
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error getting auth token for FCM request:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor remains the same
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout - the server took too long to respond');
        } else if (error.code === 'ERR_NETWORK') {
            console.error('Network error - please check if the Django server is running at http://127.0.0.1:8000');
        } else {
            console.error('API Error:', error.message || 'Unknown error');
        }
        return Promise.reject(error);
    }
);

fcmApi.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.log('FCM API Error:', error.message || 'Unknown error');
        // Don't fail the app if FCM token update fails
        return Promise.resolve({ status: 'failed', error });
    }
);

export default api;