import React, {FC, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
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
  const {t} = useTranslation();
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
        <title>
          {t('admin')} - {t('dashboard')}
        </title>
      </Head>
      <div className="row">
        <div className="col-sm-6 col-lg-4">
          <div className="card">
            <div className="card-header bg-gradient-info text-white">
              <div className="text-center">
                <div className="text-value-xl">
                  {accountCount.allAccountActivated}
                </div>
                <div className="text-uppercase">{t('activeAccounts')}</div>
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
                    {t('verifiedUsers')}
                  </div>
                </div>
                <div className="c-vr"></div>
                <div className="col text-center">
                  <div className="text-value-lg">
                    <span className="text-primary">
                      {accountCount.adminActivated}
                    </span>
                  </div>
                  <div className="text-uppercase text-muted small">
                    {t('admins')}
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
