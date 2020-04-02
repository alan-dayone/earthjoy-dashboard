/* tslint:disable:no-default-export */
import React from 'react';
import {compose} from 'redux';
import {Provider} from 'react-redux';
import * as cookie from 'cookie';
import App from 'next/app';
import withRedux, {ReduxWrapperAppProps} from 'next-redux-wrapper';
import {AppContext} from 'next/dist/pages/_app';
import {nprogress} from '../hocs';
import {makeStore} from '../redux/store';
import {authService} from '../services';
import {RootState} from '../redux/slices';

class ComposedApp extends App<ReduxWrapperAppProps<RootState>> {
  public static async getInitialProps(context: AppContext) {
    const {Component, ctx} = context;

    if (ctx.req?.headers.cookie) {
      const cookies = cookie.parse(ctx.req.headers.cookie);
      authService.setAccessToken(cookies.jwt);
    }

    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
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

export default compose(nprogress(300, {showSpinner: true}), withRedux(makeStore))(ComposedApp);
