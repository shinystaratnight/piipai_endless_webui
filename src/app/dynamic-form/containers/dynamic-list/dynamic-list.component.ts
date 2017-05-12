import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FilterService } from './../../services/filter.service';

@Component({
  selector: 'dynamic-list',
  templateUrl: 'dynamic-list.component.html'
})

export class DynamicListComponent implements OnInit, OnChanges {
  @Input()
  public config: any;

  @Input()
  public data: any;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  public body: any[] = [];
  public select: any;
  public sortedColumns: any;
  public filtersOfList: any[] = [];
  public selectedAll: boolean = false;

  constructor(
    private filterService: FilterService
  ) {}

  public ngOnInit() {
    // this.filterService.filters = this.config.list;
    // this.filtersOfList = this.filterService.filters;
    this.sortedColumns = {};
  }

  public ngOnChanges() {
    if (this.config && this.data) {
      this.select = this.resetSelectedElements(this.data);
      if (this.config.list) {
        this.sortedColumns = this.getSortedColumns(this.config.list.columns);
        this.body = this.prepareData(this.config.list.columns, this.data);
      }
    }
  }

  public prepareData(config, data) {
    let format = require('formatstring');
    let prepareData = [];
    data.forEach((el) => {
      let row = {
        id: el.id,
        content: []
      };
      config.forEach((col) => {
        let cell = {
          name: col.name,
          content: [],
          contextMenu: col.context_menu
        };
        col.content.forEach((element) => {
          let obj = {};
          let props = element.field.split('.');
          obj['name'] = element.field;
          obj['type'] = element.type;
          if (element.link) {
            obj['link'] = format(element.link, el);
          } else if (element.endpoint) {
            obj['endpoint'] = format(element.endpoint, el);
          }
          this.setValue(el, props, obj);
          cell.content.push(obj);
        });
        row.content.push(cell);
      });
      prepareData.push(row);
    });
    return prepareData;
  }

  public getSortedColumns(config) {
    let result = {};
    config.forEach((el) => {
      if (el.sorted) {
        result[el.name] = el.sorted;
      }
    });
    return result;
  }

  public sorting(field) {
    if (this.sortedColumns[field.name]) {
      this.sortedColumns[field.name] = this.sortedColumns[field.name] === 'asc' ? 'desc' : 'asc';
      field.sorted = field.sorted === 'asc' ? 'desc' : 'asc';
    } else {
      let key = 'desc';
      this.sortedColumns[field.name] = key;
      field.sorted = key;
    }
    this.event.emit({
      type: 'sort',
      list: this.config.list.list,
      sort: this.sortedColumns
    });
  }

  public resetSort(field) {
    delete field.sorted;
    delete this.sortedColumns[field.name];
    this.event.emit({
      type: 'sort',
      list: this.config.list.list,
      sort: this.sortedColumns
    });
  }

  public getValue(data, name) {
    let result = '';
    data.forEach((el) => {
      if (el.name === name) {
        let value = '';
        el.content.forEach((elem) => {
          if (elem.value) {
            value += `${elem.value} `;
          }
        });
        result = value;
      } else if (el.content) {
        this.getValue(el.content, name);
      }
    });
    return result;
  }

  public setValue(data, props, object) {
    let prop = props.shift();
    if (props.length === 0) {
      object['value'] = data[prop];
    } else if (data[prop]) {
      this.setValue(data[prop], props, object);
    }
  }

  public selectAll() {
    let keys = Object.keys(this.select);
    keys.forEach((el) => {
      this.select[el] = this.selectedAll;
    });
  }

  public resetSelectedElements(data) {
    let select = {};
    data.forEach((el) => {
      select[el.id] = false;
    });
    return select;
  }

  public actionHandler(e) {
    this.event.emit({
      type: 'action',
      list: this.config.list.list,
      action: e.action,
      data: this.select
    });
  }

  public filterHandler(e) {
    this.event.emit({
      type: 'filter',
      list: e.list
    });
  }

}
