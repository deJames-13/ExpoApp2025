import { check } from 'express-validator';

const categoryCreateRules = () => {
  return [
    check('name')
      .notEmpty()
      .withMessage('Name is required')
      .matches(/^[a-zA-Z0-9 ]+$/)
      .withMessage('Name must be alphanumeric'),
      
    // Add more validation rules as needed for your category entity
    
  ];
};

const categoryUpdateRules = () => {
  return [
    check('name')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Name is required')
      .matches(/^[a-zA-Z0-9 ]+$/)
      .withMessage('Name must be alphanumeric'),
      
    // Add more update validation rules for your category entity

  ];
};

export { categoryCreateRules, categoryUpdateRules };
