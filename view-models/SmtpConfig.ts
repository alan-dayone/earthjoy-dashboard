import * as Yup from 'yup';
import {YupPassword, YupSmtp, YupEmail} from './YupCommon';
import {constraint} from '../models/Configuration';

const yupSmtpInstance = YupSmtp(constraint);

export const MailSmtpSettingsValidationSchema = Yup.object().shape({
  password: YupPassword(
    constraint.password.MIN_LENGTH,
    constraint.password.MAX_LENGTH,
  ),
  smtpHost: yupSmtpInstance.host,
  senderName: yupSmtpInstance.senderName,
  senderEmail: YupEmail,
  username: yupSmtpInstance.username,
  smtpPort: yupSmtpInstance.port,
});
