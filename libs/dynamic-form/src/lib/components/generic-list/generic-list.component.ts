import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
  GenericFormService,
  FilterService,
  ListService,
  SortService,
  SortData
} from './../../services';

import { forkJoin, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, map, skip } from 'rxjs/operators';
import { Sort } from '../../helpers';
import {
  FormatString,
  getFulfilledStatus,
  getPropValue
} from '@webui/utilities';
import { MessageType, ToastService } from '@webui/core';
import { ApiMethod } from '@webui/data';
import { Endpoints } from '@webui/models';
import isObject from 'isobject';

@Component({
  selector: 'webui-generic-list',
  templateUrl: './generic-list.component.html',
  providers: [ListService, SortService]
})
export class GenericListComponent implements OnInit, OnDestroy {
  @Input() endpoint?: string;
  @Input() editEndpoint?: string;
  @Input() inForm = false;
  @Input() data: any;
  @Input() query = '';
  @Input() update!: Subject<number>;
  @Input() supportData: any;
  @Input() paginated = 'on';
  @Input() responseField = 'results';
  @Input() metaType!: boolean;
  @Input() actions = false;
  @Input() delay = false;
  @Input() allowPermissions!: string[];
  @Input() metadataQuery!: string;
  @Input() addMetadataQuery!: string;
  @Input() upload!: Subject<boolean>;
  @Input() clientId?: string;
  @Input() listNameCache?: Record<string, any>;
  @Input() disableActions?: boolean;
  @Input() inlineFilters?: boolean;
  @Input() hasButtonInAction?: boolean;

  @Output() checkedObjects: EventEmitter<any> = new EventEmitter();
  @Output() event: EventEmitter<any> = new EventEmitter();
  @Output() dataLength: EventEmitter<number> = new EventEmitter();
  @Output() listUpdated: EventEmitter<void> = new EventEmitter();

  public tables: any[] = [];
  public first = false;
  public tableId = 1;
  public existingIds: number[] = [];
  public err: any;
  public limit = 10;
  public minimizedTable: any[] = [];

  public cashData?: any[];
  public isLoading!: boolean;
  public currentQuery: any;

  private subscriptions: Subscription[] = [];

  private results!: any[];

  public afterEditLimit: any = 10;
  public afterEditOffset: any = 0;
  public isEditRecord: any = false;

  get isTableReady(): boolean {
    if (!this.tables?.length) {
      return false;
    }

    const table = this.tables[0];

    return table.endpoint.includes('hr/job') ? table.metadata && table.data : table.metadata
  }

  constructor(
    private gfs: GenericFormService,
    private fs: FilterService,
    private route: ActivatedRoute,
    private router: Router,
    private listService: ListService,
    private cd: ChangeDetectorRef,
    private sortService: SortService,
    private toast: ToastService
  ) {}

  public ngOnInit() {
    if (!this.endpoint) {
      return;
    }

    const mainTable = this.createTable(this.endpoint);
    this.tables.push(mainTable);

    this.initTableData(mainTable);

    if (this.update) {
		// set temp flag in localstorage
      localStorage.setItem('flagAfterEditRecord', 'true');
      this.subscriptions.push(
        this.update.subscribe((update) => {
          const table = this.getFirstTable();

          this.updateList(table, update);
        })
      );
    }

    if (this.upload) {
      const subscription = this.upload
        .asObservable()
        .pipe(debounceTime(200))
        .subscribe((data) => {
          const table = this.getFirstTable();

          if (
            table.offset + table.limit < (table.data && table.data.count) &&
            table.data.count > table.limit
            && !table.uploadAll
          ) {
            if (data && !this.isLoading) {
              setTimeout(() => {
                this.uploadMore();
              }, 200);
            }
          }
        });

      this.subscriptions.push(subscription);
    }

    this.subscriptions.push(
      this.listService.update$.subscribe((timestamp: number) => {
        const table = this.getFirstTable();
        table.offset = 0;
        table.query.pagination = '';

        this.updateList(table, timestamp);
      })
    );
  }

  public ngOnDestroy() {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }

