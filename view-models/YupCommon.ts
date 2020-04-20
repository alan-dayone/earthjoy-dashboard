import * as Yup from 'yup';

export const YupEmail = Yup.string()
  .required('Email is required.')
  .email('Invalid Email.');

export const YupPassword = (
  min: number,
  max: number,
): Yup.StringSchema<string> =>
  Yup.string()
    .required('Password is required.')
    .min(min, `Password must contain ${min} - ${max} characters.`)
    .max(max, `Password must contain ${min} - ${max} characters.`);

export const YupConfirmPassword = Yup.string().oneOf(
  [Yup.ref('password'), null],
  'Passwords must match.',
);

export const inputSchema = (
  name: string,
  options?: {required?: boolean; min?: number; max?: number},
): Yup.StringSchema => {
  const schema = Yup.string();
  if (options?.required || options?.min) {
    schema.required(`${name} is required.`);
  }

  if (options?.min) {
    schema.min(
      options.min,
      `${name} must contain at least ${options.min} characters.`,
    );
  }

  if (options?.max) {
    schema.min(
      options.max,
      `${name} must contain at most ${options.max} characters.`,
    );
  }

  return schema;
};

export const YupFirstName = (max: number): Yup.StringSchema<string> =>
  Yup.string()
    .required('First name is required')
    .max(max, `Last name must be less than ${max} characters.`);

export const YupLastName = (max: number): Yup.StringSchema<string> =>
  Yup.string()
    .required('Last name is required')
    .max(max, `Last name must be less than ${max} characters.`);

interface YupSmtpProps {
  senderEmail: {
    MAX_LENGTH: number;
  };
  username: {
    MIN_LENGTH: number;
    MAX_LENGTH: number;
  };
  senderName: {
    MIN_LENGTH: number;
    MAX_LENGTH: number;
  };
  smtpHost: {
    MIN_LENGTH: number;
    MAX_LENGTH: number;
  };
  password: {
    MIN_LENGTH: number;
    MAX_LENGTH: number;
  };
  smtpPort: {
    MIN_LENGTH: number;
    MAX_LENGTH: number;
  };
}

export const YupSmtp = (
  config: Partial<YupSmtpProps>,
): {
  host: Yup.StringSchema<string>;
  port: Yup.StringSchema<string>;
  username: Yup.StringSchema<string>;
  senderName: Yup.StringSchema<string>;
  senderEmail: Yup.StringSchema<string>;
} => ({
  host: Yup.string()
    .required('SMTP host is required.')
    .url('You must provide correct url'),
  port: Yup.string()
    .required('SMTP port is required.')
    .max(
      config.smtpPort.MAX_LENGTH,
      `SMTP port length must be less than ${config.smtpPort.MAX_LENGTH} characters.`,
    ),
  username: Yup.string()
    .required('Username must be provided.')
    .max(
      config.username.MAX_LENGTH,
      `Username length must be less than ${config.username.MAX_LENGTH} characters.`,
    ),
  senderName: Yup.string()
    .required('Sender name must be provided.')
    .max(
      config.senderName.MAX_LENGTH,
      `Sender name length must be less than ${config.senderName.MAX_LENGTH} characters.`,
    ),
  senderEmail: Yup.string()
    .required('Email is required.')
    .email('Invalid Email.')
    .max(
      config.senderName.MAX_LENGTH,
      `Sender email length must be less than ${config.senderEmail.MAX_LENGTH} characters.`,
    ),
});
