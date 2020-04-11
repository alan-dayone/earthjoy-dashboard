/* tslint:disable:no-default-export */
import React, {FC, useCallback, useEffect, useState} from 'react';
import Head from 'next/head';
import {
  CellProps,
  Column,
  useAsyncDebounce,
  useFilters,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';
import Link from 'next/link';
import Router, {useRouter} from 'next/router';
import qs from 'qs';
import {adminOnly} from '../../../hocs';
import {accountService} from '../../../services';
import {Account, AccountStatus} from '../../../models/Account';
import {
  AccountEmailVerificationText,
  AccountStatusText,
} from '../../../view-models/Account';
import {AccountEmailVerificationLabel} from '../../../components/admin/AccountEmailVerificationLabel';
import {AccountStatusLabel} from '../../../components/admin/AccountStatusLabel';
import {isServer} from '../../../utils/environment';
import {PaginationContainer} from '../../../components/admin/DataTable';
import {PAGE_SIZE} from '../../../view-models/admin/DataTable';

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

const tableColumns: Column[] = [
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
    Cell: function EmailVerificationCell({
      cell: {value},
    }: CellProps<Account>): JSX.Element {
      return <AccountEmailVerificationLabel emailVerified={value} />;
    } as FC<CellProps<Account>>,
  },
  {
    Header: 'Status',
    accessor: 'status',
    Filter: SelectStatusFilter,
    width: '10%',
    Cell: function AccountStatusCell({
      cell: {value},
    }: CellProps<Account>): JSX.Element {
      return <AccountStatusLabel status={value} />;
    } as FC<CellProps<Account>>,
  },
  {
    Header: 'Actions',
    sortType: null,
    disableSortBy: true,
    disableFilters: true,
    width: '15%',
    Cell: function ActionCell({row}): JSX.Element {
      return (
        <>
          <Link
            href="/admin/accounts/[userId]/edit"
            as={`/admin/accounts/${row.values.id}/edit`}>
            <a className="btn btn-sm btn-info">Edit</a>
          </Link>
        </>
      );
    } as FC<CellProps<Account>>,
  },
];

interface TableProps<D> {
  data: D[];
  fetchData: (value: {}) => void;
  loadingData: boolean;
  defaultFilter: {};
  pageCount: number;
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
  pageCount,
  initialState = {pageIndex: 0, pageSize: PAGE_SIZE},
  totalRecord,
}: TableProps<Account>) => {
  const {
    getTableProps,
    getTableBodyProps,
    headers,
    page,
    prepareRow,
    gotoPage,
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
      pageCount,
    },
    useFilters,
    useSortBy,
    usePagination,
  );

  useEffect(() => {
    fetchData({pageIndex, pageSize, filters, sortBy});
  }, [fetchData, pageIndex, pageSize, filters, sortBy]);

  // TODO: {...header.getHeaderProps(header.getSortByToggleProps())} cause style of <th> to be overwritten.
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
      <PaginationContainer
        pageSize={pageSize}
        pageIndex={pageIndex}
        totalRecord={totalRecord as number}
        onPageChange={gotoPage}
      />
    </>
  );
};

const AdminAccountsPage: FC<{}> = () => {
  if (isServer()) {
    return null;
  }

  const [data, setData] = useState<Account[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [totalRecord, setTotalRecord] = useState<number>(null);
  const [loadingData, setLoadingData] = useState(true);
  const {pageIndex = 0, ...query} = Router.query;

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
        pageIndex,
        pageSize,
        filters: filterObj,
        orders: sortBy,
      });
      setData(accounts.data);
      setPageCount(Math.ceil(accounts.count / pageSize));
      setTotalRecord(accounts.count);
      setLoadingData(false);
      const queryString = qs.stringify({
        ...filterObj,
        pageIndex,
      });

      if (queryString !== '') {
        Router.push(`/admin/accounts?${queryString}`);
      }
    },
    [],
  );

  const debounceFetchData = useAsyncDebounce(fetchData, 500);

  console.log('render');
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
                fetchData={debounceFetchData}
                loadingData={loadingData}
                pageCount={pageCount}
                initialState={{
                  pageIndex: Number(pageIndex),
                  pageSize: PAGE_SIZE,
                }}
                totalRecord={totalRecord}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default adminOnly(AdminAccountsPage);
