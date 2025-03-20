import { unique } from '#utils';
import { check } from 'express-validator';
import WishlistModel from './wishlist.model.js';

const commonRules = {
  name: () =>
    check('name')
      .notEmpty()
      .withMessage('Name is required!')
      .matches(/^[a-zA-Z0-9 ]+$/)
      .withMessage('Name must be alphanumeric!'),
};

const wishlistCreateRules = () => {
  return [
    ...Object.entries(commonRules).map(([field, rule]) => {
      switch (field) {
        case 'name':
          return rule()
            .custom((value) => unique(WishlistModel, 'name', value))
            .withMessage('Name must be unique!');

        default:
          return rule();
      }
    }),
  ];
};

const wishlistUpdateRules = () => {
  return [
    ...Object.entries(commonRules).map(([field, rule]) => {
      switch (field) {
        case 'name':
          return rule()
            .custom((value, { req }) =>
              unique(WishlistModel, 'name', value, req?.params?.id, { slug: { $ne: req?.params?.slug } })
            )
            .withMessage('Name must be unique!');

        default:
          return rule().optional();
      }
    }),
  ];
};
export { wishlistCreateRules, wishlistUpdateRules };
