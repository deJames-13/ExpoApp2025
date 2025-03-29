import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS, persistCredentials, clearCredentials } from '../utils/authUtils';

// Initial state with empty values
const initialState = {
    user: null,
    token: null,
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
            const { userInfo, token } = action.payload;
            state.user = userInfo;
            state.token = token;
            state.isAuthenticated = !!token;
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

            // Clear from AsyncStorage
            clearCredentials();
        },
        hydrate: (state, action) => {
            const { user, token } = action.payload;
            if (token && user) {
                state.user = user;
                state.token = token;
                state.isAuthenticated = true;
            }
        },
        updateOnboardingStatus: (state, action) => {
            state.onboarding = {
                ...state.onboarding,
                ...action.payload
            };
        }
    },
    // We'll handle API responses through the middleware's onQueryStarted callbacks instead
});

export const { setCredentials, logout, hydrate, updateOnboardingStatus } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectAccessToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectHasBasicInfo = (state) => state.auth.onboarding.hasBasicInfo;
export const selectHasAddressInfo = (state) => state.auth.onboarding.hasAddressInfo;
export const selectIsEmailVerified = (state) => state.auth.onboarding.isEmailVerified;

export default authSlice.reducer;