import { Injectable } from '@angular/core';
import { GenericFormService } from './generic-form.service';

@Injectable()
export class FilterService {

  public _filters: any;
  public queries: any[] = [];
  public query: any;
  public _paramsOfFilters: any;

  constructor(
    private gfs: GenericFormService
  ) {
    this._filters = [];
    this._paramsOfFilters = {};
  }

  set filters(filters) {
    filters.filters.forEach((el) => {
      el.listName = filters.list;
    });
    this.parseFilters(filters.filters, this.paramsOfFilters, filters.list);
    this._filters.push(...filters.filters);
  }

  set paramsOfFilters(params) {
    this._paramsOfFilters[params.param] = params.value;
  }

  get filters() {
    return this._filters;
  }

  get paramsOfFilters() {
    return this._paramsOfFilters;
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
        filters.splice(filters.indexOf(el), 1);
        this.deleteFilters(filters, name);
      }
    });
  }

  public getQuery(list) {
    return this.parseQueries(this.queries, list);
  }

  public generateQuery(query, key, list, value = undefined) {
    if (this.queries.length > 0) {
      let el = this.queries.filter((elem) => elem.list === list);
      if (el[0]) {
        el[0].keys[key] = { query, value };
      } else {
        this.queries.push({ list, keys: { [key]: { query, value } }});
      }
    } else {
      this.queries.push({
        list,
        keys: {
          [key]: {
            query,
            value
          }
        }
      });
    }
  }

  public parseQueries(queries, list) {
    let query = '';
    queries.forEach((el) => {
      if (el.list === list) {
        let keys = Object.keys(el.keys);
        keys.forEach((elem) => {
          if (el.keys[elem].query) {
            query += `${el.keys[elem].query}&`;
          }
        });
      }
    });
    query = query.substring(0, query.length - 1);
    return query;
  }

  public parseFilters(filters, params, list) {
    filters.forEach((el) => {
      if (el.type === 'related') {
        this.gfs.getAll(el.data.endpoint).subscribe(
          (res) => el.options = res.results
        );
      }
    });
    if (Object.keys(params).length > 0) {
      filters.forEach((el) => {
        if (params[el.query]) {
          let query = `${el.query}=${params[el.query]}`;
          this.generateQuery(query, el.key, list);
        } else if (el.input) {
          let query = '';
          el.input.forEach((elem) => {
            if (params[elem.query]) {
              query += `${elem.query}=${params[elem.query]}&`;
            }
          });
          if (query) {
            this.generateQuery(query.substring(0, query.length - 1), el.key, list);
          }
        }
      });
    }
  }

  public getQueries(list, filterName) {
    let result;
    this.queries.forEach((el) => {
      if (el.list === list && el.keys[filterName]) {
        if (el.keys[filterName].value) {
          result = el.keys[filterName].value;
        } else if (el.keys[filterName].query) {
          result = {
            byQuery: true,
            query: el.keys[filterName].query
          };
        }
      }
    });
    return result;
  }

  public resetQueries(list) {
    let result;
    this.queries.forEach((el) => {
      if (el.list === list) {
       result = el;
      }
    });
    this.queries.splice(this.queries.indexOf(result), 1);
  }

}
