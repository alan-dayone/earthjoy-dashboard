import React, {FC, useState} from 'react';
import Head from 'next/head';
import toastr from 'toastr';
import classnames from 'classnames';
import {Formik, FormikHelpers, FormikProps} from 'formik';
import {useTranslation} from 'react-i18next';
import {withI18next} from '../../hocs/withI18next';
import {guestOnly} from '../../hocs/guestOnly';
import {authService} from '../../services';
import {adminResetPasswordFormSchema} from '../../view-models/Account';
import {FormikButton} from '../../components/admin/FormikButton';
import {getErrorMessageCode} from '../../view-models/Error';

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
                  <Formik
                    initialValues={{email: ''}}
                    onSubmit={handleForgotPassword}
                    validationSchema={adminResetPasswordFormSchema}>
                    {(props: FormikProps<{email: string}>): JSX.Element => (
                      <form onSubmit={props.handleSubmit}>
                        <h1>{t('forgotPassword')}</h1>
                        {!isSubmitted ? (
                          <div>
                            <p className="text-muted">
                              {t('msgPleaseEnterEmail')}
                            </p>
                            <div className="form-group">
                              <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                  <span className="input-group-text">
                                    <i className="cil-envelope-closed" />
                                  </span>
                                </div>
                                <input
                                  name="email"
                                  type="text"
                                  placeholder="Email"
                                  onChange={props.handleChange}
                                  value={props.values.email}
                                  className={classnames('form-control', {
                                    'is-invalid': props.errors.email,
                                  })}
                                />
                                {props.errors.email && (
                                  <div className="invalid-feedback">
                                    {props.errors.email}
                                  </div>
                                )}
                              </div>
                            </div>
                            <FormikButton color="primary" className="btn-block">
                              {t('submit')}
                            </FormikButton>
                          </div>
                        ) : (
                          <div className="mt-3">
                            <div className="alert alert-success">
                              {t('msgPleaseCheckEmail')}
                            </div>
                          </div>
                        )}
                      </form>
                    )}
                  </Formik>
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
