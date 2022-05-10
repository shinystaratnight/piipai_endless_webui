import { Injectable } from '@angular/core';
import { getTimeInstance, isCandidate, isMobile } from '@webui/utilities';
import { UserService } from './user.service';
import { DATE_FORMAT, DATE_TIME_FORMAT, TIME_FORMAT } from '@webui/time';

@Injectable({
  providedIn: 'root',
})
export class FormatterService {
  constructor(private userService: UserService) {}

  formatString(str: string, data: { [key: string]: any }): any {
    const open = '{';
    const close = '}';
    const pieces = [];
    const timezone = data['timezone'] || data['time_zone'];

    let before;
    let propValue;
    let pos = 0;
    let trail;

    while (true && str) {
      const start = str.indexOf(open, pos);
      const end = str.indexOf(close, pos);
      const key = str.substring(start + 1, end);

      if (start === -1 || end === -1) {
        trail = str.substr(pos);
        if (trail !== '') {
          pieces.push(trail);
        }
        break;
      }

      propValue = this.getPropValue(data, key, timezone);
      before = str.substring(pos, start);
      pieces.push(before);
      pieces.push(propValue);
      pos = end + 1;
    }
    return pieces.join('');
  }

  private getPropValue(data, key: string, timezone?: string) {
    const props = key.split('.');
    const prop = props.shift();
    if (!props.length) {
      if (data) {
        if (prop.indexOf('__') > -1) {
          const timeInstance = timezone
            ? getTimeInstance().tz.setDefault(timezone)
            : getTimeInstance();
          const [field, format] = prop.split('__');
          const datetime = ['date', 'time', 'datetime', 'diff'];
          if (datetime.indexOf(format) > -1) {
            if (data[field]) {
              if (format === 'diff') {
                return timeInstance(data[field]).from(timeInstance());
              }

              return timeInstance(data[field]).format(
                format === 'time'
                  ? TIME_FORMAT
                  : format === 'datetime'
                  ? DATE_TIME_FORMAT
                  : DATE_FORMAT
              );
            } else {
              return isMobile() && isCandidate() ? '-' : '';
            }
          } else {
            return data[prop];
          }
        } else {
          return data[prop];
        }
      }
    } else {
      if (prop === 'session') {
        return this.getPropValue(this.userService.user, props.join('.'));
      }

      if (data) {
        return this.getPropValue(data[prop], props.join('.'));
      }
    }
  }
}
