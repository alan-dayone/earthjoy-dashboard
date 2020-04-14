import React from 'react';
import {NextComponentType} from 'next';
import Router from 'next/router';
import classnames from 'classnames';
import {selectors} from '../redux/slices/loginUserSlice';
import {isAdmin} from '../models/Account';
import {CustomNextPageContext} from './types';

export const guestOnly = (
  Content,
  options?: {useAdminLayout: boolean},
): NextComponentType => {
  return class GuestWrapper extends React.Component {
    public static async getInitialProps(
      ctx: CustomNextPageContext,
    ): Promise<object> {
      const {req, res, store} = ctx;
      const isServer = !!req;
      const user = selectors.selectLoginUser(store.getState());

      if (user) {
        if (isServer) {
          res.writeHead(301, {location: isAdmin(user) ? '/admin' : '/'});
          res.end();
          return;
        } else {
          Router.replace(isAdmin(user) ? '/admin' : '/');
          return;
        }
      }

      return Content.getInitialProps ? Content.getInitialProps(ctx) : {};
    }

    public render(): JSX.Element {
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
