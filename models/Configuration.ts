export enum ConfigurationKey {
  SYSTEM_STATUS = 'SYSTEM_STATUS',
  MAIL_SMTP_SETTINGS = 'MAIL_SMTP_SETTINGS',
  RESET_PASSWORD_SETTINGS = 'RESET_PASSWORD_SETTINGS',
  VERIFY_ACCOUNT_SETTINGS = 'VERIFY_ACCOUNT_SETTINGS',
}

export interface MailSmtpSettings {
  password: string;
  smtpHost: string;
  senderName: string;
  senderEmail: string;
  username: string;
  smtpPort: string;
}

export interface ResetPasswordSettings {
  emailTemplate: string;
  subject: string;
  senderEmail: string;
  senderName: string;
}

export interface VerifyAccountSettings {
  emailTemplate: string;
  subject: string;
  senderEmail: string;
  senderName: string;
}

export const constraint = {
  senderEmail: {
    MAX_LENGTH: 256,
  },
  username: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 256,
  },
  senderName: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 256,
  },
  smtpHost: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 256,
  },
  password: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 50,
  },
  smtpPort: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 6,
  },
};
