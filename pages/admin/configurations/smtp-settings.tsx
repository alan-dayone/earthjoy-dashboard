/* tslint:disable:no-default-export */
import React, { Component } from 'react';
import Head from 'next/head';
import { Formik, FormikActions } from 'formik';
import toastr from 'toastr';
import { adminOnly } from '../../../hocs';
import { systemService } from '../../../services';
import { MailSmtpSettings } from '../../../domain/models/Configuration';

class AdminSmtpSettingsPage extends Component {
  state = {
    isTestingConnection: false,
  };

  static async getInitialProps() {
    const initialSmtpSettings = await systemService.getSmtpSettings();
    return {
      initialSmtpSettings,
    };
  }

  render() {
    const initialValues: MailSmtpSettings = this.props.initialSmtpSettings || {
      smtpHost: '',
      smtpPort: '',
      username: '',
      password: '',
      senderEmail: '',
    };
    const { isTestingConnection } = this.state;

    return (
      <div id="admin-smtp-settings-page">
        <Head>
          <title>Admin - Configuration: SMTP settings</title>
        </Head>
        <div className="row">
          <div className="col-12">
            <Formik initialValues={initialValues} onSubmit={this._handleSave}>
              {props => (
                <form onSubmit={props.handleSubmit}>
                  <div className="card">
                    <div className="card-header">
                      <strong>SMTP settings</strong>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <div className="form-group">
                            <label>SMTP server host</label>
                            <input
                              className="form-control"
                              name="smtpHost"
                              onChange={props.handleChange}
                              value={props.values.smtpHost}
                            />
                          </div>
                          <div className="form-group">
                            <label>SMTP server port</label>
                            <input
                              className="form-control"
                              name="smtpPort"
                              onChange={props.handleChange}
                              value={props.values.smtpPort}
                            />
                          </div>
                          <div className="form-group">
                            <label>Sender email</label>
                            <input
                              className="form-control"
                              name="senderEmail"
                              onChange={props.handleChange}
                              value={props.values.senderEmail}
                            />
                          </div>
                          <div className="form-group">
                            <label>SMTP account username</label>
                            <input
                              className="form-control"
                              name="username"
                              onChange={props.handleChange}
                              value={props.values.username}
                            />
                          </div>
                          <div className="form-group">
                            <label>SMTP account password</label>
                            <input
                              className="form-control"
                              name="password"
                              onChange={props.handleChange}
                              value={props.values.password}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <button
                        className="btn btn-sm btn-primary"
                        type="submit"
                        disabled={props.isSubmitting}
                      >
                        {props.isSubmitting && (
                          <div className="spinner-border spinner-border-sm mr-1" />
                        )}
                        Save
                      </button>
                      &nbsp;
                      <button
                        className="btn btn-sm btn-info"
                        onClick={async e => {
                          e.preventDefault();
                          await this._handleTestSmtpConnection(props.values);
                        }}
                        disabled={isTestingConnection}
                      >
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

  _handleTestSmtpConnection = async (values: MailSmtpSettings) => {
    try {
      this.setState({ isTestingConnection: true });
      const isValid = await systemService.testSmtpConnection(values);

      if (isValid) {
        toastr.success('SMTP settings are valid');
      } else {
        toastr.error('Invalid SMTP settings');
      }
    } catch (e) {
      toastr.error(e.message);
    } finally {
      this.setState({ isTestingConnection: false });
    }
  };

  _handleSave = async (
    values: MailSmtpSettings,
    actions: FormikActions<MailSmtpSettings>
  ) => {
    try {
      actions.setSubmitting(true);
      await systemService.saveSmtpSettings(values);
      toastr.success('Saved');
    } catch (e) {
      toastr.error(e.message);
    } finally {
      actions.setSubmitting(false);
    }
  };
}

export default adminOnly(AdminSmtpSettingsPage);
