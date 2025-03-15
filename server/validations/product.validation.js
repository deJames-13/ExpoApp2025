import { check } from 'express-validator';

const productCreateRules = () => {
  return [
    check('name')
      .notEmpty()
      .withMessage('Name is required')
      .matches(/^[a-zA-Z0-9 ]+$/)
      .withMessage('Name must be alphanumeric'),
      
    // Add more validation rules as needed for your product entity
    
  ];
};

const productUpdateRules = () => {
  return [
    check('name')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Name is required')
      .matches(/^[a-zA-Z0-9 ]+$/)
      .withMessage('Name must be alphanumeric'),
      
    // Add more update validation rules for your product entity

  ];
};

export { productCreateRules, productUpdateRules };
