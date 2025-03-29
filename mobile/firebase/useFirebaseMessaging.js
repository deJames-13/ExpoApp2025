import React from 'react'
import { getApp } from '@react-native-firebase/app'
import { getMessaging, onMessage, getToken, onTokenRefresh, requestPermission as requestMessagingPermission, getInitialNotification, onNotificationOpenedApp, registerDeviceForRemoteMessages } from '@react-native-firebase/messaging'
import Toast from 'react-native-toast-message'
import { setIsChanging, storeFcmToken, setNotification } from "~/states/slices/firebase";
import { setFcmToken } from "~/states/slices/auth"; // Import auth action
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '~/states/utils/authUtils';

export default function useFirebaseMessaging() {
    const dispatch = useDispatch();
    const { fcmToken, notification } = useSelector((state) => state.firebase);

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
            dispatch(setIsChanging({ isChanging: true }));

            if (await requestPermission()) {
                console.log('Permission granted. Getting token...')
                const messaging = getMessaging(getApp())

                // Existing token
                const existingToken = await getToken(messaging);
                if (existingToken) {
                    // Store in both firebase and auth slices
                    dispatch(storeFcmToken({ fcmToken: existingToken }));
                    dispatch(setFcmToken(existingToken));

                    // Store in AsyncStorage
                    await AsyncStorage.setItem('fcmToken', existingToken);
                    await AsyncStorage.setItem(STORAGE_KEYS.FCM_TOKEN, existingToken);
                    console.log('Existing token:', existingToken)
                }

                // Register for token refresh
                const tokenUnsubscribe = onTokenRefresh(messaging, async (token) => {
                    console.log('Token refreshed:', token);
                    // Update in both firebase and auth slices
                    dispatch(storeFcmToken({ fcmToken: token }));
                    dispatch(setFcmToken(token));

                    // Update in AsyncStorage
                    await AsyncStorage.setItem('fcmToken', token);
                    await AsyncStorage.setItem(STORAGE_KEYS.FCM_TOKEN, token);
                });

                // Get the initial token
                const token = await getToken(messaging);
                if (token) {
                    // Store in both firebase and auth slices
                    dispatch(storeFcmToken({ fcmToken: token }));
                    dispatch(setFcmToken(token));

                    // Store in AsyncStorage
                    await AsyncStorage.setItem('fcmToken', token);
                    await AsyncStorage.setItem(STORAGE_KEYS.FCM_TOKEN, token);
                }

                // Handle other messaging events
                const messageUnsubscribe = onMessage(messaging, async (remoteMessage) => {
                    Toast.show({
                        type: 'info',
                        text1: remoteMessage.notification?.title || 'New Message',
                        text2: remoteMessage.notification?.body || 'You have a new message',
                        visibilityTime: 4000,
                    });
                    dispatch(setNotification({ notification: remoteMessage }));
                });

                // Register the device for remote messages
                await registerDeviceForRemoteMessages(messaging);

                // Handle initial notification
                const initialMsg = await getInitialNotification(messaging);
                if (initialMsg) {
                    dispatch(setNotification({ notification: initialMsg }));
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
                    dispatch(setNotification({ notification: remoteMessage }));
                });

                dispatch(setIsChanging({ isChanging: false }));

                return () => {
                    messageUnsubscribe();
                    tokenUnsubscribe();
                    notificationOpenedUnsubscribe();
                };
            } else {
                console.log('Permission denied');
                dispatch(setIsChanging({ isChanging: false }));
            }
        };

        setupMessaging();
    }, [dispatch]);

    return { fcmToken, notification };
}
