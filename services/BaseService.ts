import {ServiceContext} from './';
import {AuthGateway} from '../gateways/AuthGateway';
import {PubsubGateway} from '../gateways/PubsubGateway';
import {SystemGateway} from '../gateways/SystemGateway';

export class BaseService {
  protected pubsubGateway: PubsubGateway;
  protected authGateway: AuthGateway;
  protected systemGateway: SystemGateway;

  constructor(options: ServiceContext) {
    this.pubsubGateway = options.pubsubGateway;
    this.authGateway = options.authGateway;
    this.systemGateway = options.systemGateway;
  }

  public emit(eventType: string, data?: object) {
    this.pubsubGateway.emit(eventType, data);
  }

  public subscribe(eventType: string, handler: (...args: any[]) => void) {
    this.pubsubGateway.subscribe(eventType, handler);
  }
}
