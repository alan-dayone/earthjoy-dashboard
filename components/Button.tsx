import React from 'react';

interface ButtonPropTypes {
  className?: string;
  children?: string;
  isRightIcon?: boolean;
  type?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'grey'
    | 'warning'
    | 'danger'
    | 'lightgrey'
    | 'transparent';
  size?: 'large' | 'normal' | 'medium' | 'small' | 'tiny';
  isDisabled?: boolean;
  onClick: () => void;
  icon?: string | null;
  notTranslated?: boolean;
}

const button = ({
  children = '',
  type = 'primary',
  size = 'medium',
  icon = null,
  isRightIcon = false,
  isDisabled = false,
  className,
  onClick = () => {},
}: ButtonPropTypes) => (
  <button
    onClick={onClick}
    disabled={isDisabled}
    className={`${className} ellipsis btn btn__${size} ${
      isDisabled ? `btn__disabled` : `btn__${type}`
    }`}
  >
    {icon && !isRightIcon && (
      <i className={`${icon} ${children ? 'm__r--3' : ''}`} />
    )}
    {children}
    {icon && isRightIcon && (
      <i className={`${icon} ${children ? 'm__l--3' : ''}`} />
    )}
  </button>
);

export { button as Button };
