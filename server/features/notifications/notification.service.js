import admin from '#firebase/utils';
import { Service } from '#lib';
import { UserModel } from '#features';
import NotificationModel from './notification.model.js';

class NotificationService extends Service {
  model = NotificationModel;

  async saveDevice({ user, fcmToken }) {
    // Store the user's FCM token for future reference
    if (!user || !fcmToken) return null;

    // Check if user model has fcmToken field directly or needs separate storage
    try {
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
    const message = {
      notification: {
        title, body
      },
      token: deviceToken,
      data,
      android: {
        priority,
        ttl: timeToLive * 1000 // timeToLive is in seconds
      },
      apns: {
        headers: {
          'apns-priority': priority === 'high' ? '10' : '5',
          'apns-expiration': (Math.floor(Date.now() / 1000) + timeToLive).toString()
        }
      },
      ...options // Merge custom options
    };

    return admin.messaging().send(message).then((response) => {
      console.log('Successfully sent message:', response);
      return response;
    }).catch((e) => {
      console.log('Error sending message:', e);
    });
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

      // Create a notification for each user
      const notificationPromises = userIds.map(userId =>
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
        // This could be optimized by using a single query to get all users with their FCM tokens
        // For now, we'll assume we have a way to get FCM tokens for users
        const pushPromises = userIds.map(async (userId) => {
          // This is a placeholder. In a real app, you would query the user model or a device token table
          // to get the FCM token for this user
          const user = await this.getUserWithFcmToken(userId);

          if (user && user.fcmToken) {
            return this.sendNotification({
              deviceToken: user.fcmToken,
              title,
              body,
              data,
              priority,
              timeToLive,
              options
            });
          }
          return null;
        });

        // Send push notifications asynchronously
        await Promise.allSettled(pushPromises);
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
}

export default new NotificationService();