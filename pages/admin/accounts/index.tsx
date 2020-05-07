import React, {FC} from 'react';
import Head from 'next/head';
import {CellProps, Column, Renderer} from 'react-table';
import Link from 'next/link';
import {useTranslation} from 'react-i18next';
import {adminOnly} from '../../../hocs/adminOnly';
import {accountService} from '../../../services';
import {Account, AccountStatus, Role} from '../../../models/Account';
import {AccountEmailVerificationLabel} from '../../../components/admin/AccountEmailVerificationLabel';
import {AccountStatusLabel} from '../../../components/admin/AccountStatusLabel';
import {DataTable} from '../../../containers/admin/DataTable';
import {createSelectFilter} from '../../../components/admin/DataTable/SelectFilter';
import {AccountRoleLabel} from '../../../components/admin/AccountRoleLabel';

const AdminAccountsPage: FC = () => {
  const {t} = useTranslation();
  const tableColumns: Array<Column<Account>> = [
    {
      Header: 'ID',
      accessor: 'id',
      width: '15%',
    },
    {
      Header: t('firstName'),
      accessor: 'firstName',
      width: '10%',
    },
    {
      Header: t('lastName'),
      accessor: 'lastName',
      width: '10%',
    },
    {
      Header: t('email'),
      accessor: 'email',
      width: '15%',
    },
    {
      Header: t('emailVerification'),
      accessor: 'emailVerified',
      Filter: createSelectFilter<Account>({
        items: [
          {value: 'true', label: t('verified')},
          {value: 'false', label: t('notVerified')},
        ],
      }),
      width: '10%',
      Cell: function EmailVerificationCell({
        cell: {value},
      }: CellProps<Account>): JSX.Element {
        return <AccountEmailVerificationLabel emailVerified={value} />;
      } as Renderer<CellProps<Account>>,
    },
    {
      Header: t('role'),
      accessor: 'role',
      Filter: createSelectFilter<Account>({
        items: [
          {
            value: Role.ROOT_ADMIN,
            label: t('rootAdmin'),
          },
          {
            value: Role.USER,
            label: t('user'),
          },
        ],
      }),
      width: '10%',
      Cell: function AccountRoleCell({
        cell: {value},
      }: CellProps<Account>): JSX.Element {
        return <AccountRoleLabel role={value} />;
      } as Renderer<CellProps<Account>>,
    },
    {
      Header: t('accountStatus'),
      accessor: 'status',
      Filter: createSelectFilter<Account>({
        items: [
          {
            value: AccountStatus.ACTIVE,
            label: t('active'),
          },
          {
            value: AccountStatus.INACTIVE,
            label: t('inactive'),
          },
        ],
      }),
      width: '10%',
      Cell: function AccountStatusCell({
        cell: {value},
      }: CellProps<Account>): JSX.Element {
        return <AccountStatusLabel status={value} />;
      } as Renderer<CellProps<Account>>,
    },
    {
      Header: t('actions'),
      accessor: null,
      disableSortBy: true,
      disableFilters: true,
      width: '15%',
      Cell: function ActionsCell({row}: CellProps<Account>): JSX.Element {
        return (
          <Link
            as={`/admin/accounts/${row.values.id}/edit`}
            href="/admin/accounts/[userId]/edit">
            <a className="btn btn-sm btn-info">{t('edit')}</a>
          </Link>
        );
      } as Renderer<CellProps<Account>>,
    },
  ];

  return (
    <div id="admin-accounts-page">
      <Head>
        <title>
          {t('admin')} - {t('accountManagement')}
        </title>
      </Head>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <strong>{t('accountManagement')}</strong>
              <div className="card-header-actions">
                <Link href="/admin/accounts/create">
                  <a className="btn btn-sm btn-success">{t('create')}</a>
                </Link>
              </div>
            </div>
            <div className="card-body">
              <DataTable
                tableColumns={tableColumns}
                findData={accountService.findAccountsForAdmin.bind(
                  accountService,
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default adminOnly(AdminAccountsPage);
