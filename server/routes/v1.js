import * as features from '#features';

const v1 = [


    ...features.categoryRoutes,
    ...features.wishlistRoutes,
  // NEW ROUTE HERE ->
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
];

export default v1;
