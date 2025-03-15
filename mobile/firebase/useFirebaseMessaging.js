import React from 'react'
import { getApp } from '@react-native-firebase/app'
import { getMessaging, onMessage, getToken, onTokenRefresh, requestPermission as requestMessagingPermission, getInitialNotification, onNotificationOpenedApp, registerDeviceForRemoteMessages } from '@react-native-firebase/messaging'
import Toast from 'react-native-toast-message'

export default function useFirebaseMessaging() {
    const [fcmToken, setFcmToken] = React.useState(null)
    const [notification, setNotification] = React.useState(null)

    const requestPermission = async () => {
        try {
            const messaging = getMessaging(getApp())
            const authStatus = await requestMessagingPermission(messaging)
            const enabled =
                authStatus === 1 || // AUTHORIZED
                authStatus === 2    // PROVISIONAL

            if (enabled) {
                console.log('Authorization status:', authStatus)
            }

            return enabled

        } catch (error) {
            console.log('Error requesting permission:', error)
            return false
        }
    }

    React.useEffect(() => {
        const setupMessaging = async () => {
            if (await requestPermission()) {
                console.log('Permission granted. Getting token...')
                const messaging = getMessaging(getApp())

                // Existing token
                const existingToken = await getToken(messaging);
                if (existingToken) {
                    setFcmToken(existingToken)
                    console.log('Existing token:', existingToken)
                }


                // Register for token refresh
                const tokenUnsubscribe = onTokenRefresh(messaging, (token) => {
                    console.log('Token refreshed:', token)
                    setFcmToken(token)
                })

                // Get the initial token
                const token = await getToken(messaging);
                if (token) {
                    setFcmToken(token);
                }

                // Handle other messaging events
                const messageUnsubscribe = onMessage(messaging, async (remoteMessage) => {
                    Toast.show({
                        type: 'info',
                        text1: remoteMessage.notification?.title || 'New Message',
                        text2: remoteMessage.notification?.body || 'You have a new message',
                        visibilityTime: 4000,
                    });
                    setNotification(remoteMessage)
                });

                // Register the device for remote messages
                await registerDeviceForRemoteMessages(messaging);

                // Handle initial notification
                const initialMsg = await getInitialNotification(messaging);
                if (initialMsg) {
                    setNotification(initialMsg)
                    Toast.show({
                        type: 'info',
                        text1: initialMsg.notification?.title || 'New Notification',
                        text2: initialMsg.notification?.body || 'You received a notification',
                        visibilityTime: 5000,
                    });
                }

                // Handle notification opened app
                const notificationOpenedUnsubscribe = onNotificationOpenedApp(messaging, (remoteMessage) => {
                    console.log('Notification caused app to open from background state:', remoteMessage.notification)
                    Toast.show({
                        type: 'info',
                        text1: remoteMessage.notification?.title || 'Notification Opened App',
                        text2: remoteMessage.notification?.body || 'App was opened from notification',
                        visibilityTime: 4000,
                    });
                });

                return () => {
                    messageUnsubscribe();
                    tokenUnsubscribe();
                    notificationOpenedUnsubscribe();
                };
            } else {
                console.log('Permission denied')
            }
        };

        setupMessaging();
    }, [])

    return { fcmToken, notification }
}
