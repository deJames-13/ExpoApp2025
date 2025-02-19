import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';


const getUserInfo = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
};

const getAccessToken = async () => {
    return await AsyncStorage.getItem('accessToken');
};

const initialState = {
    userInfo: await getUserInfo(),
    oAuthUser: null,
    accessToken: await getAccessToken(),
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
        setCredentials: async (state, action) => {
            const { userInfo, token } = action.payload;
            const { roles, ...info } = userInfo;
            state.userInfo = info;
            state.accessToken = token;
            state.roles = roles || action.payload?.roles;
            await AsyncStorage.setItem('userInfo', JSON.stringify(info));
            await AsyncStorage.setItem('accessToken', token);
        },
        logout: async (state) => {
            state.userInfo = null;
            state.accessToken = null;
            state.roles = null;
            await AsyncStorage.removeItem('userInfo');
            await AsyncStorage.removeItem('accessToken');
        },
        setShowProfile: (state) => {
            state.showProfile = !state.showProfile;
        },
    },
});

export const { setCredentials, logout, setIsChanging, setShowProfile } = authSlice.actions;
export const selectCurrentUser = (state) => state.auth.userInfo;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) => !!state.auth.userInfo;
export default authSlice.reducer;