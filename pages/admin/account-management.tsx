/* tslint:disable:no-default-export */
import React from 'react';
import Head from 'next/head';
import {adminOnly} from '../../hocs';
import {NextComponentType, NextPageContext} from 'next';
import {useSortBy, useTable} from 'react-table'

const columns = [
  {
    Header: 'ID',
    accessor: 'id',
  },
  {
    Header: 'First name',
    accessor: 'firstName',
  },
  {
    Header: 'Last name',
    accessor: 'lastName',
  },
  {
    Header: 'Email',
    accessor: 'email',
  },
  {
    Header: 'Email verified',
    accessor: 'emailVerified',
  },
  {
    Header: 'Status',
    accessor: 'status',
  },
  {
    Header: 'Actions',
  },
];

const data = [
  {
    id: 'id abcafsdaf',
    firstName: 'first name',
    lastName: 'last name',
    email: 'haotang.io@gmail.com',
    emailVerified: 'true',
    status: 'single',
  },
];

// TODO: Declare props for FC
function AccountManagementPage() {
  const {
    getTableProps,
    getTableBodyProps,
    headers,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  );

  const firstPageRows = rows.slice(0, 20);

  return (
    <div id="admin-account-management-page">
      <Head>
        <title>Admin - Account management</title>
      </Head>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <strong>Account management</strong>
            </div>
            <div className="card-body">
              <table className="table table-responsive-sm" {...getTableProps()}>
                <thead>
                <tr>
                  {headers.map(header => (
                    <th>{header.render('Header')}</th>
                  ))}
                </tr>
                </thead>
                <tbody {...getTableBodyProps()}>
                {firstPageRows.map(
                  (row, i) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                          return (
                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                          )
                        })}
                      </tr>
                    )
                  }
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default adminOnly(AccountManagementPage as NextComponentType<NextPageContext, any, any>);
