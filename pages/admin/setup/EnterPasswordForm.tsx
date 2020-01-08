import React, { Component } from 'react';
import { Formik } from 'formik';
import toastr from 'toastr';
import { systemService } from '../../../services';

export class EnterPasswordForm extends Component {
  render() {
    return (
      <div>
        <h1>System initialization</h1>
        <p className="text-muted">
          Use secret system initialization password to initialize the system and
          create your first admin account.
        </p>
        <Formik
          initialValues={{ password: '' }}
          validate={values => {
            const errors = {};

            if (values.password === '') {
              errors.password = 'Required';
            }

            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            try {
              const passwordIsCorrect = await systemService.validateSystemInitializationPassword(
                values.password
              );

              if (!passwordIsCorrect) {
                toastr.error('Invalid password');
                return;
              }

              this.props.onSuccess(values.password);
            } catch (e) {
              toastr.error(e.message);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, handleChange, handleSubmit, isSubmitting, isValid }) => (
            <form onSubmit={handleSubmit}>
              <div className="mb-4 input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="cil-lock-locked" />
                  </span>
                </div>
                <input
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  placeholder="System initialization password"
                  type="password"
                  className="form-control"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="px-4 btn btn-primary"
                >
                  Next
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    );
  }
}
