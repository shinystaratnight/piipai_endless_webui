import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FilterService } from './../../services/filter.service';
import moment from 'moment';

@Component({
  selector: 'filter-date',
  templateUrl: 'filter-date.component.html'
})
export class FilterDateComponent implements OnInit {
  public from: any;
  public to: any;
  public config: any;
  public data = {
    from: null,
    to: null
  };
  public query: string;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fs: FilterService
  ) { }

  public ngOnInit() {
    this.updateConfig();
  }

  public selectQuery(query) {
    this.data = {
      from: null,
      to: null
    };
    this.parseDate(query, moment);
    this.query = query;
    this.fs.generateQuery(query, this.config.key, this.config.listName);
    this.changeQuery();
  }

  public onChange() {
    this.query = '';
    let query = '';
    let keys = Object.keys(this.data);
    keys.forEach((el) => {
      if (this.data[el]) {
        let {year = 0, month = 0, day = 0} = {...this.data[el]};
        query += `${el}=${new Date(year, month, day)}&`;
      }
    });
    this.fs.generateQuery(
      query.substring(0, query.length - 1), this.config.key, this.config.listName);
    this.changeQuery();
  }

  public updateConfig() {
    this.config.input.forEach((el) => {
      if (el.query === 'from') {
        el.maxDate = this.data.to;
      } else if (el.query === 'to') {
        el.minDate = this.data.from;
      }
    });
  }

  public changeQuery() {
    this.event.emit({
      list: this.config.listName
    });
  }

  public parseDate(date, moment) {
    let result = {};
    let queries = [];
    let dates = date.split('&');
    dates.forEach((el) => {
      let query = el.split('=');
      queries.push(query[0]);
      result[query[0]] = moment.utc(query[1], 'MM-DD-YYYY');
    });
    queries.forEach((el) => {
      this.data[el] = {
        year: result[el].year(),
        month: result[el].month() + 1,
        day: result[el].date()
      };
    });
  }

  public resetFilter() {
    this.query = null;
    this.data.from = null;
    this.data.to = null;
    this.fs.generateQuery(this.query, this.config.key, this.config.listName);
    this.changeQuery();
  }

}
