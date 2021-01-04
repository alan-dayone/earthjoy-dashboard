import Cookies from 'js-cookie';
import {AxiosInstance} from 'axios';
import {AnalyticsResponse} from '../models/Analytics';

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

  public async getAnalyticsPaidUser(
    fromDate: string,
    toDate: string,
  ): Promise<AnalyticsResponse> {
    const {data} = await this.restConnector.get(
      `/user/analytics/paid-user?fromDate=${fromDate}&toDate=${toDate}`,
    );
    return data;
  }
  public async getAnalyticsNewUser(
    fromDate: string,
    toDate: string,
  ): Promise<AnalyticsResponse> {
    const {data} = await this.restConnector.get(
      `/user/analytics/new-user?fromDate=${fromDate}&toDate=${toDate}`,
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
