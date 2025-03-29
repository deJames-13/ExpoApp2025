import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for AsyncStorage
export const STORAGE_KEYS = {
    TOKEN: '@eyezone_token',
    USER: '@eyezone_user'
};

// Function to persist credentials to AsyncStorage
export const persistCredentials = async (user, token) => {
    if (token) await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    if (user) await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return { user, token };
};

// Function to clear credentials from AsyncStorage
export const clearCredentials = async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
};
