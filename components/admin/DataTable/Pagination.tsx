import React, {FC} from 'react';
import ReactPaginate from 'react-paginate';

interface Props {
  pageIndex: number;
  pageSize: number;
  totalRecord: number;
  onPageChange: (page: number) => void;
}

const PAGE_RANGE_DISPLAYED = 5;
const MARGIN_PAGES_DISPLAYED = 2;

export const PaginationContainer: FC<Props> = ({
  pageIndex,
  pageSize,
  totalRecord,
  onPageChange,
}: Props) => {
  const pageCount = Math.ceil(totalRecord / pageSize);

  return (
    <div className="row">
      <div className="col-6">
        Showing <strong>{pageIndex * pageSize + 1}</strong> to{' '}
        <strong>{Math.min((pageIndex + 1) * pageSize, totalRecord)}</strong> of{' '}
        <strong>{totalRecord}</strong> entries
      </div>
      <div className="col-6">
        <ReactPaginate
          containerClassName="pagination justify-content-end"
          pageClassName="page-item"
          pageLinkClassName="page-link u-cursor-pointer"
          nextClassName="page-item"
          nextLinkClassName="page-link u-cursor-pointer"
          previousClassName="page-item"
          previousLinkClassName="page-link u-cursor-pointer"
          activeClassName="page-item active"
          activeLinkClassName="page-link u-cursor-pointer"
          breakClassName="page-item"
          breakLinkClassName="page-link u-cursor-pointer"
          disabledClassName="disabled"
          disableInitialCallback
          pageCount={pageCount}
          pageRangeDisplayed={PAGE_RANGE_DISPLAYED}
          marginPagesDisplayed={MARGIN_PAGES_DISPLAYED}
          initialPage={0}
          forcePage={pageIndex}
          onPageChange={(pageObj: {selected: number}): void =>
            onPageChange(pageObj.selected)
          }
        />
      </div>
    </div>
  );
};
