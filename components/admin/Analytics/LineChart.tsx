import React, {useCallback, useEffect, useState} from 'react';
import chart from 'tui-chart';
import {AnalyticsResponse} from '../../../models/Analytics';
import {enumerateDatesBetween} from '../../../utils/date';

export type Props = {
  fetchData: () => Promise<AnalyticsResponse>;
  title: string;
  id: string;
  range: {
    startDate: Date;
    endDate: Date;
  };
};

type ChartedData = {
  categories: any[];
  series: any[];
};

let lineChart;

export const LineChart: React.FC<Props> = ({
  fetchData,
  title,
  id,
  range,
}: Props) => {
  const [data, setData] = useState<ChartedData>({
    categories: [],
    series: [
      {
        name: title,
        data: [],
      },
    ],
  });

  const handleFetchData = useCallback(async () => {
    const chartedData = {
      categories: [],
      series: [
        {
          name: title,
          data: [],
        },
      ],
    };

    const analyticsData = await fetchData();

    if (analyticsData.length >= 1) {
      analyticsData.sort(
        (elm1, elm2) => new Date(elm1._id) - new Date(elm2._id), // ascending
      );

      const mappedAnalyticsData = analyticsData.reduce((accumulator, item) => {
        accumulator[item._id] = item.count;
        return accumulator;
      }, {});

      const enumeratedDates = enumerateDatesBetween(
        new Date(range.startDate),
        new Date(range.endDate),
      );

      enumeratedDates.map(date => {
        chartedData.categories.push(date);
        chartedData.series[0].data.push(mappedAnalyticsData[date] || 0);
      });
    }

    console.log(chartedData);
    setData(chartedData);
  }, [fetchData]);

  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  const initChart = useCallback(() => {
    const container = window.document.getElementById(`chart-area-${id}`);
    const options = {
      chart: {
        width: container.parentElement.clientWidth - 40,
        height: 520,
      },
      yAxis: {
        title: 'Users',
      },
      xAxis: {
        title: 'Date',
        pointOnColumn: true,
        dateFormat: 'MMM',
        tickInterval: 'auto',
      },
      series: {
        spline: true,
        showDot: false,
      },
    };

    return chart.lineChart(container, data, options);
  }, [data]);

  useEffect(() => {
    if (data.categories.length >= 1) {
      lineChart = initChart();
    }
    return () => {
      try {
        lineChart?.destroy();
      } catch (e) {
        console.log(e);
      }
    };
  }, [data]);

  return <div id={`chart-area-${id}`} />;
};
