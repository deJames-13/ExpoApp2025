import { unique } from '#utils';
import { check } from 'express-validator';
import BrandModel from './brand.model.js';

const commonRules = () => {
  return [
    check('name')
      .notEmpty()
      .withMessage('Name is required!')
      .matches(/^[a-zA-Z0-9 ]+$/)
      .withMessage('Name must be alphanumeric!'),

    check('description')
      .notEmpty()
      .withMessage('Description is required!')
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters!'),

    check('websiteUrl')
      .notEmpty()
      .withMessage('Website URL is required!'),
      // .isURL()
      // .withMessage('Must be a valid URL!'),

    check('emailAddress')
      .notEmpty()
      .withMessage('Email address is required!')
      .isEmail()
      .withMessage('Must be a valid email address!'),
  ];
};

const brandCreateRules = () => {
  return [
    ...commonRules(),
    check('name')
      .custom((value) => unique(BrandModel, 'name', value))
      .withMessage('Brand name must be unique!'),

    check('websiteUrl')
      .custom((value) => unique(BrandModel, 'websiteUrl', value))
      .withMessage('Website URL must be unique!'),

    check('emailAddress')
      .custom((value) => unique(BrandModel, 'emailAddress', value))
      .withMessage('Email address must be unique!'),
  ];
};

const brandUpdateRules = () => {
  return [
    ...commonRules(),
    check('name')
      .custom((value, { req }) =>
        unique(BrandModel, 'name', value, req?.params?.id, { slug: { $ne: req?.params?.slug } })
      )
      .withMessage('Brand name must be unique!'),

    check('websiteUrl')
      .custom((value, { req }) =>
        unique(BrandModel, 'websiteUrl', value, req?.params?.id)
      )
      .withMessage('Website URL must be unique!'),

    check('emailAddress')
      .custom((value, { req }) =>
        unique(BrandModel, 'emailAddress', value, req?.params?.id)
      )
      .withMessage('Email address must be unique!'),
  ];
};

export { brandCreateRules, brandUpdateRules };
