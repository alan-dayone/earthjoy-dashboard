import React, {ReactNode} from 'react';
import Head from 'next/head';
import {NextComponentType} from 'next';
import {CustomNextPageContext} from './types';
// import {withI18next} from './withI18next';

export const everyone = (Content: NextComponentType): ReactNode => {
  class Wrapper extends React.Component {
    public static async getInitialProps(
      ctx: CustomNextPageContext,
    ): Promise<object> {
      return Content.getInitialProps ? await Content.getInitialProps(ctx) : {};
    }

    public render(): JSX.Element {
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

    public _renderNavBar = (): JSX.Element => {
      return (
        <header className="c-header c-header-light c-header-fixed px-3">
          <a className="c-header-brand">
            <img
              src="/static/img/company-logo.png"
              height="40"
              className="d-inline-block align-top"
              alt="Company logo"
            />
            Web & Admin Boilerplate
          </a>
        </header>
      );
    };

    public _renderFooter = (): JSX.Element => {
      return (
        <footer className="c-footer">
          <div>
            © 2020 <a href="https://dayoneteams.com">DayOne</a>.
          </div>
        </footer>
      );
    };
  }

  return Wrapper;
};
