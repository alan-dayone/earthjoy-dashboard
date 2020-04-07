import loGet from 'lodash/get';
import Cookies from 'js-cookie';
import {AxiosInstance} from 'axios';
import {errorCode, ValidationError} from '../errors/ValidationError';
import {AuthService} from '../services/AuthService';
import {ApplicationError} from '../errors/ApplicationError';

export class AuthGateway {
  private restConnector: AxiosInstance;
  private jwt: string | null;

  constructor(options: {restConnector: AxiosInstance}) {
    this.jwt = null;
    this.restConnector = options.restConnector;
  }

  public async loginWithEmail(body: {email: string; password: string}) {
    const {data} = await this.restConnector.post('/accounts/login', body);
    return data;
  }

  public async create(body: {email: string; password: string}) {
    await this.restConnector.post('/accounts', body);
    return this.loginWithEmail(body);
  }

  public async getLoginUser() {
    if (!this.jwt) {
      return null;
    }

    try {
      const resp = await this.restConnector.get('/accounts/me');
      return resp.data;
    } catch (e) {
      return null;
    }
  }

  public logout() {
    this.setAccessToken(null);
  }

  public async sendResetPasswordEmail(email: string) {
    try {
      await this.restConnector.post('/accounts/send-reset-password-email', {
        email,
      });
    } catch (e) {
      const errResp = loGet(e, 'response.data.error', e);
      switch (errResp.code) {
        case 'EMAIL_NOT_FOUND':
          throw new ApplicationError(AuthService.error.EMAIL_NOT_FOUND);
        case 'EMAIL_REQUIRED':
          throw new ValidationError({email: [errorCode.REQUIRED]});
        default:
          throw e;
      }
    }
  }

  public async updateAccountInfo(body: {
    name: string;
    email: string;
    preferredLanguage: string;
  }) {
    try {
      await this.restConnector.patch(`/accounts/me`, body);
    } catch (e) {
      const errResp = loGet(e, 'response.data.error', e);
      switch (errResp.name) {
        case 'ValidationError': {
          if (loGet(errResp, 'details.codes.email[0]') === 'uniqueness') {
            throw new ValidationError({email: [errorCode.EMAIL_EXISTED]});
          }
          throw new ValidationError({email: [errorCode.INVALID_EMAIL]});
        }
        default: {
        }
      }
      throw e;
    }
  }

  public async updatePassword(body: {
    oldPassword: string;
    newPassword: string;
  }) {
    try {
      await this.restConnector.post('/accounts/change-password', body);
    } catch (e) {
      const err = loGet(e, 'response.data.error', e);

      if (
        err.code === 'INVALID_PASSWORD' ||
        err.message === 'oldPassword is a required argument'
      ) {
        throw new ApplicationError(AuthService.error.INVALID_CURRENT_PASSWORD);
      }

      throw err;
    }
  }

  public async setNewPassword(body: {
    accountId: string;
    newPassword: string;
    resetPasswordToken: string;
  }): Promise<void> {
    await this.restConnector.post(`/accounts/reset-password`, body);
  }

  public setAccessToken(token: string | null) {
    if (token) {
      this.jwt = token;
      Cookies.set('jwt', token);
      this.restConnector.defaults.headers['Authorization'] = `Bearer ${token}`;
    } else {
      this.jwt = null;
      Cookies.remove('jwt');
      delete this.restConnector.defaults.headers['Authorization'];
    }
  }

  public async forgotPassword(email: string): Promise<void> {
    return this.restConnector.post('/accounts/reset-password', {email});
  }

  // public async changePassword(
  //   body: {accountId: string, newPassword: string, resetPasswordToken: string},
  //   accessToken: string,
  // ): Promise<void> {
  //   const {newPassword} = body;
  //   this.setAccessToken(accessToken);
  //   await this.restConnector.post(`/accounts/change-password?=${accessToken}`, {
  //     newPassword,
  //     newPasswordConfirm,
  //   });
  // }
}
