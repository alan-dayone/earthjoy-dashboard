import React, {FC} from 'react';
import {FieldProps} from 'formik';
import classNames from 'classnames';
interface Props<V, FormValues> extends FieldProps<V, FormValues> {
  className?: string;
  iconName?: string;
}

export const createInputGroup = <V, FormValues>(): FC<Props<V, FormValues>> => {
  const component: FC<Props<V, FormValues>> = ({
    field: {name, value},
    form: {handleChange, errors},
    className,
    iconName,
  }: Props<V, FormValues>) => {
    return (
      <div className={classNames('form-group', className)}>
        <label>Email</label>
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">
              <i className={iconName} />
            </span>
          </div>
          <input
            className={classNames('form-control', {
              'is-invalid': errors[name],
            })}
            name="email"
            onChange={handleChange}
            value={value[name]}
          />
          {errors[name] && (
            <div className="invalid-feedback">{errors[name]}</div>
          )}
        </div>
      </div>
    );
  };
  return component;
};
