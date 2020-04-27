import React, {ReactNode} from 'react';
import {NextComponentType} from 'next';
import Router from 'next/router';
import {CustomNextPageContext} from './types';
import {isAdmin} from '../models/Account';
import {selectors} from '../redux/slices/loginUserSlice';
import {getBooleanCookieFromRequest} from '../utils/cookie';
import {LoggedInAdminLayout} from '../containers/admin/LoggedInAdminLayout';
import {withI18next} from './withI18next';

const SHOW_SIDEBAR_COOKIE = 'showSidebar';

interface AdminWrapperServerProps {
  showSidebar: boolean;
  pageProps?: object;
}

export const adminOnly = (Content: NextComponentType): ReactNode => {
  const AdminWrapper: NextComponentType<
    CustomNextPageContext,
    AdminWrapperServerProps,
    AdminWrapperServerProps
  > = (props: AdminWrapperServerProps): JSX.Element => {
    return (
      <LoggedInAdminLayout showSidebar={props.showSidebar}>
        <Content {...props.pageProps} />
      </LoggedInAdminLayout>
    );
  };

  AdminWrapper.getInitialProps = async (
    ctx,
  ): Promise<AdminWrapperServerProps> => {
    const {req, res, store} = ctx;
    const isServer = !!req;
    const loginUser = selectors.selectLoginUser(store.getState());
    let showSidebar = true;

    if (isServer) {
      showSidebar = getBooleanCookieFromRequest(SHOW_SIDEBAR_COOKIE, req);

      if (!loginUser) {
        res.writeHead(302, {Location: '/admin/login'});
        res.end();
        return;
      } else if (!isAdmin(loginUser)) {
        res.writeHead(302, {Location: '/'});
        res.end();
        return;
      }
    } else {
      if (!loginUser) {
        Router.replace('/admin/login');
        return;
      } else if (!isAdmin(loginUser)) {
        Router.replace('/');
        return;
      }
    }

    return {
      showSidebar,
      pageProps: Content.getInitialProps
        ? await Content.getInitialProps(ctx)
        : undefined,
    };
  };

  return withI18next(AdminWrapper);
};
