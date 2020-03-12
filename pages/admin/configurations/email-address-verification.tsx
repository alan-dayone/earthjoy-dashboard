/* tslint:disable:no-default-export */
import React, {Component} from 'react';
import Head from 'next/head';
import {Formik, FormikActions} from 'formik';
import toastr from 'toastr';
import classNames from 'classnames';
import {adminOnly} from '../../../hocs';
// import { systemService } from '../../../services';
import {EmailFormat} from '../../../models/Configuration';
import {MailSmtpSettingsValidationSchema} from '../../../view-models/EmailVerification';
class AdminEmailAddressVerificationPage extends Component {
  public render() {
    const initialValues: EmailFormat = {
      senderName: '',
      senderEmail: '',
      subject: '',
      message: '',
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
                            <label>Subject</label>
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span className="input-group-text">
                                  <i className="cil-short-text" />
                                </span>
                              </div>
                              <input
                                className={classNames('form-control', {'is-invalid': errors.subject})}
                                name="subject"
                                onChange={handleChange}
                                value={values.subject}
                              />
                              {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Message</label>
                            <textarea
                              className={classNames('form-control')}
                              name="message"
                              placeholder="Content ..."
                              onChange={handleChange}
                              value={values.message}></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <button className="btn btn-sm btn-primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting && <div className="spinner-border spinner-border-sm mr-1" role="status" />}
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

  //   _handleTestSmtpConnection = async (values: MailSmtpSettings) => {
  //     try {
  //       this.setState({ isTestingConnection: true });
  //       const isValid = await systemService.testSmtpConnection(values);

  //       if (isValid) {
  //         toastr.success('SMTP settings are valid');
  //       } else {
  //         toastr.error('Invalid SMTP settings');
  //       }
  //     } catch (e) {
  //       toastr.error(e.message);
  //     } finally {
  //       this.setState({ isTestingConnection: false });
  //     }
  //   };

  public _handleSave = async (values: EmailFormat, actions: FormikActions<EmailFormat>) => {
    actions.setSubmitting(true);
    try {
      // await systemService.saveSmtpSettings(values);
      console.log({values});

      toastr.success('Saved');
    } catch (e) {
      toastr.error(e.message);
    } finally {
      actions.setSubmitting(false);
    }
  };
}

export default adminOnly(AdminEmailAddressVerificationPage);
