import { Field } from '@webui/data';

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
  const keys = key.split('.');
  const prop = keys.shift();
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
      getValueOfData(data[prop], keys.join('.'), obj);
    }
  }
}

export function getElementFromMetadata(metadata: Field[], key: string, param = 'key'): Field {
  let element = null;
  metadata.forEach((el: Field) => {
    if (el[param] === key) {
      if (!element) {
        element = el;
      }
    } else if (el.children) {
      if (!element) {
        element = getElementFromMetadata(el.children, key, param);
      }
    }
  });
  return element;
}

export function removeValue(key: string, data: any): void {
  const keysArray = key.split('.');
  const firstKey = keysArray.shift();

  if (keysArray.length === 0) {
    if (data) {
      delete data[firstKey];
    }
  } else if (keysArray.length > 0) {
    const combineKeys = keysArray.join('.');
    this.removeValue(combineKeys, data[firstKey]);
  }
}

export function createAddAction(data) {
  return {
    action: 'add',
    data
  };
}

export function getEvaluationScore(score) {
  return Math.floor(parseFloat(score));
}

export function getOrientation(): number {
  let orientation;
  if (Number.isInteger((window as any).orientation)) {
    orientation = Math.abs((window as any).orientation);
  } else {
    const stringOrientation = (screen as any).msOrientation
      || (screen as any).mozOrientation
      || ((screen as any).orientation || {} as any).type;
    orientation = stringOrientation.includes('landscape') ? 90 : 0;
  }
  return orientation || 0;
}

export function generateCssStyles(styles: string[] = [], prefix: string): string[] {
  return [styles
    .map((modificator) => {
      return `${prefix}__${modificator}`;
    })
    .reduce((prev, current) => {
      return `${prev} ${current}`;
    }, '')
    .trim() || ''
  ];
}
