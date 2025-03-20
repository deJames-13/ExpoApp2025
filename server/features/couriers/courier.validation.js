import { unique } from '#utils';
import { check } from 'express-validator';
import CourierModel from './courier.model.js';

const commonRules = () => {
  return [
    check('name')
      .notEmpty()
      .withMessage('Name is required!')
      .matches(/^[a-zA-Z0-9 ]+$/)
      .withMessage('Name must be alphanumeric!'),
    check('contactPerson')
      .notEmpty()
      .withMessage('Contact person is required!'),
    check('contactNumber')
      .notEmpty()
      .withMessage('Contact number is required!'),
    check('serviceArea')
      .notEmpty()
      .withMessage('Service area is required!'),
    check('emailAddress')
      .notEmpty()
      .withMessage('Email address is required!')
      .isEmail()
      .withMessage('Must be a valid email address!'),
  ];
};

const courierCreateRules = () => {
  return [
    ...commonRules(),
    check('name')
      .custom((value) => unique(CourierModel, 'name', value))
      .withMessage('Name must be unique!'),
    check('contactNumber')
      .custom((value) => unique(CourierModel, 'contactNumber', value))
      .withMessage('Contact number has already been used!'),
    check('emailAddress')
      .custom((value) => unique(CourierModel, 'emailAddress', value))
      .withMessage('Email address must be unique!'),
  ];
};

const courierUpdateRules = () => {
  return [
    ...commonRules(),
    check('name')
      .custom((value, { req }) =>
        unique(CourierModel, 'name', value, req?.params?.id, { slug: { $ne: req?.params?.slug } })
      )
      .withMessage('Name must be unique!'),
    check('contactNumber')
      .custom((value, { req }) =>
        unique(CourierModel, 'contactNumber', value, req?.params?.id)
      )
      .withMessage('Contact number has already been used!'),
    
    check('emailAddress')
      .custom((value, { req }) =>
        unique(CourierModel, 'emailAddress', value, req?.params?.id)
      )
      .withMessage('Email address must be unique!'),
  ];
};

export { courierCreateRules, courierUpdateRules };
