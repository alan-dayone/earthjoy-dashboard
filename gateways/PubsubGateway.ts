export class PubsubGateway {
  /* tslint:disable:no-any */
  pubsubConnector: any;

  constructor({pubsubConnector}) {
    this.pubsubConnector = pubsubConnector;
  }

  emit(eventName, data) {
    this.pubsubConnector.emit(eventName, data);
  }

  subscribe(eventName, handler) {
    this.pubsubConnector.on(eventName, handler);
  }
}
