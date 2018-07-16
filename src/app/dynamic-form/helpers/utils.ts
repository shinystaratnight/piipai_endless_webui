import { Field } from '../models/field.model';

export function fillingForm(metadata: Field[], data): void {
  metadata.forEach((el) => {
    if (el.key) {
      getValueOfData(data, el.key, el);
    } else if (el.children) {
      fillingForm(el.children, data);
    }
  });
}

export function getValueOfData(data, key: string, obj: Field): void {
  let keys = key.split('.');
  let prop = keys.shift();
  if (keys.length === 0) {
    if (data) {
      if (!obj['value']) {
        obj['value'] = data[key];
      }
      if (obj.type === 'related') {
        if (obj.value && obj.value instanceof Object) {
          if (obj.value.id && obj.value.__str__) {
            obj.options = [obj.value];
          }
        }
      }
    }
  } else {
    if (data[prop]) {
      this.getValueOfData(data[prop], keys.join('.'), obj);
    }
  }
}
