import { METHODS, READ_WRITE } from '#constants';
import { protectAndPermit } from '#middlewares/auth.middleware';
import { upload, handleBase64Upload } from '#middlewares/upload.middleware';
import controller from './user.controller.js';

export default [
  {
    url: '/users',
    router: [
      {
        path: '/refresh',
        method: METHODS.GET,
        controller: controller.refresh,
      },
      {
        path: '/auth/google/login',
        method: METHODS.POST,
        controller: controller.googleLogin,
      },
      {
        path: '/auth/google/register',
        method: METHODS.POST,
        controller: controller.googleRegister,
      },
      {
        path: '/forgot-password',
        method: METHODS.POST,
        controller: controller.forgotPassword,
      },
      {
        path: '/reset-password/:token',
        method: METHODS.POST,
        controller: controller.resetPassword,
      },
      {
        path: '/verify-email/:verifyToken',
        method: METHODS.GET,
        controller: controller.verifyEmail,
      },
      {
        path: '/',
        method: METHODS.GET,
        controller: controller.getAll,
      },
      {
        path: '/',
        method: METHODS.POST,
        controller: controller.register,
      },
      {
        path: '/authenticate',
        method: METHODS.POST,
        controller: controller.authenticate,
      },
      {
        path: '/logout',
        method: METHODS.POST,
        controller: [protectAndPermit(), controller.logout],
      },
      {
        path: '/profile',
        method: METHODS.GET,
        controller: [protectAndPermit(), controller.getProfile],
      },
      {
        path: '/profile',
        method: METHODS.PATCH,
        controller: [
          protectAndPermit(READ_WRITE),
          upload.single('avatar'),
          handleBase64Upload('avatar'), // Add base64 handler after multer
          controller.update
        ],
      },
      {
        path: '/:id',
        method: METHODS.GET,
        controller: controller.getById,
      },
      {
        path: '/:id',
        method: METHODS.PATCH,
        controller: [
          protectAndPermit(READ_WRITE),
          upload.single('avatar'),
          handleBase64Upload('avatar'),
          controller.update
        ],
      },
      {
        path: '/:id',
        method: METHODS.DELETE,
        controller: [protectAndPermit(READ_WRITE), controller.delete],
      },
      {
        path: '/:id/send-verify-email',
        method: METHODS.POST,
        controller: [protectAndPermit(), controller.sendVerifyEmail],
      },
      {
        path: '/:id/verify-email',
        method: METHODS.POST,
        controller: [protectAndPermit(), controller.verifyEmail],
      },
      {
        path: '/test/email',
        method: METHODS.POST,
        controller: controller.testEmail,
      },
      // Add new route for FCM token updates
      {
        path: '/fcm-token',
        method: METHODS.POST,
        controller: [protectAndPermit(), controller.updateFcmToken],
      },
      {
        path: '/:id/update-role',
        method: METHODS.PATCH,
        controller: [protectAndPermit(READ_WRITE), controller.updateRole],
      },
    ],
  },
];
