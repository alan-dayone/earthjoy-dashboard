import * as Yup from 'yup';
import {AccountStatus} from '../models/User';
import {constraint as Accountconstraint} from '../models/User';

export const AccountStatusText = {
  [AccountStatus.ACTIVE]: 'Active',
  [AccountStatus.INACTIVE]: 'Inactive',
};

export enum AccountEmailVerificationText {
  VERIFIED = 'Verified',
  NOT_VERIFIED = 'Not verified',
}

export const userFormValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required.')
    .email('Invalid Email.'),
  firstName: Yup.string()
    .required('First name is required')
    .max(10),
  lastName: Yup.string()
    .required('Last name is required')
    .max(20),
  password: Yup.string()
    .required('Password is required.')
    .min(
      Accountconstraint.password.MIN_LENGTH,
      `Password must contain ${Accountconstraint.password.MIN_LENGTH} - ${Accountconstraint.password.MAX_LENGTH} characters.`,
    )
    .max(
      Accountconstraint.password.MAX_LENGTH,
      `Password must contain ${Accountconstraint.password.MIN_LENGTH} - ${Accountconstraint.password.MAX_LENGTH} characters.`,
    ),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match.'),
});
