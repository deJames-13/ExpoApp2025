import { check } from 'express-validator';

const reviewsCreateRules = () => {
  return [
    check('name')
      .notEmpty()
      .withMessage('Name is required')
      .matches(/^[a-zA-Z0-9 ]+$/)
      .withMessage('Name must be alphanumeric'),
      
    // Add more validation rules as needed for your reviews entity
    
  ];
};

const reviewsUpdateRules = () => {
  return [
    check('name')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Name is required')
      .matches(/^[a-zA-Z0-9 ]+$/)
      .withMessage('Name must be alphanumeric'),
      
    // Add more update validation rules for your reviews entity

  ];
};

export { reviewsCreateRules, reviewsUpdateRules };
