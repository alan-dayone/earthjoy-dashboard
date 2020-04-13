import React, {Component} from 'react';
import {Formik} from 'formik';
import classnames from 'classnames';
import toastr from 'toastr';
import {connect} from 'react-redux';
import Router from 'next/router';
import {systemService} from '../../../services';
import {AppDispatch} from '../../../redux/store';
import {loginWithEmail} from '../../../redux/slices/loginUserSlice';
import {createFirstAdminFormSchema} from '../../../view-models/Account';

interface PageProps {
  dispatch: AppDispatch;
  correctSystemInitPassword: string;
}

class CreateFirstAdminForm extends Component<PageProps> {
  public render(): JSX.Element {
    return (
      <div>
        <h1>Create first admin</h1>
        <p className="text-muted">
          You can use this account to create other accounts and manage the
          system.
        </p>
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={createFirstAdminFormSchema}
          onSubmit={async (values, {setSubmitting}): Promise<void> => {
            setSubmitting(true);
            try {
              const {correctSystemInitPassword, dispatch} = this.props;
              await systemService.initSystem({
                password: correctSystemInitPassword,
                admin: {
                  email: values.email,
                  password: values.password,
                },
              });
              await dispatch(
                loginWithEmail({
                  email: values.email,
                  password: values.password,
                }),
              );
              setSubmitting(false);
              Router.replace('/admin');
            } catch (e) {
              setSubmitting(false);
              toastr.error(e.message);
            }
          }}>
          {({
            values,
            errors,
            handleChange,
            handleSubmit,
            isSubmitting,
            isValid,
          }): JSX.Element => (
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
                  className="px-4 btn btn-primary">
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

export default connect()(CreateFirstAdminForm);
