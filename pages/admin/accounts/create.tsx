/* tslint:disable:no-default-export */
import React from 'react';
import Head from 'next/head';
import {NextComponentType, NextPageContext} from 'next';
import toastr from 'toastr';
import {adminOnly} from '../../../hocs';
import {Formik, FormikActions} from 'formik';
import {AccountStatus, Account} from '../../../models/User';
import {AccountEmailVerificationText, AccountStatusText} from '../../../view-models/User';
import {accountService} from '../../../services';

const initialValues: Account = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  status: AccountStatus.ACTIVE,
  emailVerified: true,
};

function AdminAccountCreationPage() {
  async function _handleSave(values, actions) {
    try {
      actions.setSubmitting(true);
      await accountService.createAccount(values);
    } catch (e) {
      toastr.error(e.message);
    } finally {
      actions.setSubmitting(false);
    }
  }

  return (
    <div id="admin-create-account-page">
      <Head>
        <title>Admin - Create account</title>
      </Head>
      <Formik initialValues={initialValues} onSubmit={_handleSave}>
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <div className="card">
              <div className="card-header">
                <strong>Create account</strong>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label>Email</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="cil-envelope-closed" />
                          </span>
                        </div>
                        <input
                          className="form-control"
                          name="email"
                          onChange={props.handleChange}
                          value={props.values.email}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Password</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="cil-lock-locked" />
                          </span>
                        </div>
                        <input
                          className="form-control"
                          name="password"
                          type="password"
                          onChange={props.handleChange}
                          value={props.values.password}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>First name</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="cil-user" />
                          </span>
                        </div>
                        <input
                          name="firstName"
                          className="form-control"
                          onChange={props.handleChange}
                          value={props.values.firstName}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Last name</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="cil-user" />
                          </span>
                        </div>
                        <input
                          name="lastName"
                          className="form-control"
                          onChange={props.handleChange}
                          value={props.values.lastName}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Account status</label>
                      <select name="status" className="form-control">
                        <option value={AccountStatus.ACTIVE}>{AccountStatusText[AccountStatus.ACTIVE]}</option>
                        <option value={AccountStatus.INACTIVE}>{AccountStatusText[AccountStatus.INACTIVE]}</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Email verification</label>
                      <select name="emailVerified" className="form-control">
                        <option value="true">{AccountEmailVerificationText.VERIFIED}</option>
                        <option value="false">{AccountEmailVerificationText.NOT_VERIFIED}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <button className="btn btn-sm btn-primary" type="submit" disabled={props.isSubmitting}>
                  {props.isSubmitting && <div className="spinner-border spinner-border-sm mr-1" />}
                  Create
                </button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default adminOnly(AdminAccountCreationPage as NextComponentType<NextPageContext, any, any>);
