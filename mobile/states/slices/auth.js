import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS, persistCredentials, clearCredentials } from '../utils/authUtils';

// Initial state with empty values
const initialState = {
    user: null,
    token: null,
    fcmToken: null,
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

            // Automatically update onboarding status based on user data
            if (userInfo) {
                // Check for basic info completion
                if (userInfo.info &&
                    userInfo.info.first_name &&
                    userInfo.info.last_name &&
                    userInfo.info.contact) {
                    state.onboarding.hasBasicInfo = true;
                }

                // Check for address info completion
                if (userInfo.info &&
                    userInfo.info.address &&
                    userInfo.info.city &&
                    userInfo.info.region) {
                    state.onboarding.hasAddressInfo = true;
                }

                // Check if email is verified
                if (userInfo.emailVerifiedAt) {
                    state.onboarding.isEmailVerified = true;
                }
            }
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

                // Apply the same onboarding status checks during hydration
                if (user) {
                    // Check for basic info completion
                    if (user.info &&
                        user.info.first_name &&
                        user.info.last_name &&
                        user.info.contact) {
                        state.onboarding.hasBasicInfo = true;
                    }

                    // Check for address info completion
                    if (user.info &&
                        user.info.address &&
                        user.info.city &&
                        user.info.region) {
                        state.onboarding.hasAddressInfo = true;
                    }

                    // Check if email is verified
                    if (user.emailVerifiedAt) {
                        state.onboarding.isEmailVerified = true;
                    }
                }
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

// Add this selector if it doesn't exist
export const selectToken = (state) => state.auth?.token;

export default authSlice.reducer;