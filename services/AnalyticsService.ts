import {AnalyticsGateway} from '../gateways/AnalyticsGateway';
import {AnalyticsResponse} from '../models/Analytics';

export class AnalyticsService {
  private analyticsGateWay: AnalyticsGateway;

  constructor(options: {analyticsGateWay: AnalyticsGateway}) {
    this.analyticsGateWay = options.analyticsGateWay;
  }

  public async getAnalyticsPaidUser(
    fromDate: string,
    toDate: string,
  ): Promise<AnalyticsResponse> {
    return this.analyticsGateWay.getAnalyticsPaidUser(fromDate, toDate);
  }

  public async getAnalyticsNewUser(
    fromDate: string,
    toDate: string,
  ): Promise<AnalyticsResponse> {
    return this.analyticsGateWay.getAnalyticsNewUser(fromDate, toDate);
  }
}
