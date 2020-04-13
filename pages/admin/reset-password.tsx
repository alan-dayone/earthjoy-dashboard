/* tslint:disable:no-default-export */
import React from 'react';
import Head from 'next/head';
import toastr from 'toastr';
import classnames from 'classnames';
import {Formik, FormikActions, FormikProps} from 'formik';
import {guestOnly} from '../../hocs';
import {authService} from '../../services';
import {adminResetPasswordFormSchema} from '../../view-models/Account';

interface ForgotPasswordForm {
  email: string;
}

interface State {
  isSubmitted: boolean;
}

class AdminResetPasswordPage extends React.Component<{}, State> {
  public state: State = {
    isSubmitted: false,
  };

  public render(): JSX.Element {
    return (
      <div
        id="admin-reset-password-page"
        className="align-items-center c-app flex-row pace-done">
        <Head>
          <title>Admin - Forgot password</title>
        </Head>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-5">
              <div className="card-group">
                <div className="card p-4">
                  <div className="card-body">
                    <Formik
                      initialValues={{email: ''}}
                      onSubmit={this._handleForgotPassword}
                      validationSchema={adminResetPasswordFormSchema}>
                      {(props: FormikProps<{email: string}>): JSX.Element => (
                        <form onSubmit={props.handleSubmit}>
                          <h1>Forgot password</h1>
                          {!this.state.isSubmitted ? (
                            <div>
                              <p className="text-muted">
                                Please enter your email address. We will send
                                you an email to reset your password.
                              </p>
                              <div className="form-group">
                                <div className="input-group mb-3">
                                  <div className="input-group-prepend">
                                    <span className="input-group-text">
                                      <i className="cil-envelope-closed" />
                                    </span>
                                  </div>
                                  <input
                                    name="email"
                                    type="text"
                                    placeholder="Email"
                                    onChange={props.handleChange}
                                    value={props.values.email}
                                    className={classnames('form-control', {
                                      'is-invalid': props.errors.email,
                                    })}
                                  />
                                  {props.errors.email && (
                                    <div className="invalid-feedback">
                                      {props.errors.email}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <button
                                className="btn btn-block btn-primary"
                                type="submit"
                                disabled={props.isSubmitting}>
                                {props.isSubmitting && (
                                  <div className="spinner-border spinner-border-sm mr-1" />
                                )}
                                Submit
                              </button>
                            </div>
                          ) : (
                            <div className="mt-3">
                              <div className="alert alert-success">
                                We&#39ve just sent you an email to reset your
                                password.
                              </div>
                            </div>
                          )}
                        </form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  public _handleForgotPassword = async (
    values: ForgotPasswordForm,
    actions: FormikActions<ForgotPasswordForm>,
  ): Promise<void> => {
    actions.setSubmitting(true);
    try {
      await authService.sendResetPasswordEmail(values.email);
      this.setState({isSubmitted: true});
      toastr.success('Success');
      actions.setSubmitting(false);
    } catch (e) {
      toastr.error(e.message);
      actions.setSubmitting(false);
    }
  };
}

export default guestOnly(AdminResetPasswordPage, {useAdminLayout: true});
