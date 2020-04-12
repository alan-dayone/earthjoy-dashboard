import React, {FC} from 'react';
import {FilterProps} from 'react-table';

type Items = Array<{value: string; label: string}>;

interface Props {
  items: Items;
  value: string;
  onChange: (value: string) => void;
}

const SelectFilter: FC<Props> = ({items, value, onChange}: Props) => (
  <select
    className="form-control form-control-sm"
    value={value}
    onChange={(e): void => onChange(e.target.value || '')}>
    <option value="">All</option>
    {items.map(({value, label}) => (
      <option key={value} value={value}>
        {label}
      </option>
    ))}
  </select>
);

export const createSelectFilter = <D extends object>({
  items,
}: {
  items: Items;
}): FC<FilterProps<D>> => {
  const CreatedSelectFilter: FC<FilterProps<D>> = (props: FilterProps<D>) => (
    <SelectFilter
      items={items}
      value={props.column.filterValue}
      onChange={props.column.setFilter}
    />
  );
  return CreatedSelectFilter;
};
