import { Platform } from 'react-native';
import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';

// Define channels configuration for reuse
export const NOTIFICATION_CHANNELS = {
    HIGH_IMPORTANCE: 'high_importance_channel',
    ORDERS: 'orders_channel',
    PROMOTIONS: 'promotions_channel',
    INFO: 'info_channel',
    ALERT: 'alert_channel',
    WARNING: 'warning_channel',
};

export const setupNotificationChannels = async () => {
    try {
        console.log('[NotifeeChannels] Setting up notification channels...');

    if (Platform.OS === 'android') {
        // Create the high importance channel
        await notifee.createChannel({
          id: NOTIFICATION_CHANNELS.HIGH_IMPORTANCE,
          name: 'Important Notifications',
          description: 'Channel for important notifications',
          importance: AndroidImportance.HIGH,
          visibility: AndroidVisibility.PUBLIC,
          vibration: true,
          sound: 'default',
          lights: true,
          lightColor: '#FF0000',
      });

        // Create info channel
        await notifee.createChannel({
          id: NOTIFICATION_CHANNELS.INFO,
          name: 'Information',
          description: 'General information notifications',
          importance: AndroidImportance.DEFAULT,
      });

        // Create alert channel
        await notifee.createChannel({
            id: NOTIFICATION_CHANNELS.ALERT,
            name: 'Alerts',
            description: 'Alert notifications',
            importance: AndroidImportance.HIGH,
            vibration: true,
        });

        // Create warning channel
        await notifee.createChannel({
            id: NOTIFICATION_CHANNELS.WARNING,
            name: 'Warnings',
            description: 'Warning notifications',
            importance: AndroidImportance.HIGH,
            vibration: true,
        });

        // Create orders channel with maximum importance
        await notifee.createChannel({
            id: NOTIFICATION_CHANNELS.ORDERS,
            name: 'Orders',
            description: 'Order updates and notifications',
            importance: AndroidImportance.HIGH,
            visibility: AndroidVisibility.PUBLIC,
            vibration: true,
            sound: 'default',
            lights: true,
            lightColor: '#0000FF',
            // Add these settings for better visibility
            vibrationPattern: [300, 500, 300, 500],
            badge: true
        });

        // Create promotions channel
        await notifee.createChannel({
            id: NOTIFICATION_CHANNELS.PROMOTIONS,
            name: 'Promotions',
            description: 'Promotions and marketing notifications',
            importance: AndroidImportance.DEFAULT,
        });

            console.log('[NotifeeChannels] Created all Android channels successfully');
        }

        // iOS notification categories
        if (Platform.OS === 'ios') {
            await notifee.setNotificationCategories([
                {
                    id: 'order_actions',
                    actions: [
                        {
                            id: 'view_order',
                            title: 'View Order',
                        }
                    ]
                },
                {
                    id: 'default',
                    actions: []
                }
            ]);
            console.log('[NotifeeChannels] Set up iOS notification categories');
        }

        return true;
    } catch (error) {
        console.error('[NotifeeChannels] Error setting up notification channels:', error);
        return false;
    }
};

export const getChannelForType = (type) => {
    if (!type) return NOTIFICATION_CHANNELS.HIGH_IMPORTANCE;

    switch (type.toLowerCase()) {
        case 'order':
            return NOTIFICATION_CHANNELS.ORDERS;
        case 'promotion':
        case 'promo':
        case 'discount':
        case 'sale':
            return NOTIFICATION_CHANNELS.PROMOTIONS;
        case 'info':
            return NOTIFICATION_CHANNELS.INFO;
        case 'alert':
            return NOTIFICATION_CHANNELS.ALERT;
        case 'warning':
            return NOTIFICATION_CHANNELS.WARNING;
        default:
            return NOTIFICATION_CHANNELS.HIGH_IMPORTANCE;
  }
};
