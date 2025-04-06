import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import {
    getMessaging,
    onMessage,
    getToken,
    onTokenRefresh,
    requestPermission as requestMessagingPermission,
    getInitialNotification,
    onNotificationOpenedApp,
    registerDeviceForRemoteMessages,
    setBackgroundMessageHandler,
    onBackgroundMessage
} from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import Toast from 'react-native-toast-message';
import { setIsChanging, storeFcmToken as reduxStoreFcmToken, setNotification } from "~/states/slices/firebase";
import { setFcmToken } from "~/states/slices/auth";
import { useDispatch, useSelector } from 'react-redux';
import { STORAGE_KEYS, storeFcmToken } from '~/states/utils/authUtils';
import { useNavigation } from '@react-navigation/native';
import { isJsonMessage, parseJsonMessage, navigateFromNotification } from '~/utils/notificationUtils';
import useAuth from '~/hooks/useAuth';

// Process messages consistently regardless of app state
async function processRemoteMessage(remoteMessage) {
    console.log('Processing remote message:', remoteMessage);

    if (!remoteMessage) return;

    const title = remoteMessage.notification?.title || 'New Notification';
    const body = remoteMessage.notification?.body || '';
    const data = remoteMessage.data || {};

    // Mark as opened from notification for handling later
    if (data && !data._notificationOpened) {
        data._notificationOpened = true;
    }

    // Use Notifee to display the notification
    await notifee.displayNotification({
        title,
        body,
        data: {
            ...data,
            fcmMessage: JSON.stringify(remoteMessage)
        },
        android: {
            channelId: data.type === 'order' ? 'orders_channel' : 'high_importance_channel',
            pressAction: {
                id: 'default',
                launchActivity: 'default'
            },
            actions: data.type === 'order' ? [
                {
                    title: 'View Order',
                    pressAction: {
                        id: 'view_order',
                    },
                    // Auto-dismiss the notification when this action is pressed
                    androidAutoCancel: true,
                }
            ] : undefined
        },
        ios: {
            foregroundPresentationOptions: {
                badge: true,
                sound: true,
                banner: true,
                list: true,
            },
        }
    });

    return Promise.resolve();
}

