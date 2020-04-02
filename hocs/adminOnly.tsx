import React from 'react';
import Link from 'next/link';
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from 'reactstrap';
import {NextComponentType} from 'next';
import Router from 'next/router';
import classNames from 'classnames';
import JsCookie from 'js-cookie';
import {connect} from 'react-redux';
import {CustomNextPageContext} from './types';
import {authService} from '../services';
import {isAdmin, LoginUser} from '../models/User';
import {getLoginUser, selectors} from '../nredux/slices/loginUserSlice';
import {RootState} from '../nredux/slices';
import '../scss/admin/index.scss';

interface AdminWrapperState {
  showSidebar: boolean;
  sidebarUnfoldable: boolean;
}

interface AdminWrapperProps {
  loginUser: LoginUser;
}

/* tslint:disable-next-line:variable-name */
export const adminOnly = (Content: NextComponentType): NextComponentType => {
  class AdminWrapper extends React.Component<AdminWrapperProps, AdminWrapperState> {
    public static async getInitialProps(ctx: CustomNextPageContext) {
      const {req, res, store} = ctx;
      const isServer = !!req;

      if (isServer) {
        authService.setAccessToken(req?.cookies?.jwt);
        const user = await store.dispatch(getLoginUser());

        if (!user) {
          res.redirect('/admin/login');
          res.end();
        } else if (!isAdmin(user)) {
          res.redirect('/');
          res.end();
        }
      }

      return Content.getInitialProps ? Content.getInitialProps(ctx) : {};
    }

    constructor(props) {
      super(props);
      this.state = {
        showSidebar: true,
        sidebarUnfoldable: false,
      };
    }

    public render() {
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

    private handleSidebar = (feild: string) => {
      this.setState({...this.state, [feild]: !this.state[feild]});
    };

    public componentDidMount() {
      const oldState = JsCookie.get('AdminWrapperState');
      if (oldState) this.setState(JSON.parse(oldState));
    }

    public componentWillUnmount() {
      JsCookie.set('AdminWrapperState', this.state);
    }

    public _renderNavbar = () => {
      return (
        <header className="c-header c-header-light c-header-fixed px-3">
          <button
            className="c-header-toggler c-class-toggler d-md-down-none sidebar-toggler"
            onClick={() => this.handleSidebar('showSidebar')}>
            <span className="c-header-toggler-icon" />
          </button>
          <ul className="c-header-nav mfs-auto">
            <li className="c-header-nav-item dropdown">
              <div
                className="c-header-nav-link"
                data-toggle="dropdown"
                role="button"
                aria-haspopup="true"
                aria-expanded="false">
                <UncontrolledDropdown>
                  <DropdownToggle caret nav tag="a" className="u-cursor-pointer">
                    {this.props.loginUser.email}
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem>Profile</DropdownItem>
                    <DropdownItem onClick={this._logout}>Logout</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            </li>
          </ul>
        </header>
      );
    };

    public _renderSidebar = () => {
      return (
        <div
          className={classNames('c-sidebar c-sidebar-dark c-sidebar-fixed', {
            'c-sidebar-show': this.state.showSidebar,
            'c-sidebar-unfoldable': this.state.sidebarUnfoldable,
          })}
          id="sidebar">
          <div className="c-sidebar-brand flex-column" style={{height: '56px'}}>
            <img className="h-100 c-sidebar-brand-full" src="/static/img/admin_logo_bw_full.svg" alt="ADMIN PORTAL" />
            <img
              className="h-100 c-sidebar-brand-minimized"
              src="/static/img/admin_logo_bw_minimized.svg"
              alt="ADMIN"
            />
          </div>
          <ul className="c-sidebar-nav ps ps--active-y" data-drodpown-accordion="true">
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
          <button
            className="c-sidebar-minimizer c-class-toggler"
            onClick={() => this.handleSidebar('sidebarUnfoldable')}
          />
        </div>
      );
    };

    public _logout = async () => {
      try {
        await authService.logout();
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
