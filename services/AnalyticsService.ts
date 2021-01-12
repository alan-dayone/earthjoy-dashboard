import {AnalyticsGateway} from '../gateways/AnalyticsGateway';
import {AnalyticsResponse} from '../models/Analytics';
import {AccountAnalyticsInfo, AccountFilterPayload} from '../models/Account';

export class AnalyticsService {
  private analyticsGateWay: AnalyticsGateway;

  constructor(options: {analyticsGateWay: AnalyticsGateway}) {
    this.analyticsGateWay = options.analyticsGateWay;
  }

  public async getTotalUsers(): Promise<AnalyticsResponse> {
    return this.analyticsGateWay.getTotalUsers();
  }

  public async getTotalPaidUsers(): Promise<AnalyticsResponse> {
    return this.analyticsGateWay.getTotalPaidUsers();
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

  public async getAnalyticAccountInfo(
    payload: AccountFilterPayload,
  ): Promise<AccountAnalyticsInfo[]> {
    return this.analyticsGateWay.getAnalyticAccountInfo(payload);
  }
}
