import {ServiceContext} from './index';
import {AccountGateway} from '../gateways/AccountGateway';
import {Account} from '../models/Account';

export class AccountService {
  protected accountGateway: AccountGateway;

  constructor(options: ServiceContext) {
    this.accountGateway = options.accountGateway;
  }

  public async findAccountsForAdmin({
    pageIndex,
    pageSize,
    filters,
    orders,
  }): Promise<{data: Array<Account>; count: number}> {
    const [data, count] = await Promise.all([
      this.accountGateway.find({
        pageIndex,
        pageSize,
        filters,
        orders,
      }),
      this.accountGateway.count({where: filters}),
    ]);
    return {
      data,
      count,
    };
  }

  public async countAccount(filters = {}): Promise<number> {
    return this.accountGateway.count({where: filters});
  }

  public async createAccount(account: Account): Promise<Account> {
    return this.accountGateway.create(account);
  }

  public async updateAccount(id: string, account: Account): Promise<Account> {
    return this.accountGateway.update(id, account);
  }

  public async findOneForAdmin(id: string): Promise<Account | null> {
    return this.accountGateway.findOne(id);
  }

  public async changePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    await this.accountGateway.changePassword(oldPassword, newPassword);
  }
}
