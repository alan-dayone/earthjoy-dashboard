import React, {useEffect, useState, FC} from 'react';
import Head from 'next/head';
import {Formik, FormikHelpers} from 'formik';
import toastr from 'toastr';
import _isEqual from 'lodash/isEqual';
import Router from 'next/router';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {adminOnly} from '../../hocs/adminOnly';
import {Account, LoginUser} from '../../models/Account';
import {accountService, authService} from '../../services';
import {FormGroup} from '../../components/admin/FormGroup';
import {AccountStatusLabel} from '../../components/admin/AccountStatusLabel';
import {AccountEmailVerificationLabel} from '../../components/admin/AccountEmailVerificationLabel';
import {
  adminUpdateProfileSchema,
  adminUpdatePasswordSchema,
} from '../../view-models/Account';
import {selectors} from '../../redux/slices/loginUserSlice';
import {RootState} from '../../redux/slices';
import {useTranslation} from 'react-i18next';
import {FormikButton} from '../../components/admin/FormikButton';

interface Props {
  loginUser: LoginUser;
}

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const initialChangePasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const ProfilePage: FC<Props> = (props: Props) => {
  const {loginUser} = props;
  const {t} = useTranslation();
  const [profile, setProfile] = useState<Account>({
    email: '',
    emailVerified: undefined,
    firstName: '',
    lastName: '',
    status: undefined,
  });

  useEffect(() => {
    (async (): Promise<void> => {
      const userProfile = await accountService.findOneForAdmin(loginUser?.id);
      setProfile(userProfile);
    })();
  }, [loginUser]);

  const handleUpdateProfile = async (
    values: Account,
    formikHelpers: FormikHelpers<Account>,
  ): Promise<void> => {
    try {
      formikHelpers.setSubmitting(true);
      if (_isEqual(values, profile)) {
        toastr.warning('New profile is the same.');
        return;
      }
      await accountService.updateAccount(loginUser.id, values);
      toastr.success('Update profile succeed.');
    } catch {
      toastr.error('Update profile failed.');
    } finally {
      formikHelpers.setSubmitting(false);
    }
  };

  const handleChangePassword = async (
    values: ChangePasswordForm,
    formikHelpers: FormikHelpers<ChangePasswordForm>,
  ): Promise<void> => {
    try {
      formikHelpers.setSubmitting(true);
      await authService.changePassword(
        values.currentPassword,
        values.newPassword,
      );
      toastr.success('Update password succeed.');
      Router.reload();
    } catch {
      toastr.error('Update password failed.');
    } finally {
      formikHelpers.setSubmitting(false);
    }
  };

  return (
    <div id="admin-profile-page">
      <Head>
        <title>
          {t('admin')} - {t('profile')}
        </title>
      </Head>
      <div className="row">
        <div className="col-6">
          <Formik
            initialValues={profile}
            enableReinitialize
            onSubmit={handleUpdateProfile}
            validationSchema={adminUpdateProfileSchema}>
            {({handleSubmit, values}): JSX.Element => (
              <form onSubmit={handleSubmit}>
                <div className="card">
                  <div className="card-header">
                    <strong>{t('profile')}</strong>
                  </div>
                  <div className="card-body">
                    <FormGroup
                      name="firstName"
                      label={t('firstName')}
                      required
                    />
                    <FormGroup name="lastName" label={t('lastName')} required />
                    <FormGroup name="email" label={t('email')} readOnly />
                    <div className="form-group">
                      {t('accountStatus')}:{' '}
                      <AccountStatusLabel status={values.status} />
                    </div>
                    <div className="form-group">
                      {t('emailVerification')}:{' '}
                      <AccountEmailVerificationLabel
                        emailVerified={values.emailVerified}
                      />
                    </div>
                  </div>
                  <div className="card-footer d-flex justify-content-end">
                    <FormikButton size="sm" color="primary">
                      {t('save')}
                    </FormikButton>
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </div>
        <div className="col-6">
          <Formik
            initialValues={initialChangePasswordForm}
            onSubmit={handleChangePassword}
            validationSchema={adminUpdatePasswordSchema}>
            {({handleSubmit}): JSX.Element => (
              <form onSubmit={handleSubmit}>
                <div className="card">
                  <div className="card-header">
                    <strong>{t('changePassword')}</strong>
                  </div>
                  <div className="card-body">
                    <FormGroup
                      name="currentPassword"
                      type="password"
                      label={t('currentPassword')}
                      required
                    />
                    <FormGroup
                      name="newPassword"
                      type="password"
                      label={t('newPassword')}
                      required
                    />
                    <FormGroup
                      name="confirmPassword"
                      type="password"
                      label={t('confirmPassword')}
                      required
                    />
                  </div>
                  <div className="card-footer d-flex justify-content-end">
                    <FormikButton
                      size="sm"
                      color="primary"
                      className="float-right">
                      {t('submit')}
                    </FormikButton>
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default compose(
  adminOnly,
  connect(
    (state: RootState) => ({loginUser: selectors.selectLoginUser(state)}),
    null,
  ),
)(ProfilePage);
