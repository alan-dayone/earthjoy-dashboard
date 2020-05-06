import React, {FC, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import Head from 'next/head';
import {Formik, FormikProps, FormikHelpers as FormikActions} from 'formik';
import toastr from 'toastr';
import {adminOnly} from '../../../hocs/adminOnly';
import {
  ResetPasswordSettings,
  ConfigurationKey,
} from '../../../models/Configuration';
import {passwordResetValidationSchema} from '../../../view-models/Configuration';
import {getErrorMessageCode} from '../../../view-models/Error';
import {FormField} from '../../../components/admin/Formik/FormField';
import {systemService} from '../../../services';
import {ResetPasswordSetting} from '../../../gateways/SystemGateway';
import {SubmitButton} from '../../../components/admin/Formik/SubmitButton';

const AdminPasswordResetPage: FC = () => {
  const {t} = useTranslation();

  const [initialValues, setInitialValues] = useState({
    emailTemplate: '',
    subject: '',
    senderEmail: '',
    senderName: '',
  });

  useEffect(() => {
    (async (): Promise<void> => {
      const emailResetPasswordSettings = await systemService.getConfiguration<
        ResetPasswordSetting
      >(ConfigurationKey.RESET_PASSWORD_SETTINGS);
      if (emailResetPasswordSettings) {
        setInitialValues(emailResetPasswordSettings);
      }
    })();
  }, []);

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
      toastr.success(t('save'));
      actions.setSubmitting(false);
    } catch (e) {
      toastr.error(t(getErrorMessageCode(e)));
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
            enableReinitialize
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
                        <FormField
                          name="senderName"
                          label={t('senderName')}
                          icon="cil-user"
                          required
                        />
                        <FormField
                          name="senderEmail"
                          label={t('senderEmail')}
                          icon="cil-envelope-closed"
                          required
                        />
                        <FormField
                          name="subject"
                          label={t('subject')}
                          icon="cil-user"
                          required
                        />
                        <FormField
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
                    <SubmitButton size="sm" color="primary">
                      {t('save')}
                    </SubmitButton>
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
