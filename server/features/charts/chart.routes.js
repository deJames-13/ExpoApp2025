import { METHODS, READ_WRITE } from '#constants';
import { protectAndPermit } from '#middlewares/auth.middleware';
import controller from './chart.controller.js';
export default [
  {
    url: '/charts',
    router: [
      {
        path: '/monthly-revenue',
        method: METHODS.GET,
        controller: [
          ...protectAndPermit(READ_WRITE),
          controller.monthlyRevenue,
        ],
      },
      {
        path: '/daily-revenue',
        method: METHODS.POST,
        controller: [
          ...protectAndPermit(READ_WRITE),
          controller.dailyRevenue,
        ],
      }
    ],
  },
];
