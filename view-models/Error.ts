import {getErrorCode} from '../errors/ServerError';

export const getErrorMessageCode = (error, messageMap?: object): string => {
  const errorCode = getErrorCode(error);

  if (messageMap && messageMap[errorCode]) {
    return `error.${messageMap[errorCode]}`;
  }

  return errorCode && /^\w+$/.test(errorCode)
    ? `error.${errorCode}`
    : error.message;
};
