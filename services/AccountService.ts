import {ServiceContext} from './index';
import {AccountGateway} from '../gateways/AccountGateway';

export class AccountService {
  protected accountGateway: AccountGateway;

  constructor(options: ServiceContext) {
    this.accountGateway = options.accountGateway;
  }

  public async findAccountsForAdmin(page: number, pageSize = 10) {
    return this.accountGateway.find(page, pageSize);
  }
}
