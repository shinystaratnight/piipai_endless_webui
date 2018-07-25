import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GenericFormService, FilterService } from './../../services';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'generic-list',
  templateUrl: 'generic-list.component.html'
})

export class GenericListComponent implements OnInit, OnDestroy {

  @Input()
  public endpoint: string = '';

  @Input()
  public editEndpoint: string = '';

  @Input()
  public inForm: boolean = false;

  @Input()
  public data: any;

  @Input()
  public query: string;

  @Input()
  public update: BehaviorSubject<boolean>;

  @Input()
  public supportData: any;

  @Input()
  public paginated: string = 'on';

  @Input()
  public responseField: string = 'results';

  @Input()
  public metaType: string;

  @Input()
  public actions: boolean = false;

  @Input()
  public delay: boolean = false;

  @Input()
  public allowPermissions: string[];

  @Input()
  public metadataQuery: string;

  @Input()
  public addMetadataQuery: string;

  @Input()
  public upload: Subject<boolean>;

  @Input()
  public clientId: string;

  @Input()
  public listNameCache: any;

  @Output()
  public checkedObjects: EventEmitter<any> = new EventEmitter();

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public dataLength: EventEmitter<number> = new EventEmitter();

  public metadata: any;
  public tables = [];
  public first: boolean = false;
  public tableId: number = 1;
  public existingIds: number[] = [];
  public res: any;
  public err: any;
  public limit: any;
  public pagination: any = {};
  public count: number;
  public minimizedTable = [];

  public cashData: any[];
  public uploading: boolean;

  private subscriptions: Subscription[];

  constructor(
    private gfs: GenericFormService,
    private fs: FilterService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.subscriptions = [];
  }

