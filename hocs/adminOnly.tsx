import React from 'react';
import Link from 'next/link';
// import Head from 'next/head';
// import { Router } from '../routes'
import { authService } from '../services';
// import { isAdmin } from '../models/user'
import { NextJSContext } from 'next-redux-wrapper';
import '../scss/admin/index.scss';
// import {
//   actions as authActions,
//   selectors as authSelectors
// } from '../redux/authRedux'

/* tslint:disable-next-line:variable-name */
export const adminOnly = Content => {
  class AdminWrapper extends React.Component {
    static async getInitialProps(ctx: NextJSContext) {
      const { req, res, store, isServer } = ctx;
      const composedProps = Content.getInitialProps
        ? await Content.getInitialProps(ctx)
        : {};

      if (isServer) {
        authService.setAccessToken(req.signedCookies.access_token);
        // const user = await store.dispatch(authActions.getLoginUser())

        // if (!user || !isAdmin(user)) {
        //   res.redirect('/admin/login')
        //   res.end()
        // }
      } else {
        // const user = authSelectors.getLoginUser(store.getState())
        // if (!user || !isAdmin(user)) {
        //   Router.pushRoute('/admin/login')
        // }
      }

      return composedProps;
    }

    render() {
      return (
        <div className="c-app pace-done">
          {this._renderSidebar()}
          <div className="c-wrapper">
            {this._renderNavbar()}
            <div className="c-body">
              <main className="c-main">
                <div className="container-fluid">
                  <Content {...this.props} />
                </div>
              </main>
            </div>
          </div>
        </div>
      );
      // return (
      //   <div className="app header-fixed sidebar-fixed aside-menu-fixed sidebar-lg-show">
      //     {this._renderNavbar()}
      //     <div className="app-body">
      //       {this._renderSidebar()}
      //       <div id="main">
      //         <Content {...this.props} />
      //       </div>
      //     </div>
      //   </div>
      // );
    }

    _renderNavbar = () => {
      return (
        <header className="c-header c-header-light c-header-fixed px-3">
          <button
            className="c-header-toggler c-class-toggler d-md-down-none"
            type="button"
          >
            <span className="c-header-toggler-icon" />
          </button>
          <ul className="c-header-nav mfs-auto">
            <li className="c-header-nav-item dropdown">
              <a
                className="c-header-nav-link"
                data-toggle="dropdown"
                href="#"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <div className="c-avatar">
                  <img
                    className="c-avatar-img"
                    src="https://coreui.io/demo/3.0-beta.0/assets/img/avatars/6.jpg"
                    alt="user@email.com"
                  />
                </div>
              </a>
              <div className="dropdown-menu dropdown-menu-right pt-0">
                <a className="dropdown-item" href="#">
                  <i className="c-icon mfe-2 cil-settings" />
                  Settings
                </a>
                <a className="dropdown-item" href="#">
                  <i className="c-icon mfe-2 cil-account-logout" />
                  Logout
                </a>
              </div>
            </li>
          </ul>
        </header>
      );
    };

    _renderSidebar = () => {
      return (
        <div
          className="c-sidebar c-sidebar-dark c-sidebar-fixed c-sidebar-lg-show"
          id="sidebar"
        >
          <div className="c-sidebar-brand">
            <h5>ADMIN PORTAL</h5>
          </div>
          <ul
            className="c-sidebar-nav ps ps--active-y"
            data-drodpown-accordion="true"
          >
            <li className="c-sidebar-nav-item">
              <Link href="/admin">
                <a className="c-sidebar-nav-link">
                  <i className="c-sidebar-nav-icon cil-speedometer" />
                  Dashboard
                </a>
              </Link>
            </li>
            <li className="c-sidebar-nav-title">EMAIL</li>
            <li className="c-sidebar-nav-item">
              <Link href="/admin/configurations/smtp-settings">
                <a className="c-sidebar-nav-link">
                  <i className="c-sidebar-nav-icon cil-settings" />
                  SMTP settings
                </a>
              </Link>
              <Link href="/admin/configurations/email-address-verification">
                <a className="c-sidebar-nav-link">
                  <i className="c-sidebar-nav-icon cil-send" />
                  Email address verification
                </a>
              </Link>
              <Link href="/admin/configurations/password-reset">
                <a className="c-sidebar-nav-link">
                  <i className="c-sidebar-nav-icon cil-send" />
                  Password reset
                </a>
              </Link>
            </li>
          </ul>
          <button
            className="c-sidebar-minimizer c-class-toggler"
            type="button"
            data-target="_parent"
            data-class="c-sidebar-unfoldable"
          />
        </div>
      );
    };
  }

  return AdminWrapper;
};
