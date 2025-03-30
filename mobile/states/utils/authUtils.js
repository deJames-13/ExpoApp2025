import * as SecureStore from 'expo-secure-store';

// Keys for SecureStore
export const STORAGE_KEYS = {
    TOKEN: 'auth_token',
    USER: 'auth_user',
    FCM_TOKEN: 'fcm_token',
};

// Function to persist credentials to SecureStore
export const persistCredentials = async (user, token, fcmToken = null) => {
    try {
        await SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, token);
        await SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(user));

        // If FCM token is provided, store it
        if (fcmToken) {
            await SecureStore.setItemAsync(STORAGE_KEYS.FCM_TOKEN, fcmToken);
        }

        return true;
    } catch (error) {
        console.error('Error storing credentials:', error);
        return false;
    }
};

// Function to clear credentials from SecureStore
export const clearCredentials = async () => {
    try {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.USER);
        // Note: We don't clear FCM_TOKEN as it's device-specific and survives logout
        return true;
    } catch (error) {
        console.error('Error clearing credentials:', error);
        return false;
    }
};

// Function to get credentials from SecureStore
export const getCredentials = async () => {
    try {
        const [token, userJson, fcmToken] = await Promise.all([
            SecureStore.getItemAsync(STORAGE_KEYS.TOKEN),
            SecureStore.getItemAsync(STORAGE_KEYS.USER),
            SecureStore.getItemAsync(STORAGE_KEYS.FCM_TOKEN)
        ]);

        const user = userJson ? JSON.parse(userJson) : null;

        return { token, user, fcmToken };
    } catch (error) {
        console.error('Error getting credentials:', error);
        return { token: null, user: null, fcmToken: null };
    }
};

// Function to store FCM token
export const storeFcmToken = async (fcmToken) => {
    try {
        await SecureStore.setItemAsync(STORAGE_KEYS.FCM_TOKEN, fcmToken);
        return true;
    } catch (error) {
        console.error('Error storing FCM token:', error);
        return false;
    }
};
