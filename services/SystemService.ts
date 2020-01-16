import { BaseService } from './BaseService';
import { SystemGateway } from '../gateways/SystemGateway';
import {
  ConfigurationKey,
  MailSmtpSettings,
} from '../domain/models/Configuration';
import { ServiceContext } from './index';

export class SystemService extends BaseService {
  /* tslint:disable:no-any */
  systemGateway: SystemGateway;

  constructor(options: ServiceContext) {
    super(options);
    this.systemGateway = options.systemGateway;
  }

  async validateSystemInitializationPassword(
    password: string
  ): Promise<boolean> {
    return this.systemGateway.validateSystemInitializationPassword(password);
  }

  async initSystem(body: {
    password: string;
    admin: {
      email: string;
      password: string;
    };
  }): Promise<void> {
    await this.systemGateway.initSystem(body);
  }

  async saveSmtpSettings(smtpSettings: MailSmtpSettings): Promise<void> {
    await this.systemGateway.updateSystemConfiguration(
      ConfigurationKey.MAIL_SMTP_SETTINGS,
      smtpSettings
    );
  }

  async getSmtpSettings(): Promise<any> {
    const smtpConfig = await this.systemGateway.getConfiguration(
      ConfigurationKey.MAIL_SMTP_SETTINGS
    );
    return smtpConfig && smtpConfig.data;
  }
}
