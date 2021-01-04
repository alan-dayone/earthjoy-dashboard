import * as Moment from 'moment';
import {extendMoment} from 'moment-range';

const moment = extendMoment(Moment);

export const enumerateDatesBetween = (
  fromDate: Date,
  toDate: Date,
): string[] => {
  const range = moment.range(new Date(fromDate), new Date(toDate));
  const dates = Array.from(range.by('days'));
  return dates.map(m => m.format('YYYY-MM-DD'));
};
