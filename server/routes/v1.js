import * as features from '#features';

const v1 = [
  ...features.categoryRoutes,
  ...features.wishlistRoutes,
  ...features.notificationRoutes,
  ...features.orderRoutes,
  ...features.cartRoutes,
  ...features._exampleRoutes,

  ...features.brandRoutes,
  ...features.productRoutes,
  ...features.courierRoutes,
  ...features.supplierRoutes,
  ...features.userRoutes,
  ...features.reviewRoutes,
  ...features.chartRoutes,
  // NEW ROUTE HERE ->
];

export default v1;
