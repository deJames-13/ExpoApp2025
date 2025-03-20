import { METHODS, PATHS, READ_WRITE } from '#constants';
import { protectAndPermit } from '#middlewares/auth.middleware';
import { upload } from '#middlewares/upload.middleware';
import controller from './review.controller.js';
export default [
  {
    url: '/reviews',
    router: [
      {
        path: PATHS.ALL,
        method: METHODS.GET,
        controller: controller.getAll,
      },
      {
        path: PATHS.EDIT,
        method: METHODS.PATCH,
        controller: [...protectAndPermit(READ_WRITE), upload.array('image'), controller.update],
      },
      {
        path: PATHS.STORE,
        method: METHODS.POST,
        controller: [...protectAndPermit(READ_WRITE), upload.array('image'), controller.update],
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
