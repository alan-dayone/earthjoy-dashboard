/* tslint:disable:no-default-export */
import React, { Component } from 'react';

import { guestOnly } from '../../../hocs';
import { ContentContainer, Modal, TextInput } from '../../../components';
import { compose } from 'recompose';
import Router from 'next/router';
import { authService } from '../../../services';

class AdminLoginPage extends Component {
  state = {
    form: {
      email: '',
      password: '',
    },
    formError: {
      email: '',
      password: '',
    },
  };

  onFormChange = (change: { value: string, error: string }, name: string) => {
    this.setState({
      form: { ...this.state.form, [name]: change.value },
      formError: { ...this.state.formError, [name]: change.error },
    });
  };

  login = async () => {
    try {
      const user = await authService.loginWithEmail(this.state.form);
      console.log(user);
      Router.replace('/user');
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <ContentContainer>
        <Modal
          isShowSubmit
          title="Login"
          submitLabel="Login"
          onSubmit={this.login}
        >
          <TextInput
            inputClassName="width__20 input__large"
            type="email"
            placeholder="Email"
            label="Email"
            value={this.state.form.email}
            error={this.state.formError.email}
            onChange={change => this.onFormChange(change, 'email')}
          />
          <TextInput
            inputClassName="width__20 input__large"
            type="password"
            placeholder="Password"
            label="Password"
            value={this.state.form.password}
            onChange={change =>
              this.onFormChange({ value: change.value, error: '' }, 'password')
            }
          />
        </Modal>
      </ContentContainer>
    );
  }
}

export default compose(guestOnly)(AdminLoginPage);
