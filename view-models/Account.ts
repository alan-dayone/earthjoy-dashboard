import * as Yup from 'yup';
import lopick from 'lodash/pick';
import {
  AccountStatus,
  constraint as AccountConstraint,
} from '../models/Account';
import {emailSchema, inputSchema} from './YupCommon';

export const AccountStatusText = {
  [AccountStatus.ACTIVE]: 'Active',
  [AccountStatus.INACTIVE]: 'Inactive',
};

export enum AccountEmailVerificationText {
  VERIFIED = 'Verified',
  NOT_VERIFIED = 'Not verified',
}

const validationSchema = {
  email: emailSchema,
  lastName: inputSchema('Last name', {
    required: true,
    max: AccountConstraint.firstName.MAX_LENGTH,
  }),
  firstName: inputSchema('First name', {
    required: true,
    max: AccountConstraint.lastName.MAX_LENGTH,
  }),
  password: inputSchema('Password', {
    required: true,
    min: AccountConstraint.lastName.MIN_LENGTH,
    max: AccountConstraint.lastName.MAX_LENGTH,
  }),
  confirmPassword: inputSchema('Confirm password', {required: true}).oneOf(
    [Yup.ref('password'), null],
    'Passwords must match.',
  ),
};

export const userFormValidationSchema = Yup.object().shape({
  email: validationSchema.email,
  lastName: validationSchema.lastName,
  password: validationSchema.password,
  confirmPassword: inputSchema('Confirm password', {required: true}).oneOf(
    [Yup.ref('password'), null],
    'Passwords must match.',
  ),
});

export const userUpdateInformationFormValidationSchema = Yup.object().shape(
  lopick(validationSchema, ['lastName', 'firstName', 'password']),
);

export const createFirstAdminFormSchema = Yup.object().shape({
  name: validationSchema.firstName,
  email: validationSchema.email,
});

export const adminResetPasswordFormSchema = Yup.object().shape({
  email: validationSchema.email,
});

export const adminResetNewPasswordFormSchema = Yup.object().shape({
  newPassword: validationSchema.password,
  confirmPassword: inputSchema('Confirm password', {required: true}).oneOf(
    [Yup.ref('newPassword'), null],
    'Passwords must match.',
  ),
});
