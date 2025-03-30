import { DASHBOARD_PERMISSIONS, METHODS, PATHS, READ_WRITE } from '#constants';
import { protectAndPermit } from '#middlewares/auth.middleware';
import { upload, handleBase64Upload } from '#middlewares/upload.middleware';
import controller from './product.controller.js';
export default [
  {
    url: '/products',
    router: [
      {
        path: PATHS.ALL,
        method: METHODS.GET,
        controller: controller.getAll,
      },
      {
        path: '/sales',
        method: METHODS.GET,
        controller: controller.productSales,
      },
      {
        path: '/stocks',
        method: METHODS.GET,
        controller: controller.productStocks,
      },
      {
        path: '/:id/reviews',
        method: METHODS.GET,
        controller: controller.getReviewDetails,
      },
      {
        path: '/filter',
        method: METHODS.POST,
        controller: controller.getFilteredProducts,
      },
      {
        path: PATHS.EDIT,
        method: METHODS.PATCH,
        controller: [
          ...protectAndPermit(READ_WRITE),
          upload.array('image'),
          handleBase64Upload('image', { arrayMode: true }), // Handle base64 array
          controller.update
        ],
      },
      {
        path: PATHS.STORE,
        method: METHODS.POST,
        controller: [
          ...protectAndPermit(READ_WRITE),
          upload.array('image'),
          handleBase64Upload('image', { arrayMode: true }), // Handle base64 array
          controller.store
        ],
      },
      {
        path: PATHS.DELETE,
        method: METHODS.DELETE,
        controller: controller.delete,
      },
      {
        path: PATHS.ID,
        method: METHODS.GET,
        controller: controller.getById,
      },
      {
        path: PATHS.SLUG,
        method: METHODS.GET,
        controller: controller.getBySlug,
      },
    ],
  },
];
