import React, {FC} from 'react';
import Router from 'next/router';
import Head from 'next/head';
import toastr from 'toastr';
import {connect} from 'react-redux';
import {Formik, FormikProps, FormikHelpers} from 'formik';
import {useTranslation} from 'react-i18next';
import {guestOnly} from '../../hocs/guestOnly';
import {withI18next} from '../../hocs/withI18next';
import {loginWithEmail} from '../../redux/slices/loginUserSlice';
import {AppDispatch} from '../../redux/store';
import {FormField} from '../../components/admin/Formik/FormField';
import {SubmitButton} from '../../components/admin/Formik/SubmitButton';
import {getErrorMessageCode} from '../../view-models/Error';
import {UnauthenticatedLayout} from '../../containers/admin/layouts/UnauthenticatedLayout';

export interface LoginForm {
  email: string;
  password: string;
}

interface PageProps {
  dispatch: AppDispatch;
}

const AdminLoginPage: FC<PageProps> = ({dispatch}: PageProps) => {
  const {t} = useTranslation();

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
      /* eslint-disable prettier/prettier */
      toastr.error(
        t(
          getErrorMessageCode(e, {
            'VALIDATION_FAILED': 'incorrectEmailOrPassword',
            'invalid_credentials_email': 'incorrectEmailOrPassword',
          }),
        ),
      );
    }
  };

  return (
    <div
      id="admin-login-page"
      className="align-items-center c-app flex-row pace-done">
      <Head>
        <title>
          {t('admin')} - {t('login')}
        </title>
      </Head>
      <UnauthenticatedLayout>
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
                <FormField
                  name="email"
                  placeholder={t('email')}
                  icon="cil-user"
                />
                <FormField
                  name="password"
                  placeholder={t('password')}
                  icon="cil-lock-locked"
                  type="password"
                />
                <div className="row">
                  <div className="col-4">
                    <SubmitButton color="primary">
                      {t('login')}
                    </SubmitButton>
                  </div>
                  {/*<div className="col-8 text-right">*/}
                  {/*  <Link href="/admin/reset-password">*/}
                  {/*    <a className="btn btn-link px-0">*/}
                  {/*      {t('forgotPassword')}*/}
                  {/*    </a>*/}
                  {/*  </Link>*/}
                  {/*</div>*/}
                </div>
              </form>
            )}
          </Formik>
        </div>
      </UnauthenticatedLayout>
    </div>
  );
};

export default guestOnly(connect()(withI18next(AdminLoginPage)), {
  useAdminLayout: true,
});