  public ngOnInit() {
    this.tables.push(this.createTableData(this.endpoint));

    if (this.update) {
      const subscription = this.update.subscribe((update) => {
        if (update && !this.delay) {
          let table = this.getFirstTable();
          this.getData(table.endpoint, this.generateQuery(table.query), table);
        } else if (update) {
          let table = this.getFirstTable();
          table['data'] = this.data;
          table.update = Object.assign({}, this.data);
        }
      });

      this.subscriptions.push(subscription);
    }

    if (this.upload) {
      const subscription = this.upload.asObservable()
        .debounceTime(200)
        .subscribe((data) => {
          const table = this.getFirstTable();

          if (table.offset < table.data.count) {
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
  }

  public ngOnDestroy() {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }

  public uploadMore() {
    const table = this.getFirstTable();

    table.query.pagination = `limit=${table.limit}&offset=${table.offset + table.limit}`;
    this.getData(table.endpoint, this.generateQuery(table.query), table, false, null, true);
  }

  public getMetadata(endpoint, table, inner = false, outer = null, formset = undefined) {
    let query = formset || '';
    if (this.metadataQuery) {
      query += `&${this.metadataQuery}`;
    }

    this.gfs
      .getMetadata(endpoint, query)
      .subscribe(
        (metadata) => {
          table.metadata = metadata;

          if (this.listNameCache && !this.listNameCache[this.endpoint]) {
            this.listNameCache[this.endpoint] = metadata && metadata.list && metadata.list.label;
          }

          if (!this.delay) {
            table.query = {
              sort: this.prepareSortQuery(this.getSortedFields(metadata.list.columns))
            };
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
                (params) => {
                  let target = this.getTable(table.list);
                  if (target && target.first) {
                    this.parseUrl(params, table.list);
                  }
                }
              );

              this.subscriptions.push(paramsSubscription);
            } else if (!this.delay) {
              this.getData(endpoint, this.generateQuery(table.query), table);
            }
          }
        }
      );
  }

  public getSortedFields(columns) {
    const result = {};
    columns.forEach((el) => {
      if (el.sort && el.sorted) {
        result[el.sort_field] = el.sorted;
      }
    });
    return result;
  }

  public prepareSortQuery(sorted) {
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

  public getData(endpoint, query = null, table, first = false, target = null, add = false) {
    if (first && !this.query) {
      this.gfs.getAll(endpoint + (this.clientId ? `?role=${this.clientId}` : ''))
        .subscribe(
        (data) => {
          this.dataLength.emit(data.count);
          this.event.emit(data[this.supportData]);
          table.refresh = false;
          this.cashData = data;
          if (this.paginated === 'on') {
            this.calcPagination(data);
          }
          table.offset = table.limit;
          if (this.inForm) {
            const formset = '?type=formset';
            this.getMetadata(endpoint, table, null, null, formset);
          } else {
            this.getMetadata(endpoint, table);
          }
        }
      );
    } else if (query || this.query) {
      let newQuery;
      if (query) {
        newQuery = query;
        if (this.query) {
          newQuery += `&${this.query}`;
        }
      } else {
        newQuery = this.query;
      }
      this.gfs.getByQuery(
        endpoint,
        newQuery
          ? this.clientId
            ? newQuery + `&role=${this.clientId}`
            : newQuery
          : newQuery
        ).subscribe(
        (data) => {
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
      );
    } else {
      this.gfs.getAll(endpoint + (this.clientId ? `?role=${this.clientId}` : '')).subscribe(
        (data) => {
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
      );
    }
  }

  public calcPagination(data) {
    if (!this.limit) {
      let length = data.results.length;
      this.count = data.count;
      this.limit = this.calcLimit(data.count, length) || null;
      if (this.limit) {
        this.updateTables('limit');
      }
    }
  }

  public calcLimit(count, length) {
    return count > length ? length : null;
  }

  public updateTables(prop) {
    this.tables.forEach((el) => {
      el[prop] = this[prop];
    });
  }

  public eventHandler(e) {
    let table = this.getTable(e.list);
    if (!table.query) {
      table.query = {};
    }
    if (e.type === 'sort' || e.type === 'pagination' ||
      e.type === 'filter' || e.type === 'update') {
      table.refresh = true;
      if (e.type === 'update') {
        this.getData(this.getTable(e.list).endpoint, this.generateQuery(table.query), table);
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
          this.updateUrl(table.query, e.list, true);
        } else {
          this.updateUrl(table.query, e.list, false);
        }
      } else {
        this.getData(this.getTable(e.list).endpoint, this.generateQuery(table.query), table);
        if (e.query) {
          e.query.split('&').forEach((el) => {
            let propsArray = el.split('=');
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
    let minIndex = this.minimizedTable.indexOf(table);
    let tabIndex = this.tables.indexOf(table);
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
      let patt = /\?/;
      let result = '';
      if (patt.test(this.endpoint)) {
        result = '&';
      } else {
        result = '?';
      }
      let queryList = Object.keys(queries);
      queryList.forEach((el) => {
        if (queries[el]) {
          result += `${queries[el]}&`;
        }
      });
      return result.slice(0, result.length - 1);
    }
  }

  public createTableData(endpoint) {
    let table = {
      endpoint,
      innerTables: {}
    };
    if (!this.first) {
      table['first'] = true;
      this.first = true;
      if (this.inForm) {
        table['data'] = this.data;
        this.getMetadata(endpoint, table, null, null, !this.metaType && '?type=formset');
      } else {
        this.getData(endpoint, null, table, true);
      }
    } else {
      let firstTable = this.getFirstTable();
      table['parentEndpoint'] = firstTable.endpoint;
      this.getMetadata(endpoint, table);
      if (!this.delay) {
        this.getData(endpoint, null, table);
      }
    }
    return table;
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
    if (this.checkList(e.endpoint) && !e.innerTable && this.tables.length < 10) {
      this.tables.push(this.createTableData(e.endpoint));
    } else if (e.innerTable) {
      let table = this.getTable(e.list);
      table.innerTables = Object.assign({}, table.innerTables);
      table.innerTables[e.row] = table.innerTables[e.row] || {};
      table.innerTables[e.row][e.key] = {};
      this.getMetadata(e.endpoint, table.innerTables[e.row][e.key], table);
      this.getData(e.endpoint, null, table.innerTables[e.row][e.key], false, table);
    }
  }

  public checkList(endpoint) {
    let result = this.tables.filter((el) => el.endpoint === endpoint);
    return !result.length;
  }

  public callAction(data, endpoint, target, e) {
    let ids = [];
    let keys = Object.keys(data);
    keys.forEach((el) => {
      if (data[el]) {
        ids.push(el);
      }
    });
    this.gfs.callAction(endpoint, ids).subscribe(
      (res) => {
        if (res.status === 'success') {
          if (e.action.reload) {
            this.getData(target.endpoint, this.generateQuery(target.query), target);
          } else {
            target.actionData = res;
          }
        }
      },
      (err) => {
        this.err = err;
      }
    );
  }

  public updateUrl(query, list, filter) {
    let queryParams = {};
    let keys = Object.keys(query);
    keys.forEach((el) => {
      if (query[el]) {
        let elements = query[el].split('&');
        elements.forEach((item, i) => {
          let keyValue = item.split('=');
          let key = (el === 'filter') ? 'f.' :
            (el === 'sort') ? 's.' :
            (el === 'pagination') ? 'p.' : '';
          // if (el === 'pagination') {
          //   queryParams[`${list}.${key}page`] = this.setPage(keyValue[0], keyValue[1]);
          //   return;
          // }
          if (key === 'f.') {
            queryParams[`${list}.${key}${keyValue[0]}-${i}`] = keyValue[1];
          } else {
            queryParams[`${list}.${key}${keyValue[0]}`] = keyValue[1];
          }
        });
      }
    });
    // if (filter) {
    //   queryParams[`${list}.p.page`] = 1;
    // }
    this.router.navigate([], { queryParams });
  }

  public parseUrl(queryParams, list) {
    this.fs.resetQueries(list);
    let pagination = {};
    let sorted = {};
    let queryList = {
      filter: '',
      sort: '',
      pagination: ''
    };
    let table = this.getTable(list);
    let keys = Object.keys(queryParams);
    let exist = keys.length ? false : true;
    keys.forEach((el) => {
      let params = el.split('.');
      if (params[0] === list) {
        exist = true;
        if (params[1] === 'f') {
          let name = params.slice(2).toString();
          this.fs.paramsOfFilters = {
            param: name.slice(0, name.indexOf('-')),
            value: queryParams[el],
            list,
            endpoint: this.endpoint
          };
          queryList['filter'] += `${name.slice(0, name.indexOf('-'))}=${queryParams[el]}&`;
        }
        // else if (params[1] === 'p') {
        //   let offset;
        //   if (params[2] === 'page') {
        //     pagination['page']
        //       = ((queryParams[el] - 1) * this.limit > this.count && this.limit !== 1)
        //         ? 1 : queryParams[el];
        //     queryList['pagination']
        //       = `limit=${(this.limit ? this.limit : 10)}&offset=${isNaN(this.limit * (pagination['page'] - 1)) ? 0 : //tslint:disable-line
        //         this.limit * (pagination['page'] - 1)}`;
        //   }
        // }
        else if (params[1] === 's') {
          let fields = queryParams[el].split(',');
          fields.forEach((elem) => {
            let order = elem[0] === '-' ? 'desc' : 'asc';
            sorted[elem.substring(elem[0] === '-' ? 1 : 0)] = order;
          });
          queryList['sort'] += `${params[2]}=${queryParams[el]}`;
        }
      }
    });
    // table.limit = this.limit;
    // table.offset = 0;
    // let page = pagination['page'];
    // if (page) {
    //   table.offset = (page === 1) ? 0 : (page - 1) * this.limit;
    // }
    table.sorted = sorted;
    Object.keys(queryList).forEach((el) => {
      if (el === 'filter') {
        queryList[el] = queryList[el].substring(0, queryList[el].length - 1);
      }
    });
    if (exist) {
      table.query = queryList;
      if (this.cashData) {
        if (!table.query.filter && !table.query.sort && !table.query.pagination) {
          table.data = this.cashData;
          this.cashData = undefined;
        } else {
          this.getData(table.endpoint, this.generateQuery(table.query), table);
        }
      } else {
        this.getData(table.endpoint, this.generateQuery(table.query), table);
      }
    }
  }

  public setPage(param, value) {
    this.pagination[param] = value;
    if (this.pagination['limit'] && this.pagination['offset']) {
      return (this.pagination['offset'] / this.pagination['limit']) + 1;
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
