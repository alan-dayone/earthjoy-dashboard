import React, { Component } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import classnames from 'classnames';
import { systemService } from '../../../services';
import { actions as authActions } from '../../../redux/authRedux';

const formSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup
    .string()
    .email('Email must be valid')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup.string().required('Confirm password is required'),
});

export class CreateFirstAdminForm extends Component {
  render() {
    return (
      <div>
        <h1>Create first admin</h1>
        <p className="text-muted">
          You can use this account to create other accounts.
        </p>
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validate={values => {
            const errors = {};
            if (values.password !== values.confirmPassword) {
              errors.confirmPassword =
                'Password and confirm password must match';
            }
            return errors;
          }}
          validationSchema={formSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            try {
              const { password, dispatch, router } = this.props;
              await systemService.createFirstAdmin(password, values);
              await dispatch(
                authActions.loginWithEmail({
                  email: values.email,
                  password: values.password,
                })
              );
              router.replaceRoute('/admin');
            } catch (e) {
              alert(e.message);
            }
            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            handleChange,
            handleSubmit,
            isSubmitting,
            isValid,
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="mb-4 input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="cil-user" />
                  </span>
                </div>
                <input
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  placeholder="Name"
                  type="input"
                  className={classnames('form-control', {
                    'is-invalid': errors.name,
                  })}
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>
              <div className="mb-4 input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="cil-envelope-closed" />
                  </span>
                </div>
                <input
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="Email"
                  type="email"
                  className={classnames('form-control', {
                    'is-invalid': errors.email,
                  })}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>
              <div className="mb-4 input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="cil-lock-locked" />
                  </span>
                </div>
                <input
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  placeholder="Password"
                  type="password"
                  className={classnames('form-control', {
                    'is-invalid': errors.password,
                  })}
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>
              <div className="mb-4 input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="cil-lock-locked" />
                  </span>
                </div>
                <input
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  type="password"
                  className={classnames('form-control', {
                    'is-invalid': errors.confirmPassword,
                  })}
                />
                {errors.confirmPassword && (
                  <div className="invalid-feedback">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="px-4 btn btn-primary"
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    );
  }
}
