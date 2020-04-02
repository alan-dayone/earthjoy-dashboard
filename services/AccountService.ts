import {ServiceContext} from './index';
import {AccountGateway} from '../gateways/AccountGateway';
import {Account} from '../models/Account';

export class AccountService {
  protected accountGateway: AccountGateway;

  constructor(options: ServiceContext) {
    this.accountGateway = options.accountGateway;
  }

  public async findAccountsForAdmin({pageIndex, pageSize, filters, orders}): Promise<{data: Array<Account>; count: number}> {
    const orderArray = await orders.map((value) => {
      return `${value.id} ${value.desc ? 'desc' : 'asc'}`;
    });
    const [data, count] = await Promise.all([
      this.accountGateway.find({pageIndex, pageSize, filters, orders: orderArray}),
      this.accountGateway.count({where: filters}),
    ]);
    return {
      data,
      count,
    };
  }

  public async createAccount(account: Account): Promise<Account> {
    return this.accountGateway.create(account);
  }

  public async updateAccount(id: string, account: Account): Promise<void> {
    return this.accountGateway.update(id, account);
  }

  public async findOneForAdmin(id: string): Promise<Account | null> {
    return this.accountGateway.findOne(id);
  }
}
