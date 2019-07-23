export class FormatString {
  public format(str, data) {
    const open = '{';
    const close = '}';
    const pieces = [];
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
      propValue = this.getPropValue(data, key);
      before = str.substring(pos, start);
      pieces.push(before);
      pieces.push(propValue);
      pos = end + 1;
    }
    return pieces.join('');
  }

  public getPropValue(data, key: string) {
    const props = key.split('.');
    const prop = props.shift();
    if (!props.length) {
      if (data) {
        return data[prop];
      }
    } else {
      if (data) {
        return this.getPropValue(data[prop], props.join('.'));
      }
    }
  }
};
