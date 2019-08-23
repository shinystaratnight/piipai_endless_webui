export const Row = 'row';

export class RowElement {

  type = Row;
  label?: string;
  children: any[];

  constructor(label?: string) {
    this.label = label;
  }

  setChildren(children: any[]) {
    this.children = [ ...children ];

    return this;
  }

}
