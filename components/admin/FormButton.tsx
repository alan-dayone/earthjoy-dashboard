import React, {FC} from 'react';
import classnames from 'classnames';
import {ButtonProps, Button, Spinner} from 'reactstrap';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props extends ButtonProps {
  loading?: boolean;
}

export const FormButton: FC<Props> = ({loading, ...otherProps}: Props) => {
  const {children} = otherProps;

  return (
    <Button {...otherProps} disabled={loading || otherProps.disabled}>
      {loading && (
        <span>
          <Spinner
            size="sm"
            color="light"
            className={classnames('mr-1', {
              'mb-1': otherProps.size === 'lg',
            })}
          />
        </span>
      )}
      {children}
    </Button>
  );
};
