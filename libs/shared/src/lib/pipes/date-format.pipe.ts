import { Pipe, PipeTransform } from '@angular/core';
import { DATE_FORMAT, DATE_TIME_FORMAT, Time, TIME_FORMAT } from '@webui/time';

@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
  public transform(value: string, format: string): string {
    const formats: Record<string, string> = {
      date: DATE_FORMAT,
      datetime: DATE_TIME_FORMAT,
      time: TIME_FORMAT,
    };

    if (!value) {
      return '';
    }

    return Time.parse(value).format(formats[format] ? formats[format] : format);
  }
}
