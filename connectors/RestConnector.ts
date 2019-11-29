import axios from 'axios';
import Cookies from 'js-cookie';
import { ApplicationError } from '../errors/ApplicationError';
import { AxiosInstance } from 'axios';

export interface RestConnector extends AxiosInstance {
  setAccessToken(token: string): void;
  removeAccessToken(): void;
}

export function create({ baseUrl }: { baseUrl: string }): RestConnector {
  const instance = axios.create({ baseURL: baseUrl });

  instance.interceptors.response.use(
    response => {
      return response;
    },
    err => {
      if (err.message === 'Network Error') {
        err.code = ApplicationError.name;
        err.message = 'errNetwork';
      }
      return Promise.reject(err);
    }
  );

  /**
   * On browser, restConnector (axios) doesn't need to care about access_token anymore as we hacked around to let server set
   * access_token to browser on successful login.
   * @param token
   */
  Object.assign(instance, {
    setAccessToken: (token: string) => {
      if (token) {
        Cookies.set('access_token', token);
        instance.defaults.headers['Authorization'] = `Bearer ${token}`;
      }
    },
    removeAccessToken: () => {
      Cookies.remove('access_token');
      delete instance.defaults.headers.Authorization;
    },
  });

  return instance;
}
