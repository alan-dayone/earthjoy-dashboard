import getConfig from 'next/config';
import {AuthService} from './AuthService';
import {SystemService} from './SystemService';
import {AuthGateway} from '../gateways/AuthGateway';
import {PubsubGateway} from '../gateways/PubsubGateway';
import {SystemGateway} from '../gateways/SystemGateway';
import {create as createRestConnector} from '../connectors/RestConnector';
import {create as createPubsubConnector} from '../connectors/PubsubConnector';

const {publicRuntimeConfig} = getConfig();

const API_BASE_URL = `${publicRuntimeConfig.BASE_URL}/api`;
const restConnector = createRestConnector({baseUrl: API_BASE_URL});
const pubsubConnector = createPubsubConnector();

const authGateway = new AuthGateway({restConnector});
const pubsubGateway = new PubsubGateway({pubsubConnector});
const systemGateway = new SystemGateway({restConnector});

interface ServiceContext {
  authGateway: AuthGateway;
  pubsubGateway: PubsubGateway;
  systemGateway: SystemGateway;
}

const injectServiceContext: ServiceContext = {
  authGateway,
  pubsubGateway,
  systemGateway,
};

export {ServiceContext};
export const authService = new AuthService(injectServiceContext);
export const systemService = new SystemService(injectServiceContext);
