import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { startLoading, stopLoading } from "../slices/theme.js"
import { setCredentials, logout } from "../slices/auth.js"
import { resources } from '../constants/resources';
import { NavigationRef } from '~/utils/navigationRef';

const API = process.env.EXPO_PUBLIC_API_URL;
console.log('Initializing API with URL:', API);

const TAG_TYPES = resources.map(resource => resource.toUpperCase());

export const addTagType = (tagType) => {
  const normalizedTagType = tagType.toUpperCase();

  if (!apiSlice.enhanceEndpoints.config.tagTypes.includes(normalizedTagType)) {
    apiSlice.enhanceEndpoints.addTagTypes([normalizedTagType]);
    console.log(`Added new tag type: ${normalizedTagType}`);
  }
};

const baseQuery = fetchBaseQuery({
  baseUrl: `${API}/api/v1/`,
  credentials: 'include',
  prepareHeaders: (headers, { getState, args }) => {
    const token = getState().auth.token;
    headers.set('Accept', 'application/json');
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('ngrok-skip-browser-warning', '1');

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
  onQueryStarted: (args, { dispatch, getState, queryFulfilled }) => {
    console.log(`API Request starting: ${args}`);
  },
  onSuccess: (args, response) => {
    console.log(`API Response success:`, response);
  },
  onError: (args, error) => {
    console.error(`API Response error:`, error);
  },
});

// Helper to extract resource type from endpoint path
function getResourceTypeFromEndpoint(endpoint = '') {
  if (!endpoint) return 'Resource';

  const parts = endpoint.split('/').filter(Boolean);
  if (parts.length > 0) {
    const resource = parts[0];
    return resource.charAt(0).toUpperCase() + resource.slice(1, -1); // Remove trailing 's' if present
  }

  return 'Resource';
}

// Handle API errors with consistent navigation to error screen
function handleApiError(error, endpoint) {
  if (!NavigationRef || !NavigationRef.isReady()) return;

  const resourceType = getResourceTypeFromEndpoint(endpoint);

  if (error.status === 404) {
    NavigationRef.navigate('ErrorScreen', {
      statusCode: 404,
      resourceType,
      message: `The ${resourceType.toLowerCase()} you're looking for could not be found.`
    });
  } else if (error.status === 500) {
    NavigationRef.navigate('ErrorScreen', {
      statusCode: 500,
      resourceType,
      message: error.data?.message || 'Server error occurred'
    });
  } else if (error.status === 'FETCH_ERROR') {
    NavigationRef.navigate('ErrorScreen', {
      statusCode: 'network',
      resourceType,
      message: 'Network connection issue'
    });
  } else if (error.status !== 401 && error.status !== 403) {
    // Don't navigate on auth errors as they're handled differently
    NavigationRef.navigate('ErrorScreen', {
      statusCode: error.status || 0,
      resourceType,
      message: error.data?.message || 'An unexpected error occurred'
    });
  }
}

const _baseQuery = async (args, api, extraOptions) => {
  api.dispatch(startLoading());
  try {
    const result = await baseQuery(args, api, extraOptions);

    if (result === undefined) {
      console.error('API request result is undefined');
      return { error: { status: 'FETCH_ERROR', data: 'API request result is undefined' } };
    }

    if (result.error && ![401, 403, 419].includes(result.error.status)) {
      // Handle non-auth errors with custom error screen
      handleApiError(result.error, args.url);
      return result;
    }

    if (![401, 403, 419].includes(result?.error?.status)) {
      return result || 'Forbidden';
    }

    const refreshResult = await baseQuery('/refresh', api, extraOptions);
    if (refreshResult?.data?.token) {
      const userInfo = api.getState().auth.user; // Changed from userInfo to user
      const token = refreshResult.data.token;
      api.dispatch(setCredentials({ userInfo, token, role: userInfo?.role }));
      return await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
      return { error: { status: 'UNAUTHORIZED', data: 'Refresh token failed' } };
    }

  } catch (error) {
    console.error('Error in Base Query:', error);
    return { error: { status: 'FETCH_ERROR', data: error.message } };
  } finally {
    api.dispatch(stopLoading());
  }
};

const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: _baseQuery,
  tagTypes: TAG_TYPES,
  endpoints: (builder) => ({}),
});

export default apiSlice;
