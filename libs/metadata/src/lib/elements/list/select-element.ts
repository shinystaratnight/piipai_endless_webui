export const Select = 'select';

export class SelectElement {
  type = Select;

  field: string;

  values?: any;
  color?: any;

  constructor(field: string) {
    this.field = field;
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
