import {IncomingMessage} from 'http';
import * as cookie from 'cookie';

export const getCookieFromRequest = (
  cookieName: string,
  req: IncomingMessage,
): string | null => {
  return cookie.parse(req.headers.cookie as string)[cookieName] || null;
};
