import {AxiosError} from 'axios';

export const getErrorCode = (error: AxiosError): string | null => {
  const message = error.response?.data?.error?.message;

  if (/^\w+$/.test(message)) {
    return message;
  }

  if (error.response?.data?.error?.code) {
    return error.response?.data?.error?.code;
  }

  if (error.message === 'Network Error') {
    return 'networkError';
  }

  return error.message;
};
