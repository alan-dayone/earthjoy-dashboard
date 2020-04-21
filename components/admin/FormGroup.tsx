import React, {FC, ReactNode} from 'react';
import classnames from 'classnames';
import {Field, FieldProps, FieldAttributes} from 'formik';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props extends FieldAttributes<any> {
  label?: string;
  icon?: string;
  required?: boolean;
  tag?: string;
}

export const FormGroup: FC<Props> = ({
  label,
  icon,
  required,
  tag,
  ...otherProps
}) => {
  const {children} = otherProps;
  return (
    <div className="form-group">
      <label>{`${label}${required ? ' *' : ''}`}</label>
      <Field {...otherProps} required={required}>
        {(props: FieldProps): ReactNode => {
          const className = classnames(
            'form-control',
            {'is-invalid': !!props.meta.error},
            otherProps.className,
          );
          const error = props.meta.error ? (
            <div className="invalid-feedback">{props.meta.error}</div>
          ) : null;

          switch (tag) {
            case 'select':
              return (
                <>
                  <select
                    className={className}
                    {...props.field}
                    {...otherProps}>
                    {children}
                  </select>
                  {error}
                </>
              );
            case 'textarea':
              return (
                <>
                  <textarea
                    className={className}
                    {...props.field}
                    {...otherProps}>
                    {children}
                  </textarea>
                  {error}
                </>
              );
            default:
              return (
                <>
                  {icon ? (
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className={icon} />
                        </span>
                      </div>
                      <input
                        className={className}
                        {...props.field}
                        {...otherProps}
                      />
                      {error}
                    </div>
                  ) : (
                    <>
                      <input
                        className={className}
                        {...props.field}
                        {...otherProps}
                      />
                      {error}
                    </>
                  )}
                </>
              );
          }
        }}
      </Field>
    </div>
  );
};