  initTableData(table: any) {
    const endpoint = table.endpoint;
    let formset = '';
    if (this.inForm && !this.metaType) {
      formset = '?type=formset';
    }

    this.getMetadata(endpoint, table, formset)?.subscribe((data) => {
      const { isSkip } = data;

      if (!this.inForm) {
        const paramsSubscription = this.route.queryParams
          .pipe(skip(isSkip ? 1 : 0))
          .subscribe((params) => {
            setTimeout(() => {
              if (table && table.first && !(this.cd as any).destroyed) {
                this.parseUrl(params, table.list);
              }
            }, 200);
          });

        this.subscriptions.push(paramsSubscription);
      } else if (!this.delay) {
        this.getData(endpoint, this.generateQuery(table.query), table);
      }
    });
  }

  updateList(table: any, update: number) {
    if (update && !this.delay) {
      this.getData(table.endpoint, this.generateQuery(table.query), table);
    } else if (update) {
      table['data'] = this.data;
      table.update = Date.now();
    }
  }

  public uploadMore() {
    const table = this.getFirstTable();
    const limit = table.limit;
    const offset = this.afterEditOffset != 0 ? parseInt(this.afterEditOffset) + limit :  table.offset + limit;
    table.query.pagination = `limit=${limit}&offset=${offset}`;

	// Here we handlig pagination in after edit record
    const afterEditLimit = offset + limit;
    this.afterEditOffset = parseInt(this.afterEditOffset) + limit;
    localStorage.setItem('afterEditLimit', afterEditLimit);

    this.getData(
      table.endpoint,
      this.generateQuery(table.query),
      table,
      null,
      true
    );
  }

  public getMetadata(endpoint: string, table: any, formset?: string | null) {
    let query = formset || '';
    if (this.metadataQuery) {
      query += `&${this.metadataQuery}`;
    }

    return this.gfs.getMetadata(endpoint, query)?.pipe(
      map((metadata) => {
        this.updateMetadataInfo(metadata, table);

        if (!this.delay) {
          const sortData: SortData = this.sortService.getSortData(
            metadata.list.columns
          );

          if (this.inForm) {
            this.sortService.init(sortData);
          }

          table.query =
            Object.keys(sortData).length > 0
              ? {
                  filter: '',
                  sort: this.sortService.getSortQuery(sortData),
                  pagination: ''
                }
              : {};
        }

        if (endpoint.includes('fillin')) {
          const queryItems = metadata.list.filters
            .filter((filter: any) => {
              return 'default' in filter && filter.default;
            })
            .map((filter: any) => `${filter.query}=${filter.default}`);

          table.query.filter = queryItems.join('&');
        }

        const queryExist = this.route.snapshot.queryParamMap.keys.length;

        if (
          !this.inForm &&
          (table.query.sort || table.query.filter) &&
          !queryExist
        ) {
          this.updateUrl(table.query);
        }

        return {
          metadata,
          isSkip: (table.query.sort || table.query.filter) && !queryExist
        };

        // if (outer) {
        //   setTimeout(() => {
        //     outer.update = metadata;
        //   }, 300);
        // }
      })
    );
  }

  public updateMetadataInfo(metadata: any, table: any) {
    const label = metadata.list.label;
    const listKey = metadata.list.list;
    table.metadata = metadata;
    table.list = listKey;
    this.existingIds.push(this.tableId);
    table.id = this.tableId++;

    if (this.listNameCache && !this.listNameCache[this.endpoint || '']) {
      this.listNameCache[this.endpoint || ''] = label;
    }
  }

  public getData(endpoint: string, query = '?', table: any, target = null, add = false, all?: boolean) {
    if (this.clientId) {
      query += `&role=${this.clientId}`;
    }

    if (this.query) {
      query += `&${this.query}`;
    }

    if (query[0] !== '?') {
      query = `?${query}`;
    }

    this.currentQuery = query;
    this.isLoading = true;
    this.listUpdated.emit();

    this.gfs.getByQuery(endpoint, query).subscribe((data) => {
      if (this.currentQuery !== query) {
        return;
      }

      if (query === '?') {
        this.cashData = data;
      }

      if (endpoint === Endpoints.Shift) {
        data.results.forEach((el: any) => {
          el.is_fulfilled = getFulfilledStatus(
            el.is_fulfilled,
            el.workers_details
          );
        });
      }

      if (endpoint.includes('/fillin/')) {
        this.updateFillInList(data);
      }
      this.isLoading = false;
      this.updateTable(data, table, target, add);
      if (all) {
        table.uploadAll = true;
      }
    },
    // The 2nd callback handles errors.
    (err) => console.error(err),
    // The 3rd callback handles the "complete" event.
    () => {
      setTimeout(() => {
        const rowId = localStorage.getItem('rowId');
        if(rowId != ""){
          const selectedRow = (document.getElementById(rowId as string)) as HTMLTableElement;
          if(selectedRow) {
            selectedRow.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});localStorage.removeItem('rowId');

          }
        }
      }, 500);
      }
      );
  }

  updateTable(data: any, table: any, target: any, add: boolean) {
    this.dataLength.emit(data.count);
    this.event.emit(data[this.supportData]);

    if (add) {
      table.offset += table.limit;
      table.addData = data;
      this.results = [...this.results, ...data[this.responseField]];
    } else {
      table.data = data;
      this.results = [...data[this.responseField]];
    }
    // if (this.paginated === 'on') {
    //   this.calcPagination(data);
    // }
    table.refresh = false;
    if (target) {
      setTimeout(() => {
        target.update = Date.now();
      }, 150);
    }
  }

  public updateFillInList(data: any) {
    const defaultRate = 'default_rate';

    if (data[this.responseField]) {
      data[this.responseField].forEach((candidate: any) => {
        candidate[defaultRate] = data.job && data.job[defaultRate];
      });
    }
  }

  public calcPagination(data: any) {
    if (!this.limit) {
      const length = data.results.length;
      this.limit = this.calcLimit(data.count, length);

      if (this.limit) {
        this.updateTables('limit');
      }
    }
  }

  public calcLimit(count: number, length: number) {
    return count > length ? length : count;
  }

  public updateTables(prop: keyof GenericListComponent) {
    this.tables.forEach((el) => {
      el[prop] = this[prop];
    });
  }

  public eventHandler(e: any) {
    const table = this.getTable(e.list);
    if (!table.query) {
      table.query = {};
    }
    if (
      e.type === 'sort' ||
      e.type === 'pagination' ||
      e.type === 'filter' ||
      e.type === 'update'
    ) {
      table.refresh = true;
      table.uploadAll = false;
      if (e.type === 'update') {
        table.offset = 0;
        table.query.pagination = '';
        this.getData(table.endpoint, this.generateQuery(table.query), table);
        return;
      }
      if (table.query[e.type] === e.query) {
        table.refresh = false;
        return;
      }
      table.query[e.type] = e.query;
      if (e.type === 'pagination') {
        table.innerTables = {};
      }
      if (table && table.first && !this.inForm) {
        if (e.type === 'filter' || e.type === 'sort') {
          table.offset = 0;
        }
        this.updateUrl(table.query);
      } else {
        if (e.query) {
          e.query.split('&').forEach((el: any) => {
            const propsArray = el.split('=');
            if (propsArray[0] === 'offset') {
              table['offset'] = propsArray[1];
            }
          });
        }
        this.getData(table.endpoint, this.generateQuery(table.query), table);
      }
    } else if (e.type === 'close') {
      this.tables.splice(this.tables.indexOf(table), 1);
    } else if (e.type === 'active') {
      this.resetActiveTable(this.tables);
      table.active = true;
    } else if (e.type === 'action') {
      this.callAction(e.data, e.action.endpoint, table, e);
    } else if (e.type === 'minimize') {
      table.minimized = true;
      table.maximize = false;
      this.minimizedTable.push(table as any);
    } else if (e.type === 'uploadAll') {
      table.refresh = true;
      this.uploadAll();
    }

    this.event.emit(e);
  }

  public action(type: string, table: any) {
    const minIndex = this.minimizedTable.indexOf(table);
    const tabIndex = this.tables.indexOf(table);
    switch (type) {
      case 'minimize':
        table.minimized = false;
        break;
      case 'maximize':
        table.maximize = true;
        break;
      case 'close':
        if (minIndex !== -1 && tabIndex !== -1) {
          this.tables.splice(tabIndex, 1);
        }
        break;
      default:
        break;
    }
    if (minIndex !== -1 && tabIndex !== -1) {
      this.minimizedTable.splice(minIndex, 1);
    }
  }

  public generateQuery(queries: any) {
    if (queries) {
      const patt = /\?/;
      let result = '';
      if (patt.test(this.endpoint || '')) {
        result = '&';
      } else {
        result = '?';
      }
      const queryList = Object.keys(queries);
      queryList.forEach((el) => {
        if (queries[el]) {
          result += `${queries[el]}&`;
        }
      });
      return result.slice(0, result.length - 1);
    }

    return;
  }

  public createTable(endpoint: string) {
    return {
      endpoint,
      innerTables: {},
      first: !this.first,
      query: {},
      data: undefined,
      limit: this.limit,
      offset: 0
    };
  }

  public getTable(name: string) {
    return this.tables.find((el) => el.list === name);
  }

  public getFirstTable() {
    return this.tables.find((el) => el.first);
  }

  public resetActiveTable(tables: any[]) {
    tables.forEach((el) => {
      el.active = false;
    });
  }

  public listHandler(e: any) {
    if (
      this.checkList(e.endpoint) &&
      !e.innerTable &&
      this.tables.length < 10
    ) {
      this.tables.push(this.createTable(e.endpoint));
    } else if (e.innerTable) {
      const table = this.getTable(e.list);
      table.innerTables = Object.assign({}, table.innerTables);
      table.innerTables[e.row] = table.innerTables[e.row] || {};
      table.innerTables[e.row][e.key] = {};
      this.getMetadata(
        e.endpoint,
        table.innerTables[e.row][e.key],
        null,
      );
      this.getData(e.endpoint, undefined, table.innerTables[e.row][e.key], table);
    }
  }

  public checkList(endpoint: string) {
    const result = this.tables.filter((el) => el.endpoint === endpoint);
    return !result.length;
  }

  public callAction(data: any, endpoint: string, target: any, e: any) {
    let body;
    const ids: string[] = [];
    const keys = Object.keys(data);
    const {
      action: { multiple, bodyFields, bodySignature, signature_endpoint }
    } = e;
    let { action: { method } } = e;
    keys.forEach((el) => {
      if (data[el]) {
        ids.push(el);
      }
    });

    if (multiple) {
      const requests = ids.map((id: string) => {
        let url = FormatString.format(endpoint, { id });
        const rowData = this.results.find((el) => el.id === id);
        let body = {};

        const isSignatureApproving = rowData.company && rowData.company.supervisor_approved_scheme === 'SIGNATURE';

        if (bodyFields && !isSignatureApproving) {
          bodyFields.forEach((prop: any) => {
            if (typeof prop === 'string') {
              body = {
                ...body,
                [prop]: getPropValue(rowData, prop)
              };
            }

            if (isObject(prop)) {
              body = {
                ...body,
                ...prop
              };
            }
          });
        } else if (isSignatureApproving) {
          method = ApiMethod.POST;
          url = FormatString.format(signature_endpoint, { id });
          body = {
            ...bodySignature
          };
        }

        switch (method) {
          case ApiMethod.PUT:
            return this.gfs.editForm(url, body).pipe(
              catchError((err) => {
                const detail = err.detail;

                if (detail) {
                  this.toast.sendMessage(detail, MessageType.Error);
                }

                return err;
              })
            );
          case ApiMethod.DELETE:
            return this.gfs.delete(url, id);
          default:
            return this.gfs.submitForm(url, body);
        }
      });

      target.actionProcess = true;
      forkJoin(requests).subscribe((responses: (Record<string, any> | null)[]) => {
        target.actionProcess = false;
        target.refresh = true;
        target.actionData = responses;
        if (
          responses.some(
            (response) =>
              response || response === null || (response as Record<string, any>)['status'] === 'success'
          )
        ) {
          this.getData(
            target.endpoint,
            this.generateQuery(target.query),
            target
          );
        }
      });

      return;
    }

    if (e.action.property) {
      body = {
        [e.action.property]: ids
      };
    } else {
      body = ids;
    }

    target.actionProcess = true;
    this.gfs.callAction(endpoint, body).subscribe(
      (res) => {
        target.actionProcess = false;
        if (res.status === 'success') {
          if (e.action.reload) {
            this.getData(
              target.endpoint,
              this.generateQuery(target.query),
              target
            );
          } else {
            target.actionData = res;
          }
        }
        target.actionData = res;
      },
      (err) => {
        target.actionProcess = false;
        this.err = err;
      }
    );
  }

  public updateUrl(query: any) {
    const queryParams: Record<string, any> = {};
    const keys = Object.keys(query);
    keys.forEach((el) => {
      if (query[el]) {
        const elements = query[el].split('&');
        elements.forEach((item: any, i: number) => {
          const keyValue = item.split('=');
          const key = el === 'filter' ? 'f.' : el === 'sort' ? 's.' : '';
          if (key === 'f.') {
            queryParams[`${key}${keyValue[0]}-${i}`] = keyValue[1];
          } else if (el !== 'pagination') {
            queryParams[`${key}${keyValue[0]}`] = keyValue[1];
          }
        });
      }
    });
    this.router.navigate([], { queryParams });
  }

  public parseUrl(queryParams: any, list: string) {
    this.fs.resetQueries(list);
    const sorted: Record<string, Sort> = {};
    const queryList = {
      filter: '',
      sort: '',
      pagination: ''
    };

    // Here we handlig pagination in after edit record
    const flagAfterEditRecord = localStorage.getItem('flagAfterEditRecord');
    if(flagAfterEditRecord == 'true' && parseInt(localStorage.getItem('afterEditLimit') as string) > this.limit){
      queryList['pagination'] = "limit="+ localStorage.getItem('afterEditLimit') + "&offset=" + this.afterEditOffset;
      this.afterEditOffset = localStorage.getItem('afterEditLimit');

    }
    localStorage.removeItem('flagAfterEditRecord');
    localStorage.removeItem('afterEditLimit');

    const table = this.getFirstTable();
    const keys = Object.keys(queryParams);

    keys.forEach((el) => {
      const params = el.split('.');
      if (params[0] === 'f') {
        const name = params.slice(1).join('.');
        const param = name.slice(0, name.indexOf('-'));
        const value = queryParams[el];

        this.fs.paramsOfFilters = {
          param,
          value,
          list,
          endpoint: this.endpoint
        };

        queryList.filter += `${param}=${value}&`;
      } else if (params[0] === 's') {
        const fields = queryParams[el].split(',');

        fields.forEach((elem: any) => {
          const order = elem[0] === '-' ? Sort.DESC : Sort.ASC;
          sorted[elem.substring(elem[0] === '-' ? 1 : 0)] = order;
        });
        queryList['sort'] += `${params[1]}=${queryParams[el]}`;
      }
    });
    table.sorted = sorted;

    this.sortService.init(sorted);

    Object.keys(queryList).forEach((el) => {
      if (el === 'filter') {
        queryList[el] = queryList[el].substring(0, queryList[el].length - 1);
      }
    });

    table.query = queryList;

    if (this.cashData) {
      if (!table.query.filter && !table.query.sort && !table.query.pagination) {
        table.data = this.cashData;
        table.refresh = false;
        this.cashData = undefined;
      } else {
        this.getData(table.endpoint, this.generateQuery(table.query), table);
      }
    } else {
      this.getData(table.endpoint, this.generateQuery(table.query), table);
    }
  }

  public checkedHandler(e: any) {
    this.checkedObjects.emit({
      checkedData: e,
      filters: this.fs.queries.find((el) => el.list === this.tables[0].list)
    });
  }

  public loadMoreHandler() {
    this.upload.next(true);
  }

  private uploadAll() {
    const table = this.getFirstTable();
    table.query.pagination = `limit=-1&offset=0`;

    this.getData(
      table.endpoint,
      this.generateQuery(table.query),
      table,
      null,
      false,
      true
    );
  }
}
