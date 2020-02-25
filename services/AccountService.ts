import {ServiceContext} from './index';
import {AccountGateway} from '../gateways/AccountGateway';

export class AccountService {
  protected accountGateway: AccountGateway;

  constructor(options: ServiceContext) {
    this.accountGateway = options.accountGateway;
  }

  public async findAccountsForAdmin({pageIndex, pageSize, filters}) {
    return this.accountGateway.find({pageIndex, pageSize, filters});
  }
}
