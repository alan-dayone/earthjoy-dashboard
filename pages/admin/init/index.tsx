/* tslint:disable:no-default-export */
import React, { Component } from 'react';

import { index } from '../../../hocs';
import { ContentContainer, Modal, TextInput } from '../../../components';
import { systemService, authService } from '../../../services';
import { compose } from 'recompose';
import Router from 'next/router';

class SystemInit extends Component {
  state = {
    password: '',
    admin: {
      email: '',
      password: '',
    },
    adminError: {
      email: '',
      password: '',
    },
  };

  initSystem = async () => {
    const { password, admin } = this.state;
    try {
      const resp = await systemService.initSystem({
        password,
        admin,
      });
      if (resp.success) {
        await authService.loginWithEmail(admin);
        Router.replace('/user');
      }
    } catch (e) {
      console.log(e);
    }
  };

  onFormChange = (change: { value: string, error: string }, name: string) => {
    this.setState({
      admin: { ...this.state.admin, [name]: change.value },
      adminError: { ...this.state.adminError, [name]: change.error },
    });
  };

  render() {
    return (
      <ContentContainer>
        <Modal
          isShowSubmit
          title="System Initialization"
          submitLabel="Inititiate"
          onSubmit={this.initSystem}
        >
          <TextInput
            inputClassName="width__20 input__large"
            type="password"
            placeholder="Password"
            label="System Password"
            value={this.state.password}
            onChange={({ value }) => this.setState({ password: value })}
          />
          <TextInput
            inputClassName="width__20 input__large"
            type="email"
            placeholder="Email"
            label="Email"
            value={this.state.admin.email}
            error={this.state.adminError.email}
            onChange={change => this.onFormChange(change, 'email')}
          />
          <TextInput
            inputClassName="width__20 input__large"
            type="password"
            placeholder="Password"
            label="Password"
            value={this.state.admin.password}
            error={this.state.adminError.password}
            onChange={change => this.onFormChange(change, 'password')}
          />
        </Modal>
      </ContentContainer>
    );
  }
}

export default compose(index)(SystemInit);
