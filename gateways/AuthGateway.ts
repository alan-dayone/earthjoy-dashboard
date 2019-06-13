import { RestConnector } from './interfaces/RestConnector';

class AuthGateway {
  private restConnector: RestConnector;

  loginWithEmail(email: string, password: string) {
    // this.restConnector.post('/users/login', {email, password});
  }
}

export { AuthGateway };
