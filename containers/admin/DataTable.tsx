import React, {useCallback, useEffect, useRef, useState} from 'react';
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
// import {useRouter} from 'next/router';
import classNames from 'classnames';
import {Pagination} from '../../components/admin/Pagination';
import {isServer} from '../../utils/environment';
import {InputFilter} from '../../components/admin/DataTable/InputFilter';

const PAGE_SIZE_LIST = [5, 10, 15, 20, 100];
const DELAY_FILTER_CHANGE = 500; // Delay 500ms while typing search before calling API.

const DefaultColumnFilter = ({
  column: {filterValue, setFilter},
}: FilterProps<object>): Renderer<FilterProps<object>> => (
  <InputFilter value={filterValue} onChange={setFilter} />
);

export const DataTable = <D extends object>(props: {
  tableColumns: Array<Column<D>>;
  defaultOrders?: Array<{id: string; desc: boolean}>;
  findData: (options: {
    pageIndex: number;
    filters: Partial<D>;
    pageSize: number;
    orders: Array<string>;
  }) => Promise<{data: Array<D>; count: number}>;
  dataTableRef?: ({refresh: Function}) => void;
}): JSX.Element => {
  if (isServer) {
    return null;
  }

  const {
    // defaultOrders,
    tableColumns,
    findData,
    dataTableRef,
  } = props;
  // const router = useRouter();
  //
  // const dtQuery = JSON.parse((router.query['dtQuery'] as string) || '{}');
  // const {
  //   filters: initialFilters = [],
  //   pageIndex: initialPageIndexStr = 0,
  //   pageSize: initialPageSizeStr = PAGE_SIZE_LIST[1],
  //   sortBy: initialSortBy = defaultOrders ?? [],
  // } = dtQuery;
  //
  // console.log({dtQuery});

  const initialPageIndex = parseInt('0');
  const initialPageSize = parseInt(PAGE_SIZE_LIST[1].toString());
  const initialDataLoaded = useRef(false);
  const [loadingData, setLoadingData] = useState(true);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const {headers, page, prepareRow, gotoPage, state, setPageSize} = useTable(
    {
      columns: tableColumns,
      data,
      manualFilters: true,
      initialState: {
        pageIndex: initialPageIndex,
        pageSize: initialPageSize,
        // filters: initialFilters,
        // sortBy: initialSortBy,
        sortBy: [],
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

  const {filters, pageSize, sortBy, pageIndex: statePageIndex} = state;

  const fetchData = useCallback(async (): Promise<void> => {
    setLoadingData(true);

    const filterObj = filters.reduce(
      (acc, {id, value}) => ({...acc, [id]: value}),
      {},
    );
    const sortByArr = sortBy.map(value => {
      return `${value.id} ${value.desc ? 'desc' : 'asc'}`;
    });

    const {docs: data, totalDocs: count} = await findData({
      pageIndex,
      filters: filterObj,
      pageSize,
      orders: sortByArr,
    });

    setData(data);
    setTotal(count);

    if (initialDataLoaded.current) {
      // const newUrl = new URL(window.location.href);
      // newUrl.searchParams.set(
      //   'dtQuery',
      //   JSON.stringify({
      //     pageIndex: pageIndex || undefined,
      //     filters,
      //     sortBy,
      //     pageSize,
      //   }),
      // );
      // await router.replace(router.route, newUrl.toString());
    } else {
      initialDataLoaded.current = true;
    }

    setLoadingData(false);
  }, [pageIndex, pageSize, filters, sortBy]);

  if (dataTableRef) {
    dataTableRef({refresh: fetchData});
  }

  const fetchAndResetToFirstPage = (): void => {
    if (pageIndex === 0) {
      fetchData();
    } else {
      gotoPage(0);
    }
  };

  const handleFiltersChange = useAsyncDebounce(
    fetchAndResetToFirstPage,
    DELAY_FILTER_CHANGE,
  );

  useEffect(() => {
    setPageIndex(statePageIndex);
  }, [statePageIndex]);
  // Fetch initial data and listen to page index and page size change to fetch new data.
  useEffect(() => {
    fetchData();
    console.log({pageIndex});
  }, [pageIndex, pageSize]);

  // Reset page index to 0 when user changes filters, but debounce the change to wait for user typing.
  useEffect(() => {
    if (initialDataLoaded.current) {
      handleFiltersChange();
    }
  }, [filters]);

  // Reset page index to 0 when user changes sorting.
  useEffect(() => {
    if (initialDataLoaded.current) {
      fetchAndResetToFirstPage();
    }
  }, [sortBy]);

  const showFiltersOnHeader = !!headers.find(header => header.canFilter);

  return (
    <div>
      <div className="table-responsive">
        <table className="admin-table table">
          <thead>
            <tr className={'d-flex'}>
              {headers.map((header, index) => {
                const {
                  style: headerStyle,
                  ...otherHeaderProps
                } = header.getHeaderProps(header.getSortByToggleProps());
                return (
                  <th
                    className={'col-2'}
                    key={`th-${index}`}
                    style={{width: header.width, ...headerStyle}}
                    {...otherHeaderProps}>
                    <div className="d-flex">
                      <div className="flex-grow-1 admin-table__header-text">
                        {header.render('Header')}
                      </div>
                      {header.isSorted && (
                        <span className="align-self-end">
                          <i
                            className={
                              header.isSortedDesc
                                ? 'cil-sort-descending'
                                : 'cil-sort-ascending'
                            }
                          />
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
            {showFiltersOnHeader && (
              <tr className={'d-flex'}>
                {headers.map((header, index) => (
                  <th key={`th-filter-${index}`} className={'col-2'}>
                    {header.canFilter ? header.render('Filter') : null}
                  </th>
                ))}
              </tr>
            )}
          </thead>
          <tbody
            className={classNames({
              'u-opacity--50 u-pointer-events--none': loadingData,
            })}>
            {loadingData && page.length === 0 ? (
              <tr>
                <td colSpan={tableColumns.length} className="text-center">
                  <div className="spinner-grow" />
                </td>
              </tr>
            ) : page.length > 0 ? (
              page.map(row => {
                prepareRow(row);
                return (
                  <tr className={'d-flex'} key={row.id} {...row.getRowProps()}>
                    {row.cells.map((cell, i) => {
                      return (
                        <td
                          className={'col-2'}
                          key={`${row.id}-${i}`}
                          {...cell.getCellProps()}>
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
      </div>
      {data.length > 0 && (
        <div className="row">
          <div className="col-md-6 d-flex align-self-end align-items-center mb-2 mb-sm-0">
            <span>
              Showing{' '}
              <strong>{Math.min(pageIndex * pageSize + 1, total)}</strong> to{' '}
              <strong>{Math.min((pageIndex + 1) * pageSize, total)}</strong> of{' '}
              <strong>{total}</strong> entries
            </span>
            &nbsp;|&nbsp;
            <select
              className="form-control form-control-sm w-auto"
              value={pageSize}
              onChange={(e): void => setPageSize(parseInt(e.target.value))}>
              {PAGE_SIZE_LIST.map((pageSize, index) => (
                <option key={index} value={pageSize}>
                  {pageSize} entries
                </option>
              ))}
            </select>
            &nbsp;per page
          </div>
          <div className="col-md-6">
            <Pagination
              alignRight
              pageCount={Math.ceil(total / pageSize)}
              pageIndex={pageIndex}
              onPageChange={page => {
                setPageIndex(page);
                gotoPage(page);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
