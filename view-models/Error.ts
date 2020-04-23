import {getErrorCode} from '../errors/ServerError';

export const getErrorMessageCode = (error, messageMap?: object): string => {
  const errorCode = getErrorCode(error);

  if (messageMap[errorCode]) {
    return `error.${messageMap[errorCode]}`;
  }

  return error.message;
};
