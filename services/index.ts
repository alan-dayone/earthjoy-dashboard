import getConfig from 'next/config';
import { AuthService } from './AuthService';
import { AuthGateway } from '../gateways/AuthGateway';
import { PubsubGateway } from '../gateways/PubsubGateway';
import { create as createRestConnector } from '../connectors/RestConnector';
import { create as createPubsubConnector } from '../connectors/PubsubConnector';

const { publicRuntimeConfig } = getConfig();

const API_BASE_URL = `${publicRuntimeConfig.BASE_URL}/api`;
const restConnector = createRestConnector({ baseUrl: API_BASE_URL });
const pubsubConnector = createPubsubConnector();

const authGateway = new AuthGateway({ restConnector });
const pubsubGateway = new PubsubGateway({ pubsubConnector });

export const authService = new AuthService({
  pubsubGateway,
  authGateway,
});
