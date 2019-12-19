import _ from 'lodash';
import { ValidationError, errorCode } from '../errors/ValidationError';
import { AuthService } from '../services/AuthService';
import { ApplicationError } from '../errors/ApplicationError';
import { RestConnector } from '../connectors/RestConnector';

export class AuthGateway {
  /* tslint:disable:no-any */
  restConnector: RestConnector;

  constructor(connector: { restConnector: RestConnector }) {
    this.restConnector = connector.restConnector;
  }

  async loginWithEmail(body: { email: string; password: string }) {
    try {
      const { data } = await this.restConnector.post('/users/login', body);
      this.restConnector.setAccessToken(data.token);
      return this.getLoginUser();
    } catch (e) {
      switch (_.get(e, 'response.data.error.code')) {
        case 'USERNAME_EMAIL_REQUIRED':
        case 'LOGIN_FAILED': {
          throw new ApplicationError(AuthService.error.LOGIN_FAILED);
        }
        default: {
        }
      }
      if (_.get(e, 'response.data.error.message') === 'ACCOUNT_INACTIVATED') {
        throw new ApplicationError(AuthService.error.ACCOUNT_INACTIVATED);
      }
      throw e;
    }
  }

  async create(body: { email: string; password: string }) {
    try {
      await this.restConnector.post('/users', body);
      return this.loginWithEmail(body);
    } catch (e) {
      switch (_.get(e, 'response.data.error.code')) {
        case 'USERNAME_EMAIL_REQUIRED':
        case 'LOGIN_FAILED': {
          throw new ApplicationError(AuthService.error.LOGIN_FAILED);
        }
        default: {
        }
      }
      if (_.get(e, 'response.data.error.message') === 'ACCOUNT_INACTIVATED') {
        throw new ApplicationError(AuthService.error.ACCOUNT_INACTIVATED);
      }
      throw e;
    }
  }

  async getLoginUser() {
    try {
      const resp = await this.restConnector.get('/users');
      return resp.data;
    } catch (e) {
      return null;
    }
  }

  async logout() {
    try {
      await this.restConnector.post('/users/logout', {});
    } catch (e) {
      console.warn(
        'Failed to call logout api, but cookie in browser will be cleared so user is still logged out',
        e
      );
    }
    this.restConnector.removeAccessToken();
  }

  async sendResetPasswordEmail(email: string) {
    try {
      await this.restConnector.post('/users/reset', { email });
    } catch (e) {
      const errResp = _.get(e, 'response.data.error', e);
      switch (errResp.code) {
        case 'EMAIL_NOT_FOUND':
          throw new ApplicationError(AuthService.error.EMAIL_NOT_FOUND);
        case 'EMAIL_REQUIRED':
          throw new ValidationError({ email: [errorCode.REQUIRED] });
        default:
          throw e;
      }
    }
  }

  async updateAccountInfo(body: {
    name: string;
    email: string;
    preferredLanguage: string;
  }) {
    try {
      await this.restConnector.patch(`/users/me`, body);
    } catch (e) {
      const errResp = _.get(e, 'response.data.error', e);
      switch (errResp.name) {
        case 'ValidationError': {
          if (_.get(errResp, 'details.codes.email[0]') === 'uniqueness') {
            throw new ValidationError({ email: [errorCode.EMAIL_EXISTED] });
          }
          throw new ValidationError({ email: [errorCode.INVALID_EMAIL] });
        }
        default: {
        }
      }
      throw e;
    }
  }

  async updatePassword(body: { oldPassword: string; newPassword: string }) {
    try {
      await this.restConnector.post('/users/change-password', body);
    } catch (e) {
      console.log(e.response);
      const err = _.get(e, 'response.data.error', e);

      if (
        err.code === 'INVALID_PASSWORD' ||
        err.message === 'oldPassword is a required argument'
      ) {
        throw new ApplicationError(AuthService.error.INVALID_CURRENT_PASSWORD);
      }

      throw err;
    }
  }

  async setNewPassword(
    body: { userId: string; newPassword: string },
    accessToken: string
  ) {
    const { userId, newPassword } = body;
    try {
      await this.restConnector.post(
        `/users/reset-password?access_token=${accessToken}`,
        { id: userId, newPassword }
      );
    } catch (e) {
      const err = _.get(e, 'response.data.error', e);

      switch (err.code) {
        case 'INVALID_PASSWORD':
          throw new ValidationError(AuthService.error.INVALID_CURRENT_PASSWORD);
        default:
          throw err;
      }
    }
  }

  async updateAvatar(avatar: string) {
    return this.restConnector
      .patch(`/users/me`, { avatar })
      .then(resp => resp.data);
  }

  setAccessToken(accessToken: string) {
    this.restConnector.setAccessToken(accessToken);
  }
}
