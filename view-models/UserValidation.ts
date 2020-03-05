import * as Yup from 'yup';
import {AccountStatus, constraint as Accountconstraint} from '../models/User';

export const createUserSchema = Yup.object().shape({
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
  status: Yup.string().oneOf(Object.values(AccountStatus), ''),
  emailVerified: Yup.string(),
});

export const editUserSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required.')
    .email('Invalid Email.'),
  firstName: Yup.string().max(10),
  lastName: Yup.string().max(20),
  status: Yup.string().oneOf(Object.values(AccountStatus), ''),
  emailVerified: Yup.string(),
});
