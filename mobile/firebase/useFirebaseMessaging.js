import React, { useEffect } from 'react';
import { getApp } from '@react-native-firebase/app';
import { getMessaging, onMessage, getToken, onTokenRefresh, requestPermission as requestMessagingPermission, getInitialNotification, onNotificationOpenedApp, registerDeviceForRemoteMessages } from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import { setIsChanging, storeFcmToken as reduxStoreFcmToken, setNotification } from "~/states/slices/firebase";
import { setFcmToken } from "~/states/slices/auth";
import { useDispatch, useSelector } from 'react-redux';
import { STORAGE_KEYS, storeFcmToken } from '~/states/utils/authUtils';
import { useNavigation } from '@react-navigation/native';
import { isJsonMessage, parseJsonMessage, navigateFromNotification } from '~/utils/notificationUtils';
import useAuth from '~/hooks/useAuth';

export default function useFirebaseMessaging() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { fcmToken, notification } = useSelector((state) => state.firebase);
    const { isAdmin, currentUser } = useAuth();

    const requestPermission = async () => {
        try {
            const messaging = getMessaging(getApp());
            const authStatus = await requestMessagingPermission(messaging);
            const enabled =
                authStatus === 1 || // AUTHORIZED
                authStatus === 2;   // PROVISIONAL

            if (enabled) {
                console.log('Authorization status:', authStatus);
            }

            return enabled;
        } catch (error) {
            console.log('Error requesting permission:', error);
            return false;
        }
    };

    // Handle notification based on its content
    const handleNotification = (remoteMessage) => {
        if (!remoteMessage) return;

        const title = remoteMessage.notification?.title || 'New Notification';
        const body = remoteMessage.notification?.body || '';
        const data = remoteMessage.data || {};

        // Store the notification in Redux state
        dispatch(setNotification({ notification: remoteMessage }));

        // First check if we have relevant data in the data payload
        if (data.type === 'order' && data.id) {
            // Create a data object merging notification data and data payload
            const notificationData = {
                type: data.type,
                id: data.id,
                status: data.status,
                screen: data.screen || 'OrderDetailView',
                tab: data.tab || 'Orders',
                isAdmin: isAdmin
            };

            // Show actionable toast for order notifications
            let statusText = data.status
                ? data.status.charAt(0).toUpperCase() + data.status.slice(1)
                : 'updated';

            const orderText = `Order #${data.id.substring(0, 8)}`;

            Toast.show({
                type: 'actionable',
                text1: `${orderText} ${statusText}`,
                text2: 'Tap to view details',
                onPress: () => navigateFromNotification(navigation, notificationData, isAdmin),
                visibilityTime: 5000,
            });

            // If app was opened from a notification, navigate directly
            const isNotifOpen = remoteMessage._notificationOpened || remoteMessage.data?._notificationOpened;
            if (isNotifOpen) {
                // Small delay to make sure navigation is ready
                setTimeout(() => {
                    navigateFromNotification(navigation, notificationData, isAdmin);
                }, 300);
            }

            return;
        }

        // Check if notification body is a JSON message (fallback)
        if (isJsonMessage(body)) {
            const jsonData = parseJsonMessage(body);
            if (jsonData) {
                // Add isAdmin flag to help with navigation routing
                jsonData.isAdmin = isAdmin;

                // Show actionable toast
                Toast.show({
                    type: 'actionable',
                    text1: title,
                    text2: 'Tap to view details',
                    onPress: () => navigateFromNotification(navigation, jsonData, isAdmin),
                    visibilityTime: 4000,
                });

                // Navigate automatically if opened from notification
                const isNotifOpen = remoteMessage._notificationOpened || remoteMessage.data?._notificationOpened;
                if (isNotifOpen) {
                    setTimeout(() => {
                        navigateFromNotification(navigation, jsonData, isAdmin);
                    }, 300);
                }

                return;
            }
        }

        // Regular notification toast for anything else
        Toast.show({
            type: 'info',
            text1: title,
            text2: body,
            visibilityTime: 4000,
        });
    };

    // Process initial notification on app cold start
    useEffect(() => {
        const processInitialNotification = async () => {
            try {
                const messaging = getMessaging(getApp());
                const initialMsg = await getInitialNotification(messaging);

                if (initialMsg) {
                    console.log('App opened from quit state:', initialMsg);

                    // Mark this message as opened from notification
                    if (initialMsg.data) {
                        initialMsg.data._notificationOpened = true;
                    }

                    // Handle with a small delay to ensure navigation is ready
                    setTimeout(() => {
                        handleNotification(initialMsg);
                    }, 1000);
                }
            } catch (error) {
                console.error('Error processing initial notification:', error);
            }
        };

        processInitialNotification();
    }, [navigation, isAdmin]);

    // Main effect for setting up messaging
    useEffect(() => {
        const setupMessaging = async () => {
            dispatch(setIsChanging({ isChanging: true }));

            if (await requestPermission()) {
                console.log('Permission granted. Getting token...');
                const messaging = getMessaging(getApp());

                // Existing token
                const existingToken = await getToken(messaging);
                if (existingToken) {
                    // Store in both firebase and auth slices
                    dispatch(reduxStoreFcmToken({ fcmToken: existingToken }));
                    dispatch(setFcmToken(existingToken));

                    // Store in SecureStore
                    await storeFcmToken(existingToken);
                    console.log('Existing token:', existingToken);
                }

                // Register for token refresh
                const tokenUnsubscribe = onTokenRefresh(messaging, async (token) => {
                    console.log('Token refreshed:', token);
                    // Update in both firebase and auth slices
                    dispatch(reduxStoreFcmToken({ fcmToken: token }));
                    dispatch(setFcmToken(token));

                    // Update in SecureStore
                    await storeFcmToken(token);
                });

                // Get the initial token
                const token = await getToken(messaging);
                if (token) {
                    // Store in both firebase and auth slices
                    dispatch(reduxStoreFcmToken({ fcmToken: token }));
                    dispatch(setFcmToken(token));

                    // Store in SecureStore
                    await storeFcmToken(token);
                }

                // Handle incoming messages when app is in foreground
                const messageUnsubscribe = onMessage(messaging, async (remoteMessage) => {
                    handleNotification(remoteMessage);
                });

                // Register the device for remote messages
                await registerDeviceForRemoteMessages(messaging);

                // Handle notification opened app (from background state)
                const notificationOpenedUnsubscribe = onNotificationOpenedApp(messaging, (remoteMessage) => {
                    console.log('Notification caused app to open from background state:', remoteMessage);

                    // Mark this message as opened from notification
                    if (remoteMessage.data) {
                        remoteMessage.data._notificationOpened = true;
                    }

                    handleNotification(remoteMessage);
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
    }, [dispatch, navigation, isAdmin]);

    return { fcmToken, notification };
}
