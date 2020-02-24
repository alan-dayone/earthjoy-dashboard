/* tslint:disable:no-default-export */
import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import classNames from 'classnames';
import {useFilters, usePagination, useTable} from 'react-table';
import {NextComponentType, NextPageContext} from 'next';
import {adminOnly} from '../../hocs';
import {accountService} from '../../services';

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
    filter: 'equals',
    Filter: SelectStatusFilter,
  },
  {
    Header: 'Status',
    accessor: 'status',
  },
  {
    Header: 'Actions',
  },
];

const defaultColumn = {
  Filter: DefaultColumnFilter,
};

function SelectStatusFilter({column: {filterValue, setFilter}}) {
  const options = ['Active', 'Inactive'];

  return (
    <select
      className="form-control form-control-sm"
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

function DefaultColumnFilter({column: { filterValue, setFilter }}) {
  return (
    <input
      className="form-control form-control-sm"
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
      placeholder={`Search...`}
    />
  )
}

function AccountManagementPage() {
  const [data, setData] = useState([]);

  const filterTypes = React.useMemo(
    () => ({
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
              .toLowerCase()
              .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  );

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
    state: {pageIndex},
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      initialState: {pageIndex: 0, pageSize: 10},
      defaultColumn,
    },
    useFilters,
    usePagination,
  );

  // const filters = headers.map(header => header.filterValue);
  // console.log(filters);
  console.log(pageIndex, headers);

  useEffect(() => {
    (async () => {
      const accounts = await accountService.findAccountsForAdmin(pageIndex);
      setData(accounts);
    })();
  }, [pageIndex]);

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
                    {headers.map((header, index) => (
                      <th key={`th-${index}`}>
                        {header.render('Header')}
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
                <tbody {...getTableBodyProps()}>
                  {page.map((row, i) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                        })}
                      </tr>
                    );
                  })}
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
                    <li
                      className={classNames('page-item', {disabled: !canPreviousPage})}
                      onClick={() => previousPage()}>
                      <a className="page-link" href="#">
                        {'<'}
                      </a>
                    </li>
                    <li className={classNames('page-item', {disabled: !canNextPage})} onClick={() => nextPage()}>
                      <a className="page-link" href="#">
                        {'>'}
                      </a>
                    </li>
                    <li
                      className={classNames('page-item', {disabled: !canNextPage})}
                      onClick={() => gotoPage(pageCount - 1)}>
                      <a className="page-link" href="#">
                        {'>>'}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default adminOnly(AccountManagementPage as NextComponentType<NextPageContext, any, any>);
