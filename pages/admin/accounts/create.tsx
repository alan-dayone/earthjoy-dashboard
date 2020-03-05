/* tslint:disable:no-default-export */
import React from 'react';
import Head from 'next/head';
import {NextComponentType, NextPageContext} from 'next';
import toastr from 'toastr';
import classNames from 'classnames';
import {adminOnly} from '../../../hocs';
import {Formik, FormikActions, ErrorMessage, Field} from 'formik';
import {AccountStatus, Account} from '../../../models/User';
import {AccountEmailVerificationText, AccountStatusText} from '../../../view-models/User';
import {accountService} from '../../../services';
import {createUserSchema} from '../../../view-models/UserValidation';

const initialValues: Account = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  status: AccountStatus.ACTIVE,
  emailVerified: true,
};

function AdminAccountCreationPage() {
  async function _handleSave(values: Account, actions) {
    try {
      actions.setSubmitting(true);
      await accountService.createAccount(values);
      toastr.success(`Account ${values.email} created`);
    } catch (e) {
      toastr.error(e.message);
    } finally {
      actions.setSubmitting(false);
    }
  }

  function isFieldValid(formProps: {errors: object}, fieldName: string) {
    if (formProps.errors[fieldName]) return false;
    else return true;
  }

  const getErrorFieldStyle = (formProps: {errors: object}, fieldName: string) => {
    const fieldValid = isFieldValid(formProps, fieldName);
    if (!fieldValid) return 'border-danger rounded-sm';
    else return '';
  };

  const renderErrorMessage = (message) => <p className="text-danger">{message}</p>;

  return (
    <div id="admin-create-account-page" className="shadow">
      <Head>
        <title>Admin - Create account</title>
      </Head>
      <Formik initialValues={initialValues} onSubmit={_handleSave} validationSchema={createUserSchema}>
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
                      <div className={classNames('input-group', getErrorFieldStyle(props, 'email'))}>
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
                      <ErrorMessage name="email" render={renderErrorMessage} />
                    </div>
                    <div className="form-group">
                      <label>Password</label>
                      <div className={classNames('input-group', getErrorFieldStyle(props, 'password'))}>
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
                      <ErrorMessage name="password" render={renderErrorMessage} />
                    </div>
                    <div className="form-group">
                      <label>First name</label>
                      <div className={classNames('input-group', getErrorFieldStyle(props, 'firstName'))}>
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
                      <ErrorMessage name="firstName" render={renderErrorMessage} />
                    </div>
                    <div className="form-group">
                      <label>Last name</label>
                      <div className={classNames('input-group', getErrorFieldStyle(props, 'lastName'))}>
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
                      <ErrorMessage name="lastName" render={renderErrorMessage} />
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
                <button className="btn btn-sm btn-success" type="submit" disabled={props.isSubmitting}>
                  {props.isSubmitting && <div className="spinner-border spinner-border-sm mr-1" role="status" />}
                  {props.isSubmitting ? 'Creating...' : 'Create'}
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
