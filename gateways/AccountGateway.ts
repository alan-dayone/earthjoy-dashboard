import {AxiosInstance} from 'axios';
import {Account, AccountAnalyticsInfo} from '../models/Account';
import qs from 'qs';

export class AccountGateway {
  private restConnector: AxiosInstance;

  constructor(options: {restConnector: AxiosInstance}) {
    this.restConnector = options.restConnector;
  }

  public async create(account: Account): Promise<Account> {
    const {data} = await this.restConnector.post('/accounts', account);
    return data;
  }

  public async deleteAccount(id: string): Promise<void> {
    await this.restConnector.post('/admin/delete-user', {
      id,
    });
  }

  public async find({
    pageIndex,
    pageSize,
    filters,
    orders,
  }): Promise<Array<Account>> {
    const filter = {
      offset: pageIndex * pageSize,
      limit: pageSize,
      skip: pageIndex * pageSize,
      where: filters,
      order: orders.length >= 1 ? orders : undefined,
    };
    const {data} = await this.restConnector.get(
      `/accounts?filter=${JSON.stringify(filter)}`,
    );
    return data;
  }

  public async count({where = {}}): Promise<number> {
    const {data} = await this.restConnector.get(
      `/accounts/count?where=${JSON.stringify(where)}`,
    );
    return data.count;
  }

  public async update(id: string, values: Partial<Account>): Promise<void> {
    const {data} = await this.restConnector.patch(`accounts/${id}`, values);
    return data;
  }

  public async findOne(id: string): Promise<Account> {
    const {data} = await this.restConnector.get(`/accounts/${id}`);
    return data;
  }
}
