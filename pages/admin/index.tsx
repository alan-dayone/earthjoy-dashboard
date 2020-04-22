import React, {FC, useEffect, useState} from 'react';
import Head from 'next/head';
import {adminOnly} from '../../hocs/adminOnly';
import {accountService} from '../../services';

interface AccountCountState {
  all: number;
  activated: number;
  emailVerified: number;
}

const AdminDashboardPage: FC = () => {
  const [accountCount, setAccountCount] = useState<AccountCountState>({
    all: 0,
    activated: 0,
    emailVerified: 0,
  });
  useEffect(() => {
    (async (): Promise<void> => {
      const [all, activated, emailVerified] = await Promise.all([
        accountService.countAccount(),
        accountService.countAccount({status: 'active'}),
        accountService.countAccount({emailVerified: true}),
      ]);
      setAccountCount({
        all,
        activated,
        emailVerified,
      });
    })();
  }, []);
  return (
    <div id="admin-dashboard-page">
      <Head>
        <title>Admin - Dashboard</title>
      </Head>
      <div className="row">
        <div className="col-sm-6 col-lg-3">
          <div className="card">
            <div className="card-header bg-gradient-info text-white">
              <div className="text-center">
                <div className="text-value-xl">{accountCount.all}</div>
                <div>Users</div>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col text-center">
                  <div className="text-value-lg">
                    <span className="text-primary">
                      {accountCount.activated}
                    </span>
                    |
                    <span className="text-dark text-value">
                      {accountCount.all - accountCount.activated}
                    </span>
                  </div>
                  <div className="text-uppercase text-muted small">
                    Activated
                  </div>
                </div>
                <div className="c-vr"></div>
                <div className="col text-center">
                  <div className="text-value-lg">
                    <span className="text-primary">
                      {accountCount.emailVerified}
                    </span>
                    |
                    <span className="text-dark text-value">
                      {accountCount.all - accountCount.emailVerified}
                    </span>
                  </div>
                  <div className="text-uppercase text-muted small">
                    Email verified
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default adminOnly(AdminDashboardPage);
