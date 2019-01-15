import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment-timezone';

@Pipe({
  name: 'dateFormat' //tslint:disable-line
})
export class DateFormatPipe implements PipeTransform {
  public transform(value: string, format: string): string {
    const formats = {
      date: 'DD/MM/YYYY',
      datetime: 'DD/MM/YYYY hh:mm A',
      time: 'hh:mm A',
    };

    return moment.tz(value, 'Australia/Sydney')
      .format(formats[format] ? formats[format] : format);
  }
}
