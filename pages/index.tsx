import React, {FC, useEffect} from 'react';
import Head from 'next/head';
import {everyone} from '../hocs/everyone';
import {useRouter} from 'next/router';

const IndexPage: FC = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace('admin/login');
  }, []);
  return (
    <div className="container">
      <Head>
        <title>LoopNext</title>
      </Head>
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
              <strong>User pages</strong>
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
