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
import {PaginationContainer} from './Pagination';
import {PAGE_SIZE} from '../../../view-models/admin/DataTable';
import {isServer} from '../../../utils/environment';

const DELAY_FETCHING_DATA = 500; // 500ms to avoid calling API while typing search.

interface Props {
  refineFilter?: Function;
  tableColumns: Column[];
  findData: Function;
}

const DefaultColumnFilter = ({
  column: {filterValue, setFilter},
}: FilterProps<object>): Renderer<FilterProps<object>> => {
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

export const DataTable: FC<Props> = ({
  tableColumns,
  findData,
  refineFilter,
}: Props) => {
  if (isServer()) {
    return null;
  }

  const {
    filters: initialFilters = [],
    pageIndex: initialPageIndexStr = 0,
    sortBy: initialSortBy = [],
  } = qs.parse(Router.query);
  const initialPageIndex = parseInt(initialPageIndexStr);

  const isFirstRender = useRef(true);
  const [loadingData, setLoadingData] = useState(true);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  const {
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
        pageIndex: initialPageIndex,
        pageSize: PAGE_SIZE,
        filters: refineFilter ? refineFilter(initialFilters) : initialFilters,
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

  const handleChange = useAsyncDebounce(async () => {
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

    setLoadingData(false);
    setData(data);
    setTotal(count);

    const queryStr = qs.stringify({
      pageIndex: pageIndex || undefined,
      filters,
      sortBy,
    });
    const basePath = Router.pathname;
    const newUrl = queryStr === '' ? basePath : `${basePath}?${queryStr}`;
    Router.push(newUrl);
  }, DELAY_FETCHING_DATA);

  const gotoFirstPage = useAsyncDebounce(() => {
    gotoPage(0);
  }, DELAY_FETCHING_DATA);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else if (pageIndex === 0) {
      handleChange();
    } else {
      gotoFirstPage();
    }
  }, [filters]);

  useEffect(() => {
    handleChange();
  }, [pageIndex, sortBy]);

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
        <PaginationContainer
          pageSize={pageSize}
          pageIndex={pageIndex}
          totalRecord={total}
          onPageChange={gotoPage}
        />
      )}
    </div>
  );
};
