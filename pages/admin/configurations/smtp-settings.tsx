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

  render() {
    const initialValues: MailSmtpSettings = {
      smtpHost: '',
      smtpPort: '',
      username: '',
      password: '',
      senderEmail: '',
    };

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
                            />
                          </div>
                          <div className="form-group">
                            <label>SMTP server port</label>
                            <input
                              className="form-control"
                              name="smtpPort"
                              onChange={props.handleChange}
                            />
                          </div>
                          <div className="form-group">
                            <label>Sender email</label>
                            <input
                              className="form-control"
                              name="senderEmail"
                              onChange={props.handleChange}
                            />
                          </div>
                          <div className="form-group">
                            <label>SMTP account username</label>
                            <input
                              className="form-control"
                              name="username"
                              onChange={props.handleChange}
                            />
                          </div>
                          <div className="form-group">
                            <label>SMTP account password</label>
                            <input
                              className="form-control"
                              name="password"
                              onChange={props.handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <button className="btn btn-sm btn-primary" type="submit">
                        Save
                      </button>
                      &nbsp;
                      <button
                        className="btn btn-sm btn-info"
                        onClick={async e => {
                          e.preventDefault();
                          await this._handleTestSmtpConnection(props.values);
                        }}
                      >
                        {this.state.isTestingConnection && (
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
    } catch (e) {
      toastr.error(e.message);
    } finally {
      actions.setSubmitting(false);
    }
  };
}

export default adminOnly(AdminSmtpSettingsPage);
