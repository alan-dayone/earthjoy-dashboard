/* tslint:disable:no-default-export */
import React from 'react';
import { compose } from 'redux';
import { Provider } from 'react-redux';
import App, { AppProps, NextAppContext } from 'next/app';
import withRedux, { AppProps as NextReduxAppProps } from 'next-redux-wrapper';
import { nprogress } from '../hocs';
import { makeStore } from '../redux/store';

class ComposedApp extends App<AppProps & NextReduxAppProps> {
  static async getInitialProps({ Component, ctx }: NextAppContext) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};
    return { pageProps };
  }

  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    );
  }
}

export default compose(
  nprogress(300, { showSpinner: true }),
  withRedux(makeStore)
)(ComposedApp);
