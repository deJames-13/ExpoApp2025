import { unique } from '#utils';
import { check } from 'express-validator';
import SupplierModel from './supplier.model.js';

const commonRules = () => {
  return [
    check('name')
      .notEmpty()
      .withMessage('Name is required!')
      .matches(/^[a-zA-Z0-9 ]+$/)
      .withMessage('Name must be alphanumeric!'),
    check('emailAddress')
      .notEmpty()
      .withMessage('Email address is required!')
      .isEmail()
      .withMessage('Must be a valid email address!'),
    check('contactNumber')
      .notEmpty()
      .withMessage('Contact Number is required!'),
    check('contactPerson')
      .notEmpty()
      .withMessage('Contact person is required!')
      .matches(/^[a-zA-Z ]+$/)
      .withMessage('Contact person must contain only alphabetic characters and spaces!')
  ];
};

const supplierCreateRules = () => {
  return [
    ...commonRules(),
    check('name')
      .custom((value) => unique(SupplierModel, 'name', value))
      .withMessage('Name must be unique!'),
    check('emailAddress')
      .custom((value) => unique(SupplierModel, 'emailAddress', value))
      .withMessage('Email address has already been used!'),
    check('contactNumber')
      .custom((value) => unique(SupplierModel, 'contactNumber', value))
      .withMessage('Contact number has already been used!'),
  ];
};

const supplierUpdateRules = () => {
  return [
    ...commonRules(),
    check('name')
      .custom((value, { req }) =>
        unique(SupplierModel, 'name', value, req?.params?.id)
      )
      .withMessage('Name must be unique!'),
    check('emailAddress')
      .custom((value, { req }) =>
        unique(SupplierModel, 'emailAddress', value, req?.params?.id)
      )
      .withMessage('Email address has already been used!'),
    check('contactNumber')
      .custom((value, { req }) =>
        unique(SupplierModel, 'contactNumber', value, req?.params?.id)
      )
      .withMessage('Contact number has already been used!'),
  ];
};

export { supplierCreateRules, supplierUpdateRules };
