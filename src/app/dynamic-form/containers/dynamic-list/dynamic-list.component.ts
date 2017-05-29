import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ViewChild
} from '@angular/core';
import { FilterService } from './../../services/filter.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'dynamic-list',
  templateUrl: 'dynamic-list.component.html'
})

export class DynamicListComponent implements OnInit, OnChanges {
  @Input()
  public config: any;

  @Input()
  public data: any;

  @Input()
  public first: boolean;

  @Input()
  public id: number;

  @Input()
  public active: boolean;

  @Input()
  public limit: number;

  @Input()
  public offset: number;

  @Input()
  public sorted: any;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public list: EventEmitter<any> = new EventEmitter();

  @ViewChild('modal')
  public modal;

  @ViewChild('datatable')
  public datatable;

  public body: any[] = [];
  public select: any;
  public sortedColumns: any;
  public filtersOfList: any[] = [];
  public selectedAll: boolean = false;
  public modalInfo: any = {};
  public reason: any;
  public page: number = 1;
  public pagination: any = {};
  public pageSize: number = 0;
  public poped: boolean = false;
  public minimized: boolean = false;
  public position: { top, left };
  public move: boolean = false;

  constructor(
    private filterService: FilterService,
    private modalService: NgbModal
  ) {}

  public ngOnInit() {
    this.filterService.filters = this.config.list;
    this.filtersOfList = this.filterService.filters;
  }

  public ngOnChanges() {
    let config = this.config;
    let data = this.data;
    if (data) {
      this.initPagination(data);
    }
    if (this.sorted) {
      this.sortedColumns = this.sorted;
      let names = Object.keys(this.sorted);
      if (names.length) {
        Object.keys(this.sorted).forEach((el) => {
          this.updateSort(config.list.columns, el, this.sorted[el]);
        });
      } else {
        this.config.list.columns.forEach((el) => {
          this.resetSort(el, false);
        });
      }
    }
    this.datatable.nativeElement.style.zIndex = this.active ? 100 : this.id * 5;
    if (config && data.results) {
      this.select = this.resetSelectedElements(data.results);
      if (config.list) {
        this.sortedColumns = this.getSortedColumns(config.list.columns);
        this.body = this.prepareData(config.list.columns, data.results, config.list.highlight);
      }
    }
  }

