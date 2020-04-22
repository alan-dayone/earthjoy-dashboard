import axios from 'axios';
import getConfig from 'next/config';
import {AuthService} from './AuthService';
import {SystemService} from './SystemService';
import {AuthGateway} from '../gateways/AuthGateway';
import {SystemGateway} from '../gateways/SystemGateway';
import {AccountGateway} from '../gateways/AccountGateway';
import {AccountService} from './AccountService';

const restConnector = axios.create({
  baseURL: getConfig().publicRuntimeConfig.BASE_API_URL,
});

const authGateway = new AuthGateway({restConnector});
const accountGateway = new AccountGateway({restConnector});
const systemGateway = new SystemGateway({restConnector});

export interface ServiceContext {
  authGateway: AuthGateway;
  accountGateway: AccountGateway;
  systemGateway: SystemGateway;
}

const injectServiceContext: ServiceContext = {
  authGateway,
  accountGateway,
  systemGateway,
};

export const authService = new AuthService(injectServiceContext);
export const systemService = new SystemService(injectServiceContext);
export const accountService = new AccountService(injectServiceContext);
