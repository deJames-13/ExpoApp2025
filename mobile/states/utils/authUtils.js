import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for AsyncStorage
export const STORAGE_KEYS = {
    TOKEN: 'auth_token',
    USER: 'auth_user',
    FCM_TOKEN: 'fcm_token',
};

// Function to persist credentials to AsyncStorage
export const persistCredentials = async (user, token, fcmToken = null) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

        // If FCM token is provided, store it
        if (fcmToken) {
            await AsyncStorage.setItem(STORAGE_KEYS.FCM_TOKEN, fcmToken);
        }

        return true;
    } catch (error) {
        console.error('Error storing credentials:', error);
        return false;
    }
};

// Function to clear credentials from AsyncStorage
export const clearCredentials = async () => {
    try {
        await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
        // Note: We don't clear FCM_TOKEN as it's device-specific and survives logout
        return true;
    } catch (error) {
        console.error('Error clearing credentials:', error);
        return false;
    }
};