  public prepareData(config, data, highlight) {
    let format = require('formatstring');
    let prepareData = [];
    data.forEach((el) => {
      let row = {
        id: el.id,
        content: []
      };
      if (highlight) {
        this.addHighlight(highlight.field, el, row, highlight.values);
      }
      config.forEach((col) => {
        let cell = {
          name: col.name,
          content: [],
          contextMenu: col.context_menu
        };
        col.content.forEach((element) => {
          let obj: any = {};
          let props;
          obj['name'] = element.field;
          obj['type'] = element.type;
          if (element.link) {
            obj['link'] = format(element.link, el);
          } else if (element.endpoint) {
            obj['endpoint'] = format(element.endpoint, el);
          } else if (element.type === 'button') {
            obj.templateOptions = {
              label: element.label,
              icon: element.icon.slice(element.icon.indexOf('-') + 1),
              small: true,
              mb: false,
              action: element.action
            };
          }
          if (element.fields) {
            obj.fields = [];
            element.fields.forEach((field, index) => {
              let item = Object.assign({}, field);
              obj.fields[index] = item;
              props = field.field.split('.');
              this.setValue(el, props, item);
            });
          } else if (element.field) {
            props = element.field.split('.');
            this.setValue(el, props, obj);
          }
          if (!this.checkValue(obj)) {
            delete cell.contextMenu;
          }
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
      query: this.sortTable(this.sortedColumns)
    });
  }

  public resetSort(field, emit) {
    delete field.sorted;
    delete this.sortedColumns[field.name];
    if (emit) {
      this.event.emit({
        type: 'sort',
        list: this.config.list.list,
        sort: this.sortedColumns
      });
    }
  }

  public updateSort(columns, name, value) {
    columns.forEach((el) => {
      if (name === el.name) {
        el.sorted = value;
      }
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

  public checkValue(obj) {
    if (obj.value) {
      return !!obj.value;
    } else if (obj.fields) {
      let value = '';
      obj.fields.forEach((el) => {
        if (el.value) {
          value = el.value;
        }
      });
      return !!value;
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
      list: e.list,
      query: this.filterService.getQuery(e.list)
    });
  }

  public openModal(modal, field) {
    this.modalInfo.endpoint = field.endpoint;
    this.modalInfo.label = field.label;
    this.modalInfo.type = 'form';
    this.open(modal, {size: 'lg'});
  }

  public open(modal, options = {}) {
    this.modalService.open(modal, options).result.then((reason) => {
      this.reason = reason;
    }, (reason) => {
      this.reason = reason;
    });
  }

  public initPagination(data) {
    if (this.pagination.offset !== this.offset) {
      let count = data.count;
      let length = this.limit ? this.limit : data.results.length;
      if (!this.limit && !this.offset) {
        this.limit = length;
        this.offset = length;
        this.page = 1;
      } else {
        this.page = (this.offset / this.limit) + 1;
      }
      if (count % length === 0) {
        this.pageSize = (count / length) * 10;
      } else if (count % length > 0) {
        this.pageSize = (Math.ceil(count / length) * 10);
      }
      this.pagination['limit'] = this.limit;
      this.pagination['offset'] = this.offset;
    }
  }

  public sortTable(sorted) {
    let query = 'ordering=';
    let queries = '';
    let columns = Object.keys(sorted);
    columns.forEach((el) => {
      if (sorted[el] === 'desc') {
        queries += `-${el},`;
      } else if (sorted[el] === 'asc') {
        queries += `${el},`;
      }
    });
    query += queries.slice(0, queries.length - 1);
    return query;
  }

  public pageChange() {
    let query;
    this.selectedAll = false;
    this.select = {};
    if (this.page === 2) {
      query = `limit=${this.limit}&offset=${this.limit}`;
    } else if (this.page === 1) {
      query = `limit=${this.limit}&offset=0`;
    } else {
      query = `limit=${this.limit}&offset=${this.limit * (this.page - 1)}`;
    }
    this.event.emit({
      type: 'pagination',
      list: this.config.list.list,
      query
    });
  }

  public popedTable() {
    this.filtersOfList = this.filterService.getFiltersOfList(this.config.list.list);
    this.poped = true;
    this.position = {
      top: this.datatable.nativeElement.offsetTop,
      left: this.datatable.nativeElement.offsetLeft
    };
    this.datatable.nativeElement.style.position = 'fixed';
  }

  public unpopedTable() {
    this.filterService.filters = this.config.list;
    this.poped = false;
    this.minimized = false;
    this.datatable.nativeElement.style.position = 'relative';
    this.datatable.nativeElement.style.top = 0;
    this.datatable.nativeElement.style.left = 0;
    this.datatable.offsetTop = this.position.top;
    this.datatable.offsetLeft = this.position.left;
  }

  public minimizeTable() {
    this.minimized = !this.minimized;
  }

  public closeTable() {
    this.event.emit({
      type: 'close',
      list: this.config.list.list
    });
    this.filterService.resetQueries(this.config.list.list);
  }

  public buttonHandler(e) {
    this.modalInfo = {};
    if (e.value) {
      this[e.value](e.el.fields);
    }
  }

  public openMap(value) {
    value.forEach((el) => {
      let keys = el.field.split('.');
      this.modalInfo[keys[keys.length - 1]] = +el.value;
    });
    this.modalInfo.type = 'map';
    this.open(this.modal, {size: 'lg'});
  }

  public eventHandler(e) {
    this.modalInfo = {};
    this.modalInfo.type = e.target;
    this.modalInfo.endpoint = e.endpoint;
    this.modalInfo.label = e.label;
    this.modalInfo.id = e.id;
    this.open(this.modal, {size: 'lg'});
  }

  public activeTable(e) {
    this.event.emit({
      type: 'active',
      list: this.config.list.list
    });
  }

  public addHighlight(prop, data, row, values) {
    let props = prop.split('.');
    let key = props.shift();
    if (props.length === 0) {
      row.highlight = values[data[prop]];
    } else {
      this.addHighlight(props.join('.'), data[key], row, values);
    }
  }

}
