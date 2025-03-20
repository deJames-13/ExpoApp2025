import { METHODS, PATHS, READ_WRITE } from '#constants';
import { protectAndPermit } from '#middlewares/auth.middleware';
import controller from './cart.controller.js';
export default [
  {
    url: '/cart',
    router: [
      {
        path: PATHS.ALL,
        method: METHODS.GET,
        controller: [...protectAndPermit(READ_WRITE), controller.getAll],
      },
      {
        path: PATHS.EDIT,
        method: METHODS.PATCH,
        controller: [...protectAndPermit(READ_WRITE), controller.store],
      },
      {
        path: PATHS.STORE,
        method: METHODS.POST,
        controller: [...protectAndPermit(READ_WRITE), controller.store],
      },
      {
        path: PATHS.DELETE,
        method: METHODS.DELETE,
        controller: [...protectAndPermit(READ_WRITE), controller.delete],
      },
    ],
  },
];
