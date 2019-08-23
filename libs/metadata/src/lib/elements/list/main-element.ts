import { ColumnElement } from './column-element';

export class MainElement {

  label: string;
  list: string;
  columns: ColumnElement[];
  filters: any[];

  search_enabled?: boolean;
  pagination_label?: string;

  constructor(list: string, label: string) {
    this.list = list;
    this.label = label;
  }

  disableSearch() {
    this.search_enabled = false;

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
}
