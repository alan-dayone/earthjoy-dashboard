import React, {Component} from 'react';
import _ from 'lodash';
import {TextInput, ContentContainer} from '../components';
import {authService} from '../services';

class Login extends Component {
  state = {
    form: {
      email: '',
      password: '',
    },
    error: {
      email: '',
      password: '',
    },
  };

  onChange = (change: {value: string; error: string}, name: string) => {
    const {value, error} = change;
    this.setState({
      form: {...this.state.form, [name]: value},
      error: {...this.state.error, [name]: error},
    });
  };

  onSubmit = () => {
    const {form, error} = this.state;
    if (!_.values(error).some((err) => err)) {
      authService.loginWithEmail({
        email: form.email,
        password: form.password,
      });
    }
  };

  render() {
    const {form, error} = this.state;

    return (
      <ContentContainer>
        <TextInput
          type="email"
          containerClassName="col-4"
          placeholder="Enter your email"
          label="Email"
          value={form.email}
          error={error.email}
          onChange={(change) => this.onChange(change, 'email')}
        />
        <TextInput
          type="password"
          containerClassName="col-4"
          placeholder="Enter your password"
          label="Password"
          value={form.password}
          error={error.password}
          onChange={(change) => this.onChange(change, 'password')}
        />
        <button onClick={this.onSubmit} className="d__flex">
          Submit
        </button>
      </ContentContainer>
    );
  }
}

// tslint:disable-next-line: no-default-export
export default Login;
