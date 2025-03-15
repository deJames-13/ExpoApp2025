import { check } from 'express-validator';

const ordersCreateRules = () => {
  return [
    check('name')
      .notEmpty()
      .withMessage('Name is required')
      .matches(/^[a-zA-Z0-9 ]+$/)
      .withMessage('Name must be alphanumeric'),
      
    // Add more validation rules as needed for your orders entity
    
  ];
};

const ordersUpdateRules = () => {
  return [
    check('name')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Name is required')
      .matches(/^[a-zA-Z0-9 ]+$/)
      .withMessage('Name must be alphanumeric'),
      
    // Add more update validation rules for your orders entity

  ];
};

export { ordersCreateRules, ordersUpdateRules };
