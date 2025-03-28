import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { startLoading, stopLoading } from "../slices/theme.js"
import { setCredentials, logout } from "../slices/auth.js"
import { resources } from '../constants/resources';

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
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;

    headers.set('Accept', 'application/json');
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Content-Type', 'application/json');
    headers.set('ngrok-skip-browser-warning', '1');
    headers.set('mode', 'no-cors');

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

const _baseQuery = async (args, api, extraOptions) => {
  api.dispatch(startLoading());
  try {
    const result = await baseQuery(args, api, extraOptions);

    if (result === undefined) {
      console.error('API request result is undefined');
      return { error: { status: 'FETCH_ERROR', data: 'API request result is undefined' } };
    }

    if (![401, 403, 419].includes(result?.error?.status)) {
      return result || 'Forbidden';
    }

    const refreshResult = await baseQuery('/refresh', api, extraOptions);
    if (refreshResult?.data?.token) {
      const userInfo = api.getState().auth.userInfo;
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
