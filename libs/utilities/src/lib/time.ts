import { DateFormat } from '@webui/data';
import * as moment from 'moment-timezone';

// export const timeZone = 'Australia/Sydney';

// setTimeZone(timeZone);
moment.updateLocale('en', {
  week: {
    dow: 1 // Monday is the first day of the week.
  } as any
});

export function getTimeInstance(): any {
  return moment;
}

export function getTimeInstanceByTimezone(timezone: string) {
  if (!timezone) {
    return getTimeInstance();
  }

  return moment.tz.setDefault(timezone);
}

export function getLocalTime() {
  return moment().clone();
}

export function getTimeByTimezone(timezone: string) {
  return moment.tz(timezone);
}

export function setTimeZone(timezone: string) {
  moment.tz.setDefault(timezone);
}

export function getToday() {
  return moment();
}

export function getYesterday() {
  return getLocalTime().add(-1, 'day').format();
}

export function getTommorrow() {
  return getLocalTime().add(1, 'day').format();
}

export function getTimeZoneOffset() {
  return getToday().format('Z').slice(1);
}

export function getWeekStart() {
  return getToday().startOf('isoWeek').format();
}

export function getWeekEnd() {
  return getToday().endOf('isoWeek').format();
}

export function getMonthStart() {
  return getToday().startOf('month').format();
}

export function getMonthEnd() {
  return getToday().endOf('month').format();
}

export const dateFormat = DateFormat.Date;
export const datetimeFormat = DateFormat.DateTime;
export const timeFormat = DateFormat.Time;
