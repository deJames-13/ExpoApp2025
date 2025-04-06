import admin from '#firebase/utils';
import { Service } from '#lib';
import { UserModel } from '#features';
import NotificationModel from './notification.model.js';

class NotificationService extends Service {
  model = NotificationModel;

  async saveDevice({ user, fcmToken }) {
    // Store the user's FCM token for future reference
    if (!user || !fcmToken) return null;

    try {
      // Update user's FCM token in UserModel
      await UserModel.findByIdAndUpdate(
        user._id || user,
        { fcmToken },
        { new: true }
      );

      return await this.model.create({
        user: user._id || user,
        data: { fcmToken },
        status: 'none',
        type: 'info',
        title: 'Device Registered',
        body: 'New device registered for notifications'
      });
    } catch (error) {
      console.error('Error saving device token:', error);
      return null;
    }
  }

  async sendNotification({ deviceToken, title = '', body = '', data = {}, priority = 'high', timeToLive = 3600, options = {} }) {
    // Validate token before attempting to send
    if (!deviceToken || typeof deviceToken !== 'string' || deviceToken.length < 10) {
      console.warn('Invalid FCM token format, skipping send');
      return null;
    }

    try {
      // Convert any non-string values in data to strings (FCM requirement)
      const processedData = Object.keys(data).reduce((result, key) => {
        result[key] = typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]);
        return result;
      }, {});

      // Set channelId based on notification type
      const type = data.type || 'info';
      let channelId;

      switch (type.toLowerCase()) {
        case 'order':
          channelId = 'orders_channel';
          break;
        case 'warning':
          channelId = 'warning_channel';
          break;
        case 'alert':
        case 'error':
          channelId = 'alert_channel';
          break;
        case 'promotion':
        case 'promo':
        case 'discount':
        case 'sale':
          channelId = 'promotions_channel';
          break;
        case 'info':
          channelId = 'info_channel';
          break;
        default:
          channelId = 'high_importance_channel';
      }

      // Add channelId to data
      processedData.channelId = channelId;

      // Always add click_action for Android
      processedData.click_action = 'FLUTTER_NOTIFICATION_CLICK';

      // Add screen and tab if not present
      if (!processedData.screen) {
        processedData.screen = 'Notifications';
      }
      if (!processedData.tab) {
        processedData.tab = 'Notifications';
      }

      // Create the message object
      const message = {
        notification: {
          title,
          body
        },
        token: deviceToken,
        data: processedData,
        android: {
          priority,
          ttl: timeToLive * 1000, // timeToLive is in seconds
          notification: {
            clickAction: 'FLUTTER_NOTIFICATION_CLICK',
            channelId,
            priority: 'high',
            defaultSound: true,
            visibility: 'public',
          }
        },
        apns: {
          headers: {
            'apns-priority': priority === 'high' ? '10' : '5',
            'apns-expiration': (Math.floor(Date.now() / 1000) + timeToLive).toString()
          },
          payload: {
            aps: {
              'content-available': 1,
              sound: 'default',
              badge: 1
            }
          }
        },
        ...options
      };

