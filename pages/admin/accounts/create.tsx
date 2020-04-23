import React, {FC} from 'react';
import Head from 'next/head';
import loGet from 'lodash/get';
import toastr from 'toastr';
import {Formik, FormikProps} from 'formik';
import {useTranslation} from 'react-i18next';
import {adminOnly} from '../../../hocs/adminOnly';
import {Account, AccountStatus} from '../../../models/Account';
import {userFormValidationSchema} from '../../../view-models/Account';
import {accountService} from '../../../services';
import {FormGroup} from '../../../components/admin/FormGroup';
import {FormikButton} from '../../../components/admin/FormikButton';

const initialValues: Account = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  status: AccountStatus.ACTIVE,
  emailVerified: true,
};

const AdminAccountCreationPage: FC = () => {
  const {t} = useTranslation();

  const getServerErrorMessage = (error): string => {
    const errorEnum = loGet(error, 'response.data.error.message');
    if (errorEnum === 'EMAIL_EXISTED') {
      return 'emailAlreadyExist';
    }
    return 'error.unknown';
  };

  const handleSave = async (values: Account, actions): Promise<void> => {
    try {
      actions.setSubmitting(true);
      await accountService.createAccount(values);
      toastr.success(t('success'));
      actions.setSubmitting(false);
    } catch (e) {
      toastr.error(t(getServerErrorMessage(e)));
      actions.setSubmitting(false);
    }
  };

  return (
    <div id="admin-create-account-page" className="shadow">
      <Head>
        <title>
          {t('admin')} - {t('createAccount')}
        </title>
      </Head>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSave}
        validationSchema={userFormValidationSchema}>
        {({handleSubmit, setFieldValue}: FormikProps<Account>): JSX.Element => (
          <form onSubmit={handleSubmit}>
            <div className="card">
              <div className="card-header">
                <strong>{t('createAccount')}</strong>
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
                      name="password"
                      type="password"
                      label={t('password')}
                      icon="cil-lock-locked"
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
                      onChange={(e): void =>
                        setFieldValue(
                          'emailVerified',
                          e.target.value === 'true',
                        )
                      }
                      required>
                      <option value="true">{t('verified')}</option>
                      <option value="false">{t('notVerified')}</option>
                    </FormGroup>
                  </div>
                </div>
              </div>
              <div className="card-footer d-flex justify-content-end">
                <FormikButton size="sm" color="primary">
                  {t('create')}
                </FormikButton>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default adminOnly(AdminAccountCreationPage);
