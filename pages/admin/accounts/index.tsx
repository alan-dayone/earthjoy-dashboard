import React, {FC} from 'react';
import Head from 'next/head';
import {CellProps, Column, Renderer} from 'react-table';
import Link from 'next/link';
import {useTranslation} from 'react-i18next';
import {adminOnly} from '../../../hocs/adminOnly';
import {accountService} from '../../../services';
import {Account, Role} from '../../../models/Account';
import {DataTable} from '../../../containers/admin/DataTable';
import {createSelectFilter} from '../../../components/admin/DataTable/SelectFilter';
import {AccountRoleLabel} from '../../../components/admin/AccountRoleLabel';

const AdminAccountsPage: FC = () => {
  const {t} = useTranslation();
  let dataTableRef;

  const tableColumns: Array<Column<Account>> = [
    {
      Header: 'ID',
      accessor: '_id',
      width: '15%',
    },
    {
      Header: t('email'),
      accessor: 'email',
      width: '15%',
    },
    {
      Header: t('role'),
      accessor: 'role',
      Filter: createSelectFilter<Account>({
        items: [
          {
            value: Role.ADMIN,
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
            </div>
            <div className="card-body">
              <div className="text-right mb-2">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={(): void => {
                    if (dataTableRef) {
                      dataTableRef.refresh();
                    }
                  }}>
                  {t('refresh')}
                </button>
                &nbsp;
                <Link href="/admin/accounts/create">
                  <a className="btn btn-sm btn-success">{t('create')}</a>
                </Link>
              </div>
              <DataTable
                defaultOrders={[{id: 'status', desc: true}]}
                tableColumns={tableColumns}
                findData={accountService.findAccountsForAdmin.bind(
                  accountService,
                )}
                dataTableRef={(ref): void => {
                  dataTableRef = ref;
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default adminOnly(AdminAccountsPage);
