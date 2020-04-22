import React from 'react';
import Head from 'next/head';
import {NextPageContext, NextPage} from 'next';
import loGet from 'lodash/get';
import toastr from 'toastr';
import {adminOnly} from '../../../../hocs/adminOnly';
import {Formik, FormikHelpers as FormikActions, FormikProps} from 'formik';
import {AccountStatus, Account} from '../../../../models/Account';
import {userUpdateInformationFormValidationSchema} from '../../../../view-models/Account';
import {accountService} from '../../../../services';
import {FormGroup} from '../../../../components/admin/FormGroup';
import {useTranslation} from 'react-i18next';

export function getServerErrorMessage(error): string {
  const errorEnum = loGet(error, 'response.data.error.message');
  if (errorEnum === 'EMAIL_EXISTED') {
    return 'Email already existed';
  }
  return 'Unknown error';
}

interface Props {
  originalAccount: Account;
}

const AdminAccountEditingPage: NextPage<Partial<Props>> = ({
  originalAccount,
}) => {
  const {t} = useTranslation();
  const handleSave = async (
    values: Account,
    actions: FormikActions<Account>,
  ): Promise<void> => {
    try {
      actions.setSubmitting(true);
      const userId = originalAccount.id;
      await accountService.updateAccount(userId, values);
      toastr.success(t('success'));
    } catch (e) {
      if (loGet(e, 'e.response.data.error', false))
        toastr.error(getServerErrorMessage(e));
      else toastr.error('error.unknown');
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div id="admin-edit-account-page" className="shadow">
      <Head>
        <title>Admin - Edit account</title>
      </Head>
      <Formik
        initialValues={originalAccount}
        onSubmit={handleSave}
        validationSchema={userUpdateInformationFormValidationSchema}>
        {({handleSubmit, isSubmitting}: FormikProps<Account>): JSX.Element => (
          <form onSubmit={handleSubmit}>
            <div className="card">
              <div className="card-header">
                <strong>Edit account</strong>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <FormGroup
                      name="email"
                      label={t('email')}
                      icon="cil-envelope-closed"
                      required
                    />
                    <FormGroup
                      name="firstName"
                      label={t('firstName')}
                      icon="cil-user"
                      required
                    />
                    <FormGroup
                      name="lastName"
                      label={t('lastName')}
                      icon="cil-user"
                      required
                    />
                    <FormGroup
                      name="status"
                      label={t('accountStatus')}
                      tag="select"
                      required>
                      <option value={AccountStatus.ACTIVE}>
                        {t('active')}
                      </option>
                      <option value={AccountStatus.INACTIVE}>
                        {t('inactive')}
                      </option>
                    </FormGroup>
                    <FormGroup
                      name="emailVerified"
                      label={t('emailVerification')}
                      tag="select"
                      required>
                      <option value="true">{t('verified')}</option>
                      <option value="false">{t('notVerified')}</option>
                    </FormGroup>
                  </div>
                </div>
              </div>
              <div className="card-footer d-flex justify-content-end">
                <button
                  className="btn btn-sm btn-primary"
                  type="submit"
                  disabled={isSubmitting}>
                  {isSubmitting && (
                    <div
                      className="spinner-border spinner-border-sm mr-1"
                      role="status"
                    />
                  )}
                  {isSubmitting ? 'Saving...' : t('save')}
                </button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};
AdminAccountEditingPage.getInitialProps = async (
  context: NextPageContext<Props>,
): Promise<Partial<Props>> => {
  const originalAccount = await accountService.findOneForAdmin(
    context.query['userId'] as string,
  );
  return {
    originalAccount,
  };
};

export default adminOnly(AdminAccountEditingPage);
