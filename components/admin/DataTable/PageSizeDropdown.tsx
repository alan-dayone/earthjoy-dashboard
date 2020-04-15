import React, {FC, PropsWithChildren, useState} from 'react';
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from 'reactstrap';
import {Direction} from 'reactstrap/lib/Dropdown';
interface Props {
  pageSizes: number[];
  className?: string;
  onSetPageSize?: (pageSize: number) => void;
  direction?: Direction;
}

export const PageSizeDropdown: FC<Props> = ({
  pageSizes = [],
  className,
  onSetPageSize,
  direction,
}: PropsWithChildren<Props>) => {
  const [pageSize, setPageSize] = useState(pageSizes[0] || 0);
  return (
    <UncontrolledDropdown className={className} direction={direction}>
      <DropdownToggle>{pageSize} rows</DropdownToggle>
      <DropdownMenu>
        {pageSizes.map((v, i) => (
          <DropdownItem
            key={i}
            onClick={(): void => {
              setPageSize(v);
              onSetPageSize(v);
            }}>
            {v} rows
          </DropdownItem>
        ))}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};
