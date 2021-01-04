import * as Yup from 'yup';
import {constraint as AccountConstraint, Account} from '../models/Account';
import {emailSchema} from './CommonValidationSchemas';

export const sharedValidationSchema = {
  email: emailSchema,
  password: Yup.string()
    .required()
    .min(AccountConstraint.password.MIN_LENGTH)
    .max(AccountConstraint.password.MAX_LENGTH),
};

export const getAccountName = (account: Account): string => {
  return account.email;
};
