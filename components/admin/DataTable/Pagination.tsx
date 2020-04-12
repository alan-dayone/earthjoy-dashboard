import React, {FC} from 'react';
import ReactPaginate from 'react-paginate';

interface Props {
  pageIndex: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

const PAGE_RANGE_DISPLAYED = 5;
const MARGIN_PAGES_DISPLAYED = 2;

export const Pagination: FC<Props> = ({
  pageIndex,
  pageCount,
  onPageChange,
}: Props) => {
  return (
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
  );
};
