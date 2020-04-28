import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {Formik, FormikProps} from 'formik';
import toastr from 'toastr';
import {connect} from 'react-redux';
import * as Yup from 'yup';
import _pick from 'lodash/pick';
import {withI18next} from '../../../../hocs/withI18next';
import {systemService} from '../../../../services';
import {sharedValidationSchema} from '../../../../view-models/Account';
import {SubmitButton} from '../../../../components/admin/Formik/SubmitButton';
import {FormField} from '../../../../components/admin/Formik/FormField';

export const systemInitializationFormSchema = Yup.object().shape(
  _pick(sharedValidationSchema, 'password'),
);

interface Props {
  onSuccess: (password: string) => void;
}

const initialValues = {
  password: '',
};

const EnterPasswordForm: FC<Props> = ({onSuccess}) => {
  const {t} = useTranslation();

  const handleSubmit = async (values, actions): Promise<void> => {
    try {
      actions.setSubmitting(true);

      const passwordIsCorrect = await systemService.validateSystemInitializationPassword(
        values.password,
      );

      if (!passwordIsCorrect) {
        toastr.error(t('invalidPassword'));
        return;
      }

      onSuccess(values.password);
    } catch (e) {
      toastr.error(e.message);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>{t('systemInitialization')}</h1>
      <p className="text-muted">{t('msgSystemInitialization')}</p>
      <Formik
        initialValues={initialValues}
        validationSchema={systemInitializationFormSchema}
        onSubmit={handleSubmit}>
        {({handleSubmit}: FormikProps<Account>): JSX.Element => (
          <form onSubmit={handleSubmit}>
            <FormField
              name="password"
              type="password"
              label={t('password')}
              icon="cil-lock-locked"
              required
            />
            <div>
              <SubmitButton color="primary" className="px-4">
                {t('next')}
              </SubmitButton>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default connect()(withI18next(EnterPasswordForm));
