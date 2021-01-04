import React, {ReactNode, useState} from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import {useTranslation} from 'react-i18next';
import Router, {useRouter} from 'next/router';
import Cookies from 'js-cookie';
import {connect} from 'react-redux';
import {getAccountName} from '../../../view-models/Account';
import {logout, selectors} from '../../../redux/slices/loginUserSlice';
import {RootState} from '../../../redux/slices';
import {LoginUser} from '../../../models/Account';
import {AppDispatch} from '../../../redux/store';

const SHOW_SIDEBAR_COOKIE = 'showSidebar';

interface Props {
  loginUser: LoginUser;
  dispatch: AppDispatch;
  showSidebar: boolean;
  children: ReactNode;
}

const Container = (props: Props): JSX.Element => {
  const {t} = useTranslation();
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(props.showSidebar);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const {loginUser, dispatch, children} = props;

  const toggleSideBar = (): void => {
    const newValue = !showSidebar;
    setShowSidebar(newValue);
    Cookies.set(SHOW_SIDEBAR_COOKIE, newValue.toString());
  };

  const toggleMobileSideBar = (): void => {
    const newValue = !showMobileSidebar;
    setShowMobileSidebar(newValue);
  };

  const handleLogout = async (): Promise<void> => {
    try {
      dispatch(logout());
      Router.replace('/admin/login');
    } catch (e) {
      toastr.error(e.message);
    }
  };

  const getSidebarNavItemLinkClass = (path: string): string => {
    const matched =
      path === '/admin'
        ? router.pathname === path
        : router.pathname.match(new RegExp(`^${path}($|/.*)`));
    return matched ? 'c-sidebar-nav-link c-active' : 'c-sidebar-nav-link';
  };

  return (
    <div className="app-layout--admin c-app pace-done">
      <div
        className={classNames('c-sidebar c-sidebar-dark c-sidebar-fixed', {
          'c-sidebar-lg-show': showSidebar,
          'c-sidebar-show': showMobileSidebar,
        })}
        id="sidebar">
        <Link href="/admin">
          <a className="c-sidebar-brand flex-column" style={{height: '56px'}}>
            <img
              className="c-sidebar-brand-full"
              src="/static/img/logo.png"
              alt="ADMIN PORTAL"
              style={{height: 40}}
            />
            <img
              className="c-sidebar-brand-minimized"
              src="/static/img/logo.png"
              alt="ADMIN"
              style={{height: 40}}
            />
          </a>
        </Link>
        <ul
          className="c-sidebar-nav ps ps--active-y"
          data-dropdown-accordion="true">
          <li className="c-sidebar-nav-title">Analytics</li>
          <li className="c-sidebar-nav-item">
            <Link href="/admin/analytics/new-users">
              <a
                className={getSidebarNavItemLinkClass(
                  '/admin/analytics/new-users',
                )}>
                <i className="c-sidebar-nav-icon cil-speedometer" />
                {t('New User')}
              </a>
            </Link>
          </li>
          <li className="c-sidebar-nav-item">
            <Link href="/admin/analytics/paid-users">
              <a
                className={getSidebarNavItemLinkClass(
                  '/admin/analytics/paid-users',
                )}>
                <i className="c-sidebar-nav-icon cil-speedometer" />
                {t('Paid User')}
              </a>
            </Link>
          </li>
          {/*<li className="c-sidebar-nav-item">*/}
          {/*  <Link href="/admin/accounts">*/}
          {/*    <a className={getSidebarNavItemLinkClass('/admin/accounts')}>*/}
          {/*      <i className="c-sidebar-nav-icon cil-user" />*/}
          {/*      {t('accounts')}*/}
          {/*    </a>*/}
          {/*  </Link>*/}
          {/*</li>*/}
          {/*<li className="c-sidebar-nav-title">EMAIL</li>*/}
          {/*<li className="c-sidebar-nav-item">*/}
          {/*  <Link href="/admin/configurations/smtp-settings">*/}
          {/*    <a*/}
          {/*      className={getSidebarNavItemLinkClass(*/}
          {/*        '/admin/configurations/smtp-settings',*/}
          {/*      )}>*/}
          {/*      <i className="c-sidebar-nav-icon cil-settings" />*/}
          {/*      {t('smtpSettings')}*/}
          {/*    </a>*/}
          {/*  </Link>*/}
          {/*</li>*/}
          {/*<li className="c-sidebar-nav-item">*/}
          {/*  <Link href="/admin/configurations/email-address-verification">*/}
          {/*    <a*/}
          {/*      className={getSidebarNavItemLinkClass(*/}
          {/*        '/admin/configurations/email-address-verification',*/}
          {/*      )}>*/}
          {/*      <i className="c-sidebar-nav-icon cil-envelope-closed" />*/}
          {/*      {t('emailAddressVerification')}*/}
          {/*    </a>*/}
          {/*  </Link>*/}
          {/*</li>*/}
          {/*<li className="c-sidebar-nav-item">*/}
          {/*  <Link href="/admin/configurations/password-reset">*/}
          {/*    <a*/}
          {/*      className={getSidebarNavItemLinkClass(*/}
          {/*        '/admin/configurations/password-reset',*/}
          {/*      )}>*/}
          {/*      <i className="c-sidebar-nav-icon cil-lock-locked" />*/}
          {/*      {t('passwordReset')}*/}
          {/*    </a>*/}
          {/*  </Link>*/}
          {/*</li>*/}
        </ul>
      </div>
      <div className="c-wrapper">
        <header className="c-header c-header-light c-header-fixed px-3">
          <button
            className="c-header-toggler c-class-toggler d-md-down-none sidebar-toggler u-outline-none"
            onClick={toggleSideBar}>
            <span className="c-header-toggler-icon" />
          </button>
          <button
            className="c-header-toggler c-class-toggler d-lg-none sidebar-toggler u-outline-none"
            onClick={toggleMobileSideBar}>
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
                  <UncontrolledDropdown inNavbar>
                    <DropdownToggle
                      caret
                      nav
                      tag="a"
                      className="u-cursor-pointer">
                      {getAccountName(loginUser)}
                    </DropdownToggle>
                    <DropdownMenu right>
                      {/*<Link href="/admin/profile">*/}
                      {/*  <a className="dropdown-item">{t('profile')}</a>*/}
                      {/*</Link>*/}
                      <DropdownItem onClick={handleLogout}>
                        {t('logout')}
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              )}
            </li>
          </ul>
        </header>
        <div className="c-body">
          <main className="c-main">
            <div className="container-fluid">{children}</div>
          </main>
        </div>
      </div>
      {showMobileSidebar && (
        <div
          className="c-sidebar-backdrop c-fade c-show"
          onClick={(): void => setShowMobileSidebar(false)}
        />
      )}
    </div>
  );
};

export const AuthenticatedLayout = connect((state: RootState) => ({
  loginUser: selectors.selectLoginUser(state),
}))(Container);
