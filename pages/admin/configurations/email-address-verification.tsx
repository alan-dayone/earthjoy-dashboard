import React, {FC, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import Head from 'next/head';
import {Formik, FormikProps, FormikHelpers} from 'formik';
import toastr from 'toastr';
import {adminOnly} from '../../../hocs/adminOnly';
import {
  VerifyAccountSettings,
  ConfigurationKey,
} from '../../../models/Configuration';
import {emailVerificationValidationSchema} from '../../../view-models/Configuration';
import {getErrorMessageCode} from '../../../view-models/Error';
import {FormGroup} from '../../../components/admin/FormGroup';
import {systemService} from '../../../services';
import {VerifyAccountSetting} from '../../../gateways/SystemGateway';
import {FormikButton} from '../../../components/admin/FormikButton';

const AdminEmailAddressVerificationPage: FC = () => {
  const {t} = useTranslation();

  const [initialValues, setInitialValues] = useState({
    emailTemplate: '',
    subject: '',
    senderEmail: '',
    senderName: '',
  });

  useEffect(() => {
    (async (): Promise<void> => {
      const emailVerificationSettings = await systemService.getConfiguration<
        VerifyAccountSetting
      >(ConfigurationKey.VERIFY_ACCOUNT_SETTINGS);
      if (emailVerificationSettings) {
        setInitialValues(emailVerificationSettings);
      }
    })();
  }, []);

  return (
    <div id="admin-email-address-verification-page">
      <Head>
        <title>
          {t('admin')} - {t('configuration')}: {t('emailAddressVerification')}
        </title>
      </Head>
      <div className="row">
        <div className="col-12">
          <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={async (
              values: VerifyAccountSettings,
              actions: FormikHelpers<VerifyAccountSettings>,
            ): Promise<void> => {
              try {
                actions.setSubmitting(true);
                await systemService.saveConfiguration<VerifyAccountSettings>(
                  ConfigurationKey.VERIFY_ACCOUNT_SETTINGS,
                  values,
                );
                toastr.success(t('save'));
                actions.setSubmitting(false);
              } catch (e) {
                toastr.error(t(getErrorMessageCode(e)));
                actions.setSubmitting(false);
              }
            }}
            validationSchema={emailVerificationValidationSchema}>
            {({
              handleSubmit,
            }: FormikProps<VerifyAccountSettings>): JSX.Element => (
              <form onSubmit={handleSubmit}>
                <div className="card">
                  <div className="card-header">
                    <strong>{t('emailAddressVerification')}</strong>
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

export default adminOnly(AdminEmailAddressVerificationPage);
