import { BaseService } from './BaseService';

export class SystemService extends BaseService {
  /* tslint:disable:no-any */
  systemGateway: any;

  constructor(options) {
    super(options);
    this.systemGateway = options.systemGateway;
  }

  validateSystemInitializationPassword(password: string): boolean {
    return this.systemGateway.validateSystemInitializationPassword(password);
  }

  createFirstAdmin(systemInitPassword: string, userData: {}) {
    return this.systemGateway.createFirstAdmin(systemInitPassword, userData);
  }
}
