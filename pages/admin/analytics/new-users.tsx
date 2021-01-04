import React, {FC, useCallback, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {DateRangePicker} from 'react-date-range';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import {DropdownMenu, DropdownToggle, UncontrolledDropdown} from 'reactstrap';
import moment from 'moment';

import {adminOnly} from '../../../hocs/adminOnly';
import {analyticsService} from '../../../services';

const LineChart = dynamic(
  () =>
    import('../../../components/admin/Analytics/LineChart').then(
      mode => mode.LineChart,
    ),
  {ssr: false},
);

const NewUserAnalytics: FC = () => {
  const {t} = useTranslation();
  const initialMonth = new Date();
  initialMonth.setDate(1);
  initialMonth.setMonth(new Date().getMonth() - 1);

  const currentMonth = new Date();
  currentMonth.setDate(0);

  const [range, setRange] = useState({
    startDate: initialMonth,
    endDate: currentMonth,
    key: 'selection',
  });

  const handleSelectDateRange = useCallback(ranges => {
    console.log(ranges.selection);
    setRange(ranges.selection);
  }, []);

  const fetchData = useCallback(() => {
    return analyticsService.getAnalyticsNewUser(
      moment(range.startDate).format('YYYY-MM-DD'),
      moment(range.endDate).format('YYYY-MM-DD'),
    );
  }, [range]);

  const title = useMemo(() => {
    return `New Users (${moment(range.startDate).format(
      'YYYY/MM/DD',
    )} - ${moment(range.endDate).format('YYYY/MM/DD')})`;
  }, [range]);

  return (
    <div className="analytics-page bg-white p-sm-3">
      <Head>
        <title>
          {t('admin')} - {t('dashboard')}
        </title>
      </Head>
      <div className={'col-sm-12 row align-items-center'}>
        <div className={'col-sm-8'}>
          <h4>{title}</h4>
        </div>
        <div className={'col-sm-4'}>
          <div className="row flex-row flex-row-end">
            <div
              className="c-header-nav-link dropdown-should-transparent"
              data-toggle="dropdown"
              role="button"
              aria-haspopup="true"
              aria-expanded="false">
              <UncontrolledDropdown inNavbar>
                <DropdownToggle caret nav tag="a" className="u-cursor-pointer">
                  Select Dates
                </DropdownToggle>
                <DropdownMenu right>
                  <DateRangePicker
                    ranges={[range]}
                    onChange={handleSelectDateRange}
                  />
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </div>
          <div className="row flex-row flex-row-end pr-sm-3">
            <p>
              <strong>
                {moment(range.startDate).format('YYYY/MM/DD')} -{' '}
                {moment(range.endDate).format('YYYY/MM/DD')}
              </strong>
            </p>
          </div>
        </div>
      </div>
      <div className={'row'}>
        <div className="col-sm-12 col-lg-12">
          <LineChart
            fetchData={fetchData}
            title={'New Users'}
            id={'new_user'}
            range={range}
          />
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModalCenter"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                Modal title
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">...</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal">
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default adminOnly(NewUserAnalytics);
