/* tslint:disable:no-default-export */
import React, {useCallback, useEffect, useState} from 'react';
import Head from 'next/head';
import classNames from 'classnames';
import {useAsyncDebounce, useFilters, usePagination, useTable} from 'react-table';
import {NextComponentType, NextPageContext} from 'next';
import Link from 'next/link';
import {adminOnly} from '../../../hocs';
import {accountService} from '../../../services';
import {AccountStatus} from '../../../models/User';
import {AccountEmailVerificationText, AccountStatusText} from '../../../view-models/User';
import {AccountEmailVerificationLabel} from '../../../components/admin/AccountEmailVerificationLabel';
import {AccountStatusLabel} from '../../../components/admin/AccountStatusLabel';

function inactivateUser(cell) {
  console.log(cell);
}

const tableColumns = [
  {
    Header: 'ID',
    accessor: 'id',
    width: '15%',
  },
  {
    Header: 'First name',
    accessor: 'firstName',
    width: '15%',
  },
  {
    Header: 'Last name',
    accessor: 'lastName',
    width: '15%',
  },
  {
    Header: 'Email',
    accessor: 'email',
    width: '15%',
  },
  {
    Header: 'Email verification',
    accessor: 'emailVerified',
    Filter: SelectEmailVerificationFilter,
    width: '10%',
    Cell: ({cell: {value}}) => <AccountEmailVerificationLabel emailVerified={value} />,
  },
  {
    Header: 'Status',
    accessor: 'status',
    Filter: SelectStatusFilter,
    width: '10%',
    Cell: ({cell: {value}}) => <AccountStatusLabel status={value} />,
  },
  {
    Header: 'Actions',
    canFilter: false,
    width: '15%',
    Cell: ({row}) => (
      <>
        <Link href={`/admin/accounts/${row.values.id}/edit`}>
          <a className="btn btn-sm btn-info">Edit</a>
        </Link>
      </>
    ),
  },
];

function SelectStatusFilter({column: {filterValue, setFilter}}) {
  const options = [AccountStatus.ACTIVE, AccountStatus.INACTIVE];

  return (
    <select
      className="form-control form-control-sm"
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || '');
      }}>
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {AccountStatusText[option]}
        </option>
      ))}
    </select>
  );
}

function SelectEmailVerificationFilter({column: {filterValue, setFilter}}) {
  return (
    <select
      className="form-control form-control-sm"
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || '');
      }}>
      <option value="">All</option>
      <option value="true">{AccountEmailVerificationText.VERIFIED}</option>
      <option value="false">{AccountEmailVerificationText.NOT_VERIFIED}</option>
    </select>
  );
}

function DefaultColumnFilter({column: {filterValue, setFilter}}) {
  return (
    <input
      className="form-control form-control-sm"
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || '');
      }}
      placeholder="Search..."
    />
  );
}

function AdminAccountsPage({router}) {
  if (typeof window === 'undefined') {
    return null;
  }

  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const fetchData = useCallback(async ({pageIndex, pageSize, filters}) => {
    setLoadingData(true);

    const filterObj = filters.reduce((ac, column) => {
      if (column.value) {
        if (column.id === 'emailVerified' && column.value !== '') {
          ac[column.id] = column.value === 'true';
        } else {
          ac[column.id] = column.value;
        }
      }
      return ac;
    }, {});
    const accounts = await accountService.findAccountsForAdmin({
      pageIndex,
      pageSize,
      filters: filterObj,
    });
    console.log(filterObj);

    router.replace(`${router.route}?`);
    setData(accounts);
    setLoadingData(false);
  }, []);

  const debouncedFetchData = useAsyncDebounce(fetchData, 500);

  return (
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
              <Table data={data} fetchData={debouncedFetchData} loadingData={loadingData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Table({data, fetchData, loadingData}) {
  const {
    getTableProps,
    getTableBodyProps,
    headers,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: {pageIndex, filters, pageSize},
  } = useTable(
    {
      columns: tableColumns,
      data,
      manualFilters: true,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
        filters: [],
      },
      defaultColumn: {
        Filter: DefaultColumnFilter,
      },
    },
    useFilters,
    usePagination,
  );

  useEffect(() => {
    fetchData({pageIndex, pageSize, filters});
  }, [fetchData, pageIndex, pageSize, filters]);

  return (
    <>
      <table className="table table-responsive-sm" {...getTableProps()}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={`th-${index}`} style={{width: header.width}}>
                {header.render('Header')}
              </th>
            ))}
          </tr>
          <tr>
            {headers.map((header, index) => (
              <th key={`th-filter-${index}`}>{header.canFilter ? header.render('Filter') : null}</th>
            ))}
          </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
          {loadingData ? (
            <tr>
              <td colSpan={tableColumns.length} className="text-center">
                <div className="spinner-grow" />
              </td>
            </tr>
          ) : (
            page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <div className="row">
        <div className="col-6">
          <span>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </span>{' '}
          |{' '}
          <span>
            Go to page:{' '}
            <input
              type="number"
              className="form-control d-inline-block"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{width: '100px'}}
            />
          </span>
        </div>
        <div className="col-6">
          <ul className="pagination justify-content-end">
            <li className={classNames('page-item', {disabled: !canPreviousPage})} onClick={() => gotoPage(0)}>
              <a className="page-link" href="#">
                {'<<'}
              </a>
            </li>
            <li className={classNames('page-item', {disabled: !canPreviousPage})} onClick={() => previousPage()}>
              <a className="page-link" href="#">
                {'<'}
              </a>
            </li>
            <li className={classNames('page-item', {disabled: !canNextPage})} onClick={() => nextPage()}>
              <a className="page-link" href="#">
                {'>'}
              </a>
            </li>
            <li className={classNames('page-item', {disabled: !canNextPage})} onClick={() => gotoPage(pageCount - 1)}>
              <a className="page-link" href="#">
                {'>>'}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default adminOnly(AdminAccountsPage as NextComponentType<NextPageContext, any, any>);
