import { unique } from '#utils';
import { check } from 'express-validator';
import _ExampleModel from './_example.model.js';

const commonRules = {
  name: () =>
    check('name')
      .notEmpty()
      .withMessage('Name is required!')
      .matches(/^[a-zA-Z0-9 ]+$/)
      .withMessage('Name must be alphanumeric!'),
};

const _exampleCreateRules = () => {
  return [
    ...Object.entries(commonRules).map(([field, rule]) => {
      switch (field) {
        case 'name':
          return rule()
            .custom((value) => unique(_ExampleModel, 'name', value))
            .withMessage('Name must be unique!');

        default:
          return rule();
      }
    }),
  ];
};

const _exampleUpdateRules = () => {
  return [
    ...Object.entries(commonRules).map(([field, rule]) => {
      switch (field) {
        case 'name':
          return rule()
            .custom((value, { req }) =>
              unique(_ExampleModel, 'name', value, req?.params?.id, { slug: { $ne: req?.params?.slug } })
            )
            .withMessage('Name must be unique!');

        default:
          return rule().optional();
      }
    }),
  ];
};
export { _exampleCreateRules, _exampleUpdateRules };
