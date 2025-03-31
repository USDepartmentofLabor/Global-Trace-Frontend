import moment from 'moment';
import { DATE_FORMAT } from 'config/constants';

export const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function convertDateToTimestamp(date: Date): number {
  return moment(date).unix();
}

export function convertTimestampToDate(timestamp: number): Date {
  return moment.unix(timestamp).toDate();
}

export function formatDate(
  timestamp: number,
  format: string = DATE_FORMAT,
): string {
  return moment.unix(timestamp).format(format);
}

export function timeAgo(timestamp: number): string {
  return moment.unix(timestamp).fromNow();
}

export function dateToISOString(value: Date): string {
  return moment(value).toISOString();
}

export function currentTimestamp(): number {
  return moment().unix();
}

export function generateDateRange(
  startDate: moment.Moment,
  options: App.RangeDateOptions,
): App.RangeDate[] {
  const result = [];
  const endDate = moment();
  let isChangeStartData = false;
  while (startDate.isSameOrBefore(endDate)) {
    const to = moment(startDate).add(options.amount, options.unit);
    result.push({
      from: isChangeStartData
        ? startDate.add(1, 'milliseconds').unix()
        : startDate.unix(),
      to: to.endOf('day').subtract(1, 'days').unix(),
    });
    startDate = to.add(1, 'milliseconds');
    isChangeStartData = true;
  }
  return result;
}
