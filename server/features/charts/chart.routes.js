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
      },
      {
        path: '/recent-orders',
        method: METHODS.GET,
        controller: [
          ...protectAndPermit(READ_WRITE),
          controller.recentOrders,
        ],
      },
      {
        path: '/recent-users',
        method: METHODS.GET,
        controller: [
          ...protectAndPermit(READ_WRITE),
          controller.recentUsers,
        ],
      },
      {
        path: '/stats-data',
        method: METHODS.GET,
        controller: [
          ...protectAndPermit(READ_WRITE),
          controller.statsData,
        ],
      },
      {
        path: '/dashboard-data',
        method: METHODS.GET,
        controller: [
          ...protectAndPermit(READ_WRITE),
          controller.dashboardData,
        ],
      }
    ],
  },
];
