import userRoutes from './user.routes.js';
import productRoutes from './product.routes.js';

const v1 = [
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
