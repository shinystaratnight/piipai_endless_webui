import moment from 'moment-timezone';

export class FormatString {
  public format(str, data) {
    let open = '{';
    let close = '}';
    let pieces = [];
    let before;
    let propValue;
    let pos = 0;
    let trail;
    while (true && str) {
      let start = str.indexOf(open, pos);
      let end = str.indexOf(close, pos);
      let key = str.substring(start + 1, end);
      if (start === -1 || end === -1) {
        trail = str.substr(pos);
        if (trail !== '') {
          pieces.push(trail);
        }
        break;
      }
      propValue = this.getPropValue(data, key);
      before = str.substring(pos, start);
      pieces.push(before);
      pieces.push(propValue);
      pos = end + 1;
    }
    return pieces.join('');
  }

  public getPropValue(data, key: string) {
    let props = key.split('.');
    let prop = props.shift();
    if (!props.length) {
      if (data) {
        if (prop.indexOf('__') > -1) {
          let propArray = prop.split('__');
          let datetime = ['date', 'time'];
          if (datetime.indexOf(propArray[1]) > -1) {
            return moment.tz(data[propArray[0]], 'Australia/Sydney')
              .format(propArray[1] === 'time' ? 'hh:mm A' : 'YYYY-MM-DD');
          }
        }
        return data[prop];
      }
    } else {
      if (data) {
        return this.getPropValue(data[prop], props.join('.'));
      }
    }
  }
};
