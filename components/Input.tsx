import React from 'react';
import validator from 'validator';
import zxcvbn from 'zxcvbn';

interface NewTextInputPropTypes {
  value?: string;
  onChange?: (change: { value: string; error: string }) => void;
  containerClassName?: string;
  inputClassName?: string;
  label?: string;
  type:
    | 'text'
    | 'password'
    | 'number'
    | 'alpha'
    | 'alphanumberic'
    | 'postal'
    | 'email'
    | 'card';
  isDisabled?: boolean;
  error?: string;
  placeholder?: string;
  isArea?: boolean;
  isRequired?: boolean;
  autoComplete?: boolean;
  max?: number;
  min?: number;
  onKeyDown?: (
    e: KeyboardEvent<HTMLInputElement> | KeyboardEvent<HTMLTextAreaElement>
  ) => void;
}

const getInput = (props: NewTextInputPropTypes) => {
  switch (props.type) {
    case 'password':
      return <PasswordInput {...props} />;
    case 'alpha':
      return <AlphaInput {...props} />;
    case 'alphanumberic':
      return <AlphaNumbericInput {...props} />;
    case 'number':
      return <NumberInput {...props} />;
    case 'postal':
      return <ZipInput {...props} />;
    case 'email':
      return <EmailInput {...props} />;
    default:
      return <AlphaNumbericInput {...props} />;
  }
};

const textInput = (props: NewTextInputPropTypes) => {
  const {
    value = '',
    error = '',
    label = '',
    onChange,
    containerClassName = '',
    inputClassName = 'input__large',
    isDisabled = false,
    placeholder = '',
    isArea = false,
    onKeyDown = () => {},
    autoComplete = false,
    isRequired = false,
  } = props;
  return (
    <div className={`form-group ${containerClassName}`}>
      {label && (
        <label className="m__b--1">
          {label} {isRequired ? '*' : ''}
        </label>
      )}
      {isArea ? (
        <textarea
          autoComplete={autoComplete.toString()}
          placeholder={placeholder}
          disabled={isDisabled}
          value={value}
          onKeyDown={onKeyDown}
          className={`form-control ${
            error ? 'border-danger' : ''
          } input text__medium text__black ${inputClassName}`}
          onChange={e =>
            onChange && onChange({ value: e.target.value, error: '' })
          }
        />
      ) : (
        getInput(props)
      )}
      {error && (
        <label className="text__danger d__absolute text__tiny m__l--1">
          {error}
        </label>
      )}
    </div>
  );
};

// tslint:disable-next-line: variable-name
const PasswordInput = (props: NewTextInputPropTypes) => {
  return (
    <input
      disabled={props.isDisabled}
      value={props.value}
      type="password"
      onChange={e =>
        props.onChange &&
        props.onChange({
          value: e.target.value,
          error:
            !e.target.value && props.isRequired
              ? 'This field is required!'
              : zxcvbn(e.target.value).score > 2
              ? ''
              : 'This password is too weak',
        })
      }
      autoComplete={(props.autoComplete || false).toString()}
      onKeyDown={props.onKeyDown}
      placeholder={props.placeholder}
      className={`form-control input text__medium text__black ${props.inputClassName ||
        'input__large'} ${props.error ? 'border__danger--1' : ''}`}
    />
  );
};

// tslint:disable-next-line: variable-name
const AlphaInput = (props: NewTextInputPropTypes) => {
  return (
    <input
      disabled={props.isDisabled}
      value={props.value}
      type="text"
      onChange={e =>
        props.onChange &&
        props.onChange({
          value: e.target.value,
          error:
            !e.target.value && props.isRequired
              ? 'This field is required!'
              : validator.isAlpha(e.target.value.replace(/ /g, ''))
              ? ''
              : 'Invalid',
        })
      }
      autoComplete={(props.autoComplete || false).toString()}
      onKeyDown={props.onKeyDown}
      placeholder={props.placeholder}
      className={`form-control input text__medium text__black ${props.inputClassName ||
        'input__large'} ${props.error ? 'border__danger--1' : ''}`}
    />
  );
};

// tslint:disable-next-line: variable-name
const AlphaNumbericInput = (props: NewTextInputPropTypes) => {
  return (
    <input
      disabled={props.isDisabled}
      value={props.value}
      type="text"
      onChange={e =>
        props.onChange &&
        props.onChange({
          value: e.target.value,
          error:
            !e.target.value && props.isRequired
              ? 'This field is required!'
              : '',
        })
      }
      onKeyDown={props.onKeyDown}
      autoComplete={(props.autoComplete || false).toString()}
      placeholder={props.placeholder}
      className={`form-control input text__medium text__black ${props.inputClassName ||
        'input__large'} ${props.error ? 'border__danger--1' : ''}`}
    />
  );
};

// tslint:disable-next-line: variable-name
const NumberInput = (props: NewTextInputPropTypes) => {
  return (
    <input
      disabled={props.isDisabled}
      value={props.value}
      type="number"
      max={props.max}
      onChange={e =>
        props.onChange &&
        props.onChange({
          value: e.target.value,
          error:
            !e.target.value && props.isRequired
              ? 'This field is required!'
              : validator.isInt(e.target.value, {
                  min: props.min,
                  max: props.max,
                })
              ? ''
              : 'Invalid number',
        })
      }
      onKeyDown={props.onKeyDown}
      autoComplete={(props.autoComplete || false).toString()}
      placeholder={props.placeholder}
      className={`form-control input text__medium text__black ${props.inputClassName ||
        'input__large'} ${props.error ? 'border__danger--1' : ''}`}
    />
  );
};

// tslint:disable-next-line: variable-name
const ZipInput = (props: NewTextInputPropTypes) => {
  return (
    <input
      disabled={props.isDisabled}
      value={props.value}
      type="text"
      max={props.max}
      onChange={e =>
        props.onChange &&
        props.onChange({
          value: e.target.value,
          error:
            !e.target.value && props.isRequired
              ? 'This field is required!'
              : validator.isPostalCode(e.target.value, 'any')
              ? ''
              : 'Invalid postal code',
        })
      }
      onKeyDown={props.onKeyDown}
      autoComplete={(props.autoComplete || false).toString()}
      placeholder={props.placeholder}
      className={`form-control input text__medium text__black ${props.inputClassName ||
        'input__large'} ${props.error ? 'border__danger--1' : ''}`}
    />
  );
};

// tslint:disable-next-line: variable-name
const EmailInput = (props: NewTextInputPropTypes) => {
  return (
    <input
      disabled={props.isDisabled}
      value={props.value}
      type="text"
      max={props.max}
      onChange={e =>
        props.onChange &&
        props.onChange({
          value: e.target.value,
          error:
            !e.target.value && props.isRequired
              ? 'This field is required!'
              : validator.isEmail(e.target.value)
              ? ''
              : 'Invalid email address',
        })
      }
      onKeyDown={props.onKeyDown}
      autoComplete={(props.autoComplete || false).toString()}
      placeholder={props.placeholder}
      className={`form-control input text__medium text__black ${props.inputClassName ||
        'input__large'} ${props.error ? 'border__danger--1' : ''}`}
    />
  );
};

export { textInput as TextInput };
