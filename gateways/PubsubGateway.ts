export interface PubsubConnector {
  emit(eventName: string, data: any): any;
  on(eventName: string, data: any): any;
}

export type SubscribingHandler = (...args: any[]) => void;

export class PubsubGateway {
  protected pubsubConnector: any;

  constructor({pubsubConnector}: {pubsubConnector: PubsubConnector}) {
    this.pubsubConnector = pubsubConnector;
  }

  public emit(eventName: string, data: any) {
    this.pubsubConnector.emit(eventName, data);
  }

  public subscribe(eventName: string, handler: SubscribingHandler) {
    this.pubsubConnector.on(eventName, handler);
  }
}
