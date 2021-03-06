import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {DateRangePicker} from 'react-date-range';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import {DropdownMenu, DropdownToggle, UncontrolledDropdown} from 'reactstrap';
import moment from 'moment';

import {adminOnly} from '../../../hocs/adminOnly';
import {analyticsService} from '../../../services';
import {AnalyticsItem, AnalyticsResponse} from '../../../models/Analytics';

const LineChart = dynamic(
  () =>
    import('../../../components/admin/Analytics/LineChart').then(
      mode => mode.LineChart,
    ),
  {ssr: false},
);

const NewUserAnalytics: FC = () => {
  const {t} = useTranslation();
  const initialDate = moment()
    .startOf('week')
    .toDate();
  const currentDate = moment()
    .endOf('week')
    .toDate();

  const [range, setRange] = useState({
    startDate: initialDate,
    endDate: currentDate,
    key: 'selection',
  });

  const [totalUsers, setTotalUsers] = useState<AnalyticsItem>({
    _id: null,
    count: 0,
  });

  const handleSelectDateRange = useCallback(ranges => {
    console.log(ranges.selection);
    setRange(ranges.selection);
  }, []);

  const fetchTotalUsers = useCallback(async () => {
    const response = await analyticsService.getTotalUsers();
    setTotalUsers(response[0]);
  }, []);

  const fetchData = useCallback(async () => {
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

  useEffect(() => {
    fetchTotalUsers();
  }, [fetchTotalUsers]);

  return (
    <div className="analytics-page pb-sm-5">
      <Head>
        <title>
          {t('admin')} - {t('dashboard')}
        </title>
      </Head>
      <div className={'bg-white p-sm-3 text-dark mb-sm-3'}>
        <div className={'col-sm-12 row align-items-center'}>
          <div className={'col-sm-12'}>
            <h4>Total Users</h4>
          </div>
        </div>
        <div className={'col-sm-12 row align-items-center'}>
          <div className={'col-sm-12'}>
            <h1>{totalUsers.count}</h1>
          </div>
        </div>
      </div>

      <div className={'bg-white p-sm-3 text-dark'}>
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
                  <DropdownToggle
                    caret
                    nav
                    tag="a"
                    className="u-cursor-pointer">
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
            <div className="row flex-row flex-row-end">
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
      </div>
    </div>
  );
};

export default adminOnly(NewUserAnalytics);
