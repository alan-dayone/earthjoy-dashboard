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

export const authService = new AuthService({authGateway});
export const systemService = new SystemService({systemGateway});
export const accountService = new AccountService({accountGateway});
