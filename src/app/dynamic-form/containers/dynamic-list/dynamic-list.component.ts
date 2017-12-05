import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ViewChild,
  OnDestroy,
  AfterContentChecked,
  AfterViewInit
} from '@angular/core';
import { FilterService } from './../../services/filter.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';

import { GenericFormService } from './../../services/generic-form.service';

import moment from 'moment-timezone';

@Component({
  selector: 'dynamic-list',
  templateUrl: 'dynamic-list.component.html'
})

export class DynamicListComponent implements
  OnInit, OnChanges, OnDestroy, AfterContentChecked, AfterViewInit {
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

  @Input()
  public innerTables: any;

  @Input()
  public update: any;

  @Input()
  public minimized: boolean;

  @Input()
  public maximize: boolean;

  @Input()
  public refresh: boolean = false;

  @Input()
  public endpoint: string;

  @Input()
  public parentEndpoint: string;

  @Input()
  public inForm: boolean = false;

  @Input()
  public actionData: any;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public list: EventEmitter<any> = new EventEmitter();

  @ViewChild('modal')
  public modal;

  @ViewChild('confirmModal')
  public confirmModal;

  @ViewChild('evaluateModal')
  public evaluateModal;

  @ViewChild('sendMessageModal')
  public sendMessageModal;

  @ViewChild('datatable')
  public datatable;

  @ViewChild('tableWrapper')
  public tableWrapper;

  @ViewChild('showPreviewInvoice')
  public showPreviewInvoice;

  public body: any[] = [];
  public select: any;
  public sortedColumns: any;
  public filtersOfList: any[] = [];
  public selectedAll: boolean = false;
  public modalInfo: any = {};
  public reason: any;
  public page: any;
  public pagination: any = {};
  public pageSize: number = 0;
  public poped: boolean = false;
  public position: { top, left };
  public move: boolean = false;
  public currentData: any;
  public count: number;
  public innerTableCall: any;
  public modalRef: any;
  public refreshing: boolean = false;
  public tabs: any;
  public evaluateEndpoint: string;
  public approveEndpoint: string;
  public currentActionData: any;
  public actionEndpoint: any;

  public showFilters: boolean;

  constructor(
    private filterService: FilterService,
    private modalService: NgbModal,
    private genericFormService: GenericFormService,
    private sanitizer: DomSanitizer
  ) {}

  public ngOnInit() {
    if (this.config.list.filters && this.config.list.search_enabled) {
      this.config.list.filters.push({
        type: 'search',
        query: 'search',
        key: 'search'
      });
    } else if (this.config.list.search_enabled) {
      this.config.list.filters = [
        {
          type: 'search',
          query: 'search',
          key: 'search'
        }
      ];
    }
    if (this.config.list.filters) {
      this.filterService.filters = {
        endpoint: this.parentEndpoint || this.endpoint,
        list: this.config.list
      };
      this.filtersOfList = this.filterService.getFiltersByEndpoint(this.endpoint);
    }
    this.innerTableCall = {
      row: '',
      cell: ''
    };
    if (this.config.list.search_enabled) {
      if (this.filtersOfList.length > 1) {
        this.showFilters = true;
      } else {
        this.showFilters = false;
      }
    } else {
      this.showFilters = !!(this.filtersOfList && this.filtersOfList.length);
    }
  }

  public ngOnChanges() {
    let config = this.config;
    let data = this.data;
    let innerTables = this.innerTables;
    if (this.actionData !== this.currentActionData) {
      this.currentActionData = this.actionData;
      if (this.actionEndpoint.indexOf('/sendsms/') > -1) {
        setTimeout(() => {
          this.openFrame(this.currentActionData.phone_number);
        }, 250);
      }
      return;
    }
    if (!this.tabs) {
      this.tabs = this.config.list.tabs;
    }
    if (config.list.columns) {
      this.updateMetadataByTabs(config.list.columns);
    }
    if (data) {
      this.initPagination(data);
    }
    if (this.maximize) {
      this.unpopedTable();
    }
    if (this.sorted) {
      this.sortedColumns = this.sorted;
      let names = Object.keys(this.sorted);
      if (names.length) {
        names.forEach((el) => {
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
    if (innerTables && this.innerTableCall) {
      let currentRow = innerTables[this.innerTableCall.row];
      if (currentRow) {
        let currentCell = innerTables[this.innerTableCall.row][this.innerTableCall.cell];
        if (currentCell) {
          let cell = innerTables[this.innerTableCall.row][this.innerTableCall.cell];
          if (cell.metadata && cell.data) {
            cell.body = this.prepareData(cell.metadata.list.columns, cell.data.results);
          }
        }
      }
    }
  }

  public ngOnDestroy() {
    if (this.first) {
      this.filterService.filters = {
        endpoint: this.endpoint,
        list: null
      };
      if (this.modalRef) {
        this.modalRef.close();
      }
    }
  }

  public ngAfterContentChecked() {
    this.checkOverfow();
  }

  public ngAfterViewInit() {
    if (this.datatable && !this.inForm) {
      let listButtons: any = this.datatable.nativeElement.getElementsByClassName('list-buttons');
      let filterWrapper: any =
        this.datatable.nativeElement.getElementsByClassName('filter-wrapper');
      let width: any = window.innerWidth;
      let height: any = window.innerHeight;
      let offsetTop;
      if (listButtons && listButtons.length && width > 992) {
        offsetTop = listButtons[0].offsetHeight;
        if (filterWrapper && filterWrapper.length) {
          if (document.body.classList.contains('r3sourcer')) {
            filterWrapper[0].style.top = offsetTop + 'px';
          }
          filterWrapper[0].style.height = height - 100 - offsetTop + 'px';
        }
      }
      if (this.first) {
        let table = this.datatable.nativeElement.getElementsByClassName('table');
        let offsetParent = this.datatable.nativeElement.offsetParent;
        let datatableWrapper = offsetParent.getElementsByClassName('datatable-wrapper')[0];
        if (this.tableWrapper) {
          if ((offsetParent.offsetHeight - this.tableWrapper.nativeElement.offsetTop)
             < table[0].offsetHeight) {
            datatableWrapper.style.maxHeight = offsetParent.offsetHeight - 70 + 'px';
            this.datatable.nativeElement.style.maxHeight = offsetParent.offsetHeight - 70 + 'px';
          }
          let tableWrapperElement = this.tableWrapper.nativeElement;
          let parentHeigth = tableWrapperElement.parentElement.parentElement.offsetHeight;
          tableWrapperElement.style.maxHeight =
            parentHeigth - tableWrapperElement.offsetTop + `px`;
        }
      }
    }
  }

  public checkOverfow() {
    let width = this.tableWrapper.nativeElement.offsetWidth;
    let count = 0;
    this.config.list.columns.forEach((el) => {
      if (!el.tab) {
        count += 1;
      } else if (el.tab && !el.tab.is_collapsed) {
        count += 1;
      }
    });
    if ((width / count) < 150) {
      this.tableWrapper.nativeElement.style.overflowX = 'auto';
    } else {
      this.tableWrapper.nativeElement.style.overflowX = 'visible';
    }
  };

  public changeTab(tab) {
    if (this.tabs) {
      this.tabs.forEach((el) => {
        if (el === tab) {
          el.is_collapsed = !el.is_collapsed;
        }
      });
      let collapsedTabs = this.tabs.filter((el) => el.is_collapsed);
    }
  }

  public getTabOfColumn(name) {
    let tab;
    if (this.tabs) {
      let filteredTabs = this.tabs.filter((el) => {
        let result = false;
        el.fields.forEach((field) => {
          if (field === name) {
            result = true;
          }
        });
        return result;
      });
      if (filteredTabs.length) {
        tab = filteredTabs[0];
      }
    }
    return tab;
  }

  public updateMetadataByTabs(metadata) {
    metadata.forEach((el) => {
      el.tab = this.getTabOfColumn(el.name);
    });
  }

  public prepareData(config, data, highlight = null) {
    let prepareData = [];
    data.forEach((el) => {
      let row = {
        id: el.id,
        __str__: el.__str__,
        content: []
      };
      if (highlight) {
        this.addHighlight(highlight.field, el, row, highlight.values);
      }
      config.forEach((col) => {
        let cell = {
          id: el.id,
          label: col.label,
          name: col.name,
          content: [],
          contextMenu: col.context_menu,
          tab: this.getTabOfColumn(col.name)
        };
        col.content.forEach((element) => {
          let obj: any = {};
          let props;
          obj['rowId'] = el.id;
          obj['key'] = col.name;
          obj['name'] = element.field;
          obj['type'] = element.type;
          obj['values'] = element.values;
          obj['delim'] = col.delim;
          obj['title'] = col.title;
          if (element.type === 'icon') {
            let field = this.config.fields.filter((elem) => elem.key === element.field);
            if (field && field.length > 0) {
              obj['values'] = field[0].templateOptions.values;
              obj['color'] = field[0].templateOptions.color;
            }
          }
          if (element.link) {
            obj['link'] = this.format(element.link, el);
          } else if (element.endpoint) {
            obj['endpoint'] = this.format(element.endpoint, el);
            if (col.name === 'evaluate') {
              this.evaluateEndpoint = element.endpoint;
            }
          }
          if (element.type === 'static') {
            obj.value = this.format(element.text, el);
            obj.label = element.label;
          }
          if (element.type === 'button') {
            obj.confirm = element.confirm;
            obj.options = element.options;
            obj.color = element.color;
            obj.repeat = element.repeat;
            if (element.hidden) {
              this.setValue(el, element.hidden.split('.'), obj, 'hidden');
            }
            if (element.replace_by) {
              this.setValue(el, element.replace_by.split('.'), obj, 'replace_by');
            }
            obj.list = true;
            obj.templateOptions = {
              label: element.label,
              icon: element.icon ? element.icon.slice(element.icon.indexOf('-') + 1) : null,
              small: true,
              mb: false,
              p: true,
              action: element.action,
              text: this.format(element.text, el)
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
        result[el.sort_field] = el.sorted;
      }
    });
    return result;
  }

  public sorting(field) {
    if (this.sortedColumns[field.sort_field]) {
      this.sortedColumns[field.sort_field]
        = this.sortedColumns[field.sort_field] === 'asc' ? 'desc' : 'asc';
      field.sorted = field.sorted === 'asc' ? 'desc' : 'asc';
    } else {
      let key = 'asc';
      this.sortedColumns[field.sort_field] = key;
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
    delete this.sortedColumns[field.sort_field];
    if (emit) {
      this.event.emit({
        type: 'sort',
        list: this.config.list.list,
        query: this.sortTable(this.sortedColumns)
      });
    }
  }

  public updateSort(columns, name, value) {
    columns.forEach((el) => {
      if (name === el.sort_field) {
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

  public setValue(data, props, object , param = 'value') {
    let prop = props.shift();
    if (props.length === 0) {
      if (object.type === 'related' && !object[param]) {
        object[param] = data[prop] ? data[prop].__str__ : '';
      } else if (!object[param]) {
        if (object.type === 'datepicker' || object.type === 'datetime') {
          object[param] = data[prop] &&
            moment.tz(data[prop], 'Australia/Sydney').format('YYYY-MM-DD hh:mm A');
        } else {
          object[param] = data[prop];
        }
      }
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
    this.actionEndpoint = e.action.endpoint;
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
    this.modalRef = this.modalService.open(modal, options);
  }

  public initPagination(data) {
    if (data !== this.currentData || data.count !== this.count) {
      this.selectedAll = false;
      let count = data.count;
      let length = data.results.length;
      this.count = length;
      if (length === 0) {
        this.pageSize = 10;
        this.page = 1;
        return;
      }
      if (!this.offset) {
        this.page = 1;
      } else if (this.offset) {
        this.page = (this.offset / this.limit) + 1;
      }
      if (!this.limit) {
        this.pageSize = 10;
      } else {
        this.pageSize = (count / this.limit) * 10;
      }
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
    this.filtersOfList =
      this.filterService.getFiltersOfList(this.parentEndpoint, this.config.list.list);
    this.poped = true;
  }

  public unpopedTable() {
    if (this.config.list.filters) {
      this.filterService.filters = {
        endpoint: this.parentEndpoint,
        list: this.config.list,
      };
    }
    this.poped = false;
    this.minimized = false;
    this.maximize = false;
  }

  public minimizeTable() {
    this.minimized = true;
    this.event.emit({
      type: 'minimize',
      list: this.config.list.list
    });
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
    if (e && e.value) {
      switch (e.value) {
        case 'openMap':
          this.openMap(e.el.fields);
        break;
        case 'openList':
        case 'openDiff':
          this[e.value](e.el.endpoint, e.el);
          break;
        case 'approveTimesheet':
          this.approveTimesheet(e);
          break;
        case 'openForm':
          this.openForm(e);
          break;
        case 'changeTimesheet':
          this.changeTimesheet(e);
          break;
        case 'callAction':
          this.setAction(e);
          break;
        case 'evaluateCandidate':
          this.evaluate(e);
          break;
        case 'sendSMS':
          this.openFrame(e.el.fields);
          break;
        case 'previewInvoice':
          this.showPreview(e);
          break;
        case 'printInvoice':
          this.printPDF(e);
          break;
        default:
          return;
      }
    }
    return;
  }

  public openForm(e) {
    this.modalInfo = {};
    this.modalInfo.type = 'form';
    this.modalInfo.endpoint = e.el.endpoint;
    this.modalInfo.label = e.el.value;
    this.open(this.modal, {size: 'lg'});
  }

  public setAction(e) {
    this.modalInfo = {};
    this.modalInfo.type = 'action';
    this.modalInfo.endpoint = e.el.endpoint;
    if (e.el.confirm && e.el.options) {
      this.modalInfo.message = e.el.options.message;
      this.modalInfo.agree_label = e.el.options.agree_label;
      this.modalInfo.decline_label = e.el.options.decline_label;
      this.open(this.confirmModal);
    } else {
      this.callAction(this.modalInfo);
    }
  }

  public callAction(modalInfo, closeModal = undefined) {
    if (closeModal) {
      closeModal();
    }
    let endpoint = modalInfo.endpoint;
    this.genericFormService.submitForm(endpoint, {}).subscribe(
      (res: any) => {
        this.event.emit({
          type: 'update',
          list: this.config.list.list
        });
      }
    );
  }

  public openMap(value) {
    value.forEach((el) => {
      let keys = el.field.split('.');
      this.modalInfo[keys[keys.length - 1]] = +el.value;
    });
    this.modalInfo.type = 'map';
    this.open(this.modal, {size: 'lg'});
  }

  public evaluate(e) {
    let object = this.data.results.filter((el) => el.id === e.el.rowId)[0];
    this.modalInfo = {};
    this.modalInfo.type = 'evaluate';
    this.modalInfo.endpoint = e.el.endpoint;
    this.modalInfo.edit = true;
    this.modalInfo.needData = false;
    this.modalInfo.label = {
      picture: object.picture && object.picture.thumb ?
         object.picture.thumb : '/assets/img/avatar.png',
      name: object.vacancy_offer.candidate_contact.contact.__str__
    };
    this.open(this.evaluateModal);
  }

  public changeTimesheet(e) {
    let object = this.data.results.filter((el) => el.id === e.el.rowId)[0];
    this.modalInfo = {};
    this.modalInfo.type = 'evaluate';
    this.modalInfo.endpoint = e.el.endpoint;
    this.modalInfo.edit = true;
    this.modalInfo.needData = false;
    this.modalInfo.data = {
      shift_started_at: {
        action: 'add',
        data: {
          value: object.shift_started_at
        }
      },
      break_started_at: {
        action: 'add',
        data: {
          value: object.break_started_at
        }
      },
      break_ended_at: {
        action: 'add',
        data: {
          value: object.break_ended_at
        }
      },
      shift_ended_at: {
        action: 'add',
        data: {
          value: object.shift_ended_at
        }
      }
    };
    this.modalInfo.label = {
      picture: object.picture && object.picture.thumb ?
         object.picture.thumb : '/assets/img/avatar.png',
      name: object.vacancy_offer.candidate_contact.contact.__str__
    };
    this.open(this.evaluateModal, {size: 'lg'});
    let modalContent: any = document.getElementsByClassName('modal-content')[0];
    if (modalContent) {
      modalContent.style.overflow = 'visible';
    }
  }

  public approveTimesheet(e) {
    let object = this.data.results.filter((el) => el.id === e.el.rowId)[0];
    this.approveEndpoint = e.el.endpoint;
    e.el.endpoint = this.format(this.evaluateEndpoint, object);
    this.evaluate(e);
  }

  public openFrame(e, param = 'recipient') {
    let query = '?';
    let contacts = [];
    if (e && e.length) {
      e.forEach((el) => {
        if (el) {
          if (el instanceof Object) {
            if (el.value) {
              contacts.push(el.value);
            }
          } else {
            contacts.push(el);
          }
        }
      });
    }
    if (contacts && contacts.length) {
      contacts.forEach((el) => {
        query += `${param}[]=${encodeURIComponent(el)}&`;
      });
      query = query.slice(0, query.length - 1);
      let url;
      this.modalInfo = {};
      url = param === 'recipient' ? '/ecore/twilio/' : '';
      url += query;
      this.modalInfo.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.open(this.sendMessageModal);
    }
  }

  public eventHandler(e) {
    this.modalInfo = {};
    this.modalInfo.type = e.target;
    this.modalInfo.endpoint = e.endpoint;
    this.modalInfo.label = e.label;
    this.modalInfo.id = e.id;
    this.open(this.modal, {size: 'lg'});
  }

  public addObject() {
    this.modalInfo = {};
    this.modalInfo.type = 'form';
    this.modalInfo.endpoint = this.endpoint;
    this.modalInfo.label = `Add ${this.config.list.label}`;
    this.open(this.modal, {size: 'lg'});
  }

  public editObject(id, label = undefined) {
    this.modalInfo = {};
    this.modalInfo.type = 'form';
    this.modalInfo.endpoint = this.endpoint;
    this.modalInfo.label = label ? label : 'Edit';
    this.modalInfo.id = id;
    this.open(this.modal, {size: 'lg'});
  }

  public activeTable(e) {
    if (this.poped) {
      this.event.emit({
        type: 'active',
        list: this.config.list.list
      });
    }
  }

  public addHighlight(prop, data, row, values) {
    let props = prop.split('.');
    let key = props.shift();
    if (props.length === 0) {
      let property = data[prop];
      row.highlight = false;
      if (typeof values[property] === 'boolean') {
        row.highlight = {
          highlight: true
        };
      } else if (property) {
        row.highlight = {
          color: values[property]
        };
      }
    } else {
      this.addHighlight(props.join('.'), data[key], row, values);
    }
  }

  public openList(value) {
    this.list.emit({
      endpoint: value
    });
  }

  public openDiff(endpoint, el) {
    this.innerTableCall.row = el.rowId;
    this.innerTableCall.cell = el.key;
    this.list.emit({
      endpoint,
      innerTable: true,
      list: this.config.list.list,
      key: el.key,
      row: el.rowId
    });
  }

  public format(str, data) {
    let open = '{';
    let close = '}';
    let pieces = [];
    let before;
    let propValue;
    let pos = 0;
    let trail;
    while (true && str) {
      let start = str.indexOf(open, pos);
      let end = str.indexOf(close, pos);
      let key = str.substring(start + 1, end);
      if (start === -1 || end === -1) {
        trail = str.substr(pos);
        if (trail !== '') {
          pieces.push(trail);
        }
        break;
      }
      propValue = this.getPropValue(data, key);
      before = str.substring(pos, start);
      pieces.push(before);
      pieces.push(propValue);
      pos = end + 1;
    }
    return pieces.join('');
  }

  public getPropValue(data, key: string) {
    let props = key.split('.');
    let prop = props.shift();
    if (!props.length) {
      if (data) {
        if (prop.indexOf('__') > -1) {
          let propArray = prop.split('__');
          let datetime = ['date', 'time'];
          if (datetime.indexOf(propArray[1]) > -1) {
            return moment.tz(data[propArray[0]], 'Australia/Sydney')
              .format(propArray[1] === 'time' ? 'hh:mm A' : 'YYYY-MM-DD');
          }
        }
        return data[prop];
      }
    } else {
      if (data) {
        return this.getPropValue(data[prop], props.join('.'));
      }
    }
  }

  public formEvent(e, closeModal) {
    if (e.type === 'sendForm' && e.status === 'success') {
      closeModal();
      this.event.emit({
        type: 'update',
        list: this.config.list.list
      });
    }
  }

  public evaluateEvent(e, closeModal) {
    if (e.type === 'sendForm' && e.status === 'success') {
      closeModal();
      if (this.approveEndpoint) {
        this.genericFormService.editForm(this.approveEndpoint, {}).subscribe(
          (res: any) => {
            this.event.emit({
              type: 'update',
              list: this.config.list.list
            });
            this.approveEndpoint = null;
          }
        );
      } else {
        this.formEvent(e, closeModal);
      }
    }
  }

  public buttonAction(e) {
    if (e && e.type) {
      switch (e.type) {
        case 'add_object':
          this.addObject();
          break;
        case 'poped_table':
          this.popedTable();
          break;
        default:
          return;
      }
    }
  }

  public showPreview(e) {
    this.genericFormService.getAll(e.el.endpoint).subscribe(
      (res: any) => {
        this.modalInfo = {
          url: {
            url: res.pdf
          }
        };
        this.open(this.showPreviewInvoice, {size: 'lg'});
      }
    );
  }

  public printPDF(e) {
    this.genericFormService.getAll(e.el.endpoint).subscribe(
      (res: any) => {
        this.modalInfo = {
          url: this.sanitizer.bypassSecurityTrustResourceUrl(res.pdf)
        };
        this.open(this.sendMessageModal, {size: 'lg'});
      }
    );
  }

}
