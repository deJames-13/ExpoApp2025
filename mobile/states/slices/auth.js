import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
    userInfo: null,
    oAuthUser: null,
    accessToken: null,
    roles: null,
    isChanging: false,
    showProfile: false,
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
            const { roles, ...info } = userInfo;
            state.userInfo = info;
            state.accessToken = token;
            state.roles = roles || action.payload?.roles;
        },
        logout: (state) => {
            state.userInfo = null;
            state.accessToken = null;
            state.roles = null;
        },
        setShowProfile: (state) => {
            state.showProfile = !state.showProfile;
        },
    },
});

export const getUserInfo = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
};

export const getAccessToken = async () => {
    return await AsyncStorage.getItem('accessToken');
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

export const { setCredentials, logout, setIsChanging, setShowProfile } = authSlice.actions;
export const selectCurrentUser = (state) => state.auth.userInfo;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) => !!state.auth.userInfo;
export default authSlice.reducer;

export const persistCredentials = async (userInfo, token) => {
    const { roles, ...info } = userInfo;
    await AsyncStorage.setItem('userInfo', JSON.stringify(info));
    await AsyncStorage.setItem('accessToken', token);
};

export const clearCredentials = async () => {
    await AsyncStorage.removeItem('userInfo');
    await AsyncStorage.removeItem('accessToken');
};