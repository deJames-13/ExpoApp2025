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
import { NOTIFICATION_CHANNELS, getChannelForType } from './notificationChannels';

/**
 * Process FCM messages consistently regardless of app state
 * This function is used by both foreground and background handlers
 */
export async function processRemoteMessage(message) {
    console.log('[FCM] Processing remote message:', message);

    if (!message) return;

    // Extract notification data from the FCM message
    const title = message.notification?.title || 'New Notification';
    const body = message.notification?.body || '';
    const data = message.data || {};

    // Mark as opened from notification for handling later
    // Convert boolean to string since Notifee requires all data values to be strings
    if (data) {
        data._notificationOpened = 'true';
    }

    // Get the appropriate channel for this notification type
    const channelId = data.channelId || getChannelForType(data.type || 'default');

    try {
        // Create a notification display object following Notifee structure
        const notificationToDisplay = {
            title,
            body,
            data: {
                ...data,
                fcmMessage: JSON.stringify(message)
            },
            android: {
                channelId,
                pressAction: {
                    id: 'default',
                    launchActivity: 'default'
                },
                // Add actions based on notification type
                actions: data.type === 'order' ? [
                    {
                        title: 'View Order',
                        pressAction: {
                            id: 'view_order',
                        },
                        androidAutoCancel: true,
                    }
                ] : undefined,
                smallIcon: 'ic_notification', // Ensure this exists in your drawable folder
                color: '#4CAF50', // Notification icon color
            },
            ios: {
                // iOS configuration for notifications
                foregroundPresentationOptions: {
                    badge: true,
                    sound: true,
                    banner: true,
                    list: true,
                },
                // Link to notification category for custom actions
                categoryId: data.type === 'order' ? 'order_actions' : 'default'
            }
        };

        // Use Notifee to display the notification
        const notificationId = await notifee.displayNotification(notificationToDisplay);
        console.log(`[FCM] Displayed notification ${notificationId} on channel: ${channelId}`);
    } catch (error) {
        console.error('[FCM] Error displaying notification:', error);
    }

    return Promise.resolve();
}

/**
 * Custom hook for Firebase Cloud Messaging integration
 * Handles token management, permissions, and notification handling
 */
export default function useFirebaseMessaging() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { fcmToken, notification } = useSelector((state) => state.firebase);
    const { isAdmin, currentUser } = useAuth();

    /**
     * Request notification permissions from the user
     */
    const requestPermission = async () => {
        try {
            const messaging = getMessaging(getApp());
            const authStatus = await requestMessagingPermission(messaging);
            const enabled =
                authStatus === 1 || // AUTHORIZED
                authStatus === 2;   // PROVISIONAL

            if (enabled) {
                console.log('[FCM] Authorization status:', authStatus);

                // Also request notification permissions through Notifee
                await notifee.requestPermission({
                    android: {
                        importance: 4, // HIGH importance
                        lightColor: '#ff79c6',
                        channelId: NOTIFICATION_CHANNELS.HIGH_IMPORTANCE,
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
            console.log('[FCM] Error requesting permission:', error);
            return false;
        }
    };

    /**
     * Handle notifications with UI updates (Toast, Navigation)
     * This is only for foreground notifications or when the app is opened from a notification
     */
    const handleNotification = (remoteMessage) => {
        if (!remoteMessage) return;

        const title = remoteMessage.notification?.title || 'New Notification';
        const body = remoteMessage.notification?.body || '';
        const data = remoteMessage.data || {};

        console.log('Handling notification:', { title, body, data: JSON.stringify(data) });

        // Store the notification in Redux state
        dispatch(setNotification({ notification: remoteMessage }));

        // Convert boolean to string or check for string representation
        const isNotifOpen =
            remoteMessage._notificationOpened === 'true' ||
            remoteMessage.data?._notificationOpened === 'true';

        // First check if we have relevant data in the data payload
        if (data.type === 'order' && data.id) {
            // Handle order notifications as before
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
            const isNotifOpen =
                remoteMessage._notificationOpened === 'true' ||
                remoteMessage.data?._notificationOpened === 'true';
            if (isNotifOpen) {
                // Small delay to make sure navigation is ready
                setTimeout(() => {
                    navigateFromNotification(navigation, notificationData, isAdmin);
                }, 300);
            }

            return;
        }

        // Handle broadcast and other notification types
        try {
            let toastType = 'info';
            // Map notification type to toast type if possible
            if (data.type) {
                if (['warning', 'alert', 'error'].includes(data.type)) {
                    toastType = 'warning';
                } else if (['success', 'order_success'].includes(data.type)) {
                    toastType = 'success';
                }
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
                    const isNotifOpen =
                        remoteMessage._notificationOpened === 'true' ||
                        remoteMessage.data?._notificationOpened === 'true';
                    if (isNotifOpen) {
                        setTimeout(() => {
                            navigateFromNotification(navigation, jsonData, isAdmin);
                        }, 300);
                    }

                    return;
                }
            }

            // Get screen and tab from data or use defaults
            const screen = data.screen || 'Notifications';
            const tab = data.tab || 'Notifications';

            // Create actionable toast for all notifications
            Toast.show({
                type: data.toastType || 'info',
                text1: title,
                text2: body,
                onPress: () => {
                    if (screen && tab) {
                        navigateFromNotification(navigation, {
                            screen,
                            tab,
                            ...data,
                            isAdmin
                        }, isAdmin);
                    }
                },
                visibilityTime: 4000,
            });
        } catch (error) {
            console.error('Error showing toast notification:', error);
            // Fallback to simple toast
            Toast.show({
                type: 'info',
                text1: title,
                text2: body,
                visibilityTime: 4000,
            });
        }
    };

    // Handle foreground notification interaction events with Notifee
    useEffect(() => {
        // Set up Notifee foreground event listener
        const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
            console.log('[Notifee] Foreground event:', type, detail);

            // Handle notification presses in foreground
            if (type === EventType.PRESS) {
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
                        console.error('[Notifee] Error parsing FCM message', e);
                    }
                }
            }

            // Handle action button presses
            if (type === EventType.ACTION_PRESS) {
                const { pressAction, notification } = detail;
                console.log('[Notifee] Action pressed:', pressAction.id);

                // Check which action was pressed
                if (pressAction.id === 'view_order') {
                    const data = notification?.data || {};

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
                            console.error('[Notifee] Error parsing FCM message', e);
                        }
                    }
                }
            }

            // Handle notification dismissal
            if (type === EventType.DISMISSED) {
                console.log('[Notifee] User dismissed notification', detail.notification?.id);
            }
        });

        return () => unsubscribe();
    }, [navigation, isAdmin]);

    // Process initial notification on app cold start
    useEffect(() => {
        const processInitialNotification = async () => {
            try {
                // Check for FCM initial notification
                const messaging = getMessaging(getApp());
                const initialMsg = await getInitialNotification(messaging);

                if (initialMsg) {
                    console.log('[FCM] App opened from quit state by FCM notification:', initialMsg);

                    // Mark this message as opened from notification
                    if (initialMsg.data) {
                        initialMsg.data._notificationOpened = 'true';
                    }

                    // Handle with a small delay to ensure navigation is ready
                    setTimeout(() => {
                        handleNotification(initialMsg);
                    }, 1000);
                }

                // Also check Notifee for initial notification (this is the preferred method)
                const initialNotifee = await notifee.getInitialNotification();
                if (initialNotifee) {
                    console.log('[Notifee] App opened from notification:', initialNotifee);

                    // If we have stored FCM message data, parse and use it
                    if (initialNotifee.notification?.data?.fcmMessage) {
                        try {
                            const fcmMessage = JSON.parse(initialNotifee.notification.data.fcmMessage);
                            fcmMessage.data = fcmMessage.data || {};
                            fcmMessage.data._notificationOpened = 'true';

                            // Handle with the standard handler
                            setTimeout(() => {
                                handleNotification(fcmMessage);
                            }, 1000);
                        } catch (e) {
                            console.error('[Notifee] Error parsing FCM message', e);
                        }
                    }
                }
            } catch (error) {
                console.error('[FCM] Error processing initial notification:', error);
            }
        };

        processInitialNotification();
    }, [navigation, isAdmin]);

    // Main effect for setting up messaging
    useEffect(() => {
        const setupMessaging = async () => {
            dispatch(setIsChanging({ isChanging: true }));

            if (await requestPermission()) {
                console.log('[FCM] Permission granted. Setting up messaging...');
                const messaging = getMessaging(getApp());

                try {
                    // Force token refresh to ensure valid token
                    await messaging.deleteToken().catch(err => console.log('[FCM] Error deleting token:', err));

                    // Get the initial token
                    const token = await getToken(messaging);
                    if (token) {
                        // Store token in Redux
                        dispatch(reduxStoreFcmToken({ fcmToken: token }));
                        dispatch(setFcmToken(token));

                        // Store token in SecureStore
                        await storeFcmToken(token);
                        console.log('[FCM] Token obtained:', token.substring(0, 10) + '...');

                        // Register token with server
                        try {
                            // Add your server API call here
                            // await api.post('/notifications/device', { fcmToken: token });
                            console.log('[FCM] Token registered with server');
                        } catch (apiError) {
                            console.error('[FCM] Error registering token with server:', apiError);
                        }
                    }

                    // Register for token refresh events
                    const tokenUnsubscribe = onTokenRefresh(messaging, async (token) => {
                        console.log('[FCM] Token refreshed:', token.substring(0, 10) + '...');

                        // Update token in Redux
                        dispatch(reduxStoreFcmToken({ fcmToken: token }));
                        dispatch(setFcmToken(token));

                        // Update token in storage
                        await storeFcmToken(token);

                        // Update token on server
                        try {
                            // Add your server API call here
                            // await api.post('/notifications/device', { fcmToken: token });
                            console.log('[FCM] Refreshed token registered with server');
                        } catch (apiError) {
                            console.error('[FCM] Error registering refreshed token with server:', apiError);
                        }
                    });

                    // Handle incoming messages when app is in foreground
                    const messageUnsubscribe = onMessage(messaging, async (remoteMessage) => {
                        console.log('[FCM] Foreground message received');

                        // Process with Notifee
                        await processRemoteMessage(remoteMessage);

                        // Also handle with our UI handler
                        handleNotification(remoteMessage);
                    });

                    // Register the device for remote messages on iOS
                    if (Platform.OS === 'ios') {
                        await registerDeviceForRemoteMessages(messaging);
                        console.log('[FCM] iOS device registered for remote messages');
                    }

                    // Handle notification opened app (from background state)
                    const notificationOpenedUnsubscribe = onNotificationOpenedApp(messaging, (remoteMessage) => {
                        console.log('[FCM] Notification caused app to open from background state');

                        // Mark this message as opened from notification
                        if (remoteMessage.data) {
                            remoteMessage.data._notificationOpened = 'true';
                        }

                        // Handle in-app navigation and UI updates
                        handleNotification(remoteMessage);
                    });

                    dispatch(setIsChanging({ isChanging: false }));

                    // Clean up listeners on unmount
                    return () => {
                        messageUnsubscribe();
                        tokenUnsubscribe();
                        notificationOpenedUnsubscribe();
                    };
                } catch (error) {
                    console.error('[FCM] Error setting up messaging:', error);
                    dispatch(setIsChanging({ isChanging: false }));
                }
            } else {
                console.log('[FCM] Permission denied');
                dispatch(setIsChanging({ isChanging: false }));
            }
        };

        setupMessaging();
    }, [dispatch, navigation, isAdmin]);

    return { fcmToken, notification };
}
