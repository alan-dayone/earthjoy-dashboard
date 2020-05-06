import React, {ReactNode} from 'react';
import {NextPage} from 'next';
import Router from 'next/router';
import classnames from 'classnames';
import {selectors} from '../redux/slices/loginUserSlice';
import {isAdmin} from '../models/Account';
import {CustomNextPageContext} from './types';

interface GuestWrapperProps {
  pageProps?: object;
}

export const guestOnly = (
  Content,
  options?: {useAdminLayout: boolean},
): ReactNode => {
  const GuestWrapper: NextPage<GuestWrapperProps> = ({
    pageProps,
  }: GuestWrapperProps) => {
    const useAdminLayout = options?.useAdminLayout;

    return (
      <div
        className={classnames('app-layout', {
          'app-layout--admin': useAdminLayout,
          'app-layout--user': !useAdminLayout,
        })}>
        <Content {...pageProps} />
      </div>
    );
  };

  GuestWrapper.getInitialProps = async (
    ctx: CustomNextPageContext,
  ): Promise<GuestWrapperProps> => {
    const {req, res, store} = ctx;
    const isServer = !!req;
    const user = selectors.selectLoginUser(store.getState());

    if (user) {
      if (isServer) {
        res.writeHead(302, {Location: isAdmin(user) ? '/admin' : '/'});
        res.end();
        return;
      } else {
        Router.replace(isAdmin(user) ? '/admin' : '/');
        return;
      }
    }

    const pageProps = Content.getInitialProps
      ? await Content.getInitialProps(ctx)
      : undefined;

    return {pageProps};
  };

  return GuestWrapper;
};
