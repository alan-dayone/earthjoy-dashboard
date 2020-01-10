/* tslint:disable:no-default-export */
import React, { Component } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import toastr from 'toastr';
import { Formik, FormikActions } from 'formik';
import { guestOnly } from '../../hocs';
import { authService } from '../../services';

interface ResetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

class AdminResetPasswordPage extends Component {
  render() {
    return (
      <div
        id="admin-login-page"
        className="align-items-center c-app flex-row pace-done"
      >
        <Head>
          <title>Admin - Login</title>
        </Head>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-5">
              <div className="card-group">
                <div className="card p-5">
                  <div className="card-body">
                    <Formik
                      initialValues={{
                        newPassword: '',
                        confirmPassword: '',
                      }}
                      onSubmit={this._handleResetPassword}
                    >
                      {props => (
                        <form onSubmit={props.handleSubmit}>
                          <h1>Reset Password</h1>
                          <p className="text-muted">Sign In to your account</p>
                          <div className="form-group">
                            <div className="input-group mb-3">
                              <div className="input-group-prepend">
                                <span className="input-group-text">
                                  <i className="cil-lock-locked" />
                                </span>
                              </div>
                              <input
                                name="newPassword"
                                className="form-control"
                                type="text"
                                placeholder="New Password"
                                onChange={props.handleChange}
                                value={props.values.newPassword}
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="input-group mb-3">
                              <div className="input-group-prepend">
                                <span className="input-group-text">
                                  <i className="cil-lock-locked" />
                                </span>
                              </div>
                              <input
                                name="confirmPassword"
                                className="form-control"
                                type="text"
                                placeholder="Confirm Password"
                                onChange={props.handleChange}
                                value={props.values.confirmPassword}
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <button
                              className="btn btn-block btn-primary"
                              type="submit"
                              disabled={props.isSubmitting}
                            >
                              {props.isSubmitting && (
                                <div className="spinner-border spinner-border-sm mr-1" />
                              )}
                              Submit
                            </button>
                          </div>
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

  _handleResetPassword = async (
    values: ResetPasswordForm,
    actions: FormikActions<LoginForm>
  ) => {
    actions.setSubmitting(true);
    try {
      await authService.loginWithEmail(values);
      Router.replace('/admin');
    } catch (e) {
      toastr.error(e.message);
    } finally {
      actions.setSubmitting(false);
    }
  };
}

export default guestOnly(AdminResetPasswordPage, { useAdminLayout: true });
