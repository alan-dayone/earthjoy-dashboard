import {
  errorCode as ValidationErrorCode,
  ValidationError
} from '../errors/ValidationError';
import { constraint } from '../models/User';
import { validate } from './BaseValidator';

const spec = {
  email: {
    presence: {
      message: `^${ValidationErrorCode.REQUIRED}`,
      allowEmpty: false,
    },
    email: { message: `^${ValidationErrorCode.INVALID_EMAIL}` },
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

export function validateUser(userData) {
  validate(userData, spec);
}

export function validateAvatarUpload(file) {
  const errorCodes = [];

  if (!constraint.avatar.ALLOWED_FILE_TYPES.includes(file.type)) {
    errorCodes.push(ValidationErrorCode.INVALID_FILE_TYPE);
  }

  if (file.size > constraint.avatar.MAX_FILE_SIZE) {
    errorCodes.push(ValidationErrorCode.INVALID_FILE_SIZE);
  }

  if (errorCodes.length) {
    throw new ValidationError(errorCodes);
  }
}
