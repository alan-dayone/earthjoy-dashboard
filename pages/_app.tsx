/* tslint:disable:no-default-export */
import React from 'react';
import {compose} from 'redux';
import {Provider} from 'react-redux';
import App, {AppContext} from 'next/app';
import withRedux, {ReduxWrapperAppProps} from 'next-redux-wrapper';
import {I18nextProvider, initReactI18next, withSSR} from 'react-i18next';
import i18next from 'i18next';
import i18nextXhrBackend from 'i18next-xhr-backend';
import Cookie from 'js-cookie';
import {nprogress} from '../hocs';
import {CustomNextPageContext} from '../hocs/types';
import {makeStore} from '../redux/store';
import {RootState} from '../redux/slices';
import {authService} from '../services';
import {getCookieFromRequest} from '../utils/cookie';
import {getLoginUser} from '../redux/slices/loginUserSlice';
import {ACCESS_TOKEN_COOKIE} from '../gateways/AuthGateway';
import {isServer} from "../utils/environment";
import {getInitialI18nextData, InitialI18nextData} from "../hocs/withI18next";
import '../scss/index.scss';

interface CustomNextAppContext extends AppContext {
  ctx: CustomNextPageContext;
}

class ComposedApp extends App<ReduxWrapperAppProps<RootState> & {initialI18nextData: InitialI18nextData}> {
  public static async getInitialProps(
    context: CustomNextAppContext,
  ): Promise<{pageProps: object, initialI18nextData: InitialI18nextData}> {
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
    return {
      pageProps,
      initialI18nextData: isServer ? getInitialI18nextData(i18next) : {},
    };
  }

  public render(): JSX.Element {
    const {Component, pageProps, store, initialI18nextData} = this.props;
    const WithI18nextComponent = withSSR()(Component);
    return (
      <Provider store={store}>
        <I18nextProvider i18n={i18next}>
          <WithI18nextComponent
            initialI18nStore={initialI18nextData.initialI18nStore}
            initialLanguage={initialI18nextData.initialLanguage}
            {...pageProps}
          />
        </I18nextProvider>
      </Provider>
    );
  }
}

export default compose(
  nprogress(300, {showSpinner: true}),
  withRedux(makeStore),
)(ComposedApp);
