/* tslint:disable:no-default-export */
import React, { Component } from 'react';
import { index } from '../../../hocs';
import { EnterPasswordForm } from './EnterPasswordForm';
import { CreateFirstAdminForm } from './CreateFirstAdminForm';

const STEP = {
  ENTER_PASSWORD: 'enter-password',
  CREATE_FIRST_ADMIN: 'create-first-admin',
};

class AdminSetupPage extends Component {
  state = {
    step: STEP.ENTER_PASSWORD,
    correctSystemInitPassword: null,
  };

  render() {
    return (
      <div className="app flex-row align-items-center">
        <div className="container">
          <div className="justify-content-center row">
            <div className="col-md-6">
              <div className="p-4 card">
                <div className="card-body">
                  {this.state.step === STEP.CREATE_FIRST_ADMIN ? (
                    <CreateFirstAdminForm
                      correctSystemInitPassword={
                        this.state.correctSystemInitPassword
                      }
                    />
                  ) : (
                    <EnterPasswordForm
                      onSuccess={correctPassword =>
                        this.setState({
                          step: STEP.CREATE_FIRST_ADMIN,
                          correctSystemInitPassword: correctPassword,
                        })
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default index(AdminSetupPage, { useAdminLayout: true });