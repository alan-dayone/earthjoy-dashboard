import React, {FC} from 'react';
import Head from 'next/head';
import {Formik, FormikHelpers} from 'formik';
import toastr from 'toastr';
import Router from 'next/router';
import {connect} from 'react-redux';
import {compose} from 'redux';
import * as Yup from 'yup';
import {useTranslation} from 'react-i18next';
import {adminOnly} from '../../hocs/adminOnly';
import {LoginUser} from '../../models/Account';
import {authService} from '../../services';
import {FormField} from '../../components/admin/Formik/FormField';
import {AccountEmailVerificationLabel} from '../../components/admin/AccountEmailVerificationLabel';
import {sharedValidationSchema} from '../../view-models/Account';
import {
  selectors,
  updateLoginUserProfile,
} from '../../redux/slices/loginUserSlice';
import {RootState} from '../../redux/slices';
import {SubmitButton} from '../../components/admin/Formik/SubmitButton';
import {getErrorMessageCode} from '../../view-models/Error';
import {AppDispatch} from '../../redux/store';

const adminUpdateProfileSchema = Yup.object().shape({
  firstName: sharedValidationSchema.firstName,
  lastName: sharedValidationSchema.lastName,
});

const adminUpdatePasswordSchema = Yup.object().shape({
  currentPassword: sharedValidationSchema.password,
  newPassword: sharedValidationSchema.password,
  confirmPassword: Yup.string()
    .required()
    .oneOf(
      [Yup.ref('newPassword'), null],
      // 'Passwords must match.',
    ),
});

interface Props {
  loginUser: LoginUser;
  dispatch: AppDispatch;
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

const ProfilePage: FC<Props> = ({loginUser, dispatch}: Props) => {
  const {t} = useTranslation();

  const handleUpdateProfile = async (
    values: LoginUser,
    formikHelpers: FormikHelpers<LoginUser>,
  ): Promise<void> => {
    try {
      formikHelpers.setSubmitting(true);
      await dispatch(updateLoginUserProfile(values));
      toastr.success(t('success'));
    } catch (e) {
      toastr.error(t(getErrorMessageCode(e)));
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
      toastr.success(t('success'));
      Router.reload();
    } catch (e) {
      toastr.error(t(getErrorMessageCode(e)));
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
            initialValues={loginUser}
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
                    <FormField
                      name="firstName"
                      label={t('firstName')}
                      required
                    />
                    <FormField name="lastName" label={t('lastName')} required />
                    <FormField name="email" label={t('email')} readOnly />
                    <div className="form-group">
                      {t('emailVerification')}:{' '}
                      <AccountEmailVerificationLabel
                        emailVerified={values.emailVerified}
                      />
                    </div>
                  </div>
                  <div className="card-footer d-flex justify-content-end">
                    <SubmitButton size="sm" color="primary">
                      {t('save')}
                    </SubmitButton>
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
            isInitialValid={false}
            validationSchema={adminUpdatePasswordSchema}>
            {({handleSubmit}): JSX.Element => (
              <form onSubmit={handleSubmit}>
                <div className="card">
                  <div className="card-header">
                    <strong>{t('changePassword')}</strong>
                  </div>
                  <div className="card-body">
                    <FormField
                      name="currentPassword"
                      type="password"
                      label={t('currentPassword')}
                      required
                    />
                    <FormField
                      name="newPassword"
                      type="password"
                      label={t('newPassword')}
                      required
                    />
                    <FormField
                      name="confirmPassword"
                      type="password"
                      label={t('confirmPassword')}
                      required
                    />
                  </div>
                  <div className="card-footer d-flex justify-content-end">
                    <SubmitButton
                      size="sm"
                      color="primary"
                      className="float-right">
                      {t('submit')}
                    </SubmitButton>
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
  connect((state: RootState) => ({
    loginUser: selectors.selectLoginUser(state),
  })),
)(ProfilePage);
