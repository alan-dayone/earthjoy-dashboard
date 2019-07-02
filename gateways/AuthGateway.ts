import _ from 'lodash';
import { ValidationError, errorCode } from '../errors/ValidationError';
import { AuthService } from '../services/AuthService';
import { ApplicationError } from '../errors/ApplicationError';

export class AuthGateway {
  constructor({ restConnector }) {
    this.restConnector = restConnector;
  }

  async loginWithEmail({ email, password }) {
    try {
      await this.restConnector.post('/users/login', { email, password });
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

  async getLoginUser() {
    try {
      const resp = await this.restConnector.get(
        '/users/me?filter={"include":"roles"}'
      );
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

  async sendResetPasswordEmail(email) {
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

  async updateAccountInfo({ name, email, preferredLanguage }) {
    try {
      await this.restConnector.patch(`/users/me`, {
        name,
        email,
        preferredLanguage,
      });
    } catch (e) {
      const errResp = _.get(e, 'response.data.error', e);
      switch (errResp.name) {
        case 'ValidationError': {
          if (_.get(errResp, 'details.codes.email[0]') === 'uniqueness') {
            throw new ValidationError({ email: [errorCode.EMAIL_EXISTED] });
          }
        }
        default: {
        }
      }
      throw e;
    }
  }

  async updatePassword({ oldPassword, newPassword }) {
    try {
      await this.restConnector.post('/users/change-password', {
        oldPassword,
        newPassword,
      });
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

  async setNewPassword({ userId, newPassword }, accessToken) {
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

  async updateAvatar(avatar) {
    return this.restConnector
      .patch(`/users/me`, { avatar })
      .then(resp => resp.data);
  }

  setAccessToken(accessToken) {
    this.restConnector.setAccessToken(accessToken);
  }
}
