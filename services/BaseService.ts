import {ServiceContext} from './';
import {AuthGateway} from '../gateways/AuthGateway';
import {PubsubGateway} from '../gateways/PubsubGateway';
import {SystemGateway} from '../gateways/SystemGateway';

export class BaseService {
  pubsubGateway: PubsubGateway;
  authGateway: AuthGateway;
  systemGateway: SystemGateway;

  constructor(options: ServiceContext) {
    this.pubsubGateway = options.pubsubGateway;
    this.authGateway = options.authGateway;
    this.systemGateway = options.systemGateway;
  }

  emit(eventType: string, data?: object) {
    this.pubsubGateway.emit(eventType, data);
  }

  subscribe(eventType: string, handler: object) {
    this.pubsubGateway.subscribe(eventType, handler);
  }
}
