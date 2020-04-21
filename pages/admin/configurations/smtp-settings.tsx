import React, {FC, useEffect, useState} from 'react';
import Head from 'next/head';
import {Formik, FormikHelpers as FormikActions, FormikProps} from 'formik';
import toastr from 'toastr';
import {useTranslation} from 'react-i18next';
import {smtpSettingsValidationSchema} from '../../../view-models/Configuration';
import {adminOnly} from '../../../hocs';
import {systemService} from '../../../services';
import {
  ConfigurationKey,
  MailSmtpSettings,
} from '../../../models/Configuration';
import {FormGroup} from '../../../components/admin/FormGroup';

const AdminSmtpSettingsPage: FC = () => {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [initialSmtpSettings, setInitialSmtpSettings] = useState({
    smtpHost: '',
    smtpPort: '',
    username: '',
    password: '',
    senderEmail: '',
    senderName: '',
  });
  const {t} = useTranslation();

  const handleTestSmtpConnection = async (
    values: MailSmtpSettings,
  ): Promise<void> => {
    try {
      setIsTestingConnection(true);

      const isValid = await systemService.testSmtpConnection(values);
      if (isValid) {
        toastr.success(t('smtpSettingsAreValid'));
      } else {
        toastr.error(t('smtpSettingsAreInvalid'));
      }
    } catch (e) {
      toastr.error(e.message);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSave = async (
    values: MailSmtpSettings,
    actions: FormikActions<MailSmtpSettings>,
  ): Promise<void> => {
    try {
      actions.setSubmitting(true);
      await systemService.saveConfiguration<MailSmtpSettings>(
        ConfigurationKey.MAIL_SMTP_SETTINGS,
        values,
      );
      actions.setSubmitting(false);
      toastr.success(t('saved'));
    } catch (e) {
      toastr.error(e.message);
      actions.setSubmitting(false);
    }
  };

  useEffect(() => {
    (async (): Promise<void> => {
      const initialSmtpSettings = await systemService.getConfiguration<
        MailSmtpSettings
      >(ConfigurationKey.MAIL_SMTP_SETTINGS);
      setInitialSmtpSettings(initialSmtpSettings);
    })();
  });

  return (
    <div id="admin-smtp-settings-page">
      <Head>
        <title>Admin - Configuration: SMTP settings</title>
      </Head>
      <div className="row">
        <div className="col-12">
          <Formik
            initialValues={initialSmtpSettings}
            enableReinitialize
            onSubmit={handleSave}
            validationSchema={smtpSettingsValidationSchema}>
            {({
              values,
              isSubmitting,
              handleSubmit,
            }: FormikProps<MailSmtpSettings>): JSX.Element => (
              <form onSubmit={handleSubmit}>
                <div className="card">
                  <div className="card-header">
                    <strong>{t('smtpSettings')}</strong>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12">
                        <FormGroup
                          name="smtpHost"
                          label={t('smtpHost')}
                          icon="cil-cast"
                          required
                        />
                        <FormGroup
                          name="smtpPort"
                          label={t('smtpPort')}
                          icon="cil-lan"
                          required
                        />
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
                          name="username"
                          label={t('smtpAccountUsername')}
                          icon="cil-user"
                          required
                        />
                        <FormGroup
                          name="password"
                          label={t('smtpAccountPassword')}
                          icon="cil-lock-locked"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button
                      className="btn btn-sm btn-primary"
                      type="submit"
                      disabled={isSubmitting}>
                      {isSubmitting && (
                        <div
                          className="spinner-border spinner-border-sm mr-1"
                          role="status"
                        />
                      )}
                      {isSubmitting ? 'Saving...' : t('save')}
                    </button>
                    &nbsp;
                    <button
                      className="btn btn-sm btn-info"
                      onClick={async (e): Promise<void> => {
                        e.preventDefault();
                        await handleTestSmtpConnection(values);
                      }}
                      disabled={isTestingConnection}>
                      {isTestingConnection && (
                        <div className="spinner-border spinner-border-sm mr-1" />
                      )}
                      {t('testConnection')}
                    </button>
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

export default adminOnly(AdminSmtpSettingsPage);
