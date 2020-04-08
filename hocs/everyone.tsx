import React from 'react';
import Head from 'next/head';
import * as cookie from 'cookie';
import {NextComponentType} from 'next';
import {CustomNextPageContext} from './types';
import {authService} from '../services';
import {getLoginUser} from '../redux/slices/loginUserSlice';

export const everyone = (Content: NextComponentType) => {
  return class Wrapper extends React.Component {
    public static async getInitialProps(ctx: CustomNextPageContext) {
      const {req, store} = ctx;
      const isServer = !!req;

      if (isServer) {
        authService.setAccessToken(
          cookie.parse(req.headers.cookie as string).jwt,
        );
        await store.dispatch(getLoginUser());
      }

      return Content.getInitialProps ? await Content.getInitialProps(ctx) : {};
    }

    public render() {
      return (
        <div className="app-layout--user c-wrapper">
          <Head>
            <title>NextJs Boilerplate</title>
          </Head>
          {this._renderNavBar()}
          <div className="c-body">
            <main className="c-main">
              <Content {...this.props} />
            </main>
            {this._renderFooter()}
          </div>
        </div>
      );
    }

    public _renderNavBar = () => {
      return (
        <header className="c-header c-header-light c-header-fixed px-3">
          <a className="c-header-brand">
            <img
              src="/static/img/company-logo.jpg"
              height="40"
              className="d-inline-block align-top"
              alt="Company logo"
            />
            Web & Admin Boilerplate
          </a>
        </header>
      );
    };

    public _renderFooter = () => {
      return (
        <footer className="c-footer">
          <div>
            © 2020 <a href="https://dayoneteams.com">DayOne</a>.
          </div>
        </footer>
      );
    };
  };
};
