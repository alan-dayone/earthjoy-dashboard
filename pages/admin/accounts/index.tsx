import React, {FC} from 'react';
import Head from 'next/head';
import {CellProps, FilterProps, Renderer} from 'react-table';
import {useTranslation} from 'react-i18next';
import {adminOnly} from '../../../hocs/adminOnly';
import {analyticsService} from '../../../services';
import {Account, AccountAnalyticsInfo} from '../../../models/Account';
import {DataTable} from '../../../containers/admin/DataTable';
import moment from 'moment';
import {DateRangeFilter} from '../../../components/admin/DateRangeFilter';
import {
  AccountTableColumns,
  transformPayload,
} from '../../../view-models/Account';
import {createSelectFilter} from '../../../components/admin/DataTable/SelectFilter';
import {toast} from 'react-toastify';

const AdminAccountsPage: FC = () => {
  const {t} = useTranslation();
  let dataTableRef;
  //
  const tableColumns: {
    disableFilters: boolean;
    Header: string;
    accessor: string;
    width: string;
    disableSortBy: boolean;
  }[] = AccountTableColumns.map(col => {
    const builtColumn = {
      Header: col.label,
      accessor: col.field,
      width: '10%',
      disableFilters: !col.filterable,
      disableSortBy: !col.sortable,
      filterType: col.type,
      Cell: function ActionsCell(
        props: CellProps<AccountAnalyticsInfo>,
      ): JSX.Element {
        if (props.column.filterType === 'date' && props.row.values[col.field])
          return (
            <div>
              {moment(new Date(props.row.values[col.field])).format(
                'MMMM Do YYYY, h:mm:ss a',
              )}
            </div>
          );

        if (col.type === 'custom') {
          return <div>{col.resolver(props.row.values[col.field])}</div>;
        }

        if (col.type === 'action') {
          return (
            <button
              onClick={() => {
                col.handler(props.row.values, () => {
                  toast.success('Deleted successfully');
                  if (dataTableRef) {
                    dataTableRef.refresh();
                  }
                });
              }}
              className={'btn btn-danger'}>
              {col.label}
            </button>
          );
        }
        return <div>{props.row.values[col.field]}</div>;
      } as Renderer<CellProps<Account>>,
    };

    switch (col.type) {
      case 'date':
        // eslint-disable-next-line react/display-name
        builtColumn.Filter = (props: FilterProps<any>) => (
          <DateRangeFilter
            initialDate={props.column.filterValue?.startDate}
            currentDate={props.column.filterValue?.endDate}
            onSelectedDateRange={props.column.setFilter}
          />
        );
        break;
      case 'selection':
        builtColumn.Filter = createSelectFilter<AccountAnalyticsInfo>({
          items: col.items,
        });
        break;
      default:
        break;
    }

    return builtColumn;
  });

  const findData = (payload: object) => {
    const transformedPayload = transformPayload(payload);
    return analyticsService.getAnalyticAccountInfo(transformedPayload);
  };

  return (
    <div id="admin-accounts-page">
      <Head>
        <title>
          {t('admin')} - {t('accountManagement')}
        </title>
      </Head>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <strong>{t('accountManagement')}</strong>
            </div>
            <div className="card-body">
              <div className="text-right mb-2">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={(): void => {
                    if (dataTableRef) {
                      dataTableRef.refresh();
                    }
                  }}>
                  {t('refresh')}
                </button>
              </div>
              <DataTable
                defaultOrders={[{id: 'createdOn', desc: true}]}
                tableColumns={tableColumns}
                findData={findData}
                dataTableRef={(ref): void => {
                  dataTableRef = ref;
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default adminOnly(AdminAccountsPage);
