import { Injectable } from '@angular/core';

@Injectable()
export class FilterService {

  public _filters: any;
  public queries: any[] = [];

  constructor() {
    this._filters = [];
  }

  set filters(filters) {
    filters.filters.forEach((el) => {
      el.listName = filters.list;
    });
    this._filters.push(...filters.filters);
  }

  get filters() {
    return this._filters;
  }

  public getFiltersOfList(name) {
    let result = [];
    result = this._filters.filter((el) => el.listName === name);
    this.deleteFilters(this._filters, name);
    return result;
  }

  public deleteFilters(filters, name) {
    filters.forEach((el) => {
      if (el.listName === name) {
        this.filters.splice(this.filters.indexOf(el), 1);
        this.deleteFilters(this.filters, name);
      }
    });
  }

  public getQuery() {
    return 'hello';
  }

  public generateQuery(query, key, list) {
    if (this.queries.length > 0) {
      this.queries.forEach((el) => {
        if (el.list === list) {
          el.keys[key] = query;
        } else {
          this.queries.push({ list, keys: { [key]: query } });
        }
      });
    } else {
      this.queries.push({
        list,
        keys: {
          [key]: query
        }
      });
    }
  }

  public parseQueries(queries, list) {
    let query = '?';
    queries.forEach((el) => {
      if (el.list === list) {
        let keys = Object.keys(el.keys);
        keys.forEach((elem) => {
          query += `${el.keys[elem]}&`;
        });
      }
    });
    query = query.substring(0, query.length - 1);
  }

}
