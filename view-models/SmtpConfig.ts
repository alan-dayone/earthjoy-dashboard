import * as Yup from 'yup';
import {YupPassword} from './YupCommon';
import {constraint} from '../models/Configuration';

const senderName = Yup.string()
  .required('Sender name is required.')
  .max(
    constraint.senderName.MAX_LENGTH,
    `Sender name length must be less than ${constraint.senderName.MAX_LENGTH} characters.`,
  );

const senderEmail = Yup.string()
  .required('Email is required.')
  .email('Invalid email.')
  .max(
    constraint.senderName.MAX_LENGTH,
    `Sender email length must be less than ${constraint.senderEmail.MAX_LENGTH} characters.`,
  );

export const MailSmtpSettingsValidationSchema = Yup.object().shape({
  password: YupPassword(
    constraint.password.MIN_LENGTH,
    constraint.password.MAX_LENGTH,
  ),
  smtpHost: Yup.string().required('SMTP host is required.'),
  senderName,
  senderEmail,
  username: Yup.string()
    .required('Username is required.')
    .max(
      constraint.username.MAX_LENGTH,
      `Username length must be less than ${constraint.username.MAX_LENGTH} characters.`,
    ),
  smtpPort: Yup.string().required('Port is required.'), // TODO: Use .number() with custom error message.
});

// export const MailEmailVerificationValidationSchema = Yup.object().shape({
//
// });
