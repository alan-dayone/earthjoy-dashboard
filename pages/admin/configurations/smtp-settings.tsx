/* tslint:disable:no-default-export */
import React, {Component} from 'react';
import Head from 'next/head';
import {Formik, FormikActions} from 'formik';
import toastr from 'toastr';
import {NextComponentType, NextPageContext} from 'next';
import classNames from 'classnames';
import loIsEqual from 'lodash/isEqual';
import {adminOnly} from '../../../hocs';
import {systemService} from '../../../services';
import {MailSmtpSettings} from '../../../models/Configuration';
import {MailSmtpSettingsValidationSchema} from '../../../view-models/SmtpConfig';
import {ToastrWarning} from '../../../view-models/Toastr';

class SmtpSettingToastrWarning extends ToastrWarning {
  public getWarningMessage(): string {
    if (this.code === 'NOTHING_CHANGE') {
      return 'The new SMTP settings are the same';
    }
    return 'Warning';
  }
  public alert() {
    toastr.warning(this.getWarningMessage());
  }
}

class AdminSmtpSettingsPage extends Component<{initialSmtpSettings: MailSmtpSettings}> {
  public state = {
    isTestingConnection: false,
  };

  public static async getInitialProps() {
    const initialSmtpSettings = await systemService.getSmtpSettings();
    return {
      initialSmtpSettings,
    };
  }

  public render() {
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
              {({values, handleChange, isSubmitting, handleSubmit, errors}) => (
                <form onSubmit={handleSubmit}>
                  <div className="card">
                    <div className="card-header">
                      <strong>SMTP settings</strong>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <div className="form-group">
                            <label>SMTP server host</label>
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span className="input-group-text">
                                  <i className="cil-cast" />
                                </span>
                              </div>
                              <input
                                className={classNames('form-control', {'is-invalid': errors.smtpHost})}
                                name="smtpHost"
                                onChange={handleChange}
                                value={values.smtpHost}
                              />
                              {errors.smtpHost && <div className="invalid-feedback">{errors.smtpHost}</div>}
                            </div>
                          </div>
                          <div className="form-group">
                            <label>SMTP server port</label>
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span className="input-group-text">
                                  <i className="cil-lan" />
                                </span>
                              </div>
                              <input
                                className={classNames('form-control', {'is-invalid': errors.smtpPort})}
                                name="smtpPort"
                                onChange={handleChange}
                                value={values.smtpPort}
                              />
                              {errors.smtpPort && <div className="invalid-feedback">{errors.smtpPort}</div>}
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Sender name</label>
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span className="input-group-text">
                                  <i className="cil-user" />
                                </span>
                              </div>
                              <input
                                className={classNames('form-control', {'is-invalid': errors.senderName})}
                                name="senderName"
                                onChange={handleChange}
                                value={values.senderName}
                              />
                              {errors.senderName && <div className="invalid-feedback">{errors.senderName}</div>}
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Sender email</label>
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span className="input-group-text">
                                  <i className="cil-envelope-closed" />
                                </span>
                              </div>
                              <input
                                className={classNames('form-control', {'is-invalid': errors.senderEmail})}
                                name="senderEmail"
                                onChange={handleChange}
                                value={values.senderEmail}
                              />
                              {errors.senderEmail && <div className="invalid-feedback">{errors.senderEmail}</div>}
                            </div>
                          </div>
                          <div className="form-group">
                            <label>SMTP account username</label>
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span className="input-group-text">
                                  <i className="cil-user" />
                                </span>
                              </div>
                              <input
                                className={classNames('form-control', {'is-invalid': errors.username})}
                                name="username"
                                onChange={handleChange}
                                value={values.username}
                              />
                              {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                            </div>
                          </div>
                          <div className="form-group">
                            <label>SMTP account password</label>
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span className="input-group-text">
                                  <i className="cil-lock-locked" />
                                </span>
                              </div>
                              <input
                                className={classNames('form-control', {'is-invalid': errors.password})}
                                name="password"
                                onChange={handleChange}
                                value={values.password}
                              />
                              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <button className="btn btn-sm btn-primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting && <div className="spinner-border spinner-border-sm mr-1" role="status" />}
                        {isSubmitting ? 'Saving...' : 'Save'}
                      </button>
                      &nbsp;
                      <button
                        className="btn btn-sm btn-info"
                        onClick={async (e) => {
                          e.preventDefault();
                          await this._handleTestSmtpConnection(values);
                        }}
                        disabled={isTestingConnection}>
                        {isTestingConnection && <div className="spinner-border spinner-border-sm mr-1" />}
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

  public _handleTestSmtpConnection = async (values: MailSmtpSettings) => {
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

  public _handleSave = async (values: MailSmtpSettings, actions: FormikActions<MailSmtpSettings>) => {
    try {
      actions.setSubmitting(true);
      if (loIsEqual(values, this.props.initialSmtpSettings)) {
        throw new SmtpSettingToastrWarning(SmtpSettingToastrWarning.NOTHING_CHANGE);
      }
      await systemService.saveSmtpSettings(values);
      toastr.success('Saved');
    } catch (e) {
      if (e instanceof SmtpSettingToastrWarning) e.alert();
      else {
        toastr.error(e.message);
      }
    } finally {
      actions.setSubmitting(false);
    }
  };
}

export default adminOnly(AdminSmtpSettingsPage as NextComponentType<NextPageContext, any, any>);
