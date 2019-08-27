import { ColumnElement } from './column-element';

export class MainElement {

  label: string;
  list: string;
  columns: ColumnElement[];
  filters: any[];

  search_enabled?: boolean;
  pagination_label?: string;
  editDisable?: boolean;
  buttons?: any[];

  constructor(list: string, label: string) {
    this.list = list;
    this.label = label;
  }

  disableSearch() {
    this.search_enabled = false;

    return this;
  }

  disableEdit() {
    this.editDisable = true;

    return this;
  }

  setColumns(columns: ColumnElement[]) {
    this.columns = [ ...columns ];

    return this;
  }

  setFilters(filters: any[]) {
    this.filters = [ ...filters ];

    return this;
  }

  setButtons(buttons: any[]) {
    this.buttons = [ ...buttons ];

    return this;
  }

  removeCreateButton() {
    this.buttons = [];

    return this;
  }
}
