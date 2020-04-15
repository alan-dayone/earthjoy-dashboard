import React, {Component} from 'react';
import Router from 'next/router';
import Head from 'next/head';
import toastr from 'toastr';
import classnames from 'classnames';
import {Formik, FormikHelpers as FormikActions} from 'formik';
import {guestOnly} from '../../hocs';
import {authService} from '../../services';
import {adminResetNewPasswordFormSchema} from '../../view-models/Account';

interface ResetNewPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

class AdminResetNewPasswordPage extends Component {
  public render(): JSX.Element {
    return (
      <div
        id="admin-login-page"
        className="align-items-center c-app flex-row pace-done">
        <Head>
          <title>Admin - Reset password</title>
        </Head>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-4">
              <div className="card-group">
                <div className="p-4 card">
                  <div className="card-body">
                    <Formik
                      initialValues={{
                        newPassword: '',
                        confirmPassword: '',
                      }}
                      onSubmit={this._handleResetPassword}
                      validationSchema={adminResetNewPasswordFormSchema}>
                      {({
                        values,
                        handleChange,
                        isSubmitting,
                        handleSubmit,
                        errors,
                      }): JSX.Element => (
                        <form onSubmit={handleSubmit}>
                          <h1>Reset Password</h1>
                          <p className="text-muted">
                            Please enter new password.
                          </p>
                          <div className="form-group">
                            <div className="input-group mb-3">
                              <div className="input-group-prepend">
                                <span className="input-group-text">
                                  <i className="cil-lock-locked" />
                                </span>
                              </div>
                              <input
                                name="newPassword"
                                type="password"
                                placeholder="New Password"
                                onChange={handleChange}
                                value={values.newPassword}
                                className={classnames('form-control', {
                                  'is-invalid': !!errors.newPassword,
                                })}
                              />
                              {errors.newPassword && (
                                <div className="invalid-feedback">
                                  {errors.newPassword}
                                </div>
                              )}
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
                                type="password"
                                placeholder="Confirm Password"
                                onChange={handleChange}
                                value={values.confirmPassword}
                                className={classnames('form-control', {
                                  'is-invalid': !!errors.confirmPassword,
                                })}
                              />
                              {errors.confirmPassword && (
                                <div className="invalid-feedback">
                                  {errors.confirmPassword}
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            className="btn btn-block btn-primary"
                            type="submit"
                            disabled={isSubmitting}>
                            {isSubmitting && (
                              <div className="spinner-border spinner-border-sm mr-1" />
                            )}
                            Submit
                          </button>
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

  private _handleResetPassword = async (
    values: ResetNewPasswordForm,
    actions: FormikActions<ResetNewPasswordForm>,
  ): Promise<void> => {
    actions.setSubmitting(true);
    try {
      await authService.setNewPassword({
        accountId: Router.query.accountId as string,
        newPassword: values.newPassword,
        resetPasswordToken: Router.query.token as string,
      });
      toastr.success('Success');
      actions.setSubmitting(false);
      await Router.replace('/admin/login');
    } catch (e) {
      toastr.error(this._getErrorMessage(e));
      actions.setSubmitting(false);
    }
  };

  private _getErrorMessage(e): string {
    if (e.response?.data?.error?.message === 'invalid_token') {
      return 'Token is invalid or expired';
    }

    return e.message;
  }
}

export default guestOnly(AdminResetNewPasswordPage, {
  useAdminLayout: true,
});
