import { Controller } from '#lib';
import NotificationResource from './notification.resource.js';
import NotificationService from './notification.service.js';

class NotificationController extends Controller {
  service = NotificationService;
  resource = NotificationResource;

  sendNotification = async (req, res) => {
    const { type, ...message } = req.body
    const result = await this.service.sendNotification(message);

    this.success({
      res,
      message: "Notification sent.",
      success: true,
      type
    });
  }

  getUserNotifications = async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return this.error({
          res,
          message: "User not authenticated",
          statusCode: 401
        });
      }

      const notifications = await this.service.model.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(50);

      return this.success({
        res,
        data: this.resource.collection(notifications),
        message: "Notifications retrieved successfully"
      });
    } catch (error) {
      return this.error({
        res,
        message: error.message,
        error
      });
    }
  }

  saveDevice = async (req, res) => {
    try {
      const { fcmToken } = req.body;
      const userId = req.user?.id;

      if (!userId || !fcmToken) {
        return this.error({
          res,
          message: "User ID and FCM token are required",
          statusCode: 400
        });
      }

      await this.service.saveDevice({ user: userId, fcmToken });

      return this.success({
        res,
        message: "Device registered successfully"
      });
    } catch (error) {
      return this.error({
        res,
        message: error.message,
        error
      });
    }
  }

  // Admin endpoint to send notifications to specific users
  sendBatchNotifications = async (req, res) => {
    try {
      // Check if user is admin
      if (req.user?.role != 'admin') {
        console.log("User info: ", req.user)
        return this.error({
          res,
          message: "Unauthorized: Admin access required",
          statusCode: 403
        });
      }

      const {
        userIds,
        title,
        body,
        data = {},
        status = 'active',
        type = 'info',
        sendPush = true
      } = req.body;

      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return this.error({
          res,
          message: "User IDs are required and must be an array",
          statusCode: 400
        });
      }

      if (!title || !body) {
        return this.error({
          res,
          message: "Title and body are required",
          statusCode: 400
        });
      }

      const result = await this.service.sendBatchNotifications({
        userIds,
        title,
        body,
        data,
        status,
        type,
        sendPush
      });

      return this.success({
        res,
        message: `Notifications sent to ${result.length} users`,
        data: {
          count: result.length,
          success: result.filter(Boolean).length
        }
      });
    } catch (error) {
      return this.error({
        res,
        message: error.message,
        error
      });
    }
  }

  // Admin endpoint to broadcast notifications to all users or filtered users
  broadcastNotification = async (req, res) => {
    try {
      // Check if user is admin
      if (req.user?.role != 'admin') {
        console.log("User info: ", req.user)
        return this.error({
          res,
          message: "Unauthorized: Admin access required",
          statusCode: 403
        });
      }

      const {
        filter = {},
        title,
        body,
        data = {},
        status = 'active',
        type = 'info',
        sendPush = true
      } = req.body;

      if (!title || !body) {
        return this.error({
          res,
          message: "Title and body are required",
          statusCode: 400
        });
      }

      const result = await this.service.broadcastNotification({
        filter,
        title,
        body,
        data,
        status,
        type,
        sendPush
      });

      return this.success({
        res,
        message: `Notifications broadcasted to ${result.length} users`,
        data: {
          count: result.length,
          success: result.filter(Boolean).length
        }
      });
    } catch (error) {
      return this.error({
        res,
        message: error.message,
        error
      });
    }
  }
}

export default new NotificationController();
