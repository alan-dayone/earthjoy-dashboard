import { BaseService } from './BaseService';
import { SystemGateway } from '../gateways/SystemGateway';
import {
  ConfigurationKey,
  MailSmtpSettings,
} from '../domain/models/Configuration';

export class SystemService extends BaseService {
  /* tslint:disable:no-any */
  systemGateway: SystemGateway;

  constructor(options) {
    super(options);
    this.systemGateway = options.systemGateway;
  }

  // validateSystemInitializationPassword(password: string): boolean {
  //   return this.systemGateway.validateSystemInitializationPassword(password);
  // }

  initSystem = async (body: {
    password: string;
    admin: {
      email: string;
      password: string;
    };
  }): Promise<{
    success: boolean;
  }> => {
    const resp = await this.systemGateway.initSystem(body);
    return resp;
  };

  async testSmtpConnection(smtpSettings: MailSmtpSettings): Promise<boolean> {
    return true;
  }

  async saveSmtpSettings(smtpSettings: MailSmtpSettings): Promise<void> {
    await this.systemGateway.updateSystemConfiguration(
      ConfigurationKey.MAIL_SMTP_SETTINGS,
      smtpSettings
    );
  }
}
