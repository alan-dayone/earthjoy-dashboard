/* tslint:disable:no-default-export */
import React, { Component } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import { guestOnly } from '../../hocs';
import { authService } from '../../services';

class AdminLoginPage extends Component {
  state = {
    form: {
      email: '',
      password: '',
    },
    formError: {
      email: '',
      password: '',
    },
  };

  onFormChange = (change: { value: string, error: string }, name: string) => {
    this.setState({
      form: { ...this.state.form, [name]: change.value },
      formError: { ...this.state.formError, [name]: change.error },
    });
  };

  login = async () => {
    try {
      const user = await authService.loginWithEmail(this.state.form);
      console.log(user);
      Router.replace('/user');
    } catch (e) {
      console.log(e);
    }
  };

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
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="cil-user" />
                        </span>
                      </div>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Email"
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
                        placeholder="Password"
                      />
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <button className="btn btn-primary px-4" type="button">
                          Login
                        </button>
                      </div>
                      <div className="col-6 text-right">
                        <button className="btn btn-link px-0" type="button">
                          Forgot password?
                        </button>
                      </div>
                    </div>
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
