import {BaseService} from './BaseService';
import {ServiceContext} from "./index";
import {AccountGateway} from "../gateways/AccountGateway";

export class AccountService extends BaseService {
  protected accountGateway: AccountGateway;

  constructor(options: ServiceContext) {
    super(options);
    this.accountGateway = options.accountGateway;
  }

  async findAccountsForAdmin (page: number, pageSize: number = 10) {
    return this.accountGateway.find(page, pageSize) ;
  }
}
