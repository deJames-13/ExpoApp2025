import userRoutes from './user.routes.js';
import reviewsRoutes from './reviews.routes.js';
import notificationsRoutes from './notifications.routes.js';
import ordersRoutes from './orders.routes.js';
import cartRoutes from './cart.routes.js';
import categoryRoutes from './category.routes.js';
import productRoutes from './product.routes.js';

const v1 = [
  {
    url: '/reviews',
    router: reviewsRoutes,
  },
  {
    url: '/notifications',
    router: notificationsRoutes,
  },
  {
    url: '/orders',
    router: ordersRoutes,
  },
  {
    url: '/cart',
    router: cartRoutes,
  },
  {
    url: '/categories',
    router: categoryRoutes,
  },
  {
    url: '/products',
    router: productRoutes,
  },
  {
    url: '/users',
    router: userRoutes,
  },
];

export default v1;
