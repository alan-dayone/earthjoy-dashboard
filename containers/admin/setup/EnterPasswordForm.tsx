import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {Formik, FormikProps} from 'formik';
import toastr from 'toastr';
import {systemService} from '../../../services';
import {systemInitializationFormSchema} from '../../../view-models/Account';
import {FormikButton} from '../../../components/admin/FormikButton';
import {FormGroup} from '../../../components/admin/FormGroup';

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
            <FormGroup
              name="password"
              type="password"
              label={t('password')}
              icon="cil-lock-locked"
              required
            />
            <div>
              <FormikButton color="primary" className="px-4">
                {t('next')}
              </FormikButton>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default EnterPasswordForm;
