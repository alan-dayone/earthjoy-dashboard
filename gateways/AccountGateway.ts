import {RestConnector} from '../connectors/RestConnector';

export class AccountGateway {
  private restConnector: RestConnector;

  constructor(connector: {restConnector: RestConnector}) {
    this.restConnector = connector.restConnector;
  }

  public async find({pageIndex, pageSize, filters}) {
    const filter = {
      offset: pageIndex * pageSize,
      limit: pageSize,
      skip: pageIndex * pageSize,
      where: filters,
    };
    const {data} = await this.restConnector.get(`/accounts?filter=${JSON.stringify(filter)}`);
    return data;
  }
}
