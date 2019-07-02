import { BaseService } from './BaseService';
import { validateUser } from '../validators/UserValidator';

export class AuthService extends BaseService {
  static error = {
    LOGIN_FAILED: 'LOGIN_FAILED',
    EMAIL_NOT_FOUND: 'EMAIL_NOT_FOUND',
    INVALID_CURRENT_PASSWORD: 'INVALID_CURRENT_PASSWORD',
    INVALID_EMAIL: 'INVALID_EMAIL',
    ACCOUNT_INACTIVATED: 'ACCOUNT_INACTIVATED',
  };

  static event = {
    USER_LOGIN: 'USER_LOGIN',
    USER_SIGNUP: 'USER_SIGNUP',
    USER_LOGOUT: 'USER_LOGOUT',
  };

  constructor(options) {
    super(options);
    this.authGateway = options.authGateway;
  }

  async loginWithEmail({ email, password }) {
    const user = await this.authGateway.loginWithEmail({ email, password });
    this.emit(AuthService.event.USER_LOGIN, { type: 'email', user });
    return user;
  }

  async getLoginUser() {
    return this.authGateway.getLoginUser();
  }

  async signupWithEmail({ name, email, password }) {
    validateUser({ name, email, password });

    const user = await this.userGateway.create({ name, email, password });
    this.emit(AuthService.event.USER_SIGNUP, { type: email, user });

    return this.loginWithEmail({ email, password });
  }

  async logout() {
    await this.authGateway.logout();
    this.emit(AuthService.event.USER_LOGOUT);
  }

  async sendResetPasswordEmail(email) {
    validateUser({ email });
    return this.authGateway.sendResetPasswordEmail(email);
  }

  async updateAccountInfo({ name, email, preferredLanguage }) {
    validateUser({ name, email });
    await this.authGateway.updateAccountInfo({
      name,
      email,
      preferredLanguage,
    });
  }

  async updatePassword({ oldPassword, newPassword }) {
    validateUser({ password: newPassword });
    await this.authGateway.updatePassword({ oldPassword, newPassword });
  }

  async setNewPassword({ userId, newPassword }, accessToken) {
    validateUser({ password: newPassword });
    await this.authGateway.setNewPassword({ userId, newPassword }, accessToken);
  }

  setAccessToken(accessToken) {
    this.authGateway.setAccessToken(accessToken);
  }
}
