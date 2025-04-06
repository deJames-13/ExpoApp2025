import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';

export const setupNotificationChannels = async () => {
    if (Platform.OS === 'android') {
        // Create the high importance channel
        await notifee.createChannel({
            id: 'high_importance_channel',
            name: 'Important Notifications',
            description: 'Channel for important notifications',
            importance: AndroidImportance.HIGH,
            visibility: AndroidVisibility.PUBLIC,
            vibration: true,
            sound: 'default',
        });

        // Create other channels as needed
        await notifee.createChannel({
            id: 'orders_channel',
            name: 'Orders',
            description: 'Order updates and notifications',
            importance: AndroidImportance.HIGH,
        });
    }
};
