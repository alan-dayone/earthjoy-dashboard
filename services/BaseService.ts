export class BaseService {
  /* tslint:disable:no-any */
  pubsubGateway: any;

  constructor({ pubsubGateway }) {
    this.pubsubGateway = pubsubGateway;
  }

  emit(eventType, data) {
    this.pubsubGateway.emit(eventType, data);
  }

  subscribe(eventType, handler) {
    this.pubsubGateway.subscribe(eventType, handler);
  }
}
