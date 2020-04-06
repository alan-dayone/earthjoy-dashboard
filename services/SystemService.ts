import {ConfigurationData, SystemGateway} from '../gateways/SystemGateway';
import {ConfigurationKey, MailSmtpSettings} from '../models/Configuration';
import {ServiceContext} from './index';

export class SystemService {
  private systemGateway: SystemGateway;

  constructor(options: ServiceContext) {
    this.systemGateway = options.systemGateway;
  }

  public async validateSystemInitializationPassword(
    password: string,
  ): Promise<boolean> {
    return this.systemGateway.validateSystemInitializationPassword(password);
  }

  public async initSystem(body: {
    password: string;
    admin: {
      email: string;
      password: string;
    };
  }): Promise<void> {
    await this.systemGateway.initSystem(body);
  }

  public async testSmtpConnection(values): Promise<boolean> {
    return this.systemGateway.isValidSmtpSettings(values);
  }

  public async saveSmtpSettings(smtpSettings: MailSmtpSettings): Promise<void> {
    await this.systemGateway.updateSystemConfiguration(
      ConfigurationKey.MAIL_SMTP_SETTINGS,
      smtpSettings,
    );
  }

  public async getSmtpSettings(): Promise<ConfigurationData | null> {
    const smtpConfig = await this.systemGateway.getConfiguration(
      ConfigurationKey.MAIL_SMTP_SETTINGS,
    );
    return smtpConfig?.data || null;
  }
}
