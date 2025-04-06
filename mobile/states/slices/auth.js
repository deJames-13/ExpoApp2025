import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS, persistCredentials, clearCredentials, getStorageItem, storeFcmToken } from '../utils/authUtils';
import { fcmApi } from '~/axios.config';

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
            // When FCM token is set or updated, sync with server if authenticated
            if (state.isAuthenticated && state.token && action.payload) {
                updateFcmTokenOnServer(state.token, action.payload);
            }
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

// Async function to update FCM token on server
async function updateFcmTokenOnServer(authToken, fcmToken) {
    try {
        // Store token locally first
        await storeFcmToken(fcmToken);

        // Then update on server
        if (authToken) {
            const response = await fcmApi.post('/api/v1/users/fcm-token', {
                fcmToken
            });
            console.log('FCM token updated on server:', response.status === 200);
        }
    } catch (error) {
        console.error('Failed to update FCM token on server:', error);
    }
}

// Add a new thunk for token updates
export const updateFcmToken = (fcmToken) => async (dispatch, getState) => {
    const currentState = getState();
    const isAuthenticated = currentState.auth.isAuthenticated;

    // Update token in redux state
    dispatch(setFcmToken(fcmToken));

    // If authenticated, also ensure token is saved on server
    if (isAuthenticated && fcmToken) {
        try {
            await fcmApi.post('/api/v1/users/fcm-token', { fcmToken });
        } catch (error) {
            console.error('Failed to update FCM token on server:', error);
        }
    }
};

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