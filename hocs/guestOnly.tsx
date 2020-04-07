import React from 'react';
import {NextComponentType} from 'next';
import Router from 'next/router';
import classnames from 'classnames';
import * as cookie from 'cookie';
import {getLoginUser, selectors} from '../redux/slices/loginUserSlice';
import {authService} from '../services';
import {isAdmin} from '../models/Account';
import {CustomNextPageContext} from './types';

export const guestOnly = (
  Content: NextComponentType,
  options?: {useAdminLayout: boolean},
): NextComponentType => {
  return class GuestWrapper extends React.Component<any, any> {
    public static async getInitialProps(ctx: CustomNextPageContext) {
      const {req, res, store} = ctx;
      const isServer = !!req;

      if (isServer) {
        authService.setAccessToken(
          cookie.parse(req.headers.cookie as string).jwt,
        );
        const user = await store.dispatch(getLoginUser());

        if (user) {
          res.writeHead(301, {location: isAdmin(user) ? '/admin' : '/'});
          res.end();
          return;
        }
      } else {
        const user = selectors.selectLoginUser(store.getState());

        if (user) {
          Router.replace(isAdmin(user) ? '/admin' : '/');
          return;
        }
      }

      return Content.getInitialProps ? Content.getInitialProps(ctx) : {};
    }

    public render() {
      const useAdminLayout = options?.useAdminLayout;
      return (
        <div
          className={classnames('app-layout', {
            'app-layout--admin': useAdminLayout,
            'app-layout--user': !useAdminLayout,
          })}>
          <Content {...this.props} />
        </div>
      );
    }
  };
};
