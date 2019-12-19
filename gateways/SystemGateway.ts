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
}
