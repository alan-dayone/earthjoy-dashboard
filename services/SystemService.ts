import {BaseService} from './BaseService';
import {ConfigurationModel, SystemGateway} from '../gateways/SystemGateway';
import {ConfigurationKey, MailSmtpSettings} from '../domain/models/Configuration';
import {ServiceContext} from './index';

export class SystemService extends BaseService {
  protected systemGateway: SystemGateway;

  constructor(options: ServiceContext) {
    super(options);
    this.systemGateway = options.systemGateway;
  }

  public async validateSystemInitializationPassword(password: string): Promise<boolean> {
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

  public async saveSmtpSettings(smtpSettings: MailSmtpSettings): Promise<void> {
    await this.systemGateway.updateSystemConfiguration(ConfigurationKey.MAIL_SMTP_SETTINGS, smtpSettings);
  }

  public async getSmtpSettings(): Promise<ConfigurationModel | null> {
    const smtpConfig = await this.systemGateway.getConfiguration(ConfigurationKey.MAIL_SMTP_SETTINGS);
    return smtpConfig?.data;
  }
}
