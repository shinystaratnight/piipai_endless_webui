import { Pipe, PipeTransform } from '@angular/core';
import { getTimeInstance } from '@webui/utilities';

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

    if (!value) {
      return '';
    }

    return getTimeInstance()(value)
      .format(formats[format] ? formats[format] : format);
  }
}
