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

  return (
    <div id="admin-create-account-page" className="shadow">
      <Head>
        <title>Admin - Create account</title>
      </Head>
      <Formik initialValues={initialValues} onSubmit={_handleSave} validationSchema={createUserSchema}>
        {({errors, handleChange, handleSubmit, values, isSubmitting}) => (
          <form onSubmit={handleSubmit}>
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
                          className={classNames('form-control', {'is-invalid': errors.email})}
                          name="email"
                          onChange={handleChange}
                          value={values.email}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
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
                          className={classNames('form-control', {'is-invalid': errors.password})}
                          name="password"
                          type="password"
                          onChange={handleChange}
                          value={values.password}
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
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
                          className={classNames('form-control', {'is-invalid': errors.firstName})}
                          onChange={handleChange}
                          value={values.firstName}
                        />
                        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
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
                          className={classNames('form-control', {'is-invalid': errors.lastName})}
                          onChange={handleChange}
                          value={values.lastName}
                        />
                        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
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
                <button className="btn btn-sm btn-success" type="submit" disabled={isSubmitting}>
                  {isSubmitting && <div className="spinner-border spinner-border-sm mr-1" role="status" />}
                  {isSubmitting ? 'Creating...' : 'Create'}
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
