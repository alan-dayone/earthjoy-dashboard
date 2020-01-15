import React from 'react';
import Link from 'next/link';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import Router from 'next/router';
import { NextJSContext } from 'next-redux-wrapper';
import { authService } from '../services';
// import { isAdmin } from '../models/user'
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

      if (isServer) {
        authService.setAccessToken(req.cookies.jwt);
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

      const composedProps = Content.getInitialProps
        ? await Content.getInitialProps(ctx)
        : {};

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
                <UncontrolledDropdown>
                  <DropdownToggle nav>
                    <div className="c-avatar">
                      <img
                        className="c-avatar-img"
                        src="https://coreui.io/demo/3.0-beta.0/assets/img/avatars/6.jpg"
                        alt="user@email.com"
                      />
                    </div>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>Profile</DropdownItem>
                    <DropdownItem onClick={this._logout}>Logout</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </a>
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

    _logout = async () => {
      try {
        await authService.logout();
        Router.replace('/admin/login');
      } catch (e) {
        toastr.error(e.message);
      }
    };
  }

  return AdminWrapper;
};
