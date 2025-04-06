import { Controller } from '#lib';
import NotificationResource from './notification.resource.js';
import NotificationService from './notification.service.js';
import { UserModel } from '#features'; // Add this import for debugNotifications

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

      // Parse pagination parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Parse sort parameter
      const sort = req.query.sort || '-createdAt'; // Default to newest first
      const sortObj = {};

      // Handle sort prefix (- means descending)
      if (sort.startsWith('-')) {
        sortObj[sort.substring(1)] = -1;
      } else {
        sortObj[sort] = 1;
      }

      // Query with pagination and sorting
      const query = { user: userId };
      const notifications = await this.service.model.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limit);

      // Get total count for pagination
      const totalCount = await this.service.model.countDocuments(query);

      // Build pagination metadata
      const meta = {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      };

      // Transform and return data
      return this.success({
        res,
        data: (await this.resource.collection(notifications)) || notifications,
        message: "Notifications retrieved successfully",
        meta
      });
    } catch (error) {
      return this.error({
        res,
        message: error.message,
        error
      });
    }
  };

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

  markAsRead = async (req, res) => {
    try {
      const userId = req.user?.id;
      const notificationId = req.params.id;

      if (!userId) {
        return this.error({
          res,
          message: "User not authenticated",
          statusCode: 401
        });
      }

      if (!notificationId) {
        return this.error({
          res,
          message: "Notification ID is required",
          statusCode: 400
        });
      }

      const notification = await this.service.model.findOne({
        _id: notificationId,
        user: userId
      });

      if (!notification) {
        return this.error({
          res,
          message: "Notification not found",
          statusCode: 404
        });
      }

      notification.isRead = true;
      await notification.save();

      return this.success({
        res,
        data: this.resource.transform(notification),
        message: "Notification marked as read"
      });
    } catch (error) {
      return this.error({
        res,
        message: error.message,
        error
      });
    }
  }

  markAllAsRead = async (req, res) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return this.error({
          res,
          message: "User not authenticated",
          statusCode: 401
        });
      }

      // Update all unread notifications for this user
      const result = await this.service.model.updateMany(
        { user: userId, isRead: false },
        { $set: { isRead: true } }
      );

      return this.success({
        res,
        data: { count: result.modifiedCount },
        message: `${result.modifiedCount} notifications marked as read`
      });
    } catch (error) {
      return this.error({
        res,
        message: error.message,
        error
      });
    }
  }

  // New method to clear all notifications for a user
  clearAllNotifications = async (req, res) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return this.error({
          res,
          message: "User not authenticated",
          statusCode: 401
        });
      }

      // Delete all notifications for this user
      const result = await this.service.model.deleteMany({ user: userId });

      return this.success({
        res,
        data: { count: result.deletedCount },
        message: `${result.deletedCount} notifications cleared successfully`
      });
    } catch (error) {
      return this.error({
        res,
        message: error.message,
        error
      });
    }
  }

  // New method to delete selected notifications
  deleteSelectedNotifications = async (req, res) => {
    try {
      const userId = req.user?.id;
      const { ids } = req.body;

      if (!userId) {
        return this.error({
          res,
          message: "User not authenticated",
          statusCode: 401
        });
      }

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return this.error({
          res,
          message: "Notification IDs are required and must be an array",
          statusCode: 400
        });
      }

      // Delete only the notifications that belong to this user and are in the provided list
      const result = await this.service.model.deleteMany({
        _id: { $in: ids },
        user: userId
      });

      return this.success({
        res,
        data: { count: result.deletedCount },
        message: `${result.deletedCount} notifications deleted successfully`
      });
    } catch (error) {
      return this.error({
        res,
        message: error.message,
        error
      });
    }
  }

  // Debug method for notifications
  debugNotifications = async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return this.error({
          res,
          message: "User not authenticated",
          statusCode: 401
        });
      }

      // Get user info
      const user = await UserModel.findById(userId).select('fcmToken').lean();

      const diagnosticInfo = {
        userId,
        hasFcmToken: !!user?.fcmToken,
        tokenLength: user?.fcmToken?.length || 0,
        notificationCount: await this.service.model.countDocuments({ user: userId }),
        channels: await this.service.getChannelsInfo()
      };

      return this.success({
        res,
        data: diagnosticInfo,
        message: "Notification diagnostic info retrieved"
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
