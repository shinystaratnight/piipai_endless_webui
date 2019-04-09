import { Pipe, PipeTransform } from '@angular/core';

import { TimeService } from '../services';

@Pipe({
  name: 'dateFormat' //tslint:disable-line
})
export class DateFormatPipe implements PipeTransform {

  constructor(private time: TimeService) {}

  public transform(value: string, format: string): string {
    const formats = {
      date: 'DD/MM/YYYY',
      datetime: 'DD/MM/YYYY hh:mm A',
      time: 'hh:mm A',
    };

    return this.time.instance(value)
      .format(formats[format] ? formats[format] : format);
  }
}
