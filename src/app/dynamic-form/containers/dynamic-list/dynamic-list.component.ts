import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FilterService } from './../../services/filter.service';

@Component({
  selector: 'dynamic-list',
  templateUrl: 'dynamic-list.component.html'
})

export class DynamicListComponent implements OnInit {
  @Input()
  public config: any;

  @Input()
  public data: any[] = [];

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  public body: any[] = [];
  public select: any;
  public filter: any;
  public filtersOfList: any[] = [];
  public selectedAll: boolean = false;

  constructor(
    private filterService: FilterService
  ) {}

  public ngOnInit() {
    this.filterService.filters = this.config.list;
    this.filtersOfList = this.filterService.filters;
    this.select = this.resetSelectedElements(this.data);
    this.filter = {};
    this.body = this.prepareData(this.config.list.columns, this.data);
  }

  public prepareData(config, data) {
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
          obj['name'] = element.field;
          obj['type'] = element.type;
          obj['href'] = element.href ? element.href : null;
          if (el[element.field]) {
            obj['value'] = el[element.field];
          }
          cell.content.push(obj);
        });
        row.content.push(cell);
      });
      prepareData.push(row);
    });
    return prepareData;
  }

  public filterListByColumn(field) {
    if (this.filter[field.name]) {
      this.filter[field.name] = this.filter[field.name] === 'asc' ? 'desc' : 'asc';
    } else {
      this.filter = {};
      this.filter[field.name] = 'asc';
    }
    this.body.sort((prev, next) => {
      let prevValue = this.getValue(prev.content, field.name);
      let nextValue = this.getValue(next.content, field.name);
      if (this.filter[field.name] === 'asc') {
        return prevValue > nextValue ? 1 : -1;
      } else if (this.filter[field.name] === 'desc') {
        return prevValue > nextValue ? -1 : 1;
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
