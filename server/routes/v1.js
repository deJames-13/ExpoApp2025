import * as features from '#features';

const v1 = [
  ...features.categoryRoutes,
  ...features.wishlistRoutes,
  ...features.notificationRoutes,
  ...features.orderRoutes,
  ...features.cartRoutes,

  ...features.brandRoutes,
  ...features.productRoutes,
  ...features.courierRoutes,
  ...features.supplierRoutes,
  ...features.userRoutes,
  ...features.reviewRoutes,
  ...features.chartRoutes,
  ...features.healthRoutes,
  // NEW ROUTE HERE ->
];

export default v1;
