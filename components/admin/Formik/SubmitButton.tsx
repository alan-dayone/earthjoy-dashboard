import React, {FC} from 'react';
import {ButtonProps} from 'reactstrap';
import {useFormikContext} from 'formik';
import {FormButton} from '../FormButton';

export const SubmitButton: FC<ButtonProps> = ({
  disabled,
  ...otherProps
}: ButtonProps) => {
  const {isValid, isSubmitting} = useFormikContext();
  return (
    <FormButton
      disabled={isSubmitting || !isValid || disabled}
      loading={isSubmitting}
      type="submit"
      {...otherProps}
    />
  );
};
