import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import Head from 'next/head';
import {Formik, FormikHelpers as FormikActions, FormikProps} from 'formik';
import toastr from 'toastr';
import {adminOnly} from '../../../hocs/adminOnly';
import {
  ResetPasswordSettings,
  ConfigurationKey,
} from '../../../models/Configuration';
import {passwordResetValidationSchema} from '../../../view-models/Configuration';
import {systemService} from '../../../services';
import {FormikButton} from '../../../components/admin/FormikButton';
import {FormGroup} from '../../../components/admin/FormGroup';

const initialValues: ResetPasswordSettings = {
  senderName: '',
  senderEmail: '',
  subject: '',
  emailTemplate: '',
};

const AdminPasswordResetPage: FC = () => {
  const {t} = useTranslation();
  const handleSave = async (
    values: ResetPasswordSettings,
    actions: FormikActions<ResetPasswordSettings>,
  ): Promise<void> => {
    try {
      actions.setSubmitting(true);
      await systemService.saveConfiguration<ResetPasswordSettings>(
        ConfigurationKey.RESET_PASSWORD_SETTINGS,
        values,
      );
      toastr.success('Saved');
      actions.setSubmitting(false);
    } catch (e) {
      toastr.error(e.message);
      actions.setSubmitting(false);
    }
  };

  return (
    <div id="admin-smtp-settings-page">
      <Head>
        <title>
          {t('admin')} - {t('configuration')}: {t('passwordReset')}
        </title>
      </Head>
      <div className="row">
        <div className="col-12">
          <Formik
            initialValues={initialValues}
            onSubmit={handleSave}
            validationSchema={passwordResetValidationSchema}>
            {({
              handleSubmit,
            }: FormikProps<ResetPasswordSettings>): JSX.Element => (
              <form onSubmit={handleSubmit}>
                <div className="card">
                  <div className="card-header">
                    <strong>{t('passwordReset')}</strong>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12">
                        <FormGroup
                          name="senderName"
                          label={t('senderName')}
                          icon="cil-user"
                          required
                        />
                        <FormGroup
                          name="senderEmail"
                          label={t('senderEmail')}
                          icon="cil-envelope-closed"
                          required
                        />
                        <FormGroup
                          name="subject"
                          label={t('subject')}
                          icon="cil-user"
                          required
                        />
                        <FormGroup
                          name="emailTemplate"
                          tag="textarea"
                          label={t('emailTemplate')}
                          icon="cil-short-text"
                          placeholder={t('content') + '...'}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="card-footer d-flex justify-content-end">
                    <FormikButton size="sm" color="primary">
                      {t('save')}
                    </FormikButton>
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

export default adminOnly(AdminPasswordResetPage);
