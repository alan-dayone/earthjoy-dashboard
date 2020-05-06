import * as Yup from 'yup';
import {constraint as AccountConstraint, Account} from '../models/Account';
import {emailSchema} from './CommonValidationSchemas';

export const sharedValidationSchema = {
  email: emailSchema,
  firstName: Yup.string()
    .required()
    .max(AccountConstraint.firstName.MAX_LENGTH),
  lastName: Yup.string()
    .required()
    .max(AccountConstraint.lastName.MAX_LENGTH),
  password: Yup.string()
    .required()
    .min(AccountConstraint.password.MIN_LENGTH)
    .max(AccountConstraint.password.MAX_LENGTH),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref('password'), null]),
};

export const getAccountName = (account: Account): string => {
  return [account.firstName, account.lastName].filter(str => !!str).join(' ');
};
