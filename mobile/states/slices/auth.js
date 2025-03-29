import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS, persistCredentials, clearCredentials } from '../utils/authUtils';

// Initial state with empty values
const initialState = {
    user: null,
    token: null,
    fcmToken: null, // Add FCM token to auth state
    isAuthenticated: false,
    isLoading: false,
    onboarding: {
        hasBasicInfo: false,
        hasAddressInfo: false,
        isEmailVerified: false
    }
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { userInfo, token, fcmToken } = action.payload;
            state.user = userInfo;
            state.token = token;
            state.isAuthenticated = !!token;
            if (fcmToken) state.fcmToken = fcmToken;
        },
        setFcmToken: (state, action) => {
            state.fcmToken = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.onboarding = {
                hasBasicInfo: false,
                hasAddressInfo: false,
                isEmailVerified: false
            };

            clearCredentials();
        },
        hydrate: (state, action) => {
            const { user, token, fcmToken } = action.payload;
            if (token && user) {
                state.user = user;
                state.token = token;
                state.isAuthenticated = true;
                if (fcmToken) state.fcmToken = fcmToken;
            }
        },
        updateOnboardingStatus: (state, action) => {
            state.onboarding = {
                ...state.onboarding,
                ...action.payload
            };
        }
    },
});

export const {
    setCredentials,
    setFcmToken,
    logout,
    hydrate,
    updateOnboardingStatus
} = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectAccessToken = (state) => state.auth.token;
export const selectFcmToken = (state) => state.auth.fcmToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectHasBasicInfo = (state) => state.auth.onboarding.hasBasicInfo;
export const selectHasAddressInfo = (state) => state.auth.onboarding.hasAddressInfo;
export const selectIsEmailVerified = (state) => state.auth.onboarding.isEmailVerified;

export default authSlice.reducer;