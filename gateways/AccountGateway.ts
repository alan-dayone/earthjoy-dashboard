import {RestConnector} from '../connectors/RestConnector';
import {Account} from '../models/User';

export class AccountGateway {
  private restConnector: RestConnector;

  constructor(connector: {restConnector: RestConnector}) {
    this.restConnector = connector.restConnector;
  }

  public async create(account: Account) {
    const {data} = await this.restConnector.post('/accounts', account);
    return data;
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

  public async update(id: string, account: Account) {
    await console.log(id);
    const {data} = await this.restConnector.put(`accounts/${id}`, account);
    return data;
  }

  public async findOne(id: string) {
    const {data} = await this.restConnector.get(`/accounts/${id}`);
    return data;
  }
}
