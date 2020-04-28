import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {Formik, FormikProps, FormikHelpers} from 'formik';
import toastr from 'toastr';
import {connect} from 'react-redux';
import Router from 'next/router';
import _pick from 'lodash/pick';
import * as Yup from 'yup';
import {withI18next} from '../../../../hocs/withI18next';
import {Account} from '../../../../models/Account';
import {systemService} from '../../../../services';
import {AppDispatch} from '../../../../redux/store';
import {loginWithEmail} from '../../../../redux/slices/loginUserSlice';
import {sharedValidationSchema} from '../../../../view-models/Account';
import {SubmitButton} from '../../../../components/admin/Formik/SubmitButton';
import {FormField} from '../../../../components/admin/Formik/FormField';

export const userFormValidationSchema = Yup.object().shape(
  _pick(sharedValidationSchema, ['email', 'firstName', 'lastName', 'password']),
);

interface Props {
  dispatch: AppDispatch;
  correctSystemInitPassword: string;
}

interface FormData extends Partial<Account> {
  confirmPassword: string;
}

const initialValues: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const CreateFirstAdminForm: FC<Props> = ({
  correctSystemInitPassword,
  dispatch,
}) => {
  const {t} = useTranslation();

  const handleInitSystem = async (
    values: FormData,
    actions: FormikHelpers<FormData>,
  ): Promise<void> => {
    try {
      actions.setSubmitting(true);
      await systemService.initSystem({
        password: correctSystemInitPassword,
        admin: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        },
      });

      await dispatch(
        loginWithEmail({
          email: values.email,
          password: values.password,
        }),
      );

      Router.replace('/admin');
    } catch (e) {
      toastr.error(e.message);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>{t('createFirstAdmin')}</h1>
      <p className="text-muted">{t('msgCreateFirstAdmin')}</p>
      <Formik
        initialValues={initialValues}
        validationSchema={userFormValidationSchema}
        onSubmit={handleInitSystem}>
        {({handleSubmit}: FormikProps<FormData>): JSX.Element => (
          <form onSubmit={handleSubmit}>
            <FormField
              name="firstName"
              label={t('firstName')}
              icon="cil-user"
              required
            />
            <FormField
              name="lastName"
              label={t('lastName')}
              icon="cil-user"
              required
            />
            <FormField
              name="email"
              label={t('email')}
              icon="cil-envelope-closed"
              required
            />
            <FormField
              name="password"
              type="password"
              label={t('password')}
              icon="cil-lock-locked"
              required
            />
            <FormField
              name="confirmPassword"
              type="password"
              label={t('confirmPassword')}
              icon="cil-lock-locked"
              required
            />
            <div>
              <SubmitButton color="primary" className="px-4">
                {t('submit')}
              </SubmitButton>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default connect()(withI18next(CreateFirstAdminForm));
