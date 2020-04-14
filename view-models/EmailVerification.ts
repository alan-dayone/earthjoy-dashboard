import * as Yup from 'yup';
import {constraint} from '../models/Configuration';
import {YupSmtp} from './YupCommon';

const yupSmtpInstance = YupSmtp(constraint);

export const MailSmtpSettingsValidationSchema = Yup.object().shape({
  senderName: yupSmtpInstance.senderName,
  senderEmail: yupSmtpInstance.senderEmail,
  subject: Yup.string().required('Email subject is required.'),
});
