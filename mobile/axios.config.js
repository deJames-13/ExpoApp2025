import axios from 'axios';

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

api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

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

export default api;