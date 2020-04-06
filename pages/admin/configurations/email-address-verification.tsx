/* tslint:disable:no-default-export */
import React, {Component} from 'react';
import Head from 'next/head';
import {Formik, FormikActions} from 'formik';
import toastr from 'toastr';
import classNames from 'classnames';
import {adminOnly} from '../../../hocs';
import {VerifyAccountSettings} from '../../../models/Configuration';
import {MailSmtpSettingsValidationSchema} from '../../../view-models/EmailVerification';
import {systemService} from '../../../services';

class AdminEmailAddressVerificationPage extends Component {
  public render(): JSX.Element {
    const initialValues: VerifyAccountSettings = {
      emailTemplate: '',
      subject: '',
      senderEmail: '',
      senderName: '',
    };

    return (
      <div id="admin-smtp-settings-page">
        <Head>
          <title>Admin - Configuration: Email address verification</title>
        </Head>
        <div className="row">
          <div className="col-12">
            <Formik
              initialValues={initialValues}
              onSubmit={this._handleSave}
              validationSchema={MailSmtpSettingsValidationSchema}>
              {({handleChange, handleSubmit, values, errors, isSubmitting}) => (
                <form onSubmit={handleSubmit}>
                  <div className="card">
                    <div className="card-header">
                      <strong>Email address verification</strong>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <div className="form-group">
                            <label>Sender name</label>
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span className="input-group-text">
                                  <i className="cil-user" />
                                </span>
                              </div>
                              <input
                                className={classNames('form-control', {
                                  'is-invalid': errors.senderName,
                                })}
                                name="senderName"
                                onChange={handleChange}
                                value={values.senderName}
                              />
                              {errors.senderName && (
                                <div className="invalid-feedback">
                                  {errors.senderName}
                                </div>
                              )}
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
                                className={classNames('form-control', {
                                  'is-invalid': errors.senderEmail,
                                })}
                                name="senderEmail"
                                onChange={handleChange}
                                value={values.senderEmail}
                              />
                              {errors.senderEmail && (
                                <div className="invalid-feedback">
                                  {errors.senderEmail}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Subject</label>
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span className="input-group-text">
                                  <i className="cil-short-text" />
                                </span>
                              </div>
                              <input
                                className={classNames('form-control', {
                                  'is-invalid': errors.subject,
                                })}
                                name="subject"
                                onChange={handleChange}
                                value={values.subject}
                              />
                              {errors.subject && (
                                <div className="invalid-feedback">
                                  {errors.subject}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Email template</label>
                            <textarea
                              className={classNames('form-control')}
                              name="message"
                              placeholder="Content ..."
                              onChange={handleChange}
                              value={values.emailTemplate}
                            />
                          </div>
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

  public _handleSave = async (
    values: VerifyAccountSettings,
    actions: FormikActions<VerifyAccountSettings>,
  ) => {
    try {
      actions.setSubmitting(true);
      await systemService.saveAccountVerificationSettings(values);
      toastr.success('Saved');
      actions.setSubmitting(false);
    } catch (e) {
      toastr.error(e.message);
      actions.setSubmitting(false);
    }
  };
}

export default adminOnly(AdminEmailAddressVerificationPage);
