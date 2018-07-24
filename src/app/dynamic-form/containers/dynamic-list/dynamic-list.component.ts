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
import { Router } from '@angular/router';

import { GenericFormService } from './../../services/generic-form.service';

import moment from 'moment-timezone';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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

  @Input()
  public supportData: any;

  @Input()
  public responseField: string;

  @Input()
  public paginated: string;

  @Input()
  public actions: boolean;

  @Input()
  public delay: boolean;

  @Input()
  public allowPermissions: string[];

  @Input()
  public metadataQuery: string;

  @Input()
  public addMetadataQuery: string;

  @Input()
  public editEndpoint: string;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public list: EventEmitter<any> = new EventEmitter();

  @Output()
  public checkedObjects: EventEmitter<string[]> = new EventEmitter();

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

  @ViewChild('fillInMap')
  public fillInMap;

  public body: any[] = [];
  public select: any;
  public selectedCount: number;
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
  public error: any;
  public saveProcess: boolean;

  public showFilters: boolean;
  public filtersHidden: boolean = true;

  public asyncData: any;

  public pictures = [
    '/ecore/api/v2/core/contacts/',
    '/ecore/api/v2/candidate/candidatecontacts/',
    '/ecore/api/v2/core/companies/'
  ];

  public noneEdit: boolean;

  constructor(
    private filterService: FilterService,
    private modalService: NgbModal,
    private genericFormService: GenericFormService,
    private sanitizer: DomSanitizer,
    private router: Router
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
      if (this.filtersOfList && this.filtersOfList.length > 1) {
        this.showFilters = true;
      } else {
        this.showFilters = false;
      }
    } else {
      this.showFilters = !!(this.filtersOfList && this.filtersOfList.length);
    }

    this.noneEdit = this.pictures.indexOf(this.endpoint) > -1;
  }

  public ngOnChanges() {
    let config = this.config;
    let data = this.data;
    this.parseMultipleFilter(this.config.list.filters);
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
    if (data && this.paginated === 'on') {
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
    if (config && data[this.responseField]) {
      this.select = this.resetSelectedElements(data[this.responseField]);
      if (config.list) {
        this.sortedColumns = this.getSortedColumns(config.list.columns);
        if (this.tabs) {
          const mainMetadata = config.list.columns.filter((el) => !el.tab || !el.tab.is_collapsed);
          const metadata = config.list.columns.filter((el) => el.tab && el.tab.is_collapsed); //tslint:disable-line
          const additionalMetadata = [];

          this.tabs.forEach((tab) => {
            if (tab.is_collapsed) {
              tab.fields.forEach((field) => {
                additionalMetadata.push(metadata.find((el) => el.name === field));
              });
            }
          });

          const additionalBody = this.prepareData(additionalMetadata, data[this.responseField], config.list.highlight); //tslint:disable-line

          this.body = this.prepareData(mainMetadata, data[this.responseField], config.list.highlight); //tslint:disable-line
          this.body.forEach((main) => {
            additionalBody.forEach((additional) => {
              if (main.id === additional.id) {
                if (!additional.parsed) {
                  main.additionalBody = this.parseAdditionalBody(additional);
                } else {
                  main.additionalBody = additional;
                }
              }
            });
          });
        } else {
          this.body = this.prepareData(config.list.columns, data[this.responseField], config.list.highlight); //tslint:disable-line
        }
        if (this.asyncData) {
          this.getAsyncData();
        }
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

  public parseAdditionalBody(body) {
    const content = [];

    body.content.forEach((col) => {
      const tab = col.tab;
      const newContent = content.find((c) => c.label === tab.label);
      if (newContent) {
        newContent.content.push(col);
      } else {
        content.push(Object.assign({}, tab, {content: [col]}));
      }
    });
    body.content = content;
    body.parsed = true;
    return body;
  }

  public ngOnDestroy() {
    if (this.first) {
      this.filterService.filters = {
        endpoint: this.endpoint,
        list: null
      };
      this.filterService.resetQueries(this.config.list.list);
      if (this.modalRef) {
        this.modalRef.close();
      }
    }
  }

  public ngAfterContentChecked() {
    this.checkOverfow();
  }

  public ngAfterViewInit() {
    // if (this.datatable && !this.inForm) {
    //   let listButtons: any = this.datatable.nativeElement.getElementsByClassName('list-buttons');
    //   let filterWrapper: any =
    //     this.datatable.nativeElement.getElementsByClassName('filter-wrapper');
    //   let width: any = window.innerWidth;
    //   let offsetTop;
    //   if (listButtons && listButtons.length && width > 992) {
    //     this.calcButton(offsetTop, listButtons, filterWrapper);
    //     this.calcTable();
    //   }

    //   let resizeTimeout;
    //   window.addEventListener('resize', () => {
    //     if (!resizeTimeout) {
    //       resizeTimeout = setTimeout(() => {
    //         resizeTimeout = null;
    //         if (listButtons && listButtons.length && window.innerWidth > 992) {
    //           this.calcButton(offsetTop, listButtons, filterWrapper);
    //           this.calcTable();
    //         } else {
    //           filterWrapper[0].style.top = 0;
    //           filterWrapper[0].style.height = 'auto';

    //           if (this.tableWrapper) {
    //             let tableWrapperEl = this.tableWrapper.nativeElement;
    //             tableWrapperEl.style.maxHeight = 'auto';
    //           }
    //         }
    //       }, 66);
    //     }
    //   }, false);
    // }
  }

  public parseMultipleFilter(filters: any[]): void {
    if (filters) {
      const multipleFilters = filters.filter((filter) => filter.type === 'multiple');
      multipleFilters.forEach((filter) => {
        if (!filter.parsed) {
          if (filter.data.data) {
            filter.data = this.getPropValue(this.data, filter.data.data);
            filter.parsed = true;
          }

          if (filter.data.endpoint && !filter.data.data) {
            filter.endpoint = this.format(filter.endpoint, this.data);
            this.genericFormService.getAll(filter.endpoint).subscribe(
              (res: any) => {
                filter.data = res;
                filter.parsed = true;
              }
            );
          }
        }
      });
    }
  }

  public getAsyncData() {
    if (this.asyncData) {
      const endpoints = Object.keys(this.asyncData);
      if (endpoints.length) {
        endpoints.forEach((endpoint) => {
          if (this.asyncData[endpoint][0].method === 'get') {
            let query = this.generateParams(this.asyncData[endpoint]);
            if (endpoint.indexOf('?') > -1) {
              query = `&${query}`;
            } else {
              query = `${query}`;
            }
            this.genericFormService.getByQuery(endpoint, query).subscribe(
              (res: any) => this.updateValuesOfAsyncData(res, this.asyncData[endpoint]),
              (err: any) => this.error = err
            );
          } else {
            const body: any = this.generateParams(this.asyncData[endpoint]);
            this.genericFormService.submitForm(endpoint, body).subscribe(
              (res: any) => this.updateValuesOfAsyncData(res, this.asyncData[endpoint]),
              (err: any) => this.error = err
            );
          }
        });
      }
    }
  }

  public generateParams(elements: any[]) {
    if (elements && elements.length) {
      let params = {};
      elements.forEach((element) => {
        if (element.query) {
          const keys = Object.keys(element.query);
          keys.forEach((key) => {
            if (params[key]) {
              if (params[key] === element.query[key]) {
                return;
              } else {
                if (Array.isArray(params[key])) {
                  if (params[key].indexOf(element.query[key]) === -1) {
                    params[key].push(element.query[key]);
                  } else {
                    return;
                  }
                } else {
                  params[key] = [].concat(params[key], element.query[key]);
                }
              }
            } else {
              params[key] = element.query[key];
            }
          });
        }
      });
      if (elements[0].method === 'get') {
        const keys = Object.keys(params);
        let query = '';
        keys.forEach((key) => {
          if (Array.isArray(params[key])) {
            params[key].forEach((item) => {
              query += `${key}=${item}&`;
            });
          } else {
            query += `${key}=${params[key]}&`;
          }
        });
        return query.slice(0, query.length - 1);
      } else if (elements[0].method === 'post') {
        return params;
      }
    }
  }

  public updateValuesOfAsyncData(data, target) {
    data.forEach((el) => {
      target.forEach((targetItem) => {
        if (el.id === targetItem.id || el.contact === targetItem.id) {
          targetItem.field.value = el[targetItem.request_field];
        }
      });
    });
    this.body = JSON.parse(JSON.stringify(this.body));
  }

  public calcButton(offsetTop, listButtons, filterWrapper) {
    offsetTop = listButtons[0].offsetHeight;
    if (filterWrapper && filterWrapper.length) {
      if (document.body.classList.contains('r3sourcer')) {
        filterWrapper[0].style.top = offsetTop + 'px';
        filterWrapper[0].style.height = `calc(100vh - ${offsetTop}px - 80px)`;
      }
    }
  }

  public calcTable() {
    if (this.tableWrapper) {
      let tableWrapperEl = this.tableWrapper.nativeElement;
      tableWrapperEl.style.maxHeight = `calc(100vh - ${tableWrapperEl.offsetTop}px - 150px)`;
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
    this.asyncData = {};
    let prepareData = [];
    data.forEach((el) => {
      let row = {
        id: el.id,
        __str__: el.__str__,
        collapsed: true,
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
          if (element.showIf && !this.checkShowRules(element.showIf, el)) {
            return;
          }
          let obj: any = {};
          let props;
          obj['rowId'] = el.id;
          obj['key'] = col.name;
          obj['name'] = element.field;
          obj['type'] = element.type;
          obj['values'] = element.values;
          obj.action = element.action;
          obj['delim'] = col.delim;
          obj['title'] = col.title;
          obj['inline'] = element.inline;
          obj['outline'] = element.outline;
          obj['skillName'] = col.label;
          obj['description'] = col.description;
          obj['redirect'] = element.redirect;
          obj['file'] = element.file;
          if (element.hasOwnProperty('file')) {
            const keys = element.field.split('.');
            keys[keys.length - 1] = '__str__';
            obj['contactName'] = this.getValueByKey(keys.join('.'), el);
          }
          if (element.display) {
            obj.display = this.format(element.display.replace(/{field}/gi, `{${element.field}}`), el); //tslint:disable-line
          }
          if (element.type === 'datepicker') {
            let field = this.config.fields.find((elem) => elem.key === element.field);
            if (field) {
              obj.templateOptions = field.templateOptions;
            }
          }
          if (element.type === 'icon' || element.type === 'static') {
            if (element.type === 'icon') {
              obj.label = element.label;
            }
            let field = this.config.fields.find((elem) => elem.key === element.field);
            if (field) {
              obj['values'] = field.templateOptions.values || element.values;
              obj['color'] = field.templateOptions.color || element.color;
            }
          }
          if (element.link) {
            let indexOf = element.link.indexOf('{field}');
            if (indexOf) {
              element.link = element.link.replace(/{field}/gi, `{${element.field}}`);
            }
            obj['link'] = this.format(element.link, el);
            obj.text = this.format(element.text, el);
          } else if (element.endpoint) {
            if (element.field) {
              props = element.field.split('.');
              this.setValue(el, props, obj);
            }
            let indexOf = element.endpoint.indexOf('{field}');

            obj.notParsedEndpoint = element.notParsedEndpoint;
            if (element.endpoint[element.endpoint.length - 1] !== '/') {
              obj.notParsedEndpoint = element.endpoint;
              element.notParsedEndpoint = element.endpoint;
              element.endpoint += '/';
            }
            if (indexOf) {
              element.endpoint = element.endpoint.replace(/{field}/gi, `{${element.field}}`);
            }
            if (Array.isArray(obj.value)) {
              obj.link = [];
              obj.value.forEach((val) => {
                obj.link.push(this.format(element.endpoint, {
                  [obj.name]: val
                }).replace('/ecore/api/v2', ''));
              });
            } else {
              obj['endpoint'] = this.format(element.endpoint, el);
            }
            if (col.name === 'evaluate') {
              this.evaluateEndpoint = element.endpoint;
            }
            obj.text = this.format(element.text, el);
          }
          if (element.type === 'static') {
            if (element.text) {
              obj.value = this.format(element.text.replace(/{field}/gi, `{${element.field}}`), el);
            }
            obj.label = element.label;
          }
          if (element.type === 'picture') {
            const field = this.config.fields.find((elem) => elem.key === element.field);
            if (field) {
              obj.default = field.default;
            }
          }
          if (element.type === 'button') {
            obj.confirm = element.confirm;
            obj.options = element.options;
            obj.color = element.color;
            obj.text_color = element.text_color;
            obj.title = element.title;
            obj.repeat = element.repeat;
            if (element.hidden) {
              this.setValue(el, element.hidden.split('.'), obj, 'hidden');
            } else if (element.field) {
              this.setValue(el, element.field.split('.'), obj, 'hidden');
              obj.hidden = !obj.hidden;
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
            if (element.type === 'info') {
              obj.value = el;
              obj.companyPicture = this.endpoint === '/ecore/api/v2/core/companies/';
            } else {
              props = element.field.split('.');
              this.setValue(el, props, obj);
            }
          }
          if (!this.checkValue(obj)) {
            delete cell.contextMenu;
          }
          if (element.async && obj.value === -1) {
            element.endpoint = this.format(element.endpoint, el);
            const query = {};
            if (element.query) {
              const keys = Object.keys(element.query);
              obj.query = {};
              keys.forEach((key) => {
                query[key] = this.format(element.query[key], el);

                if (!query[key]) {
                  query[key] = this.format(element.query[key], this.data);
                }
              });
            }
            if (this.asyncData[element.endpoint]) {
              this.asyncData[element.endpoint].push({
                method: element.method,
                content: cell.content,
                query,
                field: obj,
                id: el.id,
                request_field: element.request_field
              });
            } else {
              this.asyncData[element.endpoint] = [{
                method: element.method,
                content: cell.content,
                query,
                field: obj,
                id: el.id,
                request_field: element.request_field
              }];
            }
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

  public sorting(field, type: string) {
    if (!this.delay) {
      this.sortedColumns[field.sort_field] = type;
      field.sorted = type;

      this.event.emit({
        type: 'sort',
        list: this.config.list.list,
        query: this.sortTable(this.sortedColumns)
      });
    }
  }

  public resetSort(field, emit) {
    if (!this.delay) {
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
  }

  public updateSort(columns, name, value) {
    columns.forEach((el) => {
      if (name === el.sort_field) {
        el.sorted = value;
      }
    });
  }

  public setValue(data, props, object, param = 'value') {
    let prop = props.shift();
    if (props.length === 0) {
      if (object.type === 'related' && !object[param]) {
        if (Array.isArray(data[prop])) {
          object[param] = data[prop];
        } else {
          object[param] = data[prop] ? data[prop].__str__ : '';
        }
      } else if (object.type === 'static' && !object[param]) {
        object[param] = data[prop] && data[prop].__str__ ? data[prop].__str__ : data[prop];
      } else if (!object[param]) {
        object[param] = data[prop];
      }
    } else if (data[prop]) {
      this.setValue(data[prop], props, object, param);
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
    this.emitSelect();
  }

  public emitSelect() {
    if (this.select) {
      const keys = Object.keys(this.select);
      const result = keys.filter((key) => this.select[key]);
      this.selectedCount = result.length;
      this.checkedObjects.emit(keys.filter((key) => this.select[key]));
    }
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
    if (e === 'resetAll') {
      this.event.emit({
        type: 'filter',
        list: this.config.list.list,
        query: ''
      });

      if (this.inForm) {
        this.filterService.resetFilters(this.config.list.list);
      }
    } else {
      this.event.emit({
        type: 'filter',
        list: e.list,
        query: this.filterService.getQuery(e.list)
      });
    }
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

  public buttonHandler(e, action?) {
    if (action) {
      action.close();
    }
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
        case 'delete':
          this.delete(e);
          break;
        case 'addForm':
          this.addForm(e);
          break;
        case 'editModal':
        case 'editForm':
          this.editForm(e);
          break;
        case 'emptyPost':
          this.post(e);
          break;
        case 'showCandidateProfile':
          this.showCandidateProfile(e);
          break;
        case 'fillin':
          this.fillIn(e);
          break;
        default:
          return;
      }
    }
    return;
  }

  public fillIn(e) {
    const fillInPath = `/hr/jobs/${e.el.rowId}/fillin/`;
    this.router.navigate([fillInPath]);
  }

  public showCandidateProfile(e) {
    let arr = e.el.endpoint.split('/');
    let id = arr[arr.length - 2];
    arr.splice(arr.length - 2, 1);
    let endpoint = arr.join('/');
    this.modalInfo = {};
    this.modalInfo.type = 'profile';
    this.modalInfo.id = id;
    this.open(this.modal, {size: 'lg'});
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
    let object = this.data[this.responseField].filter((el) => el.id === e.el.rowId)[0];
    this.modalInfo = {};
    this.modalInfo.type = 'evaluate';
    this.modalInfo.endpoint = e.el.endpoint;
    this.modalInfo.edit = true;
    this.modalInfo.needData = false;
    this.modalInfo.label = {
      picture: object.picture && object.picture.thumb ?
         object.picture.thumb : '/assets/img/avatar.png',
      name: object.job_offer.candidate_contact.contact.__str__
    };
    this.open(this.evaluateModal);
  }

  public changeTimesheet(e) {
    let object = this.data[this.responseField].filter((el) => el.id === e.el.rowId)[0];
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
      },
      supervisor: {
        action: 'add',
        data: {
          value: object.supervisor
        }
      },
      position: {
        action: 'add',
        data: {
          value: object.position
        }
      },
      company: {
        action: 'add',
        data: {
          value: object.company
        }
      },
      jobsite: {
        action: 'add',
        data: {
          value: object.jobsite
        }
      }
    };
    this.modalInfo.label = {
      picture: object.picture && object.picture.thumb ?
         object.picture.thumb : '/assets/img/avatar.png',
      name: object.job_offer.candidate_contact.contact.__str__
    };
    this.open(this.evaluateModal, {size: 'lg'});
    let modalContent: any = document.getElementsByClassName('modal-content')[0];
    if (modalContent) {
      modalContent.style.overflow = 'visible';
    }
  }

  public approveTimesheet(e) {
    let object = this.data[this.responseField].filter((el) => el.id === e.el.rowId)[0];
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
    this.modalInfo.mode = 'edit';
    this.modalInfo.dontUseMetadataQuery = true;
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
            if (data[propArray[0]]) {
              return moment.tz(data[propArray[0]], 'Australia/Sydney')
                .format(propArray[1] === 'time' ? 'hh:mm A' : 'YYYY-MM-DD');
            } else {
              return '';
            }
          } else {
            return data[prop];
          }
        } else {
          return data[prop];
        }
      }
    } else {
      if (data) {
        return this.getPropValue(data[prop], props.join('.'));
      }
    }
  }

  public formEvent(e, closeModal) {
    if (e.type === 'saveStart') {
      this.saveProcess = true;
    }
    if (e.type === 'sendForm' && e.status === 'success') {
      this.saveProcess = false;
      closeModal();
      this.event.emit({
        type: 'update',
        list: this.config.list.list
      });
    }
  }

  public formError() {
    this.saveProcess = false;
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
        case 'openMap':
          this.showMap();
          break;
        default:
          return;
      }
    }
  }

  public showMap() {
    this.modalInfo = this.generateDataForFillInMap({});
    this.open(this.fillInMap, {size: 'lg'});
  }

  public generateDataForFillInMap(data) {
    data.markers = [];
    this.data[this.responseField].forEach((el) => {
      data.markers.push({
        latitude: +this.getPropValue(el, 'contact.address.latitude'),
        longitude: +this.getPropValue(el, 'contact.address.longitude'),
        name: this.getPropValue(el, 'contact.__str__'),
        description: this.getPropValue(el, 'contact.address.__str__'),
        iconUrl: '/assets/img/location-blue.svg',
        id: this.getPropValue(el, 'id'),
        selected: this.select[this.getPropValue(el, 'id')],
      });
    });
    if (this.supportData) {
      data.markers.push({
        latitude: this.data[this.supportData].latitude,
        longitude: this.data[this.supportData].longitude,
        name: this.data[this.supportData].__str__,
        description: this.data[this.supportData].address,
        label: this.sanitizer.bypassSecurityTrustStyle("{ color: 'green'}"),
        iconUrl: '/assets/img/location-red.svg'
      });
      data.latitude = this.data[this.supportData].latitude;
      data.longitude = this.data[this.supportData].longitude;
    }
    return data;
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

  public delete(e) {
    this.genericFormService.delete(this.endpoint, e.el.rowId).subscribe(
      (res: any) => {
        this.event.emit({
          type: 'update',
          list: this.config.list.list
        });
      },
      (err: any) => this.error = err
    );
  }

  public editForm(e) {
    let endpoint;
    let id;
    if (this.editEndpoint) {
      endpoint = this.format(
        this.editEndpoint,
        this.data.results.find((el) => el.id === e.el.rowId)
      );
    } else {
      endpoint = e.el.endpoint;
      if (e.el.notParsedEndpoint[e.el.notParsedEndpoint.length - 1] !== '/') {
        const arr: string[] = e.el.endpoint.split('/');
        arr.pop();
        const lastElement = arr.pop();
        if (lastElement === 'extend') {
          endpoint = [...arr, 'extend'].join('/');
        } else {
          id = lastElement
          endpoint = [...arr, ''].join('/');
        }
      }
    }
    this.modalInfo = {};
    this.modalInfo.type = 'form';
    this.modalInfo.endpoint = endpoint;
    this.modalInfo.id = id;
    this.modalInfo.mode = 'edit';
    this.modalInfo.edit = true;
    this.modalInfo.dontUseMetadataQuery = e.value === 'editModal';
    this.open(this.modal, {size: 'lg'});
  }

  public addForm(e) {
    this.modalInfo = {};
    this.modalInfo.type = 'form';
    this.modalInfo.endpoint = e.el.endpoint;
    this.open(this.modal, {size: 'lg'});
  }

  public post(e) {
    this.genericFormService.submitForm(e.el.endpoint, {}).subscribe(
      (res: any) => {
        if (e.el && e.el.redirect) {
          location.href = e.el.redirect;
          return;
        }

        this.event.emit({
          type: 'update',
          list: this.config.list.list
        });
      },
      (err: any) => this.error = err
    );
  }

  public checkShowRules(rule: any[], data): boolean {
    let approvedRules = 0;
    let rulesNumber = rule.length;

    rule.forEach((el: any) => {
      if (typeof el === 'string') {
        let value = this.getValueByKey(el, data);

        if (value && value !== '0') {
          approvedRules += 1;
        } else {
          return;
        }
      } else if (el instanceof Object) {
        let key = Object.keys(el)[0];
        let targetValue = el[key];
        let value = this.getValueByKey(key, data);

        if (value === targetValue) {
          approvedRules += 1;
        } else {
          return;
        }
      }
    });

    return approvedRules === rulesNumber;
  }

  public getValueByKey(key: string, data: any): any {
    let keysArray = key.split('.');
    let firstKey = keysArray.shift();
    if (keysArray.length === 0) {
      return data && data[firstKey];
    } else if (keysArray.length > 0) {
      let combineKeys = keysArray.join('.');
      return this.getValueByKey(combineKeys, data[firstKey]);
    }
  }

  public checkPermission(type: string): boolean {
    if (this.allowPermissions) {
      return this.allowPermissions.indexOf(type) > -1;
    } else {
      return false;
    }
  }

  public markerClick(e) {
    e.selected = !e.selected;
    this.select[e.id] = e.selected;

    this.emitSelect();
  }

}
