import * as Yup from 'yup';
import {emailSchema, inputSchema} from './YupCommon';
import {constraint} from '../models/Configuration';

const senderName = inputSchema('Sender name', {
  required: true,
  max: constraint.senderName.MAX_LENGTH,
});

export const smtpSettingsValidationSchema = Yup.object().shape({
  smtpHost: inputSchema('SMTP host', {required: true}),
  smtpPort: inputSchema('Port', {required: true}), // TODO: Possible to use .number() with custom error message?
  senderName,
  senderEmail: emailSchema,
  username: inputSchema('Username', {
    required: true,
    max: constraint.username.MAX_LENGTH,
  }),
  password: inputSchema('Password', {
    min: constraint.password.MIN_LENGTH,
    max: constraint.password.MAX_LENGTH,
  }),
});

export const emailVerificationValidationSchema = Yup.object().shape({
  senderName,
  senderEmail: emailSchema,
  subject: inputSchema('Email subject', {required: true}),
  emailTemplate: inputSchema('Email template', {required: true}),
});

export const passwordResetValidationSchema = Yup.object().shape({
  senderName,
  senderEmail: emailSchema,
  subject: inputSchema('Email subject', {required: true}),
  emailTemplate: inputSchema('Email template', {required: true}),
});
