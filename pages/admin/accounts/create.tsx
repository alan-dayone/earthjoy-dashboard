import React, {ReactElement} from 'react';
import Head from 'next/head';
import {NextComponentType, NextPageContext} from 'next';
import loGet from 'lodash/get';
import toastr from 'toastr';
import {Formik, FormikProps} from 'formik';
import {useTranslation} from 'react-i18next';
import {adminOnly} from '../../../hocs';
import {Account, AccountStatus} from '../../../models/Account';
import {
  AccountEmailVerificationText,
  AccountStatusText,
  userFormValidationSchema,
} from '../../../view-models/Account';
import {accountService} from '../../../services';
import {createField, createTextField} from '../../../components/common/Formik';

const initialValues: Account = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  status: AccountStatus.ACTIVE,
  emailVerified: true,
};

export function getServerErrorMessage(error): string {
  const errorEnum = loGet(error, 'response.data.error.message');
  if (errorEnum === 'EMAIL_EXISTED') {
    return 'Email already existed';
  }
  return 'Unknown error';
}

const TextField = createTextField<string, Account>();
const CustomField = createField<string, Account>();

function AdminAccountCreationPage(): ReactElement {
  const {t} = useTranslation();

  async function _handleSave(values: Account, actions): Promise<void> {
    try {
      actions.setSubmitting(true);
      await accountService.createAccount(values);
      toastr.success('Success');
      actions.setSubmitting(false);
    } catch (e) {
      toastr.error(getServerErrorMessage(e));
      actions.setSubmitting(false);
    }
  }

  return (
    <div id="admin-create-account-page" className="shadow">
      <Head>
        <title>Admin - Create account</title>
      </Head>
      <Formik
        initialValues={initialValues}
        onSubmit={_handleSave}
        validationSchema={userFormValidationSchema}>
        {({handleSubmit, isSubmitting}: FormikProps<Account>): JSX.Element => (
          <form onSubmit={handleSubmit}>
            <div className="card">
              <div className="card-header">
                <strong>{t('createAccount')}</strong>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <TextField
                      labelText="Email"
                      iconName="cil-envelope-closed"
                    />
                    <TextField
                      type="password"
                      labelText="Password"
                      iconName="cil-lock-locked"
                    />
                    <TextField labelText="First name" iconName="cil-user" />
                    <TextField labelText="Last name" iconName="cil-user" />
                    <CustomField labelText="Account status" iconName="cil-user">
                      {({values, handleChange}): JSX.Element => (
                        <select
                          name="status"
                          className="form-control"
                          value={values.status}
                          onChange={handleChange}>
                          <option value={AccountStatus.ACTIVE}>
                            {AccountStatusText[AccountStatus.ACTIVE]}
                          </option>
                          <option value={AccountStatus.INACTIVE}>
                            {AccountStatusText[AccountStatus.INACTIVE]}
                          </option>
                        </select>
                      )}
                    </CustomField>
                    <CustomField
                      labelText="Email verification"
                      iconName="cil-user">
                      {({values, setFieldValue}): JSX.Element => (
                        <select
                          name="emailVerified"
                          className="form-control"
                          value={String(values.emailVerified)}
                          onChange={(e): void => {
                            if (e.target.value === 'true')
                              setFieldValue('emailVerified', true);
                            else setFieldValue('emailVerified', false);
                          }}>
                          <option value="true">
                            {AccountEmailVerificationText.VERIFIED}
                          </option>
                          <option value="false">
                            {AccountEmailVerificationText.NOT_VERIFIED}
                          </option>
                        </select>
                      )}
                    </CustomField>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <button
                  className="btn btn-sm btn-success"
                  type="submit"
                  disabled={isSubmitting}>
                  {isSubmitting && (
                    <div
                      className="spinner-border spinner-border-sm mr-1"
                      role="status"
                    />
                  )}
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

export default adminOnly(
  AdminAccountCreationPage as NextComponentType<NextPageContext>,
);
