import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';


const initialState = {
    fcmToken: null,
    notification: null,
    isChanging: false,
};

export const firebaseSlice = createSlice({
    name: 'firebase',
    initialState,
    reducers: {
        setIsChanging: (state, action) => {
            state.isChanging = action.payload.isChanging;
        },
        storeFcmToken: (state, action) => {
            state.fcmToken = action.payload.fcmToken;
        },
        setNotification: (state, action) => {
            state.notification = action.payload.notification;
        },
    },
});

export const getFcmToken = async () => {
    return await AsyncStorage.getItem('fcmToken');
};

export const initializeFirebaseState = async (store) => {
    try {
        const fcmToken = await getFcmToken();

        if (fcmToken) {
            store.dispatch(storeFcmToken({ fcmToken }));
        }
    } catch (error) {
        console.error('Failed to load firebase state:', error);
    }
};


export const { setIsChanging, storeFcmToken, setNotification } = firebaseSlice.actions;
export default firebaseSlice.reducer;