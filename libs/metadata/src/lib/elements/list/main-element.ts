import { ColumnElement } from './column-element';

export class MainElement {
  columns: ColumnElement[];
  filters: any[];

  search_enabled = true;
  pagination_label?: string;
  editDisable?: boolean;
  buttons?: any[];
  canEdit?: string;
  editEndpoint?: string;

  constructor(public list: string, public label: string) { }

  disableSearch() {
    this.search_enabled = false;

    return this;
  }

  disableEdit() {
    this.editDisable = true;

    return this;
  }

  setColumns(columns: ColumnElement[]) {
    this.columns = [...columns];

    return this;
  }

  setFilters(filters: any[]) {
    this.filters = [...filters];

    return this;
  }

  setButtons(buttons: any[]) {
    this.buttons = [...buttons];

    return this;
  }

  removeCreateButton() {
    this.buttons = [];

    return this;
  }

  setEditOptions(endpoint: string, ifExist: string) {
    this.canEdit = ifExist;
    this.editEndpoint = endpoint;

    return this;
  }
}
