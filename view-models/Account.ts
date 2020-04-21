import * as Yup from 'yup';
import lopick from 'lodash/pick';
// import i18next from 'i18next';
import {
  AccountStatus,
  constraint as AccountConstraint,
} from '../models/Account';
import {emailSchema} from './YupCommon';

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
    .oneOf(
      [Yup.ref('password'), null],
      // i18next.t('passwordsMustMatch'),
    ),
};

export const userFormValidationSchema = Yup.object().shape(
  lopick(validationSchema, ['email', 'firstName', 'lastName', 'password']),
);

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
  confirmPassword: Yup.string()
    .required()
    .oneOf(
      [Yup.ref('newPassword'), null],
      // 'Passwords must match.',
    ),
});
