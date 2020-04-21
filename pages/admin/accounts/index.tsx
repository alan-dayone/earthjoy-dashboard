import React, {FC} from 'react';
import Head from 'next/head';
import {Column, CellProps, Renderer} from 'react-table';
import Link from 'next/link';
import {adminOnly} from '../../../hocs/adminOnly';
import {accountService} from '../../../services';
import {Account, AccountStatus, Role} from '../../../models/Account';
import {
  AccountEmailVerificationText,
  AccountStatusText,
} from '../../../view-models/Account';
import {AccountEmailVerificationLabel} from '../../../components/admin/AccountEmailVerificationLabel';
import {AccountStatusLabel} from '../../../components/admin/AccountStatusLabel';
import {DataTable} from '../../../containers/admin/DataTable';
import {createSelectFilter} from '../../../components/admin/DataTable/SelectFilter';

const tableColumns: Column[] = [
  {
    Header: 'ID',
    accessor: 'id',
    width: '15%',
  },
  {
    Header: 'First name',
    accessor: 'firstName',
    width: '10%',
  },
  {
    Header: 'Last name',
    accessor: 'lastName',
    width: '10%',
  },
  {
    Header: 'Email',
    accessor: 'email',
    width: '15%',
  },
  {
    Header: 'Email verification',
    accessor: 'emailVerified',
    Filter: createSelectFilter<Account>({
      items: [
        {value: 'true', label: AccountEmailVerificationText.VERIFIED},
        {value: 'false', label: AccountEmailVerificationText.NOT_VERIFIED},
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
    Header: 'Role',
    accessor: 'role',
    Filter: createSelectFilter<Account>({
      items: [
        {
          value: Role.ROOT_ADMIN,
          label: 'Root admin',
        },
        {
          value: Role.USER,
          label: 'User',
        },
      ],
    }),
    width: '10%',
  },
  {
    Header: 'Status',
    accessor: 'status',
    Filter: createSelectFilter<Account>({
      items: [
        {
          value: AccountStatus.ACTIVE,
          label: AccountStatusText[AccountStatus.ACTIVE],
        },
        {
          value: AccountStatus.INACTIVE,
          label: AccountStatusText[AccountStatus.INACTIVE],
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
    Header: 'Actions',
    sortType: null,
    disableSortBy: true,
    disableFilters: true,
    width: '15%',
    Cell: function ActionsCell({row}: CellProps<Account>): JSX.Element {
      return (
        <Link
          as={`/admin/accounts/${row.values.id}/edit`}
          href="/admin/accounts/[userId]/edit">
          <a className="btn btn-sm btn-info">Edit</a>
        </Link>
      );
    } as Renderer<CellProps<Account>>,
  },
];

const AdminAccountsPage: FC<{}> = () => (
  <div id="admin-accounts-page">
    <Head>
      <title>Admin - Account management</title>
    </Head>
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <strong>Account management</strong>
            <div className="card-header-actions">
              <Link href="/admin/accounts/create">
                <a className="btn btn-sm btn-success">Create</a>
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

export default adminOnly(AdminAccountsPage);
