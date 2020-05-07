import {IncomingMessage} from 'http';
import * as cookie from 'cookie';

export const getCookieFromRequest = (
  cookieName: string,
  req: IncomingMessage,
): string | null => {
  const cookieStr = req.headers.cookie as string;
  if (!cookieStr) {
    return null;
  }

  return cookie.parse(cookieStr)[cookieName] || null;
};

export const getBooleanCookieFromRequest = (
  cookieName: string,
  req: IncomingMessage,
  defaultValue?: boolean,
): boolean => {
  return getCookieFromRequest(cookieName, req) === 'true' || defaultValue;
};
