import { createSlice } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

const initialState = {
    userInfo: null,
    accessToken: null,
    roles: null,
    isChanging: false,
    showProfile: false,
    onboardingStatus: {
        hasBasicInfo: false,
        hasAddressInfo: false,
        isEmailVerified: false
    }
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsChanging: (state, action) => {
            state.isChanging = action.payload.isChanging;
        },
        setCredentials: (state, action) => {
            const { userInfo, token } = action.payload;
            const { roles, ...info } = userInfo || {};
            state.userInfo = info;
            state.accessToken = token;
            state.roles = roles || action.payload?.roles;

            // Set onboarding status based on user info
            if (info) {
                state.onboardingStatus.isEmailVerified = !!info.emailVerifiedAt;
                state.onboardingStatus.hasBasicInfo = !!info.info &&
                    !!info.info.first_name &&
                    !!info.info.last_name &&
                    !!info.info.contact;
                state.onboardingStatus.hasAddressInfo = !!info.info &&
                    !!info.info.address &&
                    !!info.info.city &&
                    !!info.info.region;
            }
        },
        logout: (state) => {
            state.userInfo = null;
            state.accessToken = null;
            state.roles = null;
            state.onboardingStatus = {
                hasBasicInfo: false,
                hasAddressInfo: false,
                isEmailVerified: false
            };
        },
        setShowProfile: (state) => {
            state.showProfile = !state.showProfile;
        },
        updateOnboardingStatus: (state, action) => {
            state.onboardingStatus = {
                ...state.onboardingStatus,
                ...action.payload
            };
        },
    },
});

// Secure storage keys
const USER_INFO_KEY = 'eyezone_user_info';
const ACCESS_TOKEN_KEY = 'eyezone_access_token';

// Secure storage helper functions
export const getUserInfo = async () => {
    try {
        const userInfo = await SecureStore.getItemAsync(USER_INFO_KEY);
        return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
        console.error('Error getting user info from secure store:', error);
        return null;
    }
};

export const getAccessToken = async () => {
    try {
        return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch (error) {
        console.error('Error getting access token from secure store:', error);
        return null;
    }
};

export const persistCredentials = async (userInfo, token) => {
    try {
        const { roles, ...info } = userInfo || {};
        await SecureStore.setItemAsync(USER_INFO_KEY, JSON.stringify(info));
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
    } catch (error) {
        console.error('Error storing credentials in secure store:', error);
    }
};

export const clearCredentials = async () => {
    try {
        await SecureStore.deleteItemAsync(USER_INFO_KEY);
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    } catch (error) {
        console.error('Error clearing credentials from secure store:', error);
    }
};

export const initializeAuthState = async (store) => {
    try {
        const userInfo = await getUserInfo();
        const accessToken = await getAccessToken();

        if (userInfo && accessToken) {
            store.dispatch(setCredentials({ userInfo, token: accessToken }));
        }
    } catch (error) {
        console.error('Failed to load auth state:', error);
    }
};

export const { setCredentials, logout, setIsChanging, setShowProfile, updateOnboardingStatus } = authSlice.actions;
export const selectCurrentUser = (state) => state.auth.userInfo;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) => !!state.auth.userInfo;

// Additional selectors for onboarding status
export const selectOnboardingStatus = (state) => state.auth.onboardingStatus;
export const selectIsEmailVerified = (state) => state.auth.onboardingStatus.isEmailVerified;
export const selectHasBasicInfo = (state) => state.auth.onboardingStatus.hasBasicInfo;
export const selectHasAddressInfo = (state) => state.auth.onboardingStatus.hasAddressInfo;
export const selectIsOnboardingComplete = (state) => {
    const { hasBasicInfo, hasAddressInfo, isEmailVerified } = state.auth.onboardingStatus;
    return hasBasicInfo && hasAddressInfo && isEmailVerified;
};

export default authSlice.reducer;