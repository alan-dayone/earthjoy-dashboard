import React from 'react';
import Link from 'next/link';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import {NextComponentType} from 'next';
import Router from 'next/router';
import classNames from 'classnames';
import Cookies from 'js-cookie';
import {connect} from 'react-redux';
import {CustomNextPageContext} from './types';
import {isAdmin, LoginUser} from '../models/Account';
import {logout, selectors} from '../redux/slices/loginUserSlice';
import {RootState} from '../redux/slices';
import {AppDispatch} from '../redux/store';
import {getBooleanCookieFromRequest} from '../utils/cookie';

const SHOW_SIDEBAR_COOKIE = 'showSidebar';

interface AdminWrapperState {
  showSidebar: boolean;
}

interface AdminWrapperProps {
  loginUser: LoginUser;
  dispatch: AppDispatch;
}

/* tslint:disable-next-line:variable-name */
export const adminOnly = (Content: NextComponentType): NextComponentType => {
  class AdminWrapper extends React.Component<
    AdminWrapperProps,
    AdminWrapperState
  > {
    public static async getInitialProps(
      ctx: CustomNextPageContext,
    ): Promise<object> {
      const {req, res, store} = ctx;
      const isServer = !!req;
      const loginUser = selectors.selectLoginUser(store.getState());
      let showSidebar = true;

      if (isServer) {
        showSidebar = getBooleanCookieFromRequest(SHOW_SIDEBAR_COOKIE, req);

        if (!loginUser) {
          res.writeHead(301, {location: '/admin/login'});
          res.end();
          return;
        } else if (!isAdmin(loginUser)) {
          res.writeHead(301, {location: '/'});
          res.end();
          return;
        }
      } else {
        if (!loginUser) {
          Router.replace('/admin/login');
          return;
        } else if (!isAdmin(loginUser)) {
          Router.replace('/');
          return;
        }
      }

      const defaultProps = {showSidebar};
      return Content.getInitialProps
        ? {...defaultProps, ...(await Content.getInitialProps(ctx))}
        : defaultProps;
    }

    constructor(props) {
      super(props);
      this.state = {
        showSidebar: props.showSidebar,
      };
    }

    public render(): JSX.Element {
      return (
        <div className="app-layout--admin c-app pace-done">
          {this.renderSidebar()}
          <div className="c-wrapper">
            {this.renderNavbar()}
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

    private renderNavbar: () => JSX.Element = () => {
      const {loginUser} = this.props;

      return (
        <header className="c-header c-header-light c-header-fixed px-3">
          <button
            className="c-header-toggler c-class-toggler d-md-down-none sidebar-toggler"
            onClick={this.toggleSideBar}>
            <span className="c-header-toggler-icon" />
          </button>
          <ul className="c-header-nav mfs-auto">
            <li className="c-header-nav-item dropdown">
              {loginUser && (
                <div
                  className="c-header-nav-link"
                  data-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false">
                  <UncontrolledDropdown>
                    <DropdownToggle
                      caret
                      nav
                      tag="a"
                      className="u-cursor-pointer">
                      {loginUser.email}
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem>Profile</DropdownItem>
                      <DropdownItem onClick={this.logout}>Logout</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              )}
            </li>
          </ul>
        </header>
      );
    };

    private renderSidebar = (): JSX.Element => {
      return (
        <div
          className={classNames('c-sidebar c-sidebar-dark c-sidebar-fixed', {
            'c-sidebar-show': this.state.showSidebar,
          })}
          id="sidebar">
          <div className="c-sidebar-brand flex-column" style={{height: '56px'}}>
            <img
              className="c-sidebar-brand-full"
              src="/static/img/admin_logo_bw_full.svg"
              alt="ADMIN PORTAL"
              style={{height: 40}}
            />
            <img
              className="c-sidebar-brand-minimized"
              src="/static/img/admin_logo_bw_minimized.svg"
              alt="ADMIN"
              style={{height: 40}}
            />
          </div>
          <ul
            className="c-sidebar-nav ps ps--active-y"
            data-dropdown-accordion="true">
            <li className="c-sidebar-nav-item">
              <Link href="/admin">
                <a className="c-sidebar-nav-link">
                  <i className="c-sidebar-nav-icon cil-speedometer" />
                  Dashboard
                </a>
              </Link>
            </li>
            <li className="c-sidebar-nav-item">
              <Link href="/admin/accounts">
                <a className="c-sidebar-nav-link">
                  <i className="c-sidebar-nav-icon cil-speedometer" />
                  Accounts
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
        </div>
      );
    };

    private toggleSideBar = (): void => {
      const newValue = !this.state.showSidebar;
      this.setState({showSidebar: newValue});
      Cookies.set(SHOW_SIDEBAR_COOKIE, newValue.toString());
    };

    private logout = async (): Promise<void> => {
      try {
        this.props.dispatch(logout());
        Router.replace('/admin/login');
      } catch (e) {
        toastr.error(e.message);
      }
    };
  }

  return connect((state: RootState) => ({
    loginUser: selectors.selectLoginUser(state),
  }))(AdminWrapper);
};
