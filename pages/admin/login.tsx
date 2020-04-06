/* tslint:disable:no-default-export */
import React, {Component} from 'react';
import Router from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import toastr from 'toastr';
import {connect} from 'react-redux';
import {Formik, FormikActions} from 'formik';
import {AxiosError} from 'axios';
import {guestOnly} from '../../hocs';
import {loginWithEmail} from '../../redux/slices/loginUserSlice';
import {AppDispatch} from '../../redux/store';

export interface LoginForm {
  email: string;
  password: string;
}

interface PageProps {
  dispatch: AppDispatch;
}

class AdminLoginPage extends Component<PageProps> {
  public render(): JSX.Element {
    return (
      <div
        id="admin-login-page"
        className="align-items-center c-app flex-row pace-done">
        <Head>
          <title>Admin - Login</title>
        </Head>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-4">
              <div className="card-group">
                <div className="card p-4">
                  <div className="card-body">
                    <Formik
                      initialValues={{
                        email: '',
                        password: '',
                      }}
                      onSubmit={this._handleLogin}>
                      {(props): JSX.Element => (
                        <form onSubmit={props.handleSubmit}>
                          <h1>Login</h1>
                          <p className="text-muted">Sign In to your account</p>
                          <div className="input-group mb-3">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <i className="cil-user" />
                              </span>
                            </div>
                            <input
                              name="email"
                              className="form-control"
                              type="text"
                              placeholder="Email"
                              onChange={props.handleChange}
                              value={props.values.email}
                            />
                          </div>
                          <div className="input-group mb-4">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <i className="cil-lock-locked" />
                              </span>
                            </div>
                            <input
                              className="form-control"
                              type="password"
                              name="password"
                              placeholder="Password"
                              onChange={props.handleChange}
                              value={props.values.password}
                            />
                          </div>
                          <div className="row">
                            <div className="col-6">
                              <button
                                className="btn btn-primary px-4"
                                type="submit"
                                disabled={props.isSubmitting}>
                                {props.isSubmitting && (
                                  <div className="spinner-border spinner-border-sm mr-1" />
                                )}
                                Login
                              </button>
                            </div>
                            <div className="col-6 text-right">
                              <Link href="/admin/reset-password">
                                <button
                                  className="btn btn-link px-0"
                                  type="button">
                                  Forgot password?
                                </button>
                              </Link>
                            </div>
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

  private _handleLogin = async (
    values: LoginForm,
    actions: FormikActions<LoginForm>,
  ): Promise<void> => {
    actions.setSubmitting(true);
    try {
      const user = await this.props.dispatch(loginWithEmail(values));

      if (user) {
        await Router.replace('/admin');
      }
    } catch (e) {
      actions.setSubmitting(false);
      toastr.error(this._getErrorMessage(e));
    }
  };

  private _getErrorMessage = (error: AxiosError): string => {
    if (
      error.response?.data?.error?.code === 'VALIDATION_FAILED' ||
      error.response?.data?.error?.message === 'invalid_credentials_email'
    ) {
      return 'Incorrect email or password';
    }

    return error.message;
  };
}

export default guestOnly(connect()(AdminLoginPage), {useAdminLayout: true});
