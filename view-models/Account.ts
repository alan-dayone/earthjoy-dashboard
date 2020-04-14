import * as Yup from 'yup';
import {
  AccountStatus,
  constraint as AccountConstraint,
} from '../models/Account';
import {
  YupEmail,
  YupLastName,
  YupPassword,
  YupConfirmPassword,
  YupFirstName,
} from './YupCommon';

export const AccountStatusText = {
  [AccountStatus.ACTIVE]: 'Active',
  [AccountStatus.INACTIVE]: 'Inactive',
};

export enum AccountEmailVerificationText {
  VERIFIED = 'Verified',
  NOT_VERIFIED = 'Not verified',
}

export const userFormValidationSchema = Yup.object().shape({
  email: YupEmail,
  lastName: YupLastName(AccountConstraint.lastName.MAX_LENGTH),
  password: YupPassword(
    AccountConstraint.password.MIN_LENGTH,
    AccountConstraint.password.MAX_LENGTH,
  ),
  confirmPassword: YupConfirmPassword,
});

export const userUpdateInfomationFormValidationSchema = Yup.object().shape({
  email: YupEmail,
  firstName: YupFirstName(AccountConstraint.firstName.MAX_LENGTH),
  lastName: YupLastName(AccountConstraint.lastName.MAX_LENGTH),
});

export const createFirstAdminFormSchema = Yup.object().shape({
  name: YupFirstName(AccountConstraint.firstName.MAX_LENGTH),
  email: YupEmail,
});

export const adminResetPasswordFormSchema = Yup.object().shape({
  email: YupEmail,
});

export const adminResetNewPasswordFormSchema = Yup.object().shape({
  newPassword: YupPassword(
    AccountConstraint.password.MIN_LENGTH,
    AccountConstraint.password.MAX_LENGTH,
  ),
  confirmPassword: YupConfirmPassword,
});
