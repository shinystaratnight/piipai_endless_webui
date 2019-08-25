export class ColumnElement {

  label: string;
  name: string;

  delim?: any;
  sort?: boolean;
  sorted_field?: string;
  center?: boolean;
  hide?: boolean;

  content: any[];

  constructor(name: string, label: string) {
    this.name = name;
    this.label = label;
  }

  update(delim: any) {
    this.delim = delim;

    return this;
  }

  setCenter() {
    this.center = true;

    return this;
  }

  setContent(content: any[]) {
    this.content = [ ...content ];

    return this;
  }

  setSort(sort: boolean, sorted_field: string) {
    this.sort = sort;
    this.sorted_field = sorted_field;

    return this;
  }

  setHide() {
    this.hide = true;

    return this;
  }
}
