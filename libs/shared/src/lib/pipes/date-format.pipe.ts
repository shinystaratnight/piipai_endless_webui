import { Pipe, PipeTransform } from '@angular/core';
import { getTimeInstance } from '@webui/utilities';
import { DATE_FORMAT, DATE_TIME_FORMAT, TIME_FORMAT } from '@webui/time';

@Pipe({
  name: 'dateFormat', //tslint:disable-line
})
export class DateFormatPipe implements PipeTransform {
  public transform(value: string, format: string): string {
    const formats = {
      date: DATE_FORMAT,
      datetime: DATE_TIME_FORMAT,
      time: TIME_FORMAT,
    };

    if (!value) {
      return '';
    }

    return getTimeInstance()(value).format(
      formats[format] ? formats[format] : format
    );
  }
}
