import 'expo-assets'

import { registerRootComponent } from 'expo';
import notifee, { EventType } from '@notifee/react-native';
import { setupNotificationChannels } from '~/firebase/notificationChannels';
import { processRemoteMessage } from '~/firebase/useFirebaseMessaging';

import App from './App';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Notifee and set up notification channels
async function initializeNotifee() {
    await notifee.requestPermission();
    await setupNotificationChannels();
}

initializeNotifee().catch(console.error);

// Register Notifee background event handler
// This must be defined at the top level, outside of any component
notifee.onBackgroundEvent(async ({ type, detail }) => {
    console.log('[Background] Event received: ', type, detail);
    const { notification, pressAction } = detail;

    try {
        // Handle notification press in background
        if (type === EventType.PRESS) {
            console.log('[Background] User pressed notification:', notification?.id);

            // If this is an order notification, save information to show toast when app opens
            if (notification?.data?.type === 'order' && notification?.data?.id) {
                const orderData = {
                    id: notification.data.id,
                    status: notification.data.status,
                    time: Date.now(),
                    orderTitle: notification.data.orderTitle || `Order #${notification.data.id.substring(0, 8)}`,
                    statusText: notification.data.statusText ||
                        (notification.data.status ? notification.data.status.charAt(0).toUpperCase() +
                            notification.data.status.slice(1) : 'updated')
                };

                // Store data for app to retrieve when it opens
                await AsyncStorage.setItem('LAST_ORDER_NOTIFICATION', JSON.stringify(orderData));
            }
        }

        // Handle action button presses
        if (type === EventType.ACTION_PRESS) {
            console.log('[Background] Action pressed:', pressAction.id);

            // Handle "view_order" action
            if (pressAction.id === 'view_order') {
                // Store order info from notification data to show toast when app opens
                if (notification?.data?.id) {
                    const orderData = {
                        id: notification.data.id,
                        status: notification.data.status,
                        time: Date.now(),
                        orderTitle: notification.data.orderTitle || `Order #${notification.data.id.substring(0, 8)}`,
                        statusText: notification.data.statusText || 'updated'
                    };

                    // Store data for app to retrieve when it opens
                    await AsyncStorage.setItem('LAST_ORDER_NOTIFICATION', JSON.stringify(orderData));
                }
            }

            // Handle "mark as read" action if implemented
            if (pressAction.id === 'mark-as-read') {
                // Example: you could mark a notification as read in local storage
                console.log('[Background] Marking notification as read:', notification?.id);

                // You can also remove the notification if needed
                if (notification?.id) {
                    await notifee.cancelNotification(notification.id);
                }
            }
        }

        // Handle dismissal
        if (type === EventType.DISMISSED) {
            console.log('[Background] User dismissed notification', notification?.id);
        }
    } catch (error) {
        console.error('[Background] Error handling background event:', error);
    }
});

// Setup Firebase messaging background handler
messaging().setBackgroundMessageHandler(processRemoteMessage);

// Register the app
registerRootComponent(App);


