export const Row = 'row';

export class RowElement {
  type = Row;

  children: any[];

  label?: string;
  hideBorder?: boolean;

  constructor(label?: string) {
    this.label = label;
  }

  setChildren(children: any[]) {
    this.children = [ ...children ];

    return this;
  }

  noBorder() {
    this.hideBorder = true;

    return this;
  }

}
