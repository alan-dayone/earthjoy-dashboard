import {AuthGateway} from '../gateways/AuthGateway';
import {LoginUser} from '../models/Account';

export class AuthService {
  private authGateway: AuthGateway;

  constructor(options: {authGateway: AuthGateway}) {
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

  public async setNewPassword(body: {
    accountId: string;
    newPassword: string;
    resetPasswordToken: string;
  }): Promise<void> {
    await this.authGateway.setNewPassword(body);
  }

  public async verifyAccount(
    accountVerificationToken: string,
  ): Promise<boolean> {
    return this.authGateway.verifyAccount(accountVerificationToken);
  }

  public setAccessToken(accessToken: string): void {
    this.authGateway.setAccessToken(accessToken);
  }

  public async changePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    await this.authGateway.changePassword(oldPassword, newPassword);
  }
}
