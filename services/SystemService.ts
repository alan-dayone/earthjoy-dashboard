import {SystemGateway, ConfigurationData} from '../gateways/SystemGateway';
import {ServiceContext} from './index';
import {ConfigurationKey} from '../models/Configuration';

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

  public async getConfiguration<T extends ConfigurationData>(
    configurationKey: ConfigurationKey,
  ): Promise<T | null> {
    const config = await this.systemGateway.getConfiguration(configurationKey);
    return (config?.data as T) || null;
  }

  public async saveConfiguration<T extends ConfigurationData>(
    configurationKey: ConfigurationKey,
    newConfig: T,
  ): Promise<void> {
    console.log(typeof newConfig);

    await this.systemGateway.updateSystemConfiguration(
      configurationKey,
      newConfig,
    );
  }
}
