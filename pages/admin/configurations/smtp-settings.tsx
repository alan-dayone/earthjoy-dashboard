import React, {Component} from 'react';
import Head from 'next/head';
import {Formik, FormikHelpers as FormikActions, FormikProps} from 'formik';
import toastr from 'toastr';
import {adminOnly} from '../../../hocs';
import {systemService} from '../../../services';
import {
  MailSmtpSettings,
  ConfigurationKey,
} from '../../../models/Configuration';
import {MailSmtpSettingsValidationSchema} from '../../../view-models/SmtpConfig';
import {FormGroup} from '../../../components/admin/FormGroup';

class AdminSmtpSettingsPage extends Component<{
  initialSmtpSettings: MailSmtpSettings;
}> {
  public state = {
    isTestingConnection: false,
  };

  public static async getInitialProps(): Promise<{}> {
    const initialSmtpSettings = await systemService.getConfiguration<
      MailSmtpSettings
    >(ConfigurationKey.MAIL_SMTP_SETTINGS);
    return {
      initialSmtpSettings,
    };
  }

  public render(): JSX.Element {
    const initialValues: MailSmtpSettings = this.props.initialSmtpSettings || {
      smtpHost: '',
      smtpPort: '',
      username: '',
      password: '',
      senderEmail: '',
      senderName: '',
    };
    const {isTestingConnection} = this.state;

    return (
      <div id="admin-smtp-settings-page">
        <Head>
          <title>Admin - Configuration: SMTP settings</title>
        </Head>
        <div className="row">
          <div className="col-12">
            <Formik
              initialValues={initialValues}
              onSubmit={this._handleSave}
              validationSchema={MailSmtpSettingsValidationSchema}>
              {({
                values,
                isSubmitting,
                handleSubmit,
              }: FormikProps<MailSmtpSettings>): JSX.Element => (
                <form onSubmit={handleSubmit}>
                  <div className="card">
                    <div className="card-header">
                      <strong>SMTP settings</strong>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <FormGroup
                            name="smtpHost"
                            label="SMTP server host"
                            icon="cil-cast"
                            required
                          />
                          <FormGroup
                            name="smtpPort"
                            label="SMTP server port"
                            icon="cil-lan"
                            required
                          />
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
                            name="username"
                            label="SMTP account username"
                            icon="cil-user"
                            required
                          />
                          <FormGroup
                            name="password"
                            label="SMTP account password"
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
                        {isSubmitting ? 'Saving...' : 'Save'}
                      </button>
                      &nbsp;
                      <button
                        className="btn btn-sm btn-info"
                        onClick={async (e): Promise<void> => {
                          e.preventDefault();
                          await this._handleTestSmtpConnection(values);
                        }}
                        disabled={isTestingConnection}>
                        {isTestingConnection && (
                          <div className="spinner-border spinner-border-sm mr-1" />
                        )}
                        Test connection
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
  }

  public _handleTestSmtpConnection = async (
    values: MailSmtpSettings,
  ): Promise<void> => {
    try {
      this.setState({isTestingConnection: true});

      const isValid = await systemService.testSmtpConnection(values);
      if (isValid) {
        toastr.success('SMTP settings are valid');
      } else {
        toastr.error('Invalid SMTP settings');
      }
    } catch (e) {
      toastr.error(e.message);
    } finally {
      this.setState({isTestingConnection: false});
    }
  };

  public _handleSave = async (
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
      toastr.success('Saved');
    } catch (e) {
      toastr.error(e.message);
      actions.setSubmitting(false);
    }
  };
}

export default adminOnly(AdminSmtpSettingsPage);
