import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
  GenericFormService,
  FilterService,
  FilterQueryService,
  ListService
} from './../../services';

import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-generic-list',
  templateUrl: './generic-list.component.html',
  providers: [ListService]
})
export class GenericListComponent implements OnInit, OnDestroy {
  @Input() endpoint = '';
  @Input() editEndpoint = '';
  @Input() inForm = false;
  @Input() data: any;
  @Input() query: string;
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

  public metadata: any;
  public tables = [];
  // public first = false;
  public tableId = 1;
  public existingIds: number[] = [];
  public res: any;
  public err: any;
  public limit: any;
  public pagination: any = {};
  public count: number;
  public minimizedTable = [];

  public cashData: any[];
  public uploading: boolean;
  public currentQuery: any;

  private subscriptions: Subscription[] = [];

  constructor(
    private gfs: GenericFormService,
    private fs: FilterService,
    private route: ActivatedRoute,
    private router: Router,
    private filterQueryService: FilterQueryService,
    private listService: ListService
  ) {}

  public ngOnInit() {
    this.tables.push(this.createTableData(this.endpoint));

    if (this.update) {
      this.subscriptions.push(
        this.update.subscribe(update => {
          const table = this.getFirstTable();

          this.updateList(table, update);
        })
      );
    }

    if (this.upload) {
      const subscription = this.upload
        .asObservable()
        .pipe(debounceTime(200))
        .subscribe(data => {
          const table = this.getFirstTable();

          if (
            table.offset < (table.data && table.data.count) &&
            table.data.count !== table.limit
          ) {
            if (data && !this.uploading) {
              this.uploading = true;

              setTimeout(() => {
                this.uploadMore();
              }, 500);
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
    this.subscriptions.forEach(s => s && s.unsubscribe());
  }

  updateList(table, update) {
    if (update && !this.delay) {
      this.getData(table.endpoint, this.generateQuery(table.query), table);
    } else if (update) {
      table['data'] = this.data;
      table.update = Object.assign({}, this.data);
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
      false,
      null,
      true
    );
  }

  public getMetadata(endpoint, table, inner = false, outer = null, formset?) {
    let query = formset || '';
    if (this.metadataQuery) {
      query += `&${this.metadataQuery}`;
    }

    this.gfs.getMetadata(endpoint, query).subscribe(metadata => {
      table.metadata = metadata;

      if (this.listNameCache && !this.listNameCache[this.endpoint]) {
        this.listNameCache[this.endpoint] =
          metadata && metadata.list && metadata.list.label;
      }

      if (!this.delay) {
        const sortedColumns = this.getSortedFields(metadata.list.columns);

        if (Object.keys(sortedColumns).length) {
          table['query'] = {
            sort: this.prepareSortQuery(sortedColumns)
          };

          if (!this.inForm) {
            this.updateUrl(table['query'], metadata.list.list);
          }
        }
      }

      if (outer) {
        setTimeout(() => {
          outer.update = metadata;
        }, 300);
      }

      if (!inner) {
        table.list = metadata.list.list;
        this.existingIds.push(this.tableId);
        table.id = this.tableId++;

        if (table && !table.first) {
          table.metadata.list.list += table.id;
          table.list += table.id;
          table.limit = this.limit;
          table.offset = 0;
        }

        if (!this.inForm) {
          const paramsSubscription = this.route.queryParams.subscribe(
            params => {
              if (table && table.first) {
                this.parseUrl(params, table.list);
              }
            }
          );

          this.subscriptions.push(paramsSubscription);
        } else if (!this.delay) {
          this.getData(endpoint, this.generateQuery(table.query), table);
        }
      }
    });
  }

  public getSortedFields(columns) {
    const result = {};

    columns.forEach(el => {
      if (el.sort && el.sorted) {
        result[el.sort_field] = el.sorted;
      }
    });

    return result;
  }

  public prepareSortQuery(sorted) {
    const queries = Object.keys(sorted).map(el => {
      return sorted[el] === 'desc' ? `-${el}` : el;
    });

    return `ordering=${queries.join(',')}`;
  }

  public getData(
    endpoint,
    query = null,
    table,
    first = false,
    target = null,
    add = false,
    fillin?
  ) {
    this.currentQuery = query;

    if (fillin) {
      this.gfs.getByQuery(endpoint, query).subscribe(data => {
        if (this.currentQuery !== query) {
          return;
        }

        this.updateFillInList(data);
        this.cashData = data;
        table.refresh = false;
        table.offset = 0;

        this.getMetadata(endpoint, table);
      });

      return;
    }

    if (first && !this.query) {
      const newQuery = this.clientId
        ? `${query || '?'}&role=${this.clientId}`
        : query || '';

      this.gfs.getByQuery(endpoint, newQuery).subscribe(data => {
        if (this.currentQuery !== query) {
          return;
        }

        this.dataLength.emit(data.count);
        this.event.emit(data[this.supportData]);
        this.cashData = data;
        table.refresh = false;
        table.offset = 0;

        if (this.paginated === 'on') {
          this.calcPagination(data);
        }

        if (this.inForm) {
          const formset = '?type=formset';
          this.getMetadata(endpoint, table, null, null, formset);
        } else {
          this.getMetadata(endpoint, table);
        }
      });
    } else if (query || this.query) {
      let newQuery = !query
        ? this.query
        : this.query
        ? `${query}&${this.query}`
        : query;

      newQuery = this.clientId ? `${newQuery}&role=${this.clientId}` : newQuery;

      if (newQuery[0] !== '?') {
        newQuery = `?${newQuery}`;
      }

      this.gfs.getByQuery(endpoint, newQuery).subscribe(data => {
        if (this.currentQuery !== query) {
          return;
        }

        if (endpoint.includes('/fillin/')) {
          this.updateFillInList(data);
        }

        this.updateTable(data, table, target, add);
      });
    } else {
      endpoint = this.clientId ? `${endpoint}?role=${this.clientId}` : endpoint;

      this.gfs.getAll(endpoint).subscribe(data => {
        if (this.currentQuery !== query) {
          return;
        }

        this.updateTable(data, table, target, add);
      });
    }
  }

  updateTable(data, table, target, add) {
    this.dataLength.emit(data.count);
    this.event.emit(data[this.supportData]);
    if (add) {
      table.offset += table.limit;
      table.addData = data;
      this.uploading = false;
    } else {
      table.data = data;
    }
    if (this.paginated === 'on') {
      this.calcPagination(data);
    }
    table.refresh = false;
    if (target) {
      setTimeout(() => {
        target.update = data;
      }, 150);
    }
  }

  public updateFillInList(data) {
    const defaultRate = 'default_rate';

    if (data[this.responseField]) {
      data[this.responseField].forEach(candidate => {
        candidate[defaultRate] = data.job && data.job[defaultRate];
      });
    }
  }

  public calcPagination(data) {
    if (!this.limit) {
      const length = data.results.length;
      this.count = data.count;
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
    this.tables.forEach(el => {
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
        if (e.type === 'filter') {
          table.offset = 0;
        }
        this.updateUrl(table.query, e.list);
      } else {
        this.getData(table.endpoint, this.generateQuery(table.query), table);
        if (e.query) {
          e.query.split('&').forEach(el => {
            const propsArray = el.split('=');
            if (propsArray[0] === 'offset') {
              table['offset'] = propsArray[1];
            }
          });
        }
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
      queryList.forEach(el => {
        if (queries[el]) {
          result += `${queries[el]}&`;
        }
      });
      return result.slice(0, result.length - 1);
    }
  }

  public createTableData(endpoint) {
    const table = {
      endpoint,
      innerTables: {},
      first: true,
      query: {},
      data: undefined
    };

    // if (!this.first) {
    // table.first = true;
    // this.first = true;

    if (this.inForm) {
      table.data = this.data;

      this.getMetadata(
        endpoint,
        table,
        null,
        null,
        !this.metaType && '?type=formset'
      );
    } else {
      if (endpoint && endpoint.includes('fillin')) {
        let query = '';
        this.gfs.getMetadata(endpoint).subscribe(metadata => {
          metadata.list.filters.forEach(filter => {
            if (filter.hasOwnProperty('default')) {
              if (query === '') {
                query = '?';
              }
              query +=
                this.filterQueryService.generateQueryOf(filter.type, filter) +
                '&';
            }
          });

          this.getData(endpoint, query, table, true, null, false, true);
        });
      } else {
        this.gfs.getMetadata(endpoint).subscribe(metadata => {
          const sortedColumns = this.getSortedFields(metadata.list.columns);

          if (Object.keys(sortedColumns).length) {
            table.query = {
              sort: this.prepareSortQuery(sortedColumns)
            };

            this.getData(
              endpoint,
              this.generateQuery(table.query),
              table,
              true
            );
          } else {
            this.getData(endpoint, null, table, true);
          }
        });
      }
    }
    // } else {
    //   const firstTable = this.getFirstTable();
    //   table['parentEndpoint'] = firstTable.endpoint;
    //   this.getMetadata(endpoint, table);
    //   if (!this.delay) {
    //     this.getData(endpoint, null, table);
    //   }
    // }

    return table;
  }

  public getTable(name) {
    return this.tables.find(el => el.list === name);
  }

  public getFirstTable() {
    return this.tables.find(el => el.first);
  }

  public resetActiveTable(tables) {
    tables.forEach(el => {
      el.active = false;
    });
  }

  public listHandler(e) {
    if (
      this.checkList(e.endpoint) &&
      !e.innerTable &&
      this.tables.length < 10
    ) {
      this.tables.push(this.createTableData(e.endpoint));
    } else if (e.innerTable) {
      const table = this.getTable(e.list);
      table.innerTables = Object.assign({}, table.innerTables);
      table.innerTables[e.row] = table.innerTables[e.row] || {};
      table.innerTables[e.row][e.key] = {};
      this.getMetadata(e.endpoint, table.innerTables[e.row][e.key], table);
      this.getData(
        e.endpoint,
        null,
        table.innerTables[e.row][e.key],
        false,
        table
      );
    }
  }

  public checkList(endpoint) {
    const result = this.tables.filter(el => el.endpoint === endpoint);
    return !result.length;
  }

  public callAction(data, endpoint, target, e) {
    let body;
    const ids = [];
    const keys = Object.keys(data);
    keys.forEach(el => {
      if (data[el]) {
        ids.push(el);
      }
    });

    if (e.action.property) {
      body = {
        [e.action.property]: ids
      };
    } else {
      body = ids;
    }

    target.actionProcess = true;
    this.gfs.callAction(endpoint, body).subscribe(
      res => {
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
      err => {
        target.actionProcess = false;
        this.err = err;
      }
    );
  }

  public updateUrl(query, list) {
    const queryParams = {};
    const keys = Object.keys(query);
    keys.forEach(el => {
      if (query[el]) {
        const elements = query[el].split('&');
        elements.forEach((item, i) => {
          const keyValue = item.split('=');
          const key = el === 'filter' ? 'f.' : el === 'sort' ? 's.' : '';
          if (key === 'f.') {
            queryParams[`${list}.${key}${keyValue[0]}-${i}`] = keyValue[1];
          } else if (el !== 'pagination') {
            queryParams[`${list}.${key}${keyValue[0]}`] = keyValue[1];
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
    const table = this.getTable(list);
    const keys = Object.keys(queryParams);
    let exist = keys.length ? false : true;
    keys.forEach(el => {
      const params = el.split('.');
      if (params[0] === list) {
        exist = true;
        if (params[1] === 'f') {
          const name = params.slice(2).join('.');
          this.fs.paramsOfFilters = {
            param: name.slice(0, name.indexOf('-')),
            value: queryParams[el],
            list,
            endpoint: this.endpoint
          };
          queryList['filter'] += `${name.slice(0, name.indexOf('-'))}=${
            queryParams[el]
          }&`;
        } else if (params[1] === 's') {
          const fields = queryParams[el].split(',');
          fields.forEach(elem => {
            const order = elem[0] === '-' ? 'desc' : 'asc';
            sorted[elem.substring(elem[0] === '-' ? 1 : 0)] = order;
          });
          queryList['sort'] += `${params[2]}=${queryParams[el]}`;
        }
      }
    });
    table.sorted = sorted;
    Object.keys(queryList).forEach(el => {
      if (el === 'filter') {
        queryList[el] = queryList[el].substring(0, queryList[el].length - 1);
      }
    });
    if (exist) {
      table.query = queryList;

      if (this.cashData) {
        if (
          !table.query.filter &&
          !table.query.sort &&
          !table.query.pagination
        ) {
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
  }

  // public setPage(param, value) {
  //   this.pagination[param] = value;
  //   if (this.pagination['limit'] && this.pagination['offset']) {
  //     return this.pagination['offset'] / this.pagination['limit'] + 1;
  //   }
  // }

  public checkedHandler(e) {
    this.checkedObjects.emit({
      checkedData: e,
      filters: this.fs.queries.find(el => el.list === this.tables[0].list)
    });
  }

  public loadMoreHandler() {
    this.upload.next(true);
  }
}
