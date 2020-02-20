import {RestConnector} from '../connectors/RestConnector';

export class AccountGateway {
  private restConnector: RestConnector;

  constructor(connector: {restConnector: RestConnector}) {
    this.restConnector = connector.restConnector;
  }

  public async find(page: number, pageSize = 10) {
    const {data} = await this.restConnector.get('/accounts');
    return data;
  }
}