// Setup background message handler - this must be outside of the component
// This ensures it works when app is in background or killed state
getMessaging(getApp()).setBackgroundMessageHandler(processRemoteMessage);

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
                // Also request notification permissions through Notifee
                await notifee.requestPermission({
                    android: {
                        importance: 4, // HIGH importance
                        lightColor: '#ff79c6',
                        channelId: 'high_importance_channel',
                        pressAction: {
                            id: 'default',
                        },
                    },
                    ios: {
                        allowAlert: true,
                        allowBadge: true,
                        allowSound: true,
                        allowAnnouncements: true,
                    },
                });
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

    // Handle notification press through Notifee
    useEffect(() => {
        // Set up Notifee notification press listener
        const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
            // Handle notification presses
            if (type === EventType.PRESS) {
                console.log('User pressed notification in foreground', detail.notification);

                const data = detail.notification?.data || {};

                // If we have a stored FCM message, parse and handle it
                if (data.fcmMessage) {
                    try {
                        const fcmMessage = JSON.parse(data.fcmMessage);
                        const messageData = fcmMessage.data || {};

                        // Create navigation data
                        const notificationData = {
                            type: messageData.type,
                            id: messageData.id,
                            status: messageData.status,
                            screen: messageData.screen || 'OrderDetailView',
                            tab: messageData.tab || 'Orders',
                            isAdmin: isAdmin
                        };

                        // Navigate to the appropriate screen
                        setTimeout(() => {
                            navigateFromNotification(navigation, notificationData, isAdmin);
                        }, 300);
                    } catch (e) {
                        console.error('Error parsing FCM message', e);
                    }
                }
            }

            // Handle action button presses
            if (type === EventType.ACTION_PRESS) {
                console.log('User pressed an action button', detail.pressAction.id);

                // Check which action was pressed
                if (detail.pressAction.id === 'view_order') {
                    const data = detail.notification?.data || {};

                    // If we have a stored FCM message, parse and handle it
                    if (data.fcmMessage) {
                        try {
                            const fcmMessage = JSON.parse(data.fcmMessage);
                            const messageData = fcmMessage.data || {};

                            // Create navigation data specific for the order
                            const notificationData = {
                                type: 'order',
                                id: messageData.id,
                                status: messageData.status,
                                screen: 'OrderDetailView',
                                tab: 'Orders',
                                isAdmin: isAdmin
                            };

                            // Navigate to the order details screen
                            setTimeout(() => {
                                navigateFromNotification(navigation, notificationData, isAdmin);
                            }, 300);
                        } catch (e) {
                            console.error('Error parsing FCM message', e);
                        }
                    }
                }
            }
        });

        // Setup background event handler
        notifee.onBackgroundEvent(async ({ type, detail }) => {
            // Handle notification presses in background
            if (type === EventType.PRESS) {
                console.log('User pressed notification in background', detail.notification);

                // We can't navigate here since we're in a background event handler
                // Store the notification so we can handle it when the app opens
                if (detail.notification?.data) {
                    await notifee.setNotificationCategories([
                        {
                            id: 'open_app',
                            actions: [
                                {
                                    id: 'open',
                                    title: 'Open App',
                                }
                            ]
                        }
                    ]);
                }
            }

            // Handle action button presses in background
            if (type === EventType.ACTION_PRESS) {
                console.log('User pressed an action button in background', detail.pressAction.id);

                if (detail.pressAction.id === 'view_order') {
                    // For background actions, we need to set up an indicator that
                    // the order screen should be opened when the app is launched
                    const data = detail.notification?.data || {};

                    // We can't navigate directly from a background event handler
                    // Store the action intent for handling when the app opens
                    await notifee.setNotificationCategories([
                        {
                            id: 'view_order_intent',
                            actions: [
                                {
                                    id: 'open_order',
                                    title: 'Open Order',
                                }
                            ]
                        }
                    ]);
                }
            }
        });

        return () => unsubscribe();
    }, [navigation, isAdmin]);

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

                // Also check Notifee for initial notification
                const initialNotifee = await notifee.getInitialNotification();
                if (initialNotifee) {
                    console.log('App opened from notification (Notifee):', initialNotifee);

                    // If we have stored FCM message data, parse and use it
                    if (initialNotifee.notification?.data?.fcmMessage) {
                        try {
                            const fcmMessage = JSON.parse(initialNotifee.notification.data.fcmMessage);
                            fcmMessage.data = fcmMessage.data || {};
                            fcmMessage.data._notificationOpened = true;

                            // Handle with the standard handler
                            setTimeout(() => {
                                handleNotification(fcmMessage);
                            }, 1000);
                        } catch (e) {
                            console.error('Error parsing FCM message from Notifee', e);
                        }
                    }
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

                try {
                    // Force token refresh to ensure valid token
                    await messaging.deleteToken().catch(err => console.log('Error deleting token:', err));

                    // Get the initial token
                    const token = await getToken(messaging);
                    if (token) {
                // Store in both firebase and auth slices
                        dispatch(reduxStoreFcmToken({ fcmToken: token }));
                        dispatch(setFcmToken(token));

                        // Store in SecureStore
                        await storeFcmToken(token);
                        console.log('FCM token:', token.substring(0, 10) + '...');

                        // Register device with your server (register even if token hasn't changed)
                        try {
                            // Implement your API call to register the device
                            // This will update the token on your server
                        } catch (apiError) {
                            console.error('Error registering device with server:', apiError);
                        }
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

                    // Handle incoming messages when app is in foreground
                    const messageUnsubscribe = onMessage(messaging, async (remoteMessage) => {
                        // Process with Notifee
                        await processRemoteMessage(remoteMessage);

                        // Also handle with our standard handler
                        handleNotification(remoteMessage);
                    });

                    // Register the device for remote messages on iOS
                    if (Platform.OS === 'ios') {
                        await registerDeviceForRemoteMessages(messaging);
                    }

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
                } catch (error) {
                    console.error('Error setting up messaging:', error);
                }
            } else {
                console.log('Permission denied');
                dispatch(setIsChanging({ isChanging: false }));
            }
        };

        setupMessaging();
    }, [dispatch, navigation, isAdmin]);

    return { fcmToken, notification };
}
