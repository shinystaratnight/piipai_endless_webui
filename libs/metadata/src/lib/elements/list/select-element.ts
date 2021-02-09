import { BasicListElement } from './basic-list-element';

export const Select = 'select';

export class SelectElement extends BasicListElement {
  values?: any;
  color?: any;

  constructor(field: string) {
    super(field, Select);
  }

  setValues(values: any) {
    this.values = { ...values };

    return this;
  }

  setColors(colors: any) {
    this.color = { ...colors };

    return this;
  }

}
