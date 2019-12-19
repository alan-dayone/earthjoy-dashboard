/* tslint:disable:no-default-export */
import React, { Component } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import { Formik } from 'formik';
import { guestOnly } from '../../hocs';
import { authService } from '../../services';

class AdminLoginPage extends Component {
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
            <div className="col-md-4">
              <div className="card-group">
                <div className="card p-4">
                  <div className="card-body">
                    <Formik
                      initialValues={{
                        email: '',
                        password: '',
                      }}
                      onSubmit={async (values, actions) => {
                        actions.setSubmitting(true);
                        try {
                          await authService.loginWithEmail(values);
                          Router.replace('/admin');
                        } catch (e) {
                          alert(e.message);
                        } finally {
                          actions.setSubmitting(false);
                        }
                      }}
                    >
                      {props => (
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
                              value={props.values.name}
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
                              >
                                {props.isSubmitting ? (
                                  <div className="spinner-border spinner-border-sm" />
                                ) : (
                                  'Login'
                                )}
                              </button>
                            </div>
                            <div className="col-6 text-right">
                              <button
                                className="btn btn-link px-0"
                                type="button"
                              >
                                Forgot password?
                              </button>
                            </div>
                          </div>
                          {/*<input*/}
                          {/*  type="text"*/}
                          {/*  onChange={props.handleChange}*/}
                          {/*  onBlur={props.handleBlur}*/}
                          {/*  value={props.values.name}*/}
                          {/*  name="name"*/}
                          {/*/>*/}
                          {/*{props.errors.name && <div id="feedback">{props.errors.name}</div>}*/}
                          {/*<button type="submit">Submit</button>*/}
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
}

export default guestOnly(AdminLoginPage, { useAdminLayout: true });
