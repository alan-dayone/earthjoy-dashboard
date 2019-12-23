import { ConfigurationKey } from '../domain/models/Configuration';

export class SystemGateway {
  /* tslint:disable:no-any */
  restConnector: any;

  constructor({ restConnector }) {
    this.restConnector = restConnector;
  }

  initSystem = async (body: {
    password: string;
    admin: {
      email: string;
      password: string;
    };
  }) => {
    const { data } = this.restConnector.post(
      `/configurations/initialize-system`,
      body
    );
    return data;
  };

  async validateSystemInitializationPassword(
    password: string
  ): Promise<boolean> {
    // const {data} = await this.restConnector.post(
    //   '/system/validate-initialization-password',
    //   {password},
    // );
    // return data.isValid;

    // TODO: For mocking purpose.
    return true;
  }

  async updateSystemConfiguration(id: ConfigurationKey, data: any) {
    const resp = await this.restConnector.put(`/configurations/${id}`, {
      id,
      data,
    });

    return resp.data;
  }
}
