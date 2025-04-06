import { registerRootComponent } from 'expo';
import App from './App';
import notifee, { EventType } from '@notifee/react-native';
import { setupNotificationChannels } from '~/firebase/notificationChannels';
import { processRemoteMessage } from '~/firebase/useFirebaseMessaging';
import messaging from '@react-native-firebase/messaging';

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
            // Background actions can only update data/storage, not navigate
        }

        // Handle action button presses
        if (type === EventType.ACTION_PRESS) {
            console.log('[Background] Action pressed:', pressAction.id);

            // Handle "view_order" action
            if (pressAction.id === 'view_order') {
                // Store data for when app opens
                // We can't navigate from background
                console.log('[Background] View order action pressed for order:', notification?.data?.id);
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


