import axios from 'axios';
import { NavigationRef } from '~/utils/navigationRef';

// Create axios instance with proper configuration
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,  // process.env. Make sure this matches your Django server
  timeout: 30000, // Increase timeout to 30 seconds
  withCredentials: false, // Required for CORS when using credentials
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add request interceptor to handle tokens if needed
api.interceptors.request.use(
  (config) => {
    // You can add authorization headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - the server took too long to respond');
      navigateToErrorScreen(0, 'The server took too long to respond', 'Server');
    } else if (error.code === 'ERR_NETWORK') {
      console.error('Network error - please check if the Django server is running at http://127.0.0.1:8000');
      navigateToErrorScreen('network', 'Cannot connect to server', 'Server');
    } else if (error.response) {
      // The request was made and the server responded with a status code
      const statusCode = error.response.status;
      const resourceType = getResourceTypeFromUrl(error.config.url);

      console.error(`API Error: Request failed with status code ${statusCode}`);
      navigateToErrorScreen(statusCode, error.response.data?.message, resourceType);
    } else {
      console.error('API Error:', error.message || 'Unknown error');
      navigateToErrorScreen(500, error.message || 'Unknown error occurred', 'Resource');
    }

    return Promise.reject(error);
  }
);

// Helper to extract resource type from URL for better error messages
function getResourceTypeFromUrl(url = '') {
  if (!url) return 'Resource';

  // Extract the resource name from URL patterns like /api/v1/products/123
  const parts = url.split('/').filter(Boolean);
  const resourceIndex = parts.findIndex(part =>
    ['api', 'v1'].includes(part)
  );

  if (resourceIndex !== -1 && parts.length > resourceIndex + 1) {
    // Get the resource type and capitalize it
    const resource = parts[resourceIndex + 1];
    return resource.charAt(0).toUpperCase() + resource.slice(1, -1); // Remove trailing 's'
  }

  return 'Resource';
}

// Navigate to error screen with the appropriate error details
function navigateToErrorScreen(statusCode, message, resourceType) {
  if (NavigationRef && NavigationRef.isReady()) {
    NavigationRef.navigate('ErrorScreen', {
      statusCode,
      message,
      resourceType
    });
  }
}

export default api;