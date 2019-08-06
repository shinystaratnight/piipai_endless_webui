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
  SimpleChanges
} from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from 'ngx-webstorage';

import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ToastService, MessageType } from '@webui/core';
import { FilterService, GenericFormService, ListStorageService } from '../../services';
import { AuthService, UserService } from '@webui/core';
import { FormatString, isMobile, isCandidate, getContactAvatar, getTimeInstance, } from '@webui/utilities';
import { createAddAction, smallModalEndpoints, getOrientation } from '../../helpers';

import { Endpoints } from '@webui/data';

import { environment } from '../../../../../../apps/r3sourcer/src/environments/environment';

@Component({
  selector: 'app-dynamic-list',
  templateUrl: './dynamic-list.component.html',
  styleUrls: ['./dynamic-list.component.scss']
})
export class DynamicListComponent
  implements OnInit, OnChanges, OnDestroy, AfterContentChecked {
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
  public endpoint: string;

  @Input()
  public parentEndpoint: string;

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

  @Input()
  public addData: any;

  @Input()
  public refresh = false;

  @Input()
  public inForm = false;

  @Input()
  public disableActions: boolean;

  @Input()
  public inlineFilters: boolean;

  @Input()
  public actionProcess: boolean;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public list: EventEmitter<any> = new EventEmitter();

  @Output()
  public checkedObjects: EventEmitter<string[]> = new EventEmitter();

  @ViewChild('modal', { static: false })
  public modal;

  @ViewChild('confirmModal', { static: false })
  public confirmModal;

  @ViewChild('evaluateModal', { static: false })
  public evaluateModal;

  @ViewChild('sendMessageModal', { static: false })
  public sendMessageModal;

  @ViewChild('pdfDocumentModal', { static: false })
  public pdfDocumentModal;

  @ViewChild('datatable', { static: false })
  public datatable;

  @ViewChild('tableWrapper', { static: false })
  public tableWrapper;

  @ViewChild('showPreviewInvoice', { static: false })
  public showPreviewInvoice;

  @ViewChild('fillInMap', { static: false })
  public fillInMap;

  @ViewChild('mapModal', { static: false })
  public mapModal;

  @ViewChild('messageDetail', { static: false })
  public messageDetail;

  @ViewChild('history', { static: true })
  public history;

  @ViewChild('timesheetsCandidate', { static: true })
  public timesheetsCandidate;

  @ViewChild('unapproved', { static: true })
  public unapproved;

  @ViewChild('tracking', { static: false })
  public trakingModal;

  @ViewChild('confirmProfileModal', { static: false })
  public confirmProfileModal;

  @ViewChild('approveSignature', { static: false })
  public approveSignature;

  public selectedCount: number;
  public sortedColumns: any;
  public reason: any;
  public page: any;
  public currentData: any;
  public count: number;
  public innerTableCall = {
    row: '',
    cell: ''
  };
  public modalRef: NgbModalRef;
  public tabs: any;
  public evaluateEndpoint: string;
  public approveEndpoint: string;
  public currentActionData: any;
  public actionEndpoint: any;
  public error: any;
  public saveProcess: boolean;
  public showFilters: boolean;
  public asyncData: any;
  public searchFilter = {
    type: 'search',
    query: 'search',
    key: 'search'
  };
  public position: { top; left };
  public noneEdit: boolean;
  public fullData: any;
  public label: string;
  public description: string;

  public body: any[] = [];
  public select: any = {};
  public filtersOfList: any[] = [];
  public selectedAll = false;
  public modalInfo: any = {};
  public pagination: any = {};
  public pageSize = 0;
  public poped = false;
  public move = false;
  public refreshing = false;
  public filtersHidden = true;
  public additionalMetadata: any[] = [];
  public pictures = [
    '/core/contacts/',
    '/candidate/candidatecontacts/',
    '/candidate/candidatecontacts/pool/',
    '/core/companies/',
    '/core/companycontacts/'
  ];
  public mobileDesign = [
    Endpoints.TimesheetHistory,
    Endpoints.TimesheetCandidate,
    Endpoints.TimesheetUnapproved,
  ];
  public collapsed = true;
  public sortedField: any;
  public isMobileDevice = isMobile() && isCandidate();
  public approveInvoice: boolean;
  public timeInstance = getTimeInstance();
  public viewInited = false;

  constructor(
    private filterService: FilterService,
    private modalService: NgbModal,
    private genericFormService: GenericFormService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private storage: LocalStorageService,
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastService,
    private listStorage: ListStorageService
  ) {}

  public isMobile = isMobile;

  public ngOnInit() {
    this.updateFilters();

    if (this.config.list.openFilter) {
      this.filtersHidden = false;
    }

    this.noneEdit = this.pictures.indexOf(this.endpoint) > -1 || this.config.list.editDisable;
  }

  public ngOnChanges(changes: SimpleChanges) {
    const config =
      changes['config'] && changes['config'].isFirstChange()
        ? changes['config'].currentValue
        : this.config;

    const data =
      changes['data'] && changes['data'].isFirstChange()
        ? changes['data'].currentValue
        : this.data;

    const innerTables =
      changes['innerTables'] && changes['innerTables'].isFirstChange()
        ? changes['innerTables'].currentValue
        : this.innerTables;

    const addData = changes['addData'] && changes['addData'].currentValue;

    if (this.actionData !== this.currentActionData) {
      this.currentActionData = this.actionData;
      this.actionProcess = false;
      if (this.actionEndpoint.indexOf('/sendsms/') > -1) {
        setTimeout(() => {
          this.openFrame(this.currentActionData.phone_number);
        }, 250);
      }

      if (this.actionEndpoint.indexOf('pdf') > -1) {
        setTimeout(() => {
          this.modalInfo = {
            url: this.sanitizer.bypassSecurityTrustResourceUrl(location.origin + this.currentActionData.pdf_url)
          };
          this.open(this.pdfDocumentModal, { size: 'lg' });
        }, 100);
      }
      return;
    }

    if (data && this.paginated === 'on') {
      this.initPagination(data);
    }
    if (this.maximize) {
      this.unpopedTable();
    }
    if (this.sorted) {
      this.sortedColumns = this.sorted;
      const names = Object.keys(this.sorted);
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

    if (this.datatable) {
      this.datatable.nativeElement.style.zIndex = this.active ? 100 : this.id * 5;
    }

    if (changes.hasOwnProperty('config') && changes['config'].isFirstChange()) {
      this.parseTabs(config);
      this.parseMultipleFilter(config.list.filters);
    }

    if (changes.hasOwnProperty('data') && changes['data'].isFirstChange()) {
      this.label = this.getFormat('label', data, config);
      this.description = this.getFormat('description', data, config);

      this.fullData = data;
      this.body.push(...this.generateBody(config, data, innerTables));
    } else if (
      changes.hasOwnProperty('data') &&
      !changes['data'].isFirstChange()
    ) {
      this.fullData = data;
      this.body = [...this.generateBody(config, data, innerTables)];
    }

    if (
      changes.hasOwnProperty('addData') &&
      !changes['addData'].isFirstChange()
    ) {
      this.fullData = {
        ...this.fullData,
        [this.responseField]: [
          ...this.fullData[this.responseField],
          ...addData[this.responseField]
        ]
      };
      this.body.push(...this.generateBody(config, addData, innerTables));
    }
  }

  public afterViewInit() {
    this.viewInited = true;
  }

  public getFormat(property: string, data, config): string {
    const formatString = new FormatString();

    if (data instanceof Object) {
      return formatString.format(config.list[property], data);
    }

    return config.list[property];
  }

  public updateFilters() {
    if (this.config.list.filters && this.config.list.search_enabled) {
      this.config.list.filters.push(this.searchFilter);
    } else if (this.config.list.search_enabled) {
      this.config.list.filters = [this.searchFilter];
    }
    if (this.config.list.filters) {
      this.filterService.filters = {
        endpoint: this.parentEndpoint || this.endpoint,
        list: this.config.list
      };
      this.filtersOfList = this.filterService.getFiltersByEndpoint(
        this.endpoint
      );
    }
    if (this.config.list.search_enabled) {
      if (this.filtersOfList && this.filtersOfList.length > 1) {
        this.showFilters = true;
      } else {
        this.showFilters = false;
      }
    } else {
      this.showFilters = !!(this.filtersOfList && this.filtersOfList.length);
    }
  }

  public parseTabs(config) {
    this.tabs = config.list.tabs;

    this.updateMetadataByTabs(config.list.columns);

    if (this.tabs) {
      const tabsMetadata = config.list.columns.filter(
        (el) => el.tab && el.tab.is_collapsed
      );

      if (tabsMetadata.length) {
        this.tabs.forEach((tab) => {
          if (tab.is_collapsed) {
            tab.fields.forEach((field) => {
              this.additionalMetadata.push(
                tabsMetadata.find((el) => el.name === field)
              );
            });
          }
        });
      }
    }
  }

  public generateBody(config, data, innerTables) {
    let body;

    if (config && data[this.responseField]) {
      this.select = {
        ...this.select,
        ...this.resetSelectedElements(data[this.responseField])
      };
      if (config.list) {
        this.sortedColumns = this.getSortedColumns(config.list.columns);
        if (this.tabs) {
          const mainMetadata = config.list.columns.filter(
            (el) => !el.tab || !el.tab.is_collapsed
          );
          const additionalBody = this.prepareData(
            this.additionalMetadata,
            data[this.responseField],
            config.list.highlight
          );

          body = this.prepareData(
            mainMetadata,
            data[this.responseField],
            config.list.highlight
          );
          this.groupedValues(body);
          body.forEach((main) => {
            additionalBody.forEach((additional) => {
              if (this.tabs && this.tabs[0].inline) {
                additional.inline = true;
              }
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
          body = this.prepareData(
            config.list.columns,
            data[this.responseField],
            config.list.highlight
          );
          this.groupedValues(body);
        }
        if (this.asyncData) {
          this.getAsyncData();
        }
      }
    }

    this.parseInnerTables(innerTables);
    return body;
  }

  public groupedValues(body: any[]) {
    const groups = this.config.list.groups;

    if (groups) {
      groups.forEach((groupName: string) => {
        const group = {};
        body.forEach((row, index) => {
          if (row) {
            row.content.forEach((column) => {
              if (column) {
                if (column.name === groupName) {
                  column.content.forEach((item) => {
                    if (item) {
                      if (group[item.value]) {
                        this.addRowToGroup(row, group[item.value]);

                        item.value = undefined;

                        row.hide = true;
                      } else {
                        group[item.value] = row;
                      }
                    }
                  });
                }
              }
            });
          }
        });
      });
    }
  }

  public addRowToGroup(row, target) {
    target.content.forEach((column, i) => {
      if (column) {
        if (column.name !== 'actions') {
          column.content.push(...row.content[i].content);
        }
      }
    });
  }

  public parseInnerTables(innerTables) {
    if (innerTables && this.innerTableCall) {
      const currentRow = innerTables[this.innerTableCall.row];
      if (currentRow) {
        const currentCell =
          innerTables[this.innerTableCall.row][this.innerTableCall.cell];
        if (currentCell) {
          const cell =
            innerTables[this.innerTableCall.row][this.innerTableCall.cell];
          if (cell.metadata && cell.data) {
            cell.body = this.prepareData(
              cell.metadata.list.columns,
              cell.data.results
            );
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
        content.push(Object.assign({}, tab, { content: [col] }));
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
      this.filtersOfList = undefined;
      if (this.modalRef) {
        this.modalRef.close();
      }
    }
  }

  public ngAfterContentChecked() {
    this.checkOverfow();
  }

  public parseMultipleFilter(filters: any[]): void {
    if (filters) {
      const multipleFilters = filters.filter(
        (filter) => filter.type === 'multiple'
      );
      multipleFilters.forEach((filter) => {
        if (!filter.parsed) {
          if (filter.data.data) {
            filter.data = this.getPropValue(this.data, filter.data.data);
            filter.parsed = true;
          }

          if (filter.data.endpoint && !filter.data.data) {
            filter.endpoint = this.format(filter.endpoint, this.data);
            this.genericFormService
              .getAll(filter.endpoint)
              .subscribe((res: any) => {
                filter.data = res;
                filter.parsed = true;
              });
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
            this.genericFormService
              .getByQuery(endpoint, query)
              .subscribe(
                (res: any) =>
                  this.updateValuesOfAsyncData(res, this.asyncData[endpoint]),
                (err: any) => (this.error = err)
              );
          } else {
            const body: any = this.generateParams(this.asyncData[endpoint]);
            this.genericFormService
              .submitForm(endpoint, body)
              .subscribe(
                (res: any) =>
                  this.updateValuesOfAsyncData(res, this.asyncData[endpoint]),
                (err: any) => (this.error = err)
              );
          }
        });
      }
    }
  }

  public generateParams(elements: any[]) {
    if (elements && elements.length) {
      const params = {};
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
      const tableWrapperEl = this.tableWrapper.nativeElement;
      tableWrapperEl.style.maxHeight = `calc(100vh - ${
        tableWrapperEl.offsetTop
      }px - 150px)`;
    }
  }

  public checkOverfow() {
    if (this.tableWrapper) {
      const width = this.tableWrapper.nativeElement.offsetWidth;
      let count = 0;
      this.config.list.columns.forEach((el) => {
        if (!el.tab) {
          count += 1;
        } else if (el.tab && !el.tab.is_collapsed) {
          count += 1;
        }
      });
      if (width / count < 150) {
        this.tableWrapper.nativeElement.style.overflowX = 'auto';
      } else {
        this.tableWrapper.nativeElement.style.overflowX = 'visible';
      }
    }
  }

  public changeTab(tab) {
    if (this.tabs) {
      this.tabs.forEach((el) => {
        if (el === tab) {
          el.is_collapsed = !el.is_collapsed;
        }
      });
    }
  }

  public getTabOfColumn(name) {
    let tab;
    if (this.tabs) {
      const filteredTabs = this.tabs.filter((el) => {
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
    const prepareData = [];
    data.forEach((el) => {
      const row = {
        id: el.id,
        __str__: el.__str__,
        collapsed: true,
        content: []
      };
      if (highlight) {
        this.addHighlight(highlight.field, el, row, highlight.values);
      }
      config.forEach((col) => {
        const cell = {
          id: el.id,
          label: col.label,
          hideLabel: col.hideLabel,
          hide: col.hide,
          name: col.name,
          center: col.center,
          content: [],
          contextMenu: col.context_menu,
          tab: this.getTabOfColumn(col.name),
          width: col.width
        };
        col.content.forEach((element) => {
          if (element.showIf && !this.checkShowRules(element.showIf, el)) {
            return;
          }
          let props;
          const obj: any = {
            rowId: el.id,
            key: col.name,
            delim: col.delim,
            title: col.title,
            skillName: col.label,
            name: element.field,
            type: element.type,
            values: element.values,
            color: element.color,
            action: element.action,
            inline: element.inline,
            outline: element.outline,
            description: element.description,
            redirect: element.redirect,
            file: element.file,
            display: element.display,
            setColorForLabel: element.setColorForLabel,
            noDelim: element.noDelim,
            placement: element.placement,
            hideValue: element.hideValue,
            help: element.help,
            postfix: element.postfix,
            content: element.content,
            groupLabel: element.groupLabel,
            emptyValue: element.emptyValue,
            messageType: element.messageType,
            customLink: element.customLink,
            fontSize: element.fontSize,
            inverse: element.inverse,
            param: element.param,
            stars: element.stars,
            visibleMode: element.visibleMode,
            image: element.image,
            score: element.score,
            hideTitle: element.hideTitle,
            size: element.size,
            shadow: element.shadow,
            muted: element.muted,
            signature: element.signature,
            svg: element.svg,
            process: new Subject(),
            info: element.info,
            styles: element.styles
          };
          if (this.listStorage.hasTrackingInfo(el.id)) {
            obj.locationDataEmpty = !this.listStorage.getTrackingInfo(el.id);
          }
          if (obj.action && this.disableActions) {
            obj.disableAction = true;
          }
          if (obj.description) {
            obj.description = this.format(obj.description, el);
          }
          if (element.setColor) {
            this.setValue(el, [element.setColor], obj, 'setColor');
          }
          if (element.workers_details) {
            obj['workers_details'] = this.getValueByKey('workers_details', el);
          }
          if (element.hasOwnProperty('file')) {
            const keys = element.field.split('.');
            keys[keys.length - 1] = '__str__';
            obj['contactName'] = this.getValueByKey(keys.join('.'), el);
          }
          if (element.display && element.type !== 'tags') {
            obj.display = this.format(
              element.display.replace(/{field}/gi, `{${element.field}}`),
              el
            );
          }
          if (element.type === 'datepicker') {
            const field = this.config.fields.find(
              (elem) => elem.key === element.field
            );
            if (field) {
              obj.templateOptions = field.templateOptions;
            }
          }
          if (element.type === 'icon' || element.type === 'static') {
            if (element.type === 'icon') {
              obj.label = element.label;
            }
            const field = this.config.fields.find(
              (elem) => elem.key === element.field
            );
            if (field) {
              obj['values'] = field.templateOptions.values || element.values;
              obj['color'] = field.templateOptions.color || element.color;
              obj['listLabel'] =
                field.templateOptions.listLabel || element.listLabel;
            }
          }
          if (element.link) {
            const indexOf = element.link.indexOf('{field}');
            if (indexOf) {
              element.link = element.link.replace(
                /{field}/gi,
                `{${element.field}}`
              );
            }
            obj['link'] = this.format(element.link, el);
            obj.text = this.format(element.text, el);
          } else if (element.endpoint) {
            if (element.field) {
              props = element.field.split('.');
              this.setValue(el, props, obj);
            }
            const indexOf = element.endpoint.indexOf('{field}');

            obj.notParsedEndpoint = element.notParsedEndpoint;
            if (element.endpoint[element.endpoint.length - 1] !== '/') {
              obj.notParsedEndpoint = element.endpoint;
              element.notParsedEndpoint = element.endpoint;
              element.endpoint += '/';
            }
            if (indexOf) {
              element.endpoint = element.endpoint.replace(
                /{field}/gi,
                `{${element.field}}`
              );
            }
            if (Array.isArray(obj.value)) {
              obj.link = [];
              obj.value.forEach((val) => {
                obj.link.push(
                  this.format(element.endpoint, {
                    [obj.name]: val
                  })
                );
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
              if (element.field === 'totalTime') {
                obj.value = this.format(
                  element.text.replace(/{field}/gi, `{${element.field}}`),
                  { ...el, totalTime: this.getTotalTime(el) }
                );
              } else {
                obj.value = this.format(
                  element.text.replace(/{field}/gi, `{${element.field}}`),
                  el
                );
              }
            }
            obj.label = element.label;
          }
          if (element.type === 'picture') {
            const field = this.config.fields.find(
              (elem) => elem.key === element.field
            );
            if (field) {
              obj.default = field.default;
            }
          }
          if (element.type === 'button') {
            this.updateButtonTypeCell(obj, element, el);
          }
          if (element.type === 'buttonGroup') {
            obj.content = element.content.map((elem) => {
              const newObj = Object.assign(
                {},
                elem,
                { rowId: obj.rowId },
                { disableAction: this.disableActions }
              );

              this.updateButtonTypeCell(newObj, elem, el);
              return newObj;
            });
          }
          if (element.type === 'select' && element.content) {
            obj.content = element.content.map((elem) => {
              const newObj = Object.assign({}, elem, { disableAction: this.disableActions });

              newObj['endpoint'] = this.format(elem.endpoint, el);

              this.updateButtonTypeCell(newObj, elem, el);
              return newObj;
            });
          }
          if (element.fields) {
            obj.fields = [];
            element.fields.forEach((field, index) => {
              const item = Object.assign({}, field);
              obj.fields[index] = item;
              props = field.field.split('.');
              this.setValue(el, props, item);
            });
          } else if (element.field) {
            if (element.type === 'info') {
              obj.editDisable = this.config.list.editDisable;
              obj.value = el;
              obj.companyPicture =
                this.endpoint === '/core/companies/';
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
              this.asyncData[element.endpoint] = [
                {
                  method: element.method,
                  content: cell.content,
                  query,
                  field: obj,
                  id: el.id,
                  request_field: element.request_field
                }
              ];
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

  public updateButtonTypeCell(obj, element, el) {
    obj.confirm = element.confirm;
    obj.options = element.options;
    obj.color = element.color;
    obj.text_color = element.text_color;
    obj.title = this.format(element.title, el);
    obj.messageType = this.format(element.messageType, el);
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
      icon: element.icon
        ? element.icon.slice(element.icon.indexOf('-') + 1)
        : null,
      small: true,
      mb: false,
      p: true,
      action: element.action,
      text: this.format(element.text, el)
    };
  }

  public getSortedColumns(config) {
    const result = {};
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
    const prop = props.shift();
    if (props.length === 0) {
      if (object.type === 'related' && !object[param]) {
        if (Array.isArray(data[prop])) {
          object[param] = data[prop];
        } else {
          object[param] = data[prop] ? data[prop].__str__ : '';
        }
      } else if (object.type === 'static' && !object[param]) {
        object[param] =
          data[prop] && data[prop].__str__ ? data[prop].__str__ : data[prop];
      } else if (!object[param]) {
        if (prop === 'totalTime') {
          object[param] = this.getTotalTime(data);
        } else {
          object[param] = data[prop];
        }
      }
    } else if (data[prop]) {
      this.setValue(data[prop], props, object, param);
    }
  }

  public getTotalTime(data) {
    const shift_ended_at = this.timeInstance(data.shift_ended_at);
    const shift_started_at = this.timeInstance(data.shift_started_at);

    let breakTime = 0;

    if (data.break_ended_at && data.break_started_at) {
      const break_ended_at = this.timeInstance(data.break_ended_at);
      const break_started_at = this.timeInstance(data.break_started_at);

      breakTime = break_ended_at.diff(break_started_at);
    }

    const workTime = shift_ended_at.diff(shift_started_at);
    const totalTime = this.timeInstance.duration(workTime - breakTime);

    return `${Math.floor(totalTime.asHours())}hr ${totalTime.minutes()}min`;
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
    const keys = Object.keys(this.select);
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
    const select = {};
    data.forEach((el) => {
      select[el.id] = false;
    });
    return select;
  }

  public actionHandler(e) {
    this.actionEndpoint = e.action.endpoint;
    if (e.action.required && !Object.keys(this.select).some((el) => el && this.select[el])) {
      this.actionProcess = false;
      this.toastr.sendMessage(e.action.selectionError, MessageType.error);
      return;
    }
    this.event.emit({
      type: 'action',
      list: this.config.list.list,
      action: e.action,
      data: this.select
    });
  }

  public filterHandler(e) {
    this.selectedAll = false;
    this.select = {};
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
    this.open(modal, { size: 'lg' });
  }

  public open(modal, options = {}) {
    this.modalRef = this.modalService.open(modal, options);
  }

  public initPagination(data) {
    if (this.inForm) {
      if (data !== this.currentData || data.count !== this.count) {
        this.selectedAll = false;
        const count = data.count;
        const length = data.results.length;
        this.count = length;
        if (length === 0) {
          this.pageSize = 10;
          this.page = 1;
          return;
        }
        if (!this.offset) {
          this.page = 1;
        } else if (this.offset) {
          this.page = this.offset / this.limit + 1;
        }
        if (!this.limit) {
          this.pageSize = 10;
        } else {
          this.pageSize = (count / this.limit) * 10;
        }
      }
    }
  }

  public sortTable(sorted) {
    let query = 'ordering=';
    let queries = '';
    const columns = Object.keys(sorted);
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
    this.filtersOfList = this.filterService.getFiltersOfList(
      this.parentEndpoint,
      this.config.list.list
    );
    this.poped = true;
  }

  public unpopedTable() {
    if (this.config.list.filters) {
      this.filterService.filters = {
        endpoint: this.parentEndpoint,
        list: this.config.list
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
        case 'buyCandidate':
          this.buyCandidate(e);
          break;
        case 'approveTimesheet':
          this.approveTimesheet(e);
          break;
        case 'openForm':
          this.openForm(e);
          break;
        case 'submitTimesheet':
          this.submitTimesheet(e);
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
        case 'showMessage':
        case 'messageDetail':
          this.showMessage(e);
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
        case 'showTracking':
          this.showTracking(e);
          break;
        default:
          return;
      }
    }
    return;
  }

  public buyCandidate(e) {
    const rowData = this.getRowData(e);
    this.modalInfo = {
      amount: rowData.profile_price,
      e
    };

    this.open(this.confirmProfileModal);
  }

  public confirmCandidateBuy() {
    const e = this.modalInfo.e;
    const rowData = this.getRowData(e);
    this.saveProcess = true;

    const body = {
      company: this.userService.user.data.contact.company_id
    };

    this.genericFormService.submitForm(e.el.endpoint, body)
      .pipe(finalize(() => this.saveProcess = false))
      .subscribe(() => {
        this.modalRef.close();
        this.toastr.sendMessage(`${rowData.__str__} has been added to your Candidate Contact list`, MessageType.success);
        this.event.emit({
          type: 'update',
          list: this.config.list.list
        });
      });
  }

  public fillIn(e) {
    const fillInPath = `/mn/hr/jobs/${e.el.rowId}/fillin/`;
    this.router.navigate([fillInPath]);
  }

  public showCandidateProfile(e) {
    const arr = e.el.endpoint.split('/');
    const id = arr[arr.length - 2];
    arr.splice(arr.length - 2, 1);
    const endpoint = arr.join('/');
    this.modalInfo = {
      type: 'form',
      mode: 'view',
      endpoint: '/candidate/candidatecontacts/',
      metadataQuery: 'type=profile',
      id
    };

    this.open(this.modal, { size: 'lg' });
  }

  public openForm(e) {
    this.modalInfo = {
      type: 'form',
      endpoint: e.el.endpoint,
      label: e.el.value
    };

    this.open(this.modal, { size: 'lg' });
  }

  public setAction(e) {
    this.modalInfo = {
      type: 'action',
      endpoint: e.el.endpoint
    };

    if (e.el.confirm && e.el.options) {
      this.modalInfo.message = e.el.options.message;
      this.modalInfo.agree_label = e.el.options.agree_label;
      this.modalInfo.decline_label = e.el.options.decline_label;
      this.open(this.confirmModal);
    } else {
      this.callAction(this.modalInfo);
    }
  }

  public callAction(modalInfo, closeModal?) {
    if (closeModal) {
      closeModal();
    }
    const endpoint = modalInfo.endpoint;
    this.genericFormService.submitForm(endpoint, {}).subscribe((res: any) => {
      this.event.emit({
        type: 'update',
        list: this.config.list.list
      });
    });
  }

  public openMap(value) {
    this.modalInfo = {};
    value.forEach((el) => {
      const keys = el.field.split('.');
      this.modalInfo[keys[keys.length - 1]] = +el.value;
    });
    this.open(this.mapModal, { size: 'lg', windowClass: 'fillin-map' });
  }

  public evaluate(e, data?) {
    if (!data) {
      data = this.getRowData(e);
    }

    if (data) {
      const contact = data.job_offer.candidate_contact.contact;
      this.modalInfo = {
        type: 'evaluate',
        endpoint: e.el.endpoint,
        edit: true,
        evaluate: true,
        rowData: data,
        label: {
          picture: contact.picture && contact.picture.origin,
          contactAvatar: getContactAvatar(contact.__str__),
          name: contact.__str__
        },
        data: {
          evaluation_score: 1
        }
      };

      this.open(this.evaluateModal, { windowClass: 'small-modal' });
    }
  }

  public sendSignature(submitButton: any) {
    if (this.modalInfo.signature) {
      const image = this.modalInfo.signature.value;

      this.modalInfo.form.supervisor_signature = image;
    }

    if (this.modalInfo.data.evaluation_score && !this.modalInfo.evaluated) {
      this.sendEvaluateData(this.modalInfo.evaluateEndpoint, this.modalInfo.data);
    }

    if (this.modalInfo.changeEndpoint) {
      setTimeout(() => {
        submitButton.click();
      }, 100);
    } else {
      this.saveProcess = true;

      this.genericFormService.submitForm(this.modalInfo.endpoint, this.modalInfo.form)
        .pipe(finalize(() => this.saveProcess = false))
        .subscribe(() => {
          this.modalRef.close();

          this.evaluateEvent({
            type: 'sendForm',
            status: 'success'
          });
        });
    }

  }

  public refreshList() {
    this.event.emit({
      type: 'update',
      list: this.config.list.list
    });
  }

  public convertBase64(url: string) {
    const b64Data = url.slice(url.indexOf(',') + 1);
    const byteCharacters = atob(b64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const theBlob = new Blob([byteArray], {type: 'image/png'});
    return new File([theBlob], 'signature.png');
  }

  public updateSignature(signature: string) {
    this.modalInfo.signature.value = signature;
  }

  public sendEvaluateData(endpoint, data) {
    this.saveProcess = true;

    this.genericFormService.editForm(endpoint, data)
      .pipe(finalize(() => this.saveProcess = false))
      .subscribe(() => {
        this.modalRef.close();

        this.evaluateEvent({
          type: 'sendForm',
          status: 'success'
        });
      });
  }

  public submitTimesheet(e) {
    const data = this.getRowData(e);

    if (data) {
      const contact = data.job_offer.candidate_contact.contact;
      this.modalInfo = {
        endpoint: e.el.endpoint,
        edit: true,
        label: {
          picture: contact.picture && contact.picture.origin,
          contactAvatar: getContactAvatar(contact.__str__),
          name: contact.__str__
        },
        data: {
          shift_started_at: createAddAction({
            value: data.shift_started_at
          }),
          break_started_at: createAddAction({
            value: data.break_started_at
          }),
          break_ended_at: createAddAction({
            value: data.break_ended_at
          }),
          shift_ended_at: createAddAction({
            value: data.shift_ended_at
          }),
          supervisor: createAddAction({
            value: data.supervisor
          }),
          position: createAddAction({
            value: data.position
          }),
          company: createAddAction({
            value: data.company
          }),
          jobsite: createAddAction({
            value: data.jobsite
          })
        }
      };

      let windowClass = 'visible-mode timesheet-submit-form';

      if (isMobile()) {
        windowClass += ' mobile-device';
      }

      this.open(this.evaluateModal, { size: 'lg', windowClass });
    }
  }

  public changeTimesheet(e) {
    const data = this.getRowData(e);
    const signature = data.company.supervisor_approved_scheme.includes('SIGNATURE');

    if (data) {
      const contact = data.job_offer.candidate_contact.contact;
      const score = this.getPropValue(data, 'evaluation.evaluation_score');
      this.modalInfo = {
        changeEndpoint: e.el.endpoint,
        evaluateEndpoint: `${Endpoints.Timesheet}${data.id}/evaluate/`,
        edit: true,
        evaluated: data.evaluated,
        total: this.getTotalTime(data),
        metadataQuery: isMobile() && (getOrientation() !== 90) ? 'type=mobile' : '',
        signatureStep: false,
        form: {},
        supervisor_signature: data.supervisor_signature.origin,
        label: {
          picture: contact.picture && contact.picture.origin,
          contactAvatar: getContactAvatar(contact.__str__),
          name: contact.__str__
        },
        timesheetData: {
          shift_started_at: createAddAction({
            value: data.shift_started_at
          }),
          break_started_at: createAddAction({
            value: data.break_started_at
          }),
          break_ended_at: createAddAction({
            value: data.break_ended_at
          }),
          shift_ended_at: createAddAction({
            value: data.shift_ended_at
          }),
          noBreak: createAddAction({
            value: !data.break_started_at && !data.break_ended_at
          }),
        },
        changeMetadata: new Subject(),
        data: {
          evaluation_score: score
        }
      };

      let windowClass = 'approve-modal visible-mode';

      if (signature) {
        this.modalInfo.signature = {
          endpoint: `${Endpoints.Timesheet}${data.id}/approve_by_signature/`,
          value: ''
        };

        windowClass = 'approve-modal change';
      }

      window.addEventListener('orientationchange', () => {
        if (this.modalInfo.changeMetadata) {
          const orientation = getOrientation();

          this.modalInfo.metadataQuery = isMobile() && orientation === 90 ? '' : 'type=mobile';

          setTimeout(() => {
            this.modalInfo.changeMetadata.next(true);
          }, 100);
        }
      });

      this.open(this.approveSignature, { size: 'lg', windowClass });
    }
  }

  public landscape() {
    return isMobile() && (getOrientation() === 90);
  }

  public approveTimesheet(e) {
    const data = this.getRowData(e);
    const signature = data.company.supervisor_approved_scheme.includes('SIGNATURE');

    if (data) {
      e.el.endpoint = this.format(this.evaluateEndpoint, data);

      if (signature) {
        const contact = data.job_offer.candidate_contact.contact;
        const score = this.getPropValue(data, 'evaluation.evaluation_score');
        this.modalInfo = {
          endpoint: `${Endpoints.Timesheet}${data.id}/approve_by_signature/`,
          evaluateEndpoint: `${Endpoints.Timesheet}${data.id}/evaluate/`,
          evaluated: data.evaluated,
          timesheet: {
            date: this.format('{shift_started_at__date}', data),
            started_at: this.format('{shift_started_at__time}', data),
            break: this.format('{break_started_at__time} - {break_ended_at__time}', data),
            ended_at: this.format('{shift_ended_at__time}', data),
            shift_start_end: this.format('{shift_started_at__time} - {shift_ended_at__time}', data),
            break_start_and: this.format('{break_started_at__time} - {break_ended_at__time}', data),
            unformated_date: data.shift_started_at,
            total: this.getTotalTime(data)
          },
          form: {},
          signature: {
            endpoint: `${Endpoints.Timesheet}${data.id}/approve_by_signature/`,
            value: ''
          },
          label: {
            picture: contact.picture && contact.picture.origin,
            contactAvatar: getContactAvatar(contact.__str__),
            name: contact.__str__
          },
          data: {
            evaluation_score: score
          },
          signatureStep: true,
          approve: true
        };

        this.open(this.approveSignature, { windowClass: 'approve-modal approve' });

      } else if (!data.evaluated) {
        this.approveEndpoint = `${Endpoints.Timesheet}${data.id}/approve/`;
        this.evaluate(e, data);
      } else {
        this.genericFormService
          .editForm(`${Endpoints.Timesheet}${data.id}/approve/`, {})
          .subscribe(
            () => this.refreshList(),
          );
      }
    }
  }

  public getRowData(event): any {
    return this.fullData[this.responseField].find(
      (el) => el.id === event.el.rowId
    );
  }

  public openFrame(e, param = 'recipient') {
    let query = '?';
    const contacts = [];
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
    }
    let url;
    this.modalInfo = {};
    url = param === 'recipient' ? `${environment.api}/twilio/` : '';
    url += query;
    url += `&token=${this.storage.retrieve('user').access_token_jwt}`;
    this.modalInfo.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.open(this.sendMessageModal);
  }

  public eventHandler(e) {
    this.modalInfo = {
      type: e.target,
      endpoint: e.endpoint,
      label: e.label,
      id: e.id,
      mode: 'edit',
      dontUseMetadataQuery: true
    };

    this.open(this.modal, { size: 'lg' });
  }

  public addObject() {
    this.modalInfo = {
      type: 'form',
      endpoint: this.endpoint,
      label: `Add ${this.config.list.label}`
    };

    this.open(this.modal, { size: 'lg' });
  }

  public editObject(id, label?) {
    this.modalInfo = {
      type: 'form',
      endpoint: this.endpoint,
      label: label ? label : 'Edit',
      id
    };

    this.open(this.modal, { size: 'lg' });
  }

  public activeTable() {
    if (this.poped) {
      this.event.emit({
        type: 'active',
        list: this.config.list.list
      });
    }
  }

  public addHighlight(prop, data, row, values) {
    const props = prop.split('.');
    const key = props.shift();
    if (props.length === 0) {
      const property = data[prop];
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
    const open = '{';
    const close = '}';
    const pieces = [];
    let before;
    let propValue;
    let pos = 0;
    let trail;
    while (true && str) {
      const start = str.indexOf(open, pos);
      const end = str.indexOf(close, pos);
      const key = str.substring(start + 1, end);
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
    const props = key.split('.');
    const prop = props.shift();
    if (!props.length) {
      if (data) {
        if (prop.indexOf('__') > -1) {
          const [field, format] = prop.split('__');
          const datetime = ['date', 'time', 'datetime', 'diff'];
          if (datetime.indexOf(format) > -1) {
            if (data[field]) {
              if (format === 'diff') {
                return this.timeInstance(data[field]).from(this.timeInstance());
              }

              return this.timeInstance(data[field])
                .format(format === 'time' ? 'hh:mm A' : format === 'datetime' ? 'DD/MM/YYYY hh:mm A' : 'DD/MM/YYYY');
            } else {
              return isMobile() && isCandidate() ? '-' : '';
            }
          } else {
            return data[prop];
          }
        } else {
          return data[prop];
        }
      }
    } else {
      if (prop === 'session') {
        return this.getPropValue(this.userService.user, props.join('.'));
      }

      if (data) {
        return this.getPropValue(data[prop], props.join('.'));
      }
    }
  }

  public formEvent(e, closeModal?) {
    if (e.type === 'formRegistration') {
      this.modalInfo.form = e.form;
    }
    if (e.type === 'saveStart') {
      this.saveProcess = true;
    }
    if (e.type === 'sendForm' && e.status === 'success') {
      this.saveProcess = false;
      if (closeModal) {
        closeModal();
      }

      if (this.approveInvoice && e.data.billing_email) {
        this.post(this.approveInvoice);
        return;
      }

      this.event.emit({
        type: 'update',
        list: this.config.list.list
      });
    }
  }

  public formError() {
    this.saveProcess = false;
  }

  public evaluateEvent(e, closeModal?) {
    if (e.type === 'sendForm' && e.status === 'success') {
      if (closeModal) {
        closeModal();
      }
      if (this.approveEndpoint) {
        this.genericFormService
          .editForm(this.approveEndpoint, {})
          .subscribe((res: any) => {
            this.event.emit({
              type: 'update',
              list: this.config.list.list
            });
            this.approveEndpoint = null;
          });
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
        case 'sendSMS':
          this.openFrame([]);
          break;
        default:
          return;
      }
    }
  }

  public showMap() {
    this.modalInfo = this.generateDataForFillInMap({});
    this.open(this.fillInMap, { size: 'lg', windowClass: 'fillin-map' });
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
        selected: this.select[this.getPropValue(el, 'id')]
      });
    });
    if (this.supportData) {
      data.markers.push({
        latitude: this.data[this.supportData].latitude,
        longitude: this.data[this.supportData].longitude,
        name: this.data[this.supportData].__str__,
        description: this.data[this.supportData].address,
        label: this.sanitizer.bypassSecurityTrustStyle('{ color: "green"}'),
        iconUrl: '/assets/img/location-red.svg'
      });
      data.latitude = this.data[this.supportData].latitude;
      data.longitude = this.data[this.supportData].longitude;
    }
    return data;
  }

  public showPreview(e) {
    this.genericFormService.getAll(e.el.endpoint).subscribe((res: any) => {
      this.modalInfo = {
        url: {
          url: res.pdf
        }
      };
      this.open(this.showPreviewInvoice, { size: 'lg' });
    });
  }

  public printPDF(e) {
    this.genericFormService.getAll(e.el.endpoint).subscribe((res: any) => {
      this.modalInfo = {
        url: this.sanitizer.bypassSecurityTrustResourceUrl(environment.api + res.pdf)
      };
      this.open(this.pdfDocumentModal, { size: 'lg' });
    });
  }

  public delete(e) {
    this.genericFormService.delete(this.endpoint, e.el.rowId).subscribe(
      (res: any) => {
        this.event.emit({
          type: 'update',
          list: this.config.list.list
        });
      },
      (err: any) => (this.error = err)
    );
  }

  public identifyDevice() {
    let changeDesign = false;

    this.mobileDesign.forEach((el) => {
      if (this.endpoint && this.endpoint.includes(el)) {
        changeDesign = true;
      }
    });

    if (changeDesign) {
      return isMobile();
    }
  }

  public editForm(e) {
    let endpoint;
    let id;
    let withoutId;
    let data;
    if (this.editEndpoint) {
      endpoint = this.format(
        this.editEndpoint,
        this.data.results.find((el) => el.id === e.el.rowId)
      );

      const arr: string[] = endpoint.split('/');
      const lastElement = arr.pop();

      id = lastElement;
      endpoint = [...arr, ''].join('/');
    } else {
      endpoint = e.el.endpoint || this.endpoint;
      if (
        e.el.notParsedEndpoint &&
        e.el.notParsedEndpoint[e.el.notParsedEndpoint.length - 1] !== '/'
      ) {
        const arr: string[] = e.el.endpoint.split('/');
        arr.pop();
        const lastElement = arr.pop();
        if (lastElement === 'extend') {
          endpoint = [...arr, 'extend'].join('/');
          withoutId = true;

          data = {
            skill: {
              action: 'add',
              data: {
                value: this.format(
                  '{position.id}',
                  this.data.results.find((el) => el.id === e.el.rowId)
                )
              }
            },
            default_shift_starting_time: {
              action: 'add',
              data: {
                value: this.format(
                  '{default_shift_starting_time}',
                  this.data.results.find((el) => el.id === e.el.rowId)
                )
              }
            },
            job: {
              action: 'add',
              data: {
                value: e.el.rowId
              }
            }
          };
        } else if (lastElement === 'candidate_fill') {
          endpoint = [...arr, 'candidate_fill'].join('/');
          withoutId = true;
        } else if (lastElement === 'supervisor_approve') {
          endpoint = [...arr, 'supervisor_approve'].join('/');
          withoutId = true;
        } else {
          id = lastElement;
          endpoint = [...arr, ''].join('/');
        }
      }
    }
    this.modalInfo = {
      type: 'form',
      endpoint,
      id: id || (!withoutId && e.el.rowId),
      mode: 'edit',
      edit: true,
      data,
      dontUseMetadataQuery: e.value === 'editModal' || e.value === 'editForm'
    };

    let size = 'lg';
    let windowClass = '';

    if (this.modalInfo.endpoint.includes('/candidate/skillrels/')) {
      this.modalInfo.label = 'Edit skills';
    }

    if (smallModalEndpoints.includes(this.modalInfo.endpoint) || e.el.size === 'small') {
      size = undefined;
      windowClass = 'small-modal';
    }

    if (this.modalInfo.endpoint.includes('/extend')) {
      windowClass = 'extend-modal';
    }

    if (e.el.visibleMode) {
      windowClass += ' visible-mode';
    }

    this.open(this.modal, { size, windowClass });
  }

  public showMessage(e) {
    const arr: string[] = e.el.endpoint.split('/');
    arr.pop();

    if (e.el.messageType) {
      e.el.messageType = (<string> e.el.messageType).toLowerCase();
    }

    const id = arr.pop();
    const endpoint = [...arr, ''].join('/');
    const metadataQuery = `type=${e.el.messageType === 'received' ? 'reply' : e.el.messageType}`;

    const label = e.el.messageType === 'sent'
      ? 'Sent message'
      : e.el.messageType === 'reply' || e.el.messageType === 'received'
        ? 'Received message'
        : undefined;

    this.modalInfo = {
      metadataQuery,
      label,
      type: 'form',
      endpoint,
      id,
      mode: 'view',
      edit: true,
      data: {
        ['has_resend_action']: {
          action: 'add',
          data: {
            value: this.getRowData(e)['has_resend_action']
          }
        },
        ['resend_id']: {
          action: 'add',
          data: {
            value: e.el.rowId
          }
        }
      },
    };

    this.open(this.messageDetail, { windowClass: 'message-detail' });
  }

  public addForm(e) {
    this.modalInfo = {
      type: 'form',
      endpoint: e.el.endpoint
    };

    this.open(this.modal, { size: 'lg' });
  }

  public post(e) {
    const endpoint: string = e.el.endpoint;
    this.genericFormService
      .submitForm(endpoint, {})
      .subscribe(
        (res: any) => {
          if (e.el && e.el.redirect) {
            const helper = new JwtHelperService();
            const token = helper.decodeToken(res.access_token_jwt);

            const redirect = token.origin;

            if (redirect === location.origin) {
              this.storage.clear('role');
              this.storage.clear('user');
              this.userService.user = null;

              this.authService.storeToken({ data: res });

              this.userService.getUserData().subscribe(() => {
                location.href = redirect;
              });

              return;
            }

            location.href = redirect;
            return;
          }

          this.event.emit({
            type: 'update',
            list: this.config.list.list
          });
        },
        (err: any) => {
          this.error = err;
          if (endpoint.includes('/core/invoices/') && endpoint.includes('/approve/')) {
            this.toastr.sendMessage(err.errors, MessageType.error);
            this.approveInvoice = e;
            const invoice = this.getRowData(e);
            this.modalInfo = {
              id: invoice.customer_company.id,
              endpoint: Endpoints.Company,
              label: invoice.customer_company.name,
              type: 'form',
              edit: true,
              mode: 'edit'
            };
            this.open(this.modal, { size: 'lg' });

            setTimeout(() => {
              const input = document.querySelector('input[name="billing_email"]') as HTMLInputElement;
              input.focus();
            }, 2000);
          }
        }
      );
  }

  public checkShowRules(rule: any[], data): boolean {
    let approvedRules = 0;
    const rulesNumber = rule.length;

    rule.forEach((el: any) => {
      if (typeof el === 'string') {
        const value = this.getValueByKey(el, data);

        if (value && value !== '0') {
          approvedRules += 1;
        } else {
          return;
        }
      } else if (el instanceof Object) {
        const key = Object.keys(el)[0];
        const targetValue = el[key];
        const value = this.getValueByKey(key, data);

        if (Array.isArray(targetValue)) {
          const exist = targetValue.some((item) => item === value);
          if (exist) {
            approvedRules += 1;
          }
        } else if (value === targetValue) {
          approvedRules += 1;
        } else {
          return;
        }
      }
    });

    return approvedRules === rulesNumber;
  }

  public getValueByKey(key: string, data: any): any {
    const keysArray = key.split('.');
    const firstKey = keysArray.shift();
    if (keysArray.length === 0) {
      return data && data[firstKey];
    } else if (keysArray.length > 0) {
      const combineKeys = keysArray.join('.');
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

  public toggleFilterBlock() {
    this.filtersHidden = !this.filtersHidden;

    if (!this.filtersHidden) {
      document.body.classList.add('scroll-hidden');
    } else {
      document.body.classList.remove('scroll-hidden');
    }
  }

  public markerClick(e) {
    e.selected = !e.selected;
    this.select[e.id] = e.selected;

    this.emitSelect();
  }

  public openAllTabs() {
    this.collapsed = !this.collapsed;

    this.body.forEach((row) => {
      row.collapsed = this.collapsed;
    });
  }

  public getView() {
    switch (this.endpoint) {
      case Endpoints.TimesheetHistory:
        return this.history
      case Endpoints.TimesheetCandidate:
        return this.timesheetsCandidate;
      case Endpoints.TimesheetUnapproved:
        return this.unapproved;
    }
  }

  public getElement(name: string, row: any[]): any {
    return row.find((el) => el.name === name);
  }

  public inverseButton(field) {
    return { ...field, inverse: true };
  }

  public showTracking(e) {
    e.el.process.next(true);
    this.genericFormService.getByQuery(e.el.endpoint, `?timesheet=${e.id}&limit=-1`)
      .pipe(finalize(() => e.el.process.next(false)))
      .subscribe((res) => {
        if (res.results.length) {
          this.listStorage.updateTrackingInfo(e.id, true);
          const timesheet = this.getRowData(e);
          const break_end = this.timeInstance(timesheet.break_ended_at);
          const break_start = this.timeInstance(timesheet.break_started_at);
          const end = this.timeInstance(timesheet.shift_ended_at);
          const start = this.timeInstance(timesheet.shift_started_at);

          const paths = res.results.map((point) => {
            return {
              lat: point.latitude,
              lng: point.longitude,
              log_at: point.log_at
            };
          });

          const breakPaths = paths.filter((el) => {
            const time = this.timeInstance(el.log_at);

            return time.isBefore(break_end) && time.isAfter(break_start);
          });

          this.modalInfo = {
            paths,
            breakPaths,
            timePoints: { start, end, break_start, break_end },
            jobsite: timesheet.jobsite.__str__,
            latitude: paths[0].lat,
            longitude: paths[0].lng,
          };

          e.el.locationDataEmpty = false;
          this.listStorage.updateTrackingInfo(e.id, true);
          this.trackingMarkerCoordinates(start);

          this.open(this.trakingModal);
        } else {
          e.el.locationDataEmpty = true;
          this.listStorage.updateTrackingInfo(e.id, false);
          this.toastr.sendMessage('Location data is empty', MessageType.info);
        }
      });
  }

  public trackByTraking(data) {
    return data.log_at;
  }

  public trackingMarkerCoordinates(time) {
    if (this.modalInfo) {
      const item = this.modalInfo.paths.find((el) => time.format('hh:mm A') === this.timeInstance(el.log_at).format('hh:mm A'));
      if (item) {
        this.modalInfo.markerLatitude = item.lat;
        this.modalInfo.markerLongitude = item.lng;
      }
    }
  }

  public isInteger(value: any) {
    return Number.isInteger(value);
  }


}