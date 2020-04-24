import React, {ReactNode, useState} from 'react';
import Link from 'next/link';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import {NextComponentType} from 'next';
import Router, {useRouter} from 'next/router';
import classNames from 'classnames';
import Cookies from 'js-cookie';
import {connect} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {CustomNextPageContext} from './types';
import {isAdmin, LoginUser} from '../models/Account';
import {logout, selectors} from '../redux/slices/loginUserSlice';
import {RootState} from '../redux/slices';
import {AppDispatch} from '../redux/store';
import {getBooleanCookieFromRequest} from '../utils/cookie';
import {withI18next} from './withI18next';
import {FormButton} from '../components/admin/FormButton';

const SHOW_SIDEBAR_COOKIE = 'showSidebar';

interface AdminWrapperServerProps {
  showSidebar: boolean;
  pageProps?: object;
}

interface AdminWrapperProps extends AdminWrapperServerProps {
  loginUser: LoginUser;
  dispatch: AppDispatch;
}

export const adminOnly = (Content: NextComponentType): ReactNode => {
  const AdminWrapper: NextComponentType<
    CustomNextPageContext,
    AdminWrapperServerProps,
    AdminWrapperProps
  > = (props: AdminWrapperProps): JSX.Element => {
    const {t} = useTranslation();
    const router = useRouter();
    const [showSidebar, setShowSidebar] = useState(props.showSidebar);
    const {loginUser, dispatch, pageProps} = props;

    const toggleSideBar = (): void => {
      const newValue = !showSidebar;
      // setShowSidebar(newValue);
      Cookies.set(SHOW_SIDEBAR_COOKIE, newValue.toString());
    };

    const handleProfile = async (): Promise<void> => {
      try {
        Router.replace('/admin/profile');
      } catch (e) {
        toastr.error(e.message);
      }
    };

    const handleLogout = async (): Promise<void> => {
      try {
        dispatch(logout());
        Router.replace('/admin/login');
      } catch (e) {
        toastr.error(e.message);
      }
    };
    const currentSidebarSection = router.pathname.split('/');

    return (
      <div className="app-layout--admin c-app pace-done">
        <div
          className={classNames('c-sidebar c-sidebar-dark c-sidebar-fixed', {
            'c-sidebar-show': showSidebar,
          })}
          id="sidebar">
          <Link href="/admin">
            <a className="c-sidebar-brand flex-column" style={{height: '56px'}}>
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
            </a>
          </Link>
          <ul
            className="c-sidebar-nav ps ps--active-y"
            data-dropdown-accordion="true">
            <li
              className={classNames('c-sidebar-nav-item', {
                'bg-primary': currentSidebarSection[2] === undefined,
              })}>
              <Link href="/admin">
                <a className="c-sidebar-nav-link">
                  <i className="c-sidebar-nav-icon cil-speedometer" />
                  {t('dashboard')}
                </a>
              </Link>
            </li>
            <li
              className={classNames('c-sidebar-nav-item', {
                'bg-primary': currentSidebarSection[2] === 'accounts',
              })}>
              <Link href="/admin/accounts">
                <a className="c-sidebar-nav-link">
                  <i className="c-sidebar-nav-icon cil-speedometer" />
                  {t('accounts')}
                </a>
              </Link>
            </li>
            <li className="c-sidebar-nav-title">EMAIL</li>
            <li
              className={classNames('c-sidebar-nav-item', {
                'bg-primary':
                  currentSidebarSection[2] === 'configurations' &&
                  currentSidebarSection[3] === 'smtp-settings',
              })}>
              <Link href="/admin/configurations/smtp-settings">
                <a className="c-sidebar-nav-link">
                  <i className="c-sidebar-nav-icon cil-settings" />
                  {t('smtpSettings')}
                </a>
              </Link>
            </li>
            <li
              className={classNames('c-sidebar-nav-item', {
                'bg-primary':
                  currentSidebarSection[2] === 'configurations' &&
                  currentSidebarSection[3] === 'email-address-verification',
              })}>
              <Link href="/admin/configurations/email-address-verification">
                <a className="c-sidebar-nav-link">
                  <i className="c-sidebar-nav-icon cil-send" />
                  {t('emailAddressVerification')}
                </a>
              </Link>
            </li>
            <li
              className={classNames('c-sidebar-nav-item', {
                'bg-primary':
                  currentSidebarSection[2] === 'configurations' &&
                  currentSidebarSection[3] === 'password-reset',
              })}>
              <Link href="/admin/configurations/password-reset">
                <a className="c-sidebar-nav-link">
                  <i className="c-sidebar-nav-icon cil-send" />
                  {t('passwordReset')}
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="c-wrapper">
          <header className="c-header c-header-light c-header-fixed px-3">
            <FormButton
              className="c-header-toggler c-class-toggler d-md-down-none sidebar-toggler"
              onClick={toggleSideBar}>
              <span className="c-header-toggler-icon" />
            </FormButton>
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
                        {loginUser.firstName || loginUser.email}
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem onClick={handleProfile}>
                          {t('profile')}
                        </DropdownItem>
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
              <div className="container-fluid">
                <Content {...pageProps} />
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  };

  AdminWrapper.getInitialProps = async (
    ctx,
  ): Promise<AdminWrapperServerProps> => {
    const {req, res, store} = ctx;
    const isServer = !!req;
    const loginUser = selectors.selectLoginUser(store.getState());
    let showSidebar = true;

    if (isServer) {
      showSidebar = getBooleanCookieFromRequest(SHOW_SIDEBAR_COOKIE, req);

      if (!loginUser) {
        res.writeHead(302, {Location: '/admin/login'});
        res.end();
        return;
      } else if (!isAdmin(loginUser)) {
        res.writeHead(302, {Location: '/'});
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

    return {
      showSidebar,
      pageProps: Content.getInitialProps
        ? await Content.getInitialProps(ctx)
        : undefined,
    };
  };

  return connect((state: RootState) => ({
    loginUser: selectors.selectLoginUser(state),
  }))(withI18next(AdminWrapper));
};
