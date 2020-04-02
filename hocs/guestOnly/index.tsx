import React from 'react';
import {connect, ConnectedComponent} from 'react-redux';
import {AnyAction, compose} from 'redux';
import {NextComponentType, NextPageContext} from 'next';
import Router from 'next/router';

import {getLoginUser, selectors} from '../../redux/slices/loginUserSlice';
import {authService} from '../../services';
import {adminLayoutWrapper} from './AdminLayoutWrapper';

export const guestOnly = (
  Content: NextComponentType,
  options?: {useAdminLayout: boolean},
): NextComponentType => {
  return class GuestWrapper extends React.Component<any, any> {
    public static async getInitialProps(context: NextPageContext) {
      if (context.isServer) {
        // const dispatch = context.store?.dispatch;
        // const user = await dispatch(getLoginUser());
        //   if (user) {
        //     context.res?.redirect('/');
        //     context.res?.end();
        //     return {};
        //   }
        // } else {
        //   const user = selectors.getLoginUser(context.store?.getState());
        //
        //   if (user) {
        //     Router.replace('/');
        //     return {};
        //   }
      }

      return Content.getInitialProps ? Content.getInitialProps(context) : {};
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
