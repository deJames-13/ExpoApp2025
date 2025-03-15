import { check } from 'express-validator';

const cartCreateRules = () => {
  return [
    check('name')
      .notEmpty()
      .withMessage('Name is required')
      .matches(/^[a-zA-Z0-9 ]+$/)
      .withMessage('Name must be alphanumeric'),
      
    // Add more validation rules as needed for your cart entity
    
  ];
};

const cartUpdateRules = () => {
  return [
    check('name')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Name is required')
      .matches(/^[a-zA-Z0-9 ]+$/)
      .withMessage('Name must be alphanumeric'),
      
    // Add more update validation rules for your cart entity

  ];
};

export { cartCreateRules, cartUpdateRules };
