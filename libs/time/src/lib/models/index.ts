import * as moment from 'moment-timezone';
import {
  Moment,
  MomentFormatSpecification,
  MomentInput,
} from 'moment-timezone';

moment.updateLocale('en', {
  week: {
    dow: 1, // Monday is the first day of the week.
  },
});

export class Time {
  static duration = moment.duration;
  static utc = moment.utc;

  static now(timezone?: string): Moment {
    if (typeof timezone === 'string') {
      return moment.tz(timezone);
    }

    return moment();
  }

  static parse(
    value: MomentInput,
    config: { format?: MomentFormatSpecification; timezone?: string } = {}
  ): Moment {
    const { format, timezone } = config;

    if (format && timezone && typeof value === 'string') {
      return moment.tz(value, format, timezone);
    } else if (format) {
      return moment(value, format);
    } else if (timezone) {
      return moment.tz(value, timezone);
    } else {
      return moment(value);
    }
  }
}
