import React, {FC, useState} from 'react';
import Head from 'next/head';
import toastr from 'toastr';
import {Formik, FormikHelpers, FormikProps} from 'formik';
import {useTranslation} from 'react-i18next';
import * as Yup from 'yup';
import {withI18next} from '../../hocs/withI18next';
import {guestOnly} from '../../hocs/guestOnly';
import {authService} from '../../services';
import {sharedValidationSchema} from '../../view-models/Account';
import {SubmitButton} from '../../components/admin/Formik/SubmitButton';
import {getErrorMessageCode} from '../../view-models/Error';
import {FormField} from '../../components/admin/Formik/FormField';
import {UnauthenticatedLayout} from '../../containers/admin/layouts/UnauthenticatedLayout';

const adminResetPasswordFormSchema = Yup.object().shape({
  email: sharedValidationSchema.email,
});

interface ForgotPasswordForm {
  email: string;
}

const AdminResetPasswordPage: FC = () => {
  const {t} = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleForgotPassword = async (
    values: ForgotPasswordForm,
    actions: FormikHelpers<ForgotPasswordForm>,
  ): Promise<void> => {
    actions.setSubmitting(true);
    try {
      await authService.sendResetPasswordEmail(values.email);
      setIsSubmitted(true);
      toastr.success(t('success'));
      actions.setSubmitting(false);
    } catch (e) {
      toastr.error(t(getErrorMessageCode(e)));
      actions.setSubmitting(false);
    }
  };

  return (
    <div
      id="admin-reset-password-page"
      className="align-items-center c-app flex-row pace-done">
      <Head>
        <title>
          {t('admin')} - {t('forgotPassword')}
        </title>
      </Head>
      <UnauthenticatedLayout>
        <div className="card-body">
          <h1>{t('forgotPassword')}</h1>
          {!isSubmitted ? (
            <Formik
              initialValues={{email: ''}}
              onSubmit={handleForgotPassword}
              validationSchema={adminResetPasswordFormSchema}>
              {(props: FormikProps<{email: string}>): JSX.Element => (
                <form onSubmit={props.handleSubmit}>
                  <div>
                    <p className="text-muted">{t('msgPleaseEnterEmail')}</p>
                    <FormField
                      name="email"
                      type="text"
                      placeholder={t('email')}
                    />
                    <SubmitButton color="primary" className="btn-block">
                      {t('submit')}
                    </SubmitButton>
                  </div>
                </form>
              )}
            </Formik>
          ) : (
            <div className="mt-3">
              <div className="alert alert-success">
                {t('msgPleaseCheckEmail')}
              </div>
            </div>
          )}
        </div>
      </UnauthenticatedLayout>
    </div>
  );
};

export default guestOnly(withI18next(AdminResetPasswordPage), {
  useAdminLayout: true,
});
