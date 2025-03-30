import React from 'react'
import { getApp } from '@react-native-firebase/app'
import { getMessaging, onMessage, getToken, onTokenRefresh, requestPermission as requestMessagingPermission, getInitialNotification, onNotificationOpenedApp, registerDeviceForRemoteMessages } from '@react-native-firebase/messaging'
import Toast from 'react-native-toast-message'
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

    // Handle notification based on its content
    const handleNotification = (remoteMessage) => {
        const title = remoteMessage.notification?.title || 'New Notification';
        const body = remoteMessage.notification?.body || '';

        // Store the notification in Redux state
        dispatch(setNotification({ notification: remoteMessage }));

        // Check if notification is a JSON message
        if (isJsonMessage(body)) {
            const jsonData = parseJsonMessage(body);

            if (jsonData) {
                // Add isAdmin flag to help with navigation routing
                jsonData.isAdmin = isAdmin;

                // For order notifications, show an actionable toast
                if (jsonData.type === 'order') {
                    let statusText = 'updated';
                    if (jsonData.status) {
                        statusText = jsonData.status.charAt(0).toUpperCase() + jsonData.status.slice(1);
                    }

                    const orderText = `Order #${jsonData.id.substring(0, 8)}`;

                    Toast.show({
                        type: 'actionable',
                        text1: `${orderText} ${statusText}`,
                        text2: 'Tap to view details',
                        type: 'info',
                        onPress: () => navigateFromNotification(jsonData, navigation),
                        visibilityTime: 5000,
                    });
                } else {
                    // For other types, just show regular toast but still make it clickable
                    Toast.show({
                        type: 'actionable',
                        text1: title,
                        text2: 'Tap to view',
                        onPress: () => navigateFromNotification(jsonData, navigation),
                        visibilityTime: 4000,
                    });
                }
            } else {
                // Fallback for failed JSON parsing
                Toast.show({
                    type: 'info',
                    text1: title,
                    text2: 'New notification received',
                    visibilityTime: 4000,
                });
            }
        } else {
            // Regular notification toast
            Toast.show({
                type: 'info',
                text1: title,
                text2: body,
                visibilityTime: 4000,
            });
        }
    };

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

                // Handle initial notification (app opened from terminated state)
                const initialMsg = await getInitialNotification(messaging);
                if (initialMsg) {
                    handleNotification(initialMsg);
                }

                // Handle notification opened app (from background state)
                const notificationOpenedUnsubscribe = onNotificationOpenedApp(messaging, (remoteMessage) => {
                    console.log('Notification caused app to open from background state:', remoteMessage.notification);
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
