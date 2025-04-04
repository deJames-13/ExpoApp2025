import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

export const getFcmToken = async () => {
  try {
    // Check if this is a compatible platform
    if (Platform.OS !== 'web' && messaging) {
      // Request permission first
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        // Get the token
        const fcmToken = await messaging().getToken();
        return fcmToken;
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};
