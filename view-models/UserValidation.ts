import * as Yup from 'yup';
import {AccountStatus, constraint as Accountconstraint} from '../models/User';

export const createUserSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required.')
    .email('Invalid Email.'),
  firstName: Yup.string().max(10),
  lastName: Yup.string().max(20),
  password: Yup.string()
    .required('Password is required.')
    .min(
      Accountconstraint.password.MIN_LENGTH,
      `Password is too short - should be ${Accountconstraint.password.MIN_LENGTH} chars minimum.`,
    )
    .max(
      Accountconstraint.password.MAX_LENGTH,
      `Password is too long - should be ${Accountconstraint.password.MAX_LENGTH} chars minimum.`,
    )
    .matches(Accountconstraint.password.PATTERN, 'Password can only contain Latin letters.'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match.'),
  status: Yup.string().oneOf(Object.values(AccountStatus), ''),
  emailVerified: Yup.boolean(),
});

export const editUserSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required.')
    .email('Invalid Email.'),
  firstName: Yup.string().max(10),
  lastName: Yup.string().max(20),
  status: Yup.string().oneOf(Object.values(AccountStatus), ''),
  emailVerified: Yup.boolean(),
});
