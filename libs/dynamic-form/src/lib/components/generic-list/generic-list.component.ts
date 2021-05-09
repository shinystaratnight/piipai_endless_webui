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

import { BehaviorSubject, forkJoin, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, map, skip } from 'rxjs/operators';
import { Sort } from '../../helpers';
import { FormatString } from '@webui/utilities';
import { MessageType, ToastService } from '@webui/core';

@Component({
  selector: 'app-generic-list',
  templateUrl: './generic-list.component.html',
  providers: [ListService, SortService]
})
export class GenericListComponent implements OnInit, OnDestroy {
  @Input() endpoint = '';
  @Input() editEndpoint = '';
  @Input() inForm = false;
  @Input() data: any;
  @Input() query = '';
  @Input() update: BehaviorSubject<boolean>;
  @Input() supportData: any;
  @Input() paginated = 'on';
  @Input() responseField = 'results';
  @Input() metaType: string;
  @Input() actions = false;
  @Input() delay = false;
  @Input() allowPermissions: string[];
  @Input() metadataQuery: string;
  @Input() addMetadataQuery: string;
  @Input() upload: Subject<boolean>;
  @Input() clientId: string;
  @Input() listNameCache: any;
  @Input() disableActions: boolean;
  @Input() inlineFilters: boolean;

  @Output() checkedObjects: EventEmitter<any> = new EventEmitter();
  @Output() event: EventEmitter<any> = new EventEmitter();
  @Output() dataLength: EventEmitter<number> = new EventEmitter();
  @Output() listUpdated: EventEmitter<void> = new EventEmitter();

  public tables = [];
  public first = false;
  public tableId = 1;
  public existingIds: number[] = [];
  public err: any;
  public limit = 10;
  public minimizedTable = [];

  public cashData: any[];
  public isLoading: boolean;
  public currentQuery: any;

  private subscriptions: Subscription[] = [];

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
    const mainTable = this.createTable(this.endpoint);
    this.tables.push(mainTable);

    this.initTableData(mainTable);

    if (this.update) {
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

  initTableData(table) {
    const endpoint = table.endpoint;
    let formset = '';
    if (this.inForm) {
      formset = !this.metaType && '?type=formset';
    }

    this.getMetadata(endpoint, table, formset).subscribe((data) => {
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

  updateList(table, update) {
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
    const offset = table.offset + limit;
    table.query.pagination = `limit=${limit}&offset=${offset}`;

    this.getData(
      table.endpoint,
      this.generateQuery(table.query),
      table,
      null,
      true
    );
  }

  public getMetadata(endpoint, table, formset?, inner = false, outer = null) {
    let query = formset || '';
    if (this.metadataQuery) {
      query += `&${this.metadataQuery}`;
    }

    return this.gfs.getMetadata(endpoint, query).pipe(
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
            .filter((filter) => {
              return filter.hasOwnProperty('default') && filter.default;
            })
            .map((filter) => `${filter.query}=${filter.default}`);

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

  public updateMetadataInfo(metadata, table) {
    const label = metadata.list.label;
    const listKey = metadata.list.list;
    table.metadata = metadata;
    table.list = listKey;
    this.existingIds.push(this.tableId);
    table.id = this.tableId++;

    if (this.listNameCache && !this.listNameCache[this.endpoint]) {
      this.listNameCache[this.endpoint] = label;
    }
  }

  public getData(endpoint, query = '?', table, target = null, add = false) {
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

      if (endpoint.includes('/fillin/')) {
        this.updateFillInList(data);
      }
      this.isLoading = false;
      this.updateTable(data, table, target, add);
    });
  }

  updateTable(data, table, target, add) {
    this.dataLength.emit(data.count);
    this.event.emit(data[this.supportData]);

    if (add) {
      table.offset += table.limit;
      table.addData = data;
    } else {
      table.data = data;
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

  public updateFillInList(data) {
    const defaultRate = 'default_rate';

    if (data[this.responseField]) {
      data[this.responseField].forEach((candidate) => {
        candidate[defaultRate] = data.job && data.job[defaultRate];
      });
    }
  }

  public calcPagination(data) {
    if (!this.limit) {
      const length = data.results.length;
      this.limit = this.calcLimit(data.count, length);

      if (this.limit) {
        this.updateTables('limit');
      }
    }
  }

  public calcLimit(count, length) {
    return count > length ? length : count;
  }

  public updateTables(prop) {
    this.tables.forEach((el) => {
      el[prop] = this[prop];
    });
  }

  public eventHandler(e) {
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
          e.query.split('&').forEach((el) => {
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
      this.minimizedTable.push(table);
    }
  }

  public action(type, table) {
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

  public generateQuery(queries) {
    if (queries) {
      const patt = /\?/;
      let result = '';
      if (patt.test(this.endpoint)) {
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
  }

  public createTable(endpoint) {
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

  public getTable(name) {
    return this.tables.find((el) => el.list === name);
  }

  public getFirstTable() {
    return this.tables.find((el) => el.first);
  }

  public resetActiveTable(tables) {
    tables.forEach((el) => {
      el.active = false;
    });
  }

  public listHandler(e) {
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
        table
      );
      this.getData(e.endpoint, null, table.innerTables[e.row][e.key], table);
    }
  }

  public checkList(endpoint) {
    const result = this.tables.filter((el) => el.endpoint === endpoint);
    return !result.length;
  }

  public callAction(data, endpoint, target, e) {
    let body;
    const ids = [];
    const keys = Object.keys(data);
    keys.forEach((el) => {
      if (data[el]) {
        ids.push(el);
      }
    });

    if (e.action.multiple) {
      const requests = ids.map((id: string) => {
        const url = FormatString.format(endpoint, { id });

        if (e.action.method === 'delete') {
          return this.gfs.delete(url, id);
        }

        return this.gfs.submitForm(url, {});
      });

      target.actionProcess = true;
      forkJoin(requests)
        .pipe(
          catchError(
            (responses: Array<{ status: string; detail?: string }>) => {
              const message = responses
                .filter(({ status }) => status === 'error')
                .map(({ detail }) => detail)
                .join(' ');
              this.toast.sendMessage(message, MessageType.Error);
              return responses;
            }
          )
        )
        .subscribe((responses: Array<{ status: string }>) => {
          target.actionProcess = false;
          target.refresh = true;
          target.actionData = responses;
          if (responses.some((response) => response === null || response.status === 'success')) {
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

  public updateUrl(query) {
    const queryParams = {};
    const keys = Object.keys(query);
    keys.forEach((el) => {
      if (query[el]) {
        const elements = query[el].split('&');
        elements.forEach((item, i) => {
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

  public parseUrl(queryParams, list) {
    this.fs.resetQueries(list);
    const sorted = {};
    const queryList = {
      filter: '',
      sort: '',
      pagination: ''
    };
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

        fields.forEach((elem) => {
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

  public checkedHandler(e) {
    this.checkedObjects.emit({
      checkedData: e,
      filters: this.fs.queries.find((el) => el.list === this.tables[0].list)
    });
  }

  public loadMoreHandler() {
    this.upload.next(true);
  }
}
