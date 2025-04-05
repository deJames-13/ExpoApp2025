import AsyncStorage from '@react-native-async-storage/async-storage';

// Key for storing the authentication token
const AUTH_TOKEN_KEY = 'auth_token';

/**
 * Get the authentication token from AsyncStorage
 * @returns {Promise<string|null>} The stored token or null if not found
 */
export const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return null;
  }
};

/**
 * Save the authentication token to AsyncStorage
 * @param {string} token - The token to save
 * @returns {Promise<boolean>} Success status of the operation
 */
export const saveAuthToken = async (token) => {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('Error saving auth token:', error);
    return false;
  }
};

/**
 * Remove the authentication token from AsyncStorage
 * @returns {Promise<boolean>} Success status of the operation
 */
export const removeAuthToken = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    return true;
  } catch (error) {
    console.error('Error removing auth token:', error);
    return false;
  }
};

/**
 * Get authorization headers for API requests
 * @returns {Promise<Object>} Headers object for authorization
 */
export const getAuthHeaders = async () => {
  const token = await getAuthToken();
  if (!token) {
    return {};
  }
  return {
    'Authorization': `Bearer ${token}`
  };
};
