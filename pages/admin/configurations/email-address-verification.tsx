import React, {FC, useEffect, useState} from 'react';
import Head from 'next/head';
import {Formik, FormikProps, FormikHelpers} from 'formik';
import toastr from 'toastr';
import {adminOnly} from '../../../hocs/adminOnly';
import {
  VerifyAccountSettings,
  ConfigurationKey,
} from '../../../models/Configuration';
import {emailVerificationValidationSchema} from '../../../view-models/Configuration';
import {FormGroup} from '../../../components/admin/FormGroup';
import {systemService} from '../../../services';
import {VerifyAccountSetting} from '../../../gateways/SystemGateway';

const AdminEmailAddressVerificationPage: FC = () => {
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
      setInitialValues(emailVerificationSettings);
    })();
  });

  return (
    <div id="admin-email-address-verification-page">
      <Head>
        <title>Admin - Configuration: Email address verification</title>
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
                toastr.success('Saved');
                actions.setSubmitting(false);
              } catch (e) {
                toastr.error(e.message);
                actions.setSubmitting(false);
              }
            }}
            validationSchema={emailVerificationValidationSchema}>
            {({
              handleSubmit,
              isSubmitting,
            }: FormikProps<VerifyAccountSettings>): JSX.Element => (
              <form onSubmit={handleSubmit}>
                <div className="card">
                  <div className="card-header">
                    <strong>Email address verification</strong>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12">
                        <FormGroup
                          name="senderName"
                          label="Sender name"
                          icon="cil-user"
                          required
                        />
                        <FormGroup
                          name="senderEmail"
                          label="Sender email"
                          icon="cil-envelope-closed"
                          required
                        />
                        <FormGroup
                          name="subject"
                          label="Subject"
                          icon="cil-user"
                          required
                        />
                        <FormGroup
                          name="emailTemplate"
                          tag="textarea"
                          label="Email template"
                          icon="cil-short-text"
                          placeholder="Content ..."
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="card-footer d-flex justify-content-end">
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
                      {isSubmitting ? 'Saving...' : 'Save'}
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

export default adminOnly(AdminEmailAddressVerificationPage);
