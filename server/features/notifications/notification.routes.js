import { METHODS, BASIC_OPERATIONS, READ_WRITE } from '#constants';
import { protectAndPermit } from '#middlewares/auth.middleware';
import controller from './notification.controller.js';

export default [
  {
    url: '/notifications',
    router: [
      {
        path: '/send',
        method: METHODS.POST,
        controller: [protectAndPermit(), controller.sendNotification],
      },
      {
        path: '/',
        method: METHODS.GET,
        controller: [protectAndPermit(), controller.getUserNotifications],
      },
      {
        path: '/device',
        method: METHODS.POST,
        controller: [protectAndPermit(), controller.saveDevice],
      },
      // Admin endpoints with appropriate protection
      {
        path: '/admin/batch',
        method: METHODS.POST,
        controller: [protectAndPermit(BASIC_OPERATIONS), controller.sendBatchNotifications],
      },
      {
        path: '/admin/broadcast',
        method: METHODS.POST,
        controller: [protectAndPermit(BASIC_OPERATIONS), controller.broadcastNotification],
      },
    ],
  },
];
