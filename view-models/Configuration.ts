import * as Yup from 'yup';
import {emailSchema} from './YupCommon';
import {constraint} from '../models/Configuration';

const senderName = Yup.string()
  .required()
  .max(constraint.senderName.MAX_LENGTH);

export const smtpSettingsValidationSchema = Yup.object().shape({
  smtpHost: Yup.string().required(),
  smtpPort: Yup.string().required(),
  senderName: senderName,
  senderEmail: emailSchema,
  username: Yup.string().required(),
  password: Yup.string().required(),
});

export const emailVerificationValidationSchema = Yup.object().shape({
  senderName,
  senderEmail: emailSchema,
  subject: Yup.string().required(),
  emailTemplate: Yup.string().required(),
});

export const passwordResetValidationSchema = Yup.object().shape({
  senderName,
  senderEmail: emailSchema,
  subject: Yup.string().required(),
  emailTemplate: Yup.string().required(),
});
