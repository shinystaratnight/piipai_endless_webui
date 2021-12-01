import { Pipe, PipeTransform } from '@angular/core';
import { DateFormat } from '@webui/data';
import { getTimeInstance } from '@webui/utilities';

@Pipe({
  name: 'dateFormat' //tslint:disable-line
})
export class DateFormatPipe implements PipeTransform {

  public transform(value: string, format: string): string {
    const formats = {
      date: DateFormat.Date,
      datetime: DateFormat.DateTime,
      time: DateFormat.Time,
    };

    if (!value) {
      return '';
    }

    return getTimeInstance()(value)
      .format(formats[format] ? formats[format] : format);
  }
}
