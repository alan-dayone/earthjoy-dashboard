import {AuthGateway} from '../gateways/AuthGateway';
import {ServiceContext} from './index';
import {LoginUser} from '../models/Account';

export class AuthService {
  public static error = {
    LOGIN_FAILED: 'LOGIN_FAILED',
    EMAIL_NOT_FOUND: 'EMAIL_NOT_FOUND',
    INVALID_CURRENT_PASSWORD: 'INVALID_CURRENT_PASSWORD',
    INVALID_EMAIL: 'INVALID_EMAIL',
    ACCOUNT_INACTIVATED: 'ACCOUNT_INACTIVATED',
  };

  private authGateway: AuthGateway;

  constructor(options: ServiceContext) {
    this.authGateway = options.authGateway;
  }

  public async loginWithEmail(body: {
    email: string;
    password: string;
  }): Promise<LoginUser> {
    const {token} = await this.authGateway.loginWithEmail(body);
    this.authGateway.setAccessToken(token);
    return this.getLoginUser();
  }

  public async getLoginUser(): Promise<LoginUser> {
    return this.authGateway.getLoginUser();
  }

  public logout(): void {
    this.authGateway.logout();
  }

  public async sendResetPasswordEmail(email: string): Promise<void> {
    return this.authGateway.sendResetPasswordEmail(email);
  }

  public async updateAccountInfo(body: {
    name: string;
    email: string;
    preferredLanguage: string;
  }): Promise<void> {
    await this.authGateway.updateAccountInfo(body);
  }

  public async updatePassword(body: {
    oldPassword: string;
    newPassword: string;
  }): Promise<void> {
    await this.authGateway.updatePassword(body);
  }

  public async setNewPassword(body: {
    accountId: string;
    newPassword: string;
    resetPasswordToken: string;
  }): Promise<void> {
    await this.authGateway.setNewPassword(body);
  }

  public setAccessToken(accessToken: string): void {
    this.authGateway.setAccessToken(accessToken);
  }
}
