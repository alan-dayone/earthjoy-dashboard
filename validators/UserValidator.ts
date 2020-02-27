import {errorCode as ValidationErrorCode, ValidationError} from '../errors/ValidationError';
import {constraint} from '../models/User';
import {validate} from './BaseValidator';

const spec = {
  email: {
    presence: {
      message: `^${ValidationErrorCode.REQUIRED}`,
      allowEmpty: false,
    },
    email: {message: `^${ValidationErrorCode.INVALID_EMAIL}`},
    length: {
      maximum: constraint.email.MAX_LENGTH,
      message: `^${ValidationErrorCode.INVALID_LENGTH}`,
    },
  },
  password: {
    presence: {
      message: `^${ValidationErrorCode.REQUIRED}`,
      allowEmpty: false,
    },
    length: {
      minimum: constraint.password.MIN_LENGTH,
      maximum: constraint.password.MAX_LENGTH,
      message: `^${ValidationErrorCode.INVALID_LENGTH}`,
    },
  },
  name: {
    presence: {
      message: `^${ValidationErrorCode.REQUIRED}`,
      allowEmpty: false,
    },
    length: {
      minimum: constraint.name.MIN_LENGTH,
      maximum: constraint.name.MAX_LENGTH,
      message: `^${ValidationErrorCode.INVALID_LENGTH}`,
    },
  },
};

export function validateUser(userData: any) {
  validate(userData, spec);
}
