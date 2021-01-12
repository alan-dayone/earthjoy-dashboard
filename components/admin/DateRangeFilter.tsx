import React, {useCallback, useState} from 'react';
import {DropdownMenu, DropdownToggle, UncontrolledDropdown} from 'reactstrap';
import {DateRangePicker, Range} from 'react-date-range';
import moment from 'moment';

export const DateRangeFilter: React.FC<{
  initialDate?: Date;
  currentDate?: Date;
  onSelectedDateRange: (range: Range) => void;
}> = props => {
  const initialDate = new Date('2000-01-01');
  const currentDate = new Date();

  const [range, setRange] = useState({
    // eslint-disable-next-line react/prop-types
    startDate: props.initialDate || initialDate,
    // eslint-disable-next-line react/prop-types
    endDate: props.currentDate || currentDate,
    key: 'selection',
  });

  const handleSelectDateRange = useCallback(ranges => {
    console.log(ranges.selection);
    setRange(ranges.selection);
    // eslint-disable-next-line react/prop-types
    props.onSelectedDateRange(ranges.selection);
  }, []);

  return (
    <div
      className="c-header-nav-link dropdown-should-transparent"
      data-toggle="dropdown"
      role="button"
      aria-haspopup="true"
      aria-expanded="false">
      <UncontrolledDropdown inNavbar>
        <DropdownToggle caret tag="a" className="u-cursor-pointer">
          {moment(range.startDate).format('YYYY/MM/DD')} -{' '}
          {moment(range.endDate).format('YYYY/MM/DD')}
        </DropdownToggle>
        <DropdownMenu>
          <DateRangePicker ranges={[range]} onChange={handleSelectDateRange} />
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
};
