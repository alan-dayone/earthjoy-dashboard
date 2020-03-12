import * as Yup from 'yup';
import {constraint} from '../models/Configuration';

export const MailSmtpSettingsValidationSchema = Yup.object().shape({
  senderName: Yup.string()
    .required('Sender name is required.')
    .max(
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
  subject: Yup.string().required('Email subject is required.'),
});
