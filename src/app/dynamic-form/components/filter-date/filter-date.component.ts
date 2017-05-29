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
  public picker: boolean = false;
  public config: any;
  public data = {};
  public query: string;
  public dateFormat: string = 'YYYY-MM-DD';
  public datetimeFormat: string = 'YYYY-MM-DD hh:mm:ss';
  public moment: any = moment;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fs: FilterService
  ) { }

  public ngOnInit() {
    this.createInputs(this.config.input, this.data);
    let data = this.fs.getQueries(this.config.listName, this.config.key);
    if (data) {
      if (data.byQuery) {
        this.query = data.query;
        this.parseDate(data.query, moment);
        this.picker = true;
      } else {
        this.data = data.data;
        this.query = data.query;
      }
    }
    this.updateConfig();
  }

  public selectQuery(query) {
    this.createInputs(this.config.input, this.data);
    this.picker = false;
    this.parseDate(query, moment);
    this.query = query;
    this.fs.generateQuery(query, this.config.key, this.config.listName, { data: this.data, query });
    this.changeQuery();
    this.updateConfig();
  }

  public onChange() {
    this.picker = true;
    this.query = '';
    let query = '';
    let keys = Object.keys(this.data);
    keys.forEach((el) => {
      if (this.data[el]) {
        let {year = 0, month = 0, day = 0} = {...this.data[el]};
        query += `${el}=${this.moment.utc([year, month - 1, day]).format(this.dateFormat)}&`;
      }
    });
    this.fs.generateQuery(
      query.substring(0, query.length - 1),
        this.config.key, this.config.listName, { data: this.data });
    this.changeQuery();
    this.updateConfig();
  }

  public updateConfig() {
    this.config.input.forEach((el, i, arr) => {
      if (el.query.indexOf('__from') > 0) {
        el.maxDate = this.data[arr[1].query];
      } else if (el.query.indexOf('__to') > 0) {
        el.minDate = this.data[arr[0].query];
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
      result[query[0]] = moment.utc(query[1], this.dateFormat);
    });
    queries.forEach((el) => {
      this.data[el] = {
        year: result[el].year(),
        month: result[el].month() + 1,
        day: result[el].date()
      };
    });
  }

  public createInputs(inputs, data) {
    inputs.forEach((el) => {
      data[el.query] = '';
    });
  }

  public resetData(data) {
    let keys = Object.keys(data);
    keys.forEach((el) => {
      data[el] = '';
    });
  }

  public resetFilter() {
    this.query = null;
    this.resetData(this.data);
    this.picker = false;
    this.fs.generateQuery(this.query, this.config.key, this.config.listName);
    this.changeQuery();
  }

}
