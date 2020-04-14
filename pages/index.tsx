/* tslint:disable:no-default-export */
import React, {FC} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {WithTranslationProps, UseTranslationResponse} from 'react-i18next';
import {everyone} from '../hocs';

const IndexPage: FC<WithTranslationProps> = (props: UseTranslationResponse) => {
  const {t, i18n} = props;
  return (
    <div className="container">
      <Head>
        <title>LoopNext</title>
      </Head>
      <button onClick={async () => {
        await i18n.changeLanguage('vn');
      }}>{t('abc')}</button>
      <Link href="/admin/login">
        <a className="c-sidebar-nav-link">
          <i className="c-sidebar-nav-icon cil-speedometer" />
          Login
        </a>
      </Link>
      <h4>
        Save hundred hours of development cost by project boilerplate including
        common functionality implemented out-of-the-box with best practices,
        industrial standards and state-of-the art architecture.
      </h4>
      <h5>Update this page as the landing page of your product.</h5>
      <p className="text-muted mb-0">Version v1.0.0</p>
      <div className="row mt-5">
        <div className="col-4">
          <div className="card">
            <div className="card-header">
              {/*<strong>{t('abc')} User pages</strong>*/}
            </div>
            <div className="card-body">
              <ul>
                <li>Login</li>
                <li>SignUp</li>
                <li>Logout</li>
                <li>Forget password</li>
                <li>Update profile</li>
                <li>Change password</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card">
            <div className="card-header">
              <strong>Admin dashboard</strong>
            </div>
            <div className="card-body">
              <ul>
                <li>Login</li>
                <li>SignUp</li>
                <li>Logout</li>
                <li>Forget password</li>
                <li>Update profile</li>
                <li>Change password</li>
                <li>
                  User management (user list with search, sort, pagination -
                  user CRUD operation- deactivate user account
                </li>
                <li>Site analytics configuration management</li>
                <li>Email configuration management</li>
                <li>Backup management</li>
                <li>Cron job management</li>
                <li>Cloud storage management</li>
                <li>Server availability management</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card">
            <div className="card-header">
              <strong>{"There're more"}</strong>
            </div>
            <div className="card-body">
              <ul>
                <li>Multi-languages implementation</li>
                <li>OOP + MVC + Domain driven design + Flux architecture</li>
                <li>Javascript standard & linting</li>
                <li>BEM CSS standard & SCSS linting</li>
                <li>Production optimization</li>
                <li>Docker configuration & deployment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default everyone(IndexPage);
