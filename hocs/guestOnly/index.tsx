import React from 'react';
import {NextComponentType} from 'next';
import Router from 'next/router';
import {getLoginUser, selectors} from '../../redux/slices/loginUserSlice';
import {authService} from '../../services';
import {adminLayoutWrapper} from './AdminLayoutWrapper';
import {isAdmin} from '../../models/Account';
import {CustomNextPageContext} from '../types';

export const guestOnly = (
  Content: NextComponentType,
  options?: {useAdminLayout: boolean},
): NextComponentType => {
  return class GuestWrapper extends React.Component<any, any> {
    public static async getInitialProps(ctx: CustomNextPageContext) {
      const {req, res, store} = ctx;
      const isServer = !!req;

      if (isServer) {
        authService.setAccessToken(req?.cookies?.jwt);
        const user = await store.dispatch(getLoginUser());

        if (user) {
          res.redirect(isAdmin(user) ? '/admin' : '/');
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
      if (options && options.useAdminLayout) {
        return this._renderContentInsideAdminLayout();
      }

      return <Content {...this.props} />;
    }

    private _renderContentInsideAdminLayout = () => {
      return adminLayoutWrapper({children: <Content {...this.props} />});
    };
  };
};
