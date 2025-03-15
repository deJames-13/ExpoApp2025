import userRoutes from './user.routes.js';
import categoryRoutes from './category.routes.js';
import productRoutes from './product.routes.js';

const v1 = [
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
