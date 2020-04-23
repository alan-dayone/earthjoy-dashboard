import loGet from 'lodash/get';
import Cookies from 'js-cookie';
import {AxiosInstance} from 'axios';
import {errorCode, ValidationError} from '../errors/ValidationError';
import {AuthService} from '../services/AuthService';
import {ApplicationError} from '../errors/ApplicationError';
import {LoginUser} from '../models/Account';

const AUTHORIZATION_HEADER = 'Authorization';

export const ACCESS_TOKEN_COOKIE = 'jwt';

export class AuthGateway {
  private restConnector: AxiosInstance;
  private jwt: string | null;

  constructor(options: {restConnector: AxiosInstance}) {
    this.jwt = null;
    this.restConnector = options.restConnector;
    this.loadAccessToken();
  }

  public async loginWithEmail(body: {
    email: string;
    password: string;
  }): Promise<{token: string}> {
    const {data} = await this.restConnector.post('/accounts/login', body);
    return {token: data.token};
  }

  public async getLoginUser(): Promise<LoginUser | null> {
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

  public logout(): void {
    this.setAccessToken(null);
  }

  public async sendResetPasswordEmail(email: string): Promise<void> {
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

  public async verifyAccount(
    accountVerificationToken: string,
  ): Promise<boolean> {
    try {
      await this.restConnector.post('/accounts/verify', {
        token: accountVerificationToken,
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  public async updateAccountInfo(body: {
    name: string;
    email: string;
    preferredLanguage: string;
  }): Promise<void> {
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
      }
      throw e;
    }
  }

  public async updatePassword(body: {
    oldPassword: string;
    newPassword: string;
  }): Promise<void> {
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

  public setAccessToken(token: string | null): void {
    if (token) {
      this.jwt = token;
      Cookies.set(ACCESS_TOKEN_COOKIE, token);
      this.restConnector.defaults.headers[
        AUTHORIZATION_HEADER
      ] = `Bearer ${token}`;
    } else {
      this.jwt = null;
      Cookies.remove(ACCESS_TOKEN_COOKIE);
      delete this.restConnector.defaults.headers[AUTHORIZATION_HEADER];
    }
  }

  public async forgotPassword(email: string): Promise<void> {
    return this.restConnector.post('/accounts/reset-password', {email});
  }

  private loadAccessToken(): void {
    // On browser, load access token from cookie storage.
    const accessToken = Cookies.get(ACCESS_TOKEN_COOKIE);
    this.jwt = accessToken;
    this.restConnector.defaults.headers[
      AUTHORIZATION_HEADER
    ] = `Bearer ${accessToken}`;
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

  public async changePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    await this.restConnector.post('/accounts/change-password', {
      oldPassword,
      newPassword,
    });
  }
}
