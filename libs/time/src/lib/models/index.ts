import * as moment from 'moment-timezone';
import { Moment, MomentFormatSpecification } from 'moment-timezone';

moment.updateLocale('en', {
  week: {
    dow: 1, // Monday is the first day of the week.
  },
});

export class Time {
  static duration = moment.duration;

  static now(): Moment {
    return moment().clone();
  }

  static parse(
    value: string,
    config: { format?: MomentFormatSpecification; timezone?: string } = {}
  ): Moment {
    const { format, timezone } = config;

    if (format && timezone) {
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
