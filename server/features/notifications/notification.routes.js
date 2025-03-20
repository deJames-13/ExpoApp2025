import { METHODS, PATHS } from '#constants';
import controller from './notification.controller.js';

export default [
  {
    url: '/notifications',
    router: [
      {
        path: '/send',
        method: METHODS.POST,
        controller: [controller.sendNotification],
      },
    ],
  },
];
