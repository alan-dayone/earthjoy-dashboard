import {BaseService} from './BaseService';
import {validateUser} from '../validators/UserValidator';

export class AuthService extends BaseService {
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

  public async loginWithEmail(body: {email: string; password: string}) {
    // Login user to get access token.
    const {token} = await this.authGateway.loginWithEmail(body);

    // Store access token on browser.
    this.authGateway.storeAccessToken(token);

    const user = await this.getLoginUser();

    // Emit login event so other services can listen to.
    this.emit(AuthService.event.USER_LOGIN, {type: 'email', user});

    return user;
  }

  public async getLoginUser() {
    return this.authGateway.getLoginUser();
  }

  public async signupWithEmail(body: {name: string; email: string; password: string}) {
    validateUser(body);

    const user = await this.authGateway.create(body);
    this.emit(AuthService.event.USER_SIGNUP, {type: body.email, user});

    return this.loginWithEmail(body);
  }

  public async logout() {
    await this.authGateway.logout();
    this.emit(AuthService.event.USER_LOGOUT);
  }

  public async sendResetPasswordEmail(email: string) {
    validateUser({email});
    return this.authGateway.sendResetPasswordEmail(email);
  }

  public async updateAccountInfo(body: {name: string; email: string; preferredLanguage: string}) {
    validateUser({name: body.name, email: body.email});
    await this.authGateway.updateAccountInfo(body);
  }

  public async updatePassword(body: {oldPassword: string; newPassword: string}) {
    validateUser(body);
    await this.authGateway.updatePassword(body);
  }

  public async setNewPassword(body: {userId: string; newPassword: string}, accessToken: string) {
    validateUser(body);
    await this.authGateway.setNewPassword(body, accessToken);
  }

  public setAccessToken(accessToken: string) {
    this.authGateway.setAccessToken(accessToken);
  }

  public async forgotPassword(email: string) {
    validateUser({email});
    return this.authGateway.forgotPassword(email);
  }

  public async changePassword(body: {newPassword: string; newPasswordConfirm: string}, accessToken: string) {
    return this.authGateway.changePassword(body, accessToken);
  }
}
