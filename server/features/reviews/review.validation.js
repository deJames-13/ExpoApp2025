import { check } from 'express-validator';

// Common rules used across different validations
const commonRules = {
  rating: () =>
    check('rating')
      .isInt({ min: 1, max: 10 })
      .withMessage('Ratings must be an integer between 1 and 10'),
  title: () =>
    check('title')
      .isString()
      .withMessage('Title must be a string')
      .optional(),
  description: () =>
    check('description')
      .isLength({ min: 5 })
      .withMessage('Description must be at least 5 characters long')
      .optional(),
  isAnonymous: () => check('isAnonymous')
        .optional()
        .isBoolean()
        .withMessage('isAnonymous must be a boolean value'),
  order: () => check('order'),
  user: () => check('user')
};

const reviewCreateRules = () => [
  ...Object.values(commonRules).map((rule) => rule()),
];

const reviewUpdateRules = () => [
  ...Object.values(commonRules).map((rule) => rule().optional()),
];

export { reviewCreateRules, reviewUpdateRules };
