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
import {userFormValidationSchema} from '../../../view-models/UserValidation';

const initialValues: Account = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  status: AccountStatus.ACTIVE,
  emailVerified: true,
};

function AdminAccountInfomationPage() {
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
        <title>Admin - Account infomation</title>
      </Head>
      <Formik initialValues={initialValues} onSubmit={_handleSave} validationSchema={userFormValidationSchema}>
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <div className="card">
              <div className="card-header">
                <strong>Account infomation</strong>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <table className={classNames('table', '')}>
                      <thead className={classNames('thead-light', '')}>
                        <tr>
                          <th scope="col" />
                          <th scope="col" />
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th></th>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <button className="btn btn-sm btn-primary" type="submit" disabled={props.isSubmitting}>
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

export default adminOnly(AdminAccountInfomationPage as NextComponentType<NextPageContext, any, any>);
