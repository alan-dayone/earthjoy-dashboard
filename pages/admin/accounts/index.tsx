/* tslint:disable:no-default-export */
import React, {useCallback, useEffect, useState, FC} from 'react';
import Head from 'next/head';
import classNames from 'classnames';
import {
  useAsyncDebounce,
  useFilters,
  usePagination,
  useTable,
  useSortBy,
  CellProps,
} from 'react-table';
import {NextComponentType, NextPageContext} from 'next';
import Link from 'next/link';
import Router from 'next/router';
import {useRouter} from 'next/router';
import qs from 'qs';
import {adminOnly} from '../../../hocs';
import {accountService} from '../../../services';
import {AccountStatus, Account} from '../../../models/Account';
import {
  AccountEmailVerificationText,
  AccountStatusText,
} from '../../../view-models/User';
import {AccountEmailVerificationLabel} from '../../../components/admin/AccountEmailVerificationLabel';
import {AccountStatusLabel} from '../../../components/admin/AccountStatusLabel';
import {isServer} from '../../../utils/environment';

interface FilterProps {
  column: {
    filterValue: number | string;
    setFilter: (value: number | string) => void;
  };
}

function SelectStatusFilter({
  column: {filterValue, setFilter},
}: FilterProps): JSX.Element {
  const options = [AccountStatus.ACTIVE, AccountStatus.INACTIVE];

  return (
    <select
      className="form-control form-control-sm"
      value={filterValue}
      onChange={(e): void => {
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

const SelectEmailVerificationFilter: FC<FilterProps> = ({
  column: {filterValue, setFilter},
}: FilterProps) => {
  return (
    <select
      className="form-control form-control-sm"
      value={filterValue}
      onChange={(e): void => {
        setFilter(e.target.value || '');
      }}>
      <option value="">All</option>
      <option value="true">{AccountEmailVerificationText.VERIFIED}</option>
      <option value="false">{AccountEmailVerificationText.NOT_VERIFIED}</option>
    </select>
  );
};

const DefaultColumnFilter: FC<FilterProps> = ({
  column: {filterValue, setFilter},
}: FilterProps) => {
  return (
    <input
      className="form-control form-control-sm"
      value={filterValue || ''}
      onChange={(e): void => {
        setFilter(e.target.value || '');
      }}
      placeholder="Search..."
    />
  );
};

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
    Cell: ({cell: {value}}): JSX.Element => (
      <AccountEmailVerificationLabel emailVerified={value} />
    ),
  },
  {
    Header: 'Status',
    accessor: 'status',
    Filter: SelectStatusFilter,
    width: '10%',
    Cell: ({cell: {value}}): JSX.Element => (
      <AccountStatusLabel status={value} />
    ),
  },
  {
    Header: 'Actions',
    sortType: null,
    canFilter: false,
    width: '15%',
    Cell: ({row}): JSX.Element => (
      <>
        <Link
          href="/admin/accounts/[userId]/edit"
          as={`/admin/accounts/${row.values.id}/edit`}>
          <a className="btn btn-sm btn-info">Edit</a>
        </Link>
      </>
    ),
  },
];

function AdminAccountsPage(): JSX.Element | null {
  if (isServer()) {
    return null;
  }

  const [data, setData] = useState<Account[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [totalRecord, setTotalRecord] = useState('...');
  const [loadingData, setLoadingData] = useState(true);
  const router = useRouter();
  const {index = 0, size = 5, ...query} = router.query;

  const fetchData = useCallback(
    async ({pageIndex, pageSize, filters, sortBy}) => {
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
        pageIndex: Number(pageIndex),
        pageSize: Number(pageSize),
        filters: filterObj,
        orders: sortBy,
      });
      setData(accounts.data);
      setPageCount(Math.ceil(accounts.count / pageSize));
      // setTotalRecord(accounts.count);
      setLoadingData(false);
      const queryString = qs.stringify({
        ...filterObj,
        index: pageIndex,
        size: pageSize,
      });
      if (queryString !== '') Router.push(`/admin/accounts?${queryString}`);
    },
    [],
  );

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
              <Table
                data={data}
                defaultFilter={query}
                fetchData={debouncedFetchData}
                loadingData={loadingData}
                manualPageCount={pageCount}
                initialState={{
                  pageIndex: Number(index),
                  pageSize: Number(size),
                }}
                totalRecord={totalRecord}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TableProps<D> {
  data: D[];
  fetchData: (value: {}) => void;
  loadingData: boolean;
  defaultFilter: {};
  manualPageCount: number;
  initialState: {
    pageIndex: number;
    pageSize: number;
  };
  totalRecord: number | string;
}

const Table: FC<TableProps<Account>> = ({
  data,
  fetchData,
  loadingData,
  defaultFilter,
  manualPageCount,
  initialState = {pageIndex: 0, pageSize: 10},
  totalRecord,
}: TableProps<Account>) => {
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
    state: {pageIndex, filters, pageSize, sortBy},
  } = useTable(
    {
      columns: tableColumns,
      data,
      manualFilters: true,
      initialState: {
        filters: Object.keys(defaultFilter).map(key => ({
          id: key,
          value: defaultFilter[key],
        })),
        ...initialState,
      },
      defaultColumn: {
        Filter: DefaultColumnFilter,
      },
      manualPagination: true,
      autoResetPage: true,
      manualSortBy: true,
      pageCount: manualPageCount,
    },
    useFilters,
    useSortBy,
    usePagination,
  );

  useEffect(() => {
    fetchData({pageIndex, pageSize, filters, sortBy});
  }, [fetchData, pageIndex, pageSize, filters, sortBy]);

  useEffect(() => {
    if (pageIndex > manualPageCount - 1) gotoPage(0);
  }, [manualPageCount]);

  return (
    <>
      <table className="table table-responsive-sm" {...getTableProps()}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={`th-${index}`}
                style={{width: header.width}}
                {...header.getHeaderProps(header.getSortByToggleProps())}>
                {header.render('Header')}
                <span className="float-right">
                  {header.isSorted ? (
                    header.isSortedDesc ? (
                      <i className="cil-sort-descending"></i>
                    ) : (
                      <i className="cil-sort-ascending"></i>
                    )
                  ) : null}
                </span>
              </th>
            ))}
          </tr>
          <tr>
            {headers.map((header, index) => (
              <th key={`th-filter-${index}`}>
                {header.canFilter ? header.render('Filter') : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="mh-50" {...getTableBodyProps()}>
          {loadingData ? (
            <tr>
              <td colSpan={tableColumns.length} className="text-center">
                <div className="spinner-grow" />
              </td>
            </tr>
          ) : (
            page.map(row => {
              prepareRow(row);
              return (
                <tr key={row.id} {...row.getRowProps()}>
                  {row.cells.map((cell, i) => {
                    return (
                      <td key={`${row.id}-${i}`} {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </td>
                    );
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
            Go to page:
            <input
              type="number"
              className="form-control d-inline-block ml-1"
              defaultValue={pageIndex + 1}
              min={1}
              max={manualPageCount}
              onChange={(e): void => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{width: '100px'}}
            />
          </span>
          <span className="ml-2">Total records: {totalRecord}</span>
        </div>
        <div className="col-6">
          <ul className="pagination justify-content-end">
            <li
              className={classNames('page-item', {disabled: !canPreviousPage})}
              onClick={(): void => gotoPage(0)}>
              <a className="page-link u-cursor-pointer">{'<<'}</a>
            </li>
            <li
              className={classNames('page-item', {disabled: !canPreviousPage})}
              onClick={(): void => previousPage()}>
              <a className="page-link u-cursor-pointer">{'<'}</a>
            </li>
            <li
              className={classNames('page-item', {disabled: !canNextPage})}
              onClick={(): void => nextPage()}>
              <a className="page-link u-cursor-pointer">{'>'}</a>
            </li>
            <li
              className={classNames('page-item', {disabled: !canNextPage})}
              onClick={(): void => gotoPage(pageCount - 1)}>
              <a className="page-link u-cursor-pointer">{'>>'}</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default adminOnly(
  AdminAccountsPage as NextComponentType<NextPageContext, any, any>,
);
