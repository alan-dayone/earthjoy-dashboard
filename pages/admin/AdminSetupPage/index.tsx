/* tslint:disable:no-default-export */
import React, { Component } from 'react';
import { Formik } from 'formik';
import { guestOnly } from '../../../hocs';
import { systemService } from '../../../services';

class AdminSetupPage extends Component {
  render() {
    return (
      <div className="app flex-row align-items-center">
        <div className="container">
          <div className="justify-content-center row">
            <div className="col-md-6">
              <div className="p-4 card">
                <div className="card-body">
                  <h1>System initialization</h1>
                  <p className="text-muted">
                    Use secret system initialization password to initialize the
                    system and create your first admin account.
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
                          alert('Invalid password');
                          return;
                        }
                      } catch (e) {
                        alert(e.message);
                      }
                      setSubmitting(false);
                    }}
                  >
                    {({
                      values,
                      handleChange,
                      handleSubmit,
                      isSubmitting,
                      isValid,
                    }) => (
                      <form onSubmit={handleSubmit}>
                        <div className="mb-4 input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="fa fa-lock" />
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default guestOnly(AdminSetupPage, { useAdminLayout: true });
