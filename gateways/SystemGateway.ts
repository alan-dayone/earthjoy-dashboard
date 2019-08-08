export class SystemGateway {
  /* tslint:disable:no-any */
  restConnector: any;

  constructor({ restConnector }) {
    this.restConnector = restConnector;
  }

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
