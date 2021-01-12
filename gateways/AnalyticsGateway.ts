import Cookies from 'js-cookie';
import {AxiosInstance} from 'axios';
import qs from 'qs';
import {AnalyticsResponse} from '../models/Analytics';
import {Account, AccountFilterPayload} from '../models/Account';

const AUTHORIZATION_HEADER = 'Authorization';

export const ACCESS_TOKEN_COOKIE = 'jwt';

export class AnalyticsGateway {
  private restConnector: AxiosInstance;
  private jwt: string | null;

  constructor(options: {restConnector: AxiosInstance}) {
    this.jwt = null;
    this.restConnector = options.restConnector;
    this.loadAccessToken();
  }

  public async getTotalUsers(): Promise<AnalyticsResponse> {
    const {data} = await this.restConnector.get(`/user/analytics/total-users`);
    return data;
  }

  public async getTotalPaidUsers(): Promise<AnalyticsResponse> {
    const {data} = await this.restConnector.get(
      `/user/analytics/total-paid-users`,
    );
    return data;
  }

  public async getAnalyticsPaidUser(
    fromDate: string,
    toDate: string,
  ): Promise<AnalyticsResponse> {
    const {data} = await this.restConnector.get(
      `/user/analytics/paid-users?fromDate=${fromDate}&toDate=${toDate}`,
    );
    return data;
  }

  public async getAnalyticsAccounts(
    payload: AccountFilterPayload,
  ): Promise<Account[]> {
    const {data} = await this.restConnector.get(
      `/user/analytics/accounts?${qs.stringify(payload)}`,
    );
    return data;
  }

  public async getAnalyticsNewUser(
    fromDate: string,
    toDate: string,
  ): Promise<AnalyticsResponse> {
    const {data} = await this.restConnector.get(
      `/user/analytics/new-users?fromDate=${fromDate}&toDate=${toDate}`,
    );
    return data;
  }

  private loadAccessToken(): void {
    // On browser, load access token from cookie storage.
    const accessToken = Cookies.get(ACCESS_TOKEN_COOKIE);
    this.jwt = accessToken;
    this.restConnector.defaults.headers[
      AUTHORIZATION_HEADER
    ] = `Bearer ${accessToken}`;
  }
}
