import React, {FC, useEffect, useState} from 'react';
import Head from 'next/head';
import {adminOnly} from '../../hocs/adminOnly';
import {accountService} from '../../services';
import {AccountStatus, Role} from '../../models/Account';

interface AccountCountState {
  allAccountActivated: number;
  userVerified: number;
  adminActivated: number;
}

const AdminDashboardPage: FC = () => {
  const [accountCount, setAccountCount] = useState<AccountCountState>({
    allAccountActivated: 0,
    userVerified: 0,
    adminActivated: 0,
  });
  useEffect(() => {
    (async (): Promise<void> => {
      const [
        allAccountActivated,
        userVerified,
        adminActivated,
      ] = await Promise.all([
        accountService.countAccount({status: AccountStatus.ACTIVE}),
        accountService.countAccount({
          status: AccountStatus.ACTIVE,
          role: {neq: Role.ROOT_ADMIN},
          emailVerified: true,
        }),
        accountService.countAccount({
          status: AccountStatus.ACTIVE,
          role: Role.ROOT_ADMIN,
        }),
      ]);
      setAccountCount({
        allAccountActivated,
        userVerified,
        adminActivated,
      });
    })();
  }, []);
  return (
    <div id="admin-dashboard-page">
      <Head>
        <title>Admin - Dashboard</title>
      </Head>
      <div className="row">
        <div className="col">
          <div className="card" style={{width: '20rem'}}>
            <div className="card-header bg-gradient-info text-white">
              <div className="text-center">
                <div className="text-value-xl">
                  {accountCount.allAccountActivated}
                </div>
                <div>Active accounts</div>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col text-center">
                  <div className="text-value-lg">
                    <span className="text-primary">
                      {accountCount.userVerified}
                    </span>
                  </div>
                  <div className="text-uppercase text-muted small">
                    Verified users
                  </div>
                </div>
                <div className="c-vr"></div>
                <div className="col text-center">
                  <div className="text-value-lg">
                    <span className="text-primary">
                      {accountCount.adminActivated}
                    </span>
                  </div>
                  <div className="text-uppercase text-muted small">Admins</div>
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
