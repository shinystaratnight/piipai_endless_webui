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

export function getElementFromMetadata(metadata: Field[], key: string): Field {
  let element = null;
  metadata.forEach((el: Field) => {
    if (el.key === key) {
      if (!element) {
        element = el;
      }
    } else if (el.children) {
      if (!element) {
        element = getElementFromMetadata(el.children, key);
      }
    }
  });
  return element;
}
