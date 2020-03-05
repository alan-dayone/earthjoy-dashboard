import {ServiceContext} from './index';
import {AccountGateway} from '../gateways/AccountGateway';
import {Account, constraint} from '../models/User';

export class AccountService {
  protected accountGateway: AccountGateway;

  constructor(options: ServiceContext) {
    this.accountGateway = options.accountGateway;
  }

  public async findAccountsForAdmin({pageIndex, pageSize, filters}) {
    return this.accountGateway.find({pageIndex, pageSize, filters});
  }

  public async createAccount(account: Account) {
    return this.accountGateway.create(account);
  }

  public async updateAccount(id: string, account: Account) {
    return this.accountGateway.update(id, account);
  }

  public async findOneForAdmin(id: string) {
    return this.accountGateway.findOne(id);
  }
}
