import React from 'react';
import {compose} from 'redux';
import {Provider} from 'react-redux';
import App, {AppContext} from 'next/app';
import withRedux, {ReduxWrapperAppProps} from 'next-redux-wrapper';
import {I18nextProvider} from 'react-i18next';
import i18next from 'i18next';
import {nprogress} from '../hocs/nprogress';
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
  public static async getInitialProps(
    context: CustomNextAppContext,
  ): Promise<{pageProps: object}> {
    const {Component, ctx} = context;
    const isServer = !!ctx.req;

    if (isServer) {
      const jwt = getCookieFromRequest(ACCESS_TOKEN_COOKIE, ctx.req);
      if (jwt) {
        authService.setAccessToken(jwt);
        await ctx.store.dispatch(getLoginUser());
      }
    }

    return {
      pageProps: Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {},
    };
  }

  public render(): JSX.Element {
    const {Component, pageProps, store} = this.props;
    console.log('render app', this.props);
    return (
      <Provider store={store}>
        <I18nextProvider i18n={i18next}>
          <Component {...pageProps} />
        </I18nextProvider>
      </Provider>
    );
  }
}

export default compose(
  nprogress(300, {showSpinner: true}),
  withRedux(makeStore),
)(ComposedApp);
