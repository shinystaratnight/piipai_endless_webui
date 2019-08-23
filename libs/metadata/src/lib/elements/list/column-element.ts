export class ColumnElement {

  label: string;
  name: string;

  delim?: any;

  content: any[];

  constructor(name: string, label: string) {
    this.name = name;
    this.label = label;
  }

  update(delim: any) {
    this.delim = delim;

    return this;
  }

  setContent(content: any[]) {
    this.content = [ ...content ];

    return this;
  }
}
