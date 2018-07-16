import { Pipe, PipeTransform } from '@angular/core';

import moment from 'moment-timezone';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  public transform(value: string, format: string): number {
    const formats = {
      date: 'DD/MM/YYYY',
      datetime: 'DD/MM/YYYY hh:mm A',
      time: 'hh:mm A',
    };

    return moment.tz(value, 'Australia/Sydney')
      .format(formats[format] ? formats[format] : format);
  }
}
