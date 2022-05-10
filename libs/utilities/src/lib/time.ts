import * as moment from 'moment-timezone';
import { Moment } from 'moment-timezone';

// export const timeZone = 'Australia/Sydney';

// setTimeZone(timeZone);
moment.updateLocale('en', {
  week: {
    dow: 1, // Monday is the first day of the week.
  } as any,
});

export function getTimeInstance(): any {
  return moment;
}

export function parseDate(
  date: string,
  timezone?: string,
  format?: string
): Moment {
  return moment.tz(date, format, timezone);
}

export function getTimeByTimezone(timezone: string) {
  return moment.tz(timezone);
}

function getToday() {
  return moment();
}

export function getTimeZoneOffset() {
  return getToday().format('Z').slice(1);
}
