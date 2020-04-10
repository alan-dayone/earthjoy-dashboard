/* tslint:disable:no-default-export */
import React from 'react';
import {compose} from 'redux';
import {Provider} from 'react-redux';
import App from 'next/app';
import withRedux, {ReduxWrapperAppProps} from 'next-redux-wrapper';
import {AppContext} from 'next/app';
import {nprogress} from '../hocs';
import {CustomNextPageContext} from '../hocs/types';
import {makeStore} from '../redux/store';
import {RootState} from '../redux/slices';
import {authService} from '../services';
import {getCookieFromRequest} from '../utils/cookie';
import {getLoginUser} from '../redux/slices/loginUserSlice';
import {ACCESS_TOKEN_COOKIE} from '../gateways/AuthGateway';
import '../scss/index.scss';

interface CustomNextAppContext extends AppContext {
  ctx: CustomNextPageContext;
}

class ComposedApp extends App<ReduxWrapperAppProps<RootState>> {
  public static async getInitialProps(context: CustomNextAppContext) {
    const {Component, ctx} = context;
    const isServer = !!ctx.req;

    if (isServer) {
      const jwt = getCookieFromRequest(ACCESS_TOKEN_COOKIE, ctx.req);
      if (jwt) {
        authService.setAccessToken(jwt);
        await ctx.store.dispatch(getLoginUser());
      }
    }

    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};
    return {pageProps};
  }

  public render() {
    const {Component, pageProps, store} = this.props;
    return (
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    );
  }
}

export default compose(
  nprogress(300, {showSpinner: true}),
  withRedux(makeStore),
)(ComposedApp);