      console.log(`Sending notification to token: ${deviceToken.substring(0, 10)}... on channel: ${channelId}`);

      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
      return response;
    } catch (error) {
      // Handle specific FCM errors
      if (error.code === 'messaging/registration-token-not-registered' ||
        error.errorInfo?.code === 'messaging/registration-token-not-registered') {
        console.warn(`Invalid FCM token: ${deviceToken.substring(0, 10)}... - Removing from user`);
        // Remove invalid token from user (don't await to avoid blocking)
        this.removeInvalidToken(deviceToken).catch(e => 
          console.error('Error removing invalid token:', e)
        );
        // Return null instead of throwing
        return null;
      }

      console.error('Error sending message:', error);
      // For other errors, we still return null to prevent batch operations from failing
      return null;
    }
  }

  // Add new method to remove invalid tokens
  async removeInvalidToken(invalidToken) {
    if (!invalidToken) return;

    try {
      // Find any users with this token and remove it
      const result = await UserModel.updateMany(
        { fcmToken: invalidToken },
        { $set: { fcmToken: '' } }
      );

      console.log(`Removed invalid token from ${result.modifiedCount} users`);
      return result;
    } catch (error) {
      console.error('Error removing invalid token:', error);
      throw error;
    }
  }

  async saveNotification({ user, title, body, data = {}, status = 'active', type = 'info' }) {
    try {
      if (!user) return null;

      return await this.model.create({
        user: user._id || user,
        title,
        body,
        data,
        status,
        type
      });
    } catch (error) {
      console.error('Error saving notification:', error);
      return null;
    }
  }

  async sendNotifications() {
    // For batch processing notifications
    // Implementation can be added later for scheduled notifications
  }

  async sendBatchNotifications({ userIds, title, body, data = {}, status = 'active', type = 'info', sendPush = true, priority = 'normal', timeToLive = 3600, options = {} }) {
    try {
      if (!userIds || !userIds.length) {
        throw new Error('User IDs are required');
      }

      // Ensure userIds are strings
      const validUserIds = userIds.map(id => id.toString());

      // Create a notification for each user
      const notificationPromises = validUserIds.map(userId =>
        this.saveNotification({
          user: userId,
          title,
          body,
          data,
          status,
          type
        })
      );

      // Save all notifications asynchronously
      const savedNotifications = await Promise.all(notificationPromises);

      // If sendPush is true, get users with FCM tokens and send push notifications
      if (sendPush) {
        const users = await UserModel.find({
          _id: { $in: validUserIds },
          fcmToken: { $exists: true, $ne: '' }
        }).select('_id fcmToken').lean();

        console.log(`Found ${users.length} users with FCM tokens out of ${validUserIds.length} requested`);

        const pushPromises = users.map(user => {
          if (user.fcmToken) {
            // Enhanced notification data
            const enhancedData = {
              ...data,
              type,
              notificationType: type,
              screen: data.screen || 'Notifications',
              tab: data.tab || 'Notifications',
              timestamp: new Date().toISOString(),
              userId: user._id.toString() // Include userId for tracking
            };

            return this.sendNotification({
              deviceToken: user.fcmToken,
              title,
              // Send plain body text for better compatibility
              body: body,
              data: enhancedData,
              priority,
              timeToLive,
              options
            }).catch(err => {
              console.error(`Error sending push to ${user._id}:`, err);
              return null;
            });
          }
          return null;
        });

        // Filter out null promises before awaiting
        const validPushPromises = pushPromises.filter(Boolean);

        if (validPushPromises.length > 0) {
          // Send push notifications asynchronously and capture results
          const pushResults = await Promise.allSettled(validPushPromises);
          console.log(`Push notification results: ${pushResults.filter(r => r.status === 'fulfilled').length} successful, ${pushResults.filter(r => r.status === 'rejected').length} failed`);
        } else {
          console.log('No valid FCM tokens found, skipping push notifications');
        }
      }

      return savedNotifications;
    } catch (error) {
      console.error('Error sending batch notifications:', error);
      throw error;
    }
  }

  // Helper method to get user with FCM token
  async getUserWithFcmToken(userId) {
    // This is a placeholder. In a real app, you would implement this to get the user with their FCM token
    // For example, you might query your User model
    try {
      return await UserModel.findById(userId).select('fcmToken').lean();
    } catch (error) {
      console.error('Error getting user FCM token:', error);
      return null;
    }
  }

  // Sending notifications to all users or filtered users
  async broadcastNotification({
    filter = {},
    title,
    body,
    data = {},
    status = 'active',
    type = 'info',
    sendPush = true,
    priority = 'normal',
    timeToLive = 3600,
    options = {}
  }) {
    try {
      const users = await UserModel.find(filter).select('_id').lean();
      const userIds = users.map(user => user._id);

      return this.sendBatchNotifications({
        userIds,
        title,
        body,
        data,
        status,
        type,
        sendPush,
        priority,
        timeToLive,
        options
      });
    } catch (error) {
      console.error('Error broadcasting notification:', error);
      throw error;
    }
  }

  // Helper method to clear all notifications for a user
  async clearAllNotifications(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const result = await this.model.deleteMany({ user: userId });
      return result;
    } catch (error) {
      console.error('Error clearing all notifications:', error);
      throw error;
    }
  }

  // Helper method to delete selected notifications
  async deleteSelectedNotifications(userId, notificationIds) {
    try {
      if (!userId || !notificationIds || !notificationIds.length) {
        throw new Error('User ID and notification IDs are required');
      }

      const result = await this.model.deleteMany({
        _id: { $in: notificationIds },
        user: userId
      });
      return result;
    } catch (error) {
      console.error('Error deleting selected notifications:', error);
      throw error;
    }
  }

  // Helper method to get notification channels info for debugging
  async getChannelsInfo() {
    try {
      return {
        firebaseInitialized: !!admin.messaging,
        availableServices: Object.keys(admin),
      };
    } catch (error) {
      console.error('Error getting channels info:', error);
      return { error: error.message };
    }
  }
}

export default new NotificationService();