import { Component, Input, OnInit } from '@angular/core';
import { GenericFormService } from './../../services/generic-form.service';
import { FilterService } from './../../services/filter.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'generic-list',
  templateUrl: 'generic-list.component.html'
})

export class GenericListComponent implements OnInit {

  @Input()
  public endpoint: string = '';

  public metadata: any;
  public data: any;
  public tables = [];
  public first: boolean = false;
  public tableId: number = 1;
  public existingIds: number[] = [];
  public res: any;
  public limit: any;
  public pagination: any = {};
  public count: number;

  constructor(
    private gfs: GenericFormService,
    private fs: FilterService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  public ngOnInit() {
    this.tables.push(this.createTableData(this.endpoint));
  }

  public getMetadata(endpoint, table, inner = false, outer = null) {
    this.gfs.getMetadata(endpoint).subscribe(
      (metadata) => {
        table.metadata = metadata;
        if (outer) {
          outer.update = Math.random();
        }
        if (!inner) {
          table.list = metadata.list.list;
          this.existingIds.push(this.tableId);
          table.id = this.tableId++;
          if (!table.first) {
            table.metadata.list.list += table.id;
            table.list += table.id;
          }
          this.route.queryParams.subscribe(
            (params) => {
              let target = this.getTable(table.list);
              if (target) {
                this.parseUrl(params, table.list);
              }
            }
          );
        }
      }
    );
  }

  public getData(endpoint, query = null, table, first = false, target = null) {
    if (first) {
      this.gfs.getAll(endpoint).subscribe(
        (data) => {
          this.limit = data.count > data.results.length ? data.results.length : data.count;
          this.count = data.results.length;
          this.getMetadata(endpoint, table);
        }
      );
    } else if (query) {
      this.gfs.getByQuery(endpoint, query).subscribe(
        (data) => {
          table.data = data;
          if (target) {
            target.update = Math.random();
          }
        }
      );
    } else {
      this.gfs.getAll(endpoint).subscribe(
        (data) => {
          table.data = data;
          if (target) {
            target.update = Math.random();
          }
        }
      );
    }
  }

  public eventHandler(e) {
    let table = this.getTable(e.list);
    if (!table.query) {
      table.query = {};
    }
    if (e.type === 'sort' || e.type === 'pagination' || e.type === 'filter') {
      table.query[e.type] = e.query;
      if (table.first) {
        this.updateUrl(table.query, e.list);
      }
    } else if (e.type === 'close') {
      this.tables.splice(this.tables.indexOf(table), 1);
    } else if (e.type === 'active') {
      this.resetActiveTable(this.tables);
      table.active = true;
    } else if (e.type === 'action') {
      this.callAction(e.data, e.action.endpoint);
    }
  }

  public generateQuery(queries) {
    let result = '?';
    let queryList = Object.keys(queries);
    queryList.forEach((el) => {
      if (queries[el]) {
        result += `${queries[el]}&`;
      }
    });
    return result.slice(0, result.length - 1);
  }

  public createTableData(endpoint) {
    let table = {
      endpoint,
      innerTables: {}
    };
    if (!this.first) {
      table['first'] = true;
      this.first = true;
      this.getData(endpoint, null, table, true);
    } else {
      this.getMetadata(endpoint, table);
      this.getData(endpoint, null, table);
    }
    return table;
  }

  public getTable(name) {
    return this.tables.filter((el) => el.list === name)[0];
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

  public callAction(data, endpoint) {
    let ids = [];
    let keys = Object.keys(data);
    keys.forEach((el) => {
      if (data[el]) {
        ids.push(el);
      }
    });
    this.gfs.callAction(endpoint, ids).subscribe(
      (res) => this.res = res
    );
  }

  public updateUrl(query, list) {
    let queryParams = {};
    let keys = Object.keys(query);
    keys.forEach((el) => {
      if (query[el]) {
        let elements = query[el].split('&');
        elements.forEach((item) => {
          let keyValue = item.split('=');
          let key = (el === 'filter') ? 'f.' :
            (el === 'sort') ? 's.' :
            (el === 'pagination') ? 'p.' : '';
          if (el === 'pagination') {
            queryParams[`${list}.${key}page`] = this.setPage(keyValue[0], keyValue[1]);
            return;
          }
          queryParams[`${list}.${key}${keyValue[0]}`] = keyValue[1];
        });
      }
    });
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
          this.fs.paramsOfFilters = {
            param: params.slice(2).toString(),
            value: queryParams[el],
            list
          };
          queryList['filter'] += `${params.slice(2).toString()}=${queryParams[el]}&`;
        } else if (params[1] === 'p') {
          let offset;
          if (params[2] === 'page') {
            pagination['page']
              = ((queryParams[el] - 1) * this.limit > this.count && this.limit !== 1)
                ? 1 : queryParams[el];
            queryList['pagination']
              = `limit=${this.limit}&offset=${this.limit * (pagination['page'] - 1)}`;
          }
        } else if (params[1] === 's') {
          let fields = queryParams[el].split(',');
          fields.forEach((elem) => {
            let order = elem[0] === '-' ? 'desc' : 'asc';
            sorted[elem.substring(elem[0] === '-' ? 1 : 0)] = order;
          });
          queryList['sort'] += `${params[2]}=${queryParams[el]}`;
        }
      }
    });
    table.limit = this.limit;
    table.offset = 0;
    let page = pagination['page'];
    if (page) {
      table.offset = (page === 1) ? 0 : (page - 1) * this.limit;
    }
    table.sorted = sorted;
    Object.keys(queryList).forEach((el) => {
      if (el === 'filter') {
        queryList[el] = queryList[el].substring(0, queryList[el].length - 1);
      }
    });
    if (exist) {
      table.query = queryList;
      this.getData(table.endpoint, this.generateQuery(table.query), table);
    }
  }

  public setPage(param, value) {
    this.pagination[param] = value;
    if (this.pagination['limit'] && this.pagination['offset']) {
      return (this.pagination['offset'] / this.pagination['limit']) + 1;
    }
  }

}
