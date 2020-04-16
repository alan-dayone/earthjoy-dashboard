import React, {FC} from 'react';
import {FieldProps, FieldInputProps, FormikProps} from 'formik';
import classNames from 'classnames';
interface Props<V, FormValues> extends FieldProps<V, FormValues> {
  className?: string;
  iconName?: string;
  labelText?: string;
  type?: string;
  children?: (
    props: Partial<FieldInputProps<V> & FormikProps<FormValues>>,
  ) => React.ReactNode;
}

export const createInputGroup = <V, FormValues>(): FC<Props<V, FormValues>> => {
  const component: FC<Props<V, FormValues>> = ({
    field: {name, value},
    form: {handleChange, errors},
    className,
    iconName,
    labelText,
    type,
  }: Props<V, FormValues>) => {
    return (
      <div className={classNames('form-group', className)}>
        <label>{labelText}</label>
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">
              <i className={iconName} />
            </span>
          </div>
          <input
            type={type}
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

export const createFieldGroup = <V, FormValues>(): FC<Props<V, FormValues>> => {
  const component: FC<Props<V, FormValues>> = ({
    field,
    form,
    className,
    iconName,
    children,
    labelText,
  }: Props<V, FormValues>) => {
    const {name} = field;
    const {errors} = form;
    return (
      <div className={classNames('form-group', className)}>
        <label>{labelText}</label>
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">
              <i className={iconName} />
            </span>
          </div>
          {children({...field, ...form})}
          {errors[name] && (
            <div className="invalid-feedback">{errors[name]}</div>
          )}
        </div>
      </div>
    );
  };
  return component;
};
