export enum ConfigurationKey {
  SYSTEM_STATUS = 'SYSTEM_STATUS',
  MAIL_SMTP_SETTINGS = 'MAIL_SMTP_SETTINGS',
}

export interface MailSmtpSettings {
  password: string;
  smtpHost: string;
  senderEmail: string;
  username: string;
  smtpPort: string;
}
