import React, {FC, useEffect, useRef, useState} from 'react';
import {
  Column,
  FilterProps,
  Renderer,
  useAsyncDebounce,
  useFilters,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';
import Router from 'next/router';
import qs from 'qs';
import {Pagination} from '../../components/admin/Pagination';
import {PAGE_SIZE, PAGE_SIZE_LIST} from '../../view-models/admin/DataTable';
import {isServer} from '../../utils/environment';
import {InputFilter} from '../../components/admin/DataTable/InputFilter';
import {PageSizeDropdown} from '../../components/admin/DataTable/PageSizeDropdown';

const DELAY_FETCHING_DATA = 500; // 500ms to avoid calling API while typing search.

interface Props {
  tableColumns: Column[];
  findData: Function;
}

const DefaultColumnFilter = ({
  column: {filterValue, setFilter},
}: FilterProps<object>): Renderer<FilterProps<object>> => (
  <InputFilter value={filterValue} onChange={setFilter} />
);

export const DataTable: FC<Props> = ({tableColumns, findData}: Props) => {
  if (isServer) {
    return null;
  }

  const {
    filters: initialFilters = [],
    pageIndex: initialPageIndexStr = 0,
    pageSize: initialPageSizeStr = PAGE_SIZE,
    sortBy: initialSortBy = [],
  } = qs.parse(Router.query);
  const initialPageIndex = parseInt(initialPageIndexStr);
  const initialPageSize = parseInt(initialPageSizeStr);
  const tableLoadedInitialData = useRef(false);
  const [loadingData, setLoadingData] = useState(true);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  const {
    headers,
    page,
    prepareRow,
    gotoPage,
    state: {pageIndex, filters, pageSize, sortBy},
    setPageSize,
  } = useTable(
    {
      columns: tableColumns,
      data,
      manualFilters: true,
      initialState: {
        pageIndex: initialPageIndex,
        pageSize: initialPageSize,
        filters: initialFilters,
        sortBy: initialSortBy,
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

  const fetchData = useAsyncDebounce(async () => {
    setLoadingData(true);

    const filterObj = filters.reduce(
      (acc, {id, value}) => ({...acc, [id]: value}),
      {},
    );
    const sortByArr = sortBy.map(value => {
      return `${value.id} ${value.desc ? 'desc' : 'asc'}`;
    });

    const {data, count} = await findData({
      pageIndex,
      filters: filterObj,
      pageSize,
      orders: sortByArr,
    });

    setData(data);
    setTotal(count);

    if (tableLoadedInitialData.current) {
      const queryStr = qs.stringify({
        pageIndex: pageIndex || undefined,
        filters,
        sortBy,
        pageSize,
      });
      const basePath = Router.pathname;
      const newUrl = queryStr === '' ? basePath : `${basePath}?${queryStr}`;
      Router.replace(newUrl);
    } else {
      tableLoadedInitialData.current = true;
    }

    setLoadingData(false);
  }, DELAY_FETCHING_DATA);

  // Reset page index to 0 when user changes filters or sorting.
  const handleFiltersAndSortChange = useAsyncDebounce(() => {
    if (pageIndex === 0) {
      fetchData();
    } else {
      setLoadingData(true);
      gotoPage(0);
    }
  }, DELAY_FETCHING_DATA);

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize]);

  useEffect(() => {
    if (tableLoadedInitialData.current) {
      handleFiltersAndSortChange();
    }
  }, [filters, sortBy]);

  return (
    <div>
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
                  {header.isSorted && (
                    <span className="float-right">
                      <i
                        className={
                          header.isSortedDesc
                            ? 'cil-sort-descending'
                            : 'cil-sort-ascending'
                        }
                      />
                    </span>
                  )}
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
          ) : page.length > 0 ? (
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
          ) : (
            <tr>
              <td colSpan={tableColumns.length} className="text-center">
                <p className="text-center">No data</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {data.length > 0 && (
        <div className="row">
          <div className="col-6 d-flex align-self-end align-items-center">
            <PageSizeDropdown
              className="d-inline px-2"
              pageSizes={PAGE_SIZE_LIST}
              onSetPageSize={setPageSize}
            />
            <span>
              Showing{' '}
              <strong>{Math.min(pageIndex * pageSize + 1, total)}</strong> to{' '}
              <strong>{Math.min((pageIndex + 1) * pageSize, total)}</strong> of{' '}
              <strong>{total}</strong> entries
            </span>
          </div>
          <div className="col-6">
            <Pagination
              alignRight
              pageCount={Math.ceil(total / pageSize)}
              pageIndex={pageIndex}
              onPageChange={gotoPage}
            />
          </div>
        </div>
      )}
    </div>
  );
};
