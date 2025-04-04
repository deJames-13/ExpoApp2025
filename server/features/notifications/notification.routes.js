import { METHODS, BASIC_OPERATIONS, READ_WRITE } from '#constants';
import { protectAndPermit } from '#middlewares/auth.middleware';
import controller from './notification.controller.js';

export default [
  {
    url: '/notifications',
    router: [
      {
        path: '/',
        method: METHODS.GET,
        controller: [protectAndPermit(), controller.getUserNotifications],
      },
      {
        path: '/send',
        method: METHODS.POST,
        controller: [protectAndPermit(), controller.sendNotification],
      },
      {
        path: '/device',
        method: METHODS.POST,
        controller: [protectAndPermit(), controller.saveDevice],
      },
      {
        path: '/:id/read',
        method: METHODS.PATCH,
        controller: [protectAndPermit(READ_WRITE), controller.markAsRead],
      },
      {
        path: '/read-all',
        method: METHODS.PATCH,
        controller: [protectAndPermit(READ_WRITE), controller.markAllAsRead],
      },
      // New endpoints for clearing and deleting notifications
      {
        path: '/clear-all',
        method: METHODS.DELETE,
        controller: [protectAndPermit(READ_WRITE), controller.clearAllNotifications],
      },
      {
        path: '/delete-selected',
        method: METHODS.DELETE,
        controller: [protectAndPermit(READ_WRITE), controller.deleteSelectedNotifications],
      },
      // Admin endpoints with appropriate protection
      {
        path: '/admin/batch',
        method: METHODS.POST,
        controller: [protectAndPermit(READ_WRITE), controller.sendBatchNotifications],
      },
      {
        path: '/admin/broadcast',
        method: METHODS.POST,
        controller: [protectAndPermit(READ_WRITE), controller.broadcastNotification],
      },
    ],
  },
];
