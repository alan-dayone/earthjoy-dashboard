import {AuthGateway} from '../gateways/AuthGateway';
import {ServiceContext} from './index';
import {LoginUser} from "../models/Account";

export class AuthService {
  public static error = {
    LOGIN_FAILED: 'LOGIN_FAILED',
    EMAIL_NOT_FOUND: 'EMAIL_NOT_FOUND',
    INVALID_CURRENT_PASSWORD: 'INVALID_CURRENT_PASSWORD',
    INVALID_EMAIL: 'INVALID_EMAIL',
    ACCOUNT_INACTIVATED: 'ACCOUNT_INACTIVATED',
  };

  public static event = {
    USER_LOGIN: 'USER_LOGIN',
    USER_SIGNUP: 'USER_SIGNUP',
    USER_LOGOUT: 'USER_LOGOUT',
  };

  private authGateway: AuthGateway;

  constructor(options: ServiceContext) {
    this.authGateway = options.authGateway;
  }

  public async loginWithEmail(body: {email: string; password: string}): Promise<LoginUser> {
    const {token} = await this.authGateway.loginWithEmail(body);
    this.authGateway.setAccessToken(token);
    return this.getLoginUser();
  }

  public async getLoginUser(): Promise<LoginUser> {
    return this.authGateway.getLoginUser();
  }

  public async logout(): Promise<void> {
    await this.authGateway.logout();
  }

  public async sendResetPasswordEmail(email: string): Promise<void> {
    return this.authGateway.sendResetPasswordEmail(email);
  }

  public async updateAccountInfo(body: {name: string; email: string; preferredLanguage: string}): Promise<void> {
    await this.authGateway.updateAccountInfo(body);
  }

  public async updatePassword(body: {oldPassword: string; newPassword: string}): Promise<void> {
    await this.authGateway.updatePassword(body);
  }

  public async setNewPassword(body: {userId: string; newPassword: string}, accessToken: string): Promise<void> {
    await this.authGateway.setNewPassword(body, accessToken);
  }

  public setAccessToken(accessToken: string): void {
    this.authGateway.setAccessToken(accessToken);
  }

  public async forgotPassword(email: string): Promise<void> {
    return this.authGateway.forgotPassword(email);
  }

  public async changePassword(body: {newPassword: string; newPasswordConfirm: string}, accessToken: string): Promise<void> {
    return this.authGateway.changePassword(body, accessToken);
  }
}
