import React, {FC} from 'react';
import {ButtonProps} from 'reactstrap';
import {useFormikContext} from 'formik';
import {FormButton} from './FormButton';

export const FormikButton: FC<ButtonProps> = ({
  disabled,
  ...otherProps
}: ButtonProps) => {
  const {isValid, isSubmitting, dirty} = useFormikContext();
  console.log({dirty});

  return (
    <FormButton
      disabled={isSubmitting || !isValid || disabled || !dirty}
      loading={isSubmitting}
      type="submit"
      {...otherProps}
    />
  );
};
