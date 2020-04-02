import getConfig from 'next/config';
import axios, {AxiosInstance} from 'axios';
import {AuthService} from './AuthService';
import {SystemService} from './SystemService';
import {AuthGateway} from '../gateways/AuthGateway';
import {SystemGateway} from '../gateways/SystemGateway';
import {AccountGateway} from '../gateways/AccountGateway';
import {AccountService} from './AccountService';

const {publicRuntimeConfig} = getConfig();

const API_BASE_URL = `${publicRuntimeConfig.BASE_URL}/api`;
const restConnector = axios.create({baseURL: API_BASE_URL});

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
