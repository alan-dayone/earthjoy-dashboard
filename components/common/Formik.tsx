import React, {FC, ReactNode} from 'react';
import {FieldProps, FieldInputProps, FormikProps, Field} from 'formik';
import classNames from 'classnames';

interface CommonProps<V, FormValues> {
  name?: string;
  className?: string;
  iconName?: string;
  labelText?: string;
  placeholder?: string;
  type?: string;
  children?:
    | ((
        props: Partial<FieldInputProps<V> & FormikProps<FormValues>>,
      ) => ReactNode)
    | ReactNode;
  onChangeProcess?: (value: string | number) => V;
}

interface Props<V, FormValues>
  extends FieldProps<V, FormValues>,
    CommonProps<V, FormValues> {
  children: (
    props: Partial<FieldInputProps<V> & FormikProps<FormValues>>,
  ) => ReactNode;
}

export const createTextInputGroup = <V, FormValues>(): FC<Props<
  V,
  FormValues
>> => {
  const component: FC<Props<V, FormValues>> = ({
    field: {name, value},
    form: {handleChange, errors},
    className,
    iconName,
    labelText,
    placeholder,
    type,
  }: Props<V, FormValues>) => {
    return (
      <div className={classNames('form-group', className)}>
        {labelText && <label>{labelText}</label>}
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
            name={name}
            onChange={handleChange}
            value={value[name]}
            placeholder={placeholder}
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

export const createInputGroup = <V, FormValues>(): FC<Props<V, FormValues>> => {
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
        {labelText && <label>{labelText}</label>}
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

export const createTextField = <V, FormValues>(): FC<CommonProps<
  V,
  FormValues
>> => {
  const component: FC<CommonProps<V, FormValues>> = ({
    name,
    className,
    iconName,
    labelText,
    placeholder,
    type,
    onChangeProcess,
  }: CommonProps<V, FormValues>) => {
    return (
      <Field name={name}>
        {({
          field: {name},
          form: {errors, setFieldValue, values},
        }: FieldProps<V, FormValues>): JSX.Element => (
          <div className={classNames('form-group', className)}>
            {labelText && <label>{labelText}</label>}
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
                name={name}
                onChange={(e): void =>
                  setFieldValue(
                    name,
                    onChangeProcess
                      ? onChangeProcess(e.target.value)
                      : e.target.value,
                  )
                }
                value={values[name]}
                placeholder={placeholder}
              />
              {errors[name] && (
                <div className="invalid-feedback">{errors[name]}</div>
              )}
            </div>
          </div>
        )}
      </Field>
    );
  };
  return component;
};

export const createField = <V, FormValues>(): FC<CommonProps<
  V,
  FormValues
>> => {
  const component: FC<CommonProps<V, FormValues>> = ({
    name,
    className,
    iconName,
    labelText,
    children,
  }: Props<V, FormValues>) => {
    return (
      <Field name={name}>
        {({field, form}: FieldProps<V, FormValues>): JSX.Element => {
          const {name} = field;
          const {errors} = form;
          return (
            <div className={classNames('form-group', className)}>
              {labelText && <label>{labelText}</label>}
              <div className="input-group">
                {iconName && (
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className={iconName} />
                    </span>
                  </div>
                )}
                {children({...field, ...form})}
                {errors[name] && (
                  <div className="invalid-feedback">{errors[name]}</div>
                )}
              </div>
            </div>
          );
        }}
      </Field>
    );
  };
  return component;
};

export const createSelectField = <V, FormValues>(): FC<CommonProps<
  V,
  FormValues
>> => {
  const component: FC<CommonProps<V, FormValues>> = ({
    name,
    className,
    iconName,
    labelText,
    children,
    onChangeProcess,
  }: CommonProps<V, FormValues>) => {
    return (
      <Field name={name}>
        {({
          field: {name},
          form: {errors, setFieldValue, values},
        }: FieldProps<V, FormValues>): JSX.Element => (
          <div className={classNames('form-group', className)}>
            {labelText && <label>{labelText}</label>}
            <div className="input-group">
              {iconName && (
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className={iconName} />
                  </span>
                </div>
              )}
              <select
                className={classNames('form-control', {
                  'is-invalid': errors[name],
                })}
                name={name}
                onChange={(e): void =>
                  setFieldValue(
                    name,
                    onChangeProcess
                      ? onChangeProcess(e.target.value)
                      : e.target.value,
                  )
                }
                value={values[name]}>
                {children}
              </select>
              {errors[name] && (
                <div className="invalid-feedback">{errors[name]}</div>
              )}
            </div>
          </div>
        )}
      </Field>
    );
  };
  return component;
};
