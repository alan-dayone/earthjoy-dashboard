import * as Yup from 'yup';
import {constraint} from '../models/Configuration';

export const MailSmtpSettingsValidationSchema = Yup.object().shape({
  password: Yup.string()
    .required('Password port is required.')
    .min(
      constraint.password.MIN_LENGTH,
      `Password lenght must be between ${constraint.password.MIN_LENGTH} - ${constraint.password.MAX_LENGTH} characters.`,
    )
    .max(
      constraint.password.MIN_LENGTH,
      `Password lenght must be between ${constraint.password.MIN_LENGTH} - ${constraint.password.MAX_LENGTH} characters.`,
    ),
  smtpHost: Yup.string()
    .required('SMTP host is required.')
    .url('You must provide correct url'),
  senderName: Yup.string().max(
    constraint.senderName.MAX_LENGTH,
    `Sender name lenght must be less than ${constraint.senderName.MAX_LENGTH} characters.`,
  ),
  senderEmail: Yup.string()
    .required('Sender email is required.')
    .email('Invalid Email.')
    .max(
      constraint.senderEmail.MAX_LENGTH,
      `Sender email lenght must be less than ${constraint.senderEmail.MAX_LENGTH} characters.`,
    ),
  username: Yup.string()
    .required('Username must be provided.')
    .max(
      constraint.username.MAX_LENGTH,
      `Username lenght must be less than ${constraint.username.MAX_LENGTH} characters.`,
    ),
  smtpPort: Yup.string()
    .required('SMTP port is required.')
    .max(
      constraint.smtpPort.MAX_LENGTH,
      `SMTP port lenght must be less than ${constraint.smtpPort.MAX_LENGTH} characters.`,
    ),
});
