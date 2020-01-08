import { ConfigurationKey } from '../domain/models/Configuration';

export class SystemGateway {
  /* tslint:disable:no-any */
  restConnector: any;

  constructor({ restConnector }) {
    this.restConnector = restConnector;
  }

  async initSystem(body: {
    password: string;
    admin: {
      email: string;
      password: string;
    };
  }): Promise<boolean> {
    const { data } = await this.restConnector.post(
      `/configurations/initialize-system`,
      body
    );
    return data.success;
  }

  async validateSystemInitializationPassword(
    password: string
  ): Promise<boolean> {
    const { data } = await this.restConnector.post(
      '/configurations/validate-system-initialization-password',
      { password }
    );
    return data.isValid;
  }

  async updateSystemConfiguration(id: ConfigurationKey, data: any) {
    const resp = await this.restConnector.put(`/configurations/${id}`, {
      id,
      data,
    });

    return resp.data;
  }

  async getConfiguration(id: ConfigurationKey): Promise<any> {
    try {
      const resp = await this.restConnector.get(`/configurations/${id}`);
      return resp.data;
    } catch (e) {
      // If data is not exist, return null rather than throwing error.
      if (e.response.status === 404) {
        return null;
      }

      throw e;
    }
  }
}
