import React, {FC} from 'react';
import Router from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import toastr from 'toastr';
import {connect} from 'react-redux';
import {Formik, FormikProps, FormikHelpers} from 'formik';
import {useTranslation} from 'react-i18next';
import {guestOnly} from '../../hocs/guestOnly';
import {withI18next} from '../../hocs/withI18next';
import {loginWithEmail} from '../../redux/slices/loginUserSlice';
import {AppDispatch} from '../../redux/store';
import {FormGroup} from '../../components/admin/FormGroup';
import {FormikButton} from '../../components/admin/FormikButton';
import {getErrorCode} from '../../errors/ServerError';

export interface LoginForm {
  email: string;
  password: string;
}

interface PageProps {
  dispatch: AppDispatch;
}

const AdminLoginPage: FC<PageProps> = ({dispatch}: PageProps) => {
  const {t} = useTranslation();

  const getErrorMessage = (error): string => {
    const errCode = getErrorCode(error);

    if (['VALIDATION_FAILED', 'invalid_credentials_email'].includes(errCode)) {
      return 'incorrectEmailOrPassword';
    }

    return errCode;
  };

  const handleLogin = async (
    values: LoginForm,
    actions: FormikHelpers<LoginForm>,
  ): Promise<void> => {
    actions.setSubmitting(true);
    try {
      const user = await dispatch(loginWithEmail(values));

      if (user) {
        await Router.replace('/admin');
      }
    } catch (e) {
      actions.setSubmitting(false);
      toastr.error(t(getErrorMessage(e)));
    }
  };

  return (
    <div
      id="admin-login-page"
      className="align-items-center c-app flex-row pace-done">
      <Head>
        <title>Admin - Login</title>
      </Head>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-4">
            <div className="card-group">
              <div className="card p-4">
                <div className="card-body">
                  <Formik
                    initialValues={{
                      email: '',
                      password: '',
                    }}
                    onSubmit={handleLogin}>
                    {(props: FormikProps<LoginForm>): JSX.Element => (
                      <form onSubmit={props.handleSubmit}>
                        <h1>{t('login')}</h1>
                        <p className="text-muted">{t('loginToYourAccount')}</p>
                        <FormGroup
                          name="email"
                          placeholder={t('email')}
                          icon="cil-user"
                        />
                        <FormGroup
                          name="password"
                          placeholder={t('password')}
                          icon="cil-lock-locked"
                          type="password"
                        />
                        <div className="row">
                          <div className="col-6">
                            <FormikButton color="primary">
                              {t('login')}
                            </FormikButton>
                          </div>
                          <div className="col-6 text-right">
                            <Link href="/admin/reset-password">
                              <a className="btn btn-link px-0">
                                {t('forgotPassword')}
                              </a>
                            </Link>
                          </div>
                        </div>
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

export default guestOnly(connect()(withI18next(AdminLoginPage)), {
  useAdminLayout: true,
});
