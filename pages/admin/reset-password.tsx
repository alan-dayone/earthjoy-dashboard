import React, {FC, useState} from 'react';
import Head from 'next/head';
import toastr from 'toastr';
import {Formik, FormikHelpers, FormikProps} from 'formik';
import {useTranslation} from 'react-i18next';
import {withI18next} from '../../hocs/withI18next';
import {guestOnly} from '../../hocs/guestOnly';
import {authService} from '../../services';
import {adminResetPasswordFormSchema} from '../../view-models/Account';
import {FormikButton} from '../../components/admin/FormikButton';
import {getErrorMessageCode} from '../../view-models/Error';
import {FormGroup} from '../../components/admin/FormGroup';

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
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card-group">
              <div className="card p-4">
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
                            <p className="text-muted">
                              {t('msgPleaseEnterEmail')}
                            </p>
                            <FormGroup
                              name="email"
                              type="text"
                              placeholder={t('email')}
                            />
                            <FormikButton color="primary" className="btn-block">
                              {t('submit')}
                            </FormikButton>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default guestOnly(withI18next(AdminResetPasswordPage), {
  useAdminLayout: true,
});
