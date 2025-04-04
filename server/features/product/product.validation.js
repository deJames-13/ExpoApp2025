import { unique } from '#utils';
import { check } from 'express-validator';
import mongoose from 'mongoose'; // Import mongoose to validate ObjectId
import ProductModel from './product.model.js';

const commonRules = () => {
  return [
    check('name')
      .notEmpty()
      .withMessage('Name is required!')
      .isString()
      .matches(/^[a-zA-Z0-9 ]+$/)
      .withMessage('Name must be alphanumeric!' + 'Characters like space and _-.,!#:() are allowed!'),
    check('price').notEmpty().withMessage('Price is required!').isNumeric().withMessage('Price must be a number!'),
    check('stock').notEmpty().withMessage('Stock is required!').isNumeric().withMessage('Stock must be a number!'),
    check('description').optional({ checkFalsy: true }).isString(),
    check('category')
      .notEmpty()
      .withMessage('Category is required!'),
    check('brand')
      .withMessage('Brand is required!'),
    check('category')
      .withMessage('Category is required!'),
    check('supplier')
      .withMessage('Supplier is required!'),
  ];
};

const productCreateRules = () => {
  // METHOD CHAINING
  return [
    ...commonRules(),
    check('name')
      .custom((value) => unique(ProductModel, 'name', value))
      .withMessage('Name must be unique!'),
  ];
};

const productUpdateRules = () => {
  return [
    ...commonRules(),
    check('name')
      .custom((value, { req }) =>
        unique(ProductModel, 'name', value, req?.params?.id, { slug: { $ne: req?.params?.slug } })
      )
      .withMessage('Name must be unique!'),
  ];
};

export { productCreateRules, productUpdateRules };

