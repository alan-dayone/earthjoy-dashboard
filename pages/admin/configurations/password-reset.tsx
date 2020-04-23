import React, {FC} from 'react';
import Head from 'next/head';
import {Formik, FormikHelpers as FormikActions, FormikProps} from 'formik';
import toastr from 'toastr';
import classNames from 'classnames';
import {adminOnly} from '../../../hocs/adminOnly';
import {
  ResetPasswordSettings,
  ConfigurationKey,
} from '../../../models/Configuration';
import {passwordResetValidationSchema} from '../../../view-models/Configuration';
import {systemService} from '../../../services';
import {FormikButton} from '../../../components/admin/FormikButton';

const initialValues: ResetPasswordSettings = {
  senderName: '',
  senderEmail: '',
  subject: '',
  emailTemplate: '',
};

const AdminPasswordResetPage: FC = () => {
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
      toastr.success('Saved');
      actions.setSubmitting(false);
    } catch (e) {
      toastr.error(e.message);
      actions.setSubmitting(false);
    }
  };

  return (
    <div id="admin-smtp-settings-page">
      <Head>
        <title>Admin - Configuration: Password Reset</title>
      </Head>
      <div className="row">
        <div className="col-12">
          <Formik
            initialValues={initialValues}
            onSubmit={handleSave}
            validationSchema={passwordResetValidationSchema}>
            {({
              errors,
              handleChange,
              handleSubmit,
              values,
            }: FormikProps<ResetPasswordSettings>): JSX.Element => (
              <form onSubmit={handleSubmit}>
                <div className="card">
                  <div className="card-header">
                    <strong>Password reset</strong>
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
                  <div className="card-footer d-flex justify-content-end">
                    <FormikButton size="sm" color="primary">
                      Save
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

export default adminOnly(AdminPasswordResetPage);
