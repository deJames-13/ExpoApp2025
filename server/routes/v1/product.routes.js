import { ProductController } from '#controllers';
import { protect } from '#middlewares';

const controller = ProductController;
export default [
  {
    path: '/',
    method: 'get',
    controller: controller.getAll,
  },
  {
    path: '/:id',
    method: 'get',
    controller: controller.getById,
  },
  {
    path: '/',
    method: 'post',
    controller: controller.create,
  },
  {
    path: '/:id',
    method: 'put',
    controller: [protect, controller.update],
  },
  {
    path: '/:id',
    method: 'delete',
    controller: [protect, controller.delete],
  },
];
