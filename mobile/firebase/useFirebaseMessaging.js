import React from 'react'
import messaging from '@react-native-firebase/messaging'
import Toast from 'react-native-toast-message' // Added Toast import

export default function useFirebaseMessaging() {
    const [fcmToken, setFcmToken] = React.useState(null)
    const [notification, setNotification] = React.useState(null)

    const requestPermission = async () => {
        try {
            const authStatus = await messaging().requestPermission()
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL

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
        if (requestPermission()) {
            messaging().onTokenRefresh((token) => {
                console.log('Token refreshed:', token)
                setFcmToken(token)
            })
        } else {
            console.log('Permission denied')
        }

        messaging()
            .getInitialNotification()
            .then(async (remoteMessage) => {
                if (remoteMessage) {
                    setNotification(remoteMessage)

                    Toast.show({
                        type: 'info',
                        text1: remoteMessage.notification?.title || 'New Notification',
                        text2: remoteMessage.notification?.body || 'You received a notification',
                        visibilityTime: 5000,
                    });
                }
            })

        messaging().onNotificationOpenedApp((remoteMessage) => {
            console.log(
                'Notification caused app to open from background state:',
                remoteMessage.notification
            )
            Toast.show({
                type: 'info',
                text1: remoteMessage.notification?.title || 'Notification Opened App',
                text2: remoteMessage.notification?.body || 'App was opened from notification',
                visibilityTime: 4000,
            });
        })

        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
            console.log('Message handled in the background!', remoteMessage)
        })

        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
            Toast.show({
                type: 'info',
                text1: remoteMessage.notification?.title || 'New Message',
                text2: remoteMessage.notification?.body || 'You have a new message',
                visibilityTime: 4000,
            });
            setNotification(remoteMessage)
        })

        return unsubscribe
    }, [])

    return { fcmToken, notification }
}
