import { ROLES } from '#constants';
import { check } from 'express-validator';

const commonrules = {
  email: () => check('email').isEmail().withMessage('Email is invalid'),
  username: () =>
    check('username')
      .notEmpty()
      .withMessage('Username is required')
      .matches(/^[a-zA-Z0-9 ]+$/)
      .withMessage('Username must be alphanumeric'),
  password: () =>
    check('password')
      .isLength({ min: 6, max: 20 })
      .withMessage('Password must be between 6 and 20 characters')
      .custom(matchPassword),
  role: () => check('role').optional().isIn(ROLES).withMessage('Role is invalid'),
};

const userinforules = {
  'info.first_name': () =>
    check('info.first_name')
      .notEmpty()
      .withMessage('First name is required')
      .matches(/^[a-zA-Z ]+$/)
      .withMessage('First name must be alphabetic'),
  'info.last_name': () =>
    check('info.last_name')
      .notEmpty()
      .withMessage('Last name is required')
      .matches(/^[a-zA-Z ]+$/)
      .withMessage('Last name must be alphabetic'),
  'info.contact': () =>
    check('info.contact')
      .notEmpty()
      .withMessage('Contact is required')
      .matches(/^[0-9]{10}$/)
      .withMessage('Contact must be 10 digits'),
  'info.address': () => check('info.address').notEmpty().withMessage('Address is required'),
  'info.birthdate': () => check('info.birthdate'),
  'info.city': () => check('info.city').notEmpty().withMessage('City is required'),
  'info.region': () => check('info.region').notEmpty().withMessage('Region is required'),
  'info.zip_code': () => check('info.zip_code'),
  'info.avatar': () => check('info.avatar'),
};

const matchPassword = (value, { req }) => {
  if (value !== req.body.confirm_password) throw new Error('Password does not match!');
  return value;
};

const userCreateRules = () => {
  return [...Object.values(commonrules).map((rule) => rule())];
};

const userUpdateRules = () => {
  return [
    ...Object.values(commonrules).map((rule) => rule().optional()),
    check('id').notEmpty().withMessage('ID is required'),
  ];
};

const userInfoCreateRules = () => [...Object.values(userinforules).map((rule) => rule())];
const userInfoUpdateRules = () => [...Object.values(userinforules).map((rule) => rule().optional())];

export { userCreateRules, userInfoCreateRules, userInfoUpdateRules, userUpdateRules };

