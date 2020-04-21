import * as Yup from 'yup';

export const emailSchema = Yup.string()
  .required()
  .email();
