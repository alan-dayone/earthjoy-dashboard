import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import Router from 'next/router';
import Head from 'next/head';
import toastr from 'toastr';
import classnames from 'classnames';
import {Formik, FormikHelpers as FormikActions} from 'formik';
import * as Yup from 'yup';
import {guestOnly} from '../../hocs/guestOnly';
import {authService} from '../../services';
import {sharedValidationSchema} from '../../view-models/Account';
import {SubmitButton} from '../../components/admin/Formik/SubmitButton';
import {withI18next} from '../../hocs/withI18next';
import {UnauthenticatedLayout} from '../../containers/admin/layouts/UnauthenticatedLayout';

const adminResetNewPasswordFormSchema = Yup.object().shape({
  newPassword: sharedValidationSchema.password,
  confirmPassword: Yup.string()
    .required()
    .oneOf(
      [Yup.ref('newPassword'), null],
      // 'Passwords must match.',
    ),
});

interface ResetNewPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

const AdminResetNewPasswordPage: FC = () => {
  const {t} = useTranslation();
  const getErrorMessage = (e): string => {
    if (e.response?.data?.error?.message === 'invalid_token') {
      return t('msgTokenInvalidOrExpired');
    }
    return e.message;
  };

  const handleResetPassword = async (
    values: ResetNewPasswordForm,
    actions: FormikActions<ResetNewPasswordForm>,
  ): Promise<void> => {
    actions.setSubmitting(true);
    try {
      await authService.setNewPassword({
        accountId: Router.query.accountId as string,
        newPassword: values.newPassword,
        resetPasswordToken: Router.query.token as string,
      });
      toastr.success(t('success'));
      actions.setSubmitting(false);
      await Router.replace('/admin/login');
    } catch (e) {
      toastr.error(getErrorMessage(e));
      actions.setSubmitting(false);
    }
  };

  return (
    <div
      id="admin-reset-new-password-page"
      className="align-items-center c-app flex-row pace-done">
      <Head>
        <title>
          {t('admin')} - {t('resetPassword')}
        </title>
      </Head>
      <UnauthenticatedLayout>
        <div className="card-body">
          <Formik
            initialValues={{
              newPassword: '',
              confirmPassword: '',
            }}
            onSubmit={handleResetPassword}
            validationSchema={adminResetNewPasswordFormSchema}>
            {({values, handleChange, handleSubmit, errors}): JSX.Element => (
              <form onSubmit={handleSubmit}>
                <h1>{t('resetPassword')}</h1>
                <p className="text-muted">{t('msgPleaseEnterNewPassword')}</p>
                <div className="form-group">
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="cil-lock-locked" />
                      </span>
                    </div>
                    <input
                      name="newPassword"
                      type="password"
                      placeholder="New Password"
                      onChange={handleChange}
                      value={values.newPassword}
                      className={classnames('form-control', {
                        'is-invalid': !!errors.newPassword,
                      })}
                    />
                    {errors.newPassword && (
                      <div className="invalid-feedback">
                        {errors.newPassword}
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="cil-lock-locked" />
                      </span>
                    </div>
                    <input
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm Password"
                      onChange={handleChange}
                      value={values.confirmPassword}
                      className={classnames('form-control', {
                        'is-invalid': !!errors.confirmPassword,
                      })}
                    />
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>
                </div>
                <SubmitButton color="primary" className="btn-block">
                  {t('submit')}
                </SubmitButton>
              </form>
            )}
          </Formik>
        </div>
      </UnauthenticatedLayout>
    </div>
  );
};

export default guestOnly(withI18next(AdminResetNewPasswordPage), {
  useAdminLayout: true,
});
