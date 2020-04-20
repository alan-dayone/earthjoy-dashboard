import * as Yup from 'yup';

export const inputSchema = (
  name: string,
  options?: {required?: boolean; min?: number; max?: number},
): Yup.StringSchema => {
  let schema = Yup.string();

  if (options?.required || options?.min) {
    schema = schema.required(`${name} is required.`);
  }

  if (options?.min) {
    schema = schema.min(
      options.min,
      `${name} must contain at least ${options.min} characters.`,
    );
  }

  if (options?.max) {
    schema = schema.max(
      options.max,
      `${name} must contain at most ${options.max} characters.`,
    );
  }

  return schema;
};

export const emailSchema = inputSchema('Email', {required: true}).email(
  'Must be valid email.',
);
