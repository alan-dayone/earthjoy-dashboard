import React, {useState, useEffect} from 'react';
import {
  Renderer,
  FilterProps,
  CellProps,
  Column,
  useAsyncDebounce,
  useFilters,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';
import {PaginationContainer} from './Pagination';
import {PAGE_SIZE} from '../../../view-models/admin/DataTable';

const DELAY_FETCHING_DATA = 500; // 500ms to avoid calling API while typing search.

interface Props {
  tableColumns: Column[];
  fetchData: Function;
}

const DefaultColumnFilter = ({column: {filterValue, setFilter}}) => {
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

export const DataTable = ({tableColumns, fetchData}: Props) => {
  const [loadingData, setLoadingData] = useState(true);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

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
        pageIndex: 0,
        pageSize: PAGE_SIZE,
        filters: [],
      },
      defaultColumn: {
        Filter: DefaultColumnFilter,
      },
      manualPagination: true,
      autoResetPage: true,
      manualSortBy: true,
    },
    useFilters,
    useSortBy,
    usePagination,
  );

  const handleChange = useAsyncDebounce(async () => {
    setLoadingData(true);

    const filterObj = filters.reduce(
      (acc, {id, value}) => ({...acc, [id]: value}),
      {},
    );
    const sortByArr = sortBy.map(value => {
      return `${value.id} ${value.desc ? 'desc' : 'asc'}`;
    });

    const {data, count} = await fetchData({
      pageIndex,
      filters: filterObj,
      pageSize,
      orders: sortByArr,
    });

    setLoadingData(false);
    setData(data);
    setTotal(count);
  }, DELAY_FETCHING_DATA);

  useEffect(() => {
    handleChange();
  }, [pageIndex, filters, sortBy]);

  return (
    <>
      <table className="admin-table table table-responsive-sm">
        <thead>
          <tr>
            {headers.map((header, index) => {
              const {
                style: headerStyle,
                ...otherHeaderProps
              } = header.getHeaderProps(header.getSortByToggleProps());
              return (
                <th
                  key={`th-${index}`}
                  style={{width: header.width, ...headerStyle}}
                  {...otherHeaderProps}>
                  {header.render('Header')}
                  <span className="float-right">
                    {header.isSorted ? (
                      header.isSortedDesc ? (
                        <i className="cil-sort-descending" />
                      ) : (
                        <i className="cil-sort-ascending" />
                      )
                    ) : null}
                  </span>
                </th>
              );
            })}
          </tr>
          <tr>
            {headers.map((header, index) => (
              <th key={`th-filter-${index}`}>
                {header.canFilter ? header.render('Filter') : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="mh-50">
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
        totalRecord={total}
        onPageChange={gotoPage}
      />
    </>
  );
};
