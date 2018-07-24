import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChildren,
  OnDestroy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import moment from 'moment-timezone';

import { FilterService } from './../../services/filter.service';

@Component({
  selector: 'filter-date',
  templateUrl: 'filter-date.component.html'
})
export class FilterDateComponent implements OnInit, AfterViewInit, OnDestroy {
  public from: any;
  public to: any;
  public picker: boolean = false;
  public config: any;
  public data = {};
  public query: string;
  public dateFormat: string = 'DD/MM/YYYY';
  public datetimeFormat: string = 'DD/MM/YYYY hh:mm:ss';
  public moment: any = moment;
  public isCollapsed: boolean = true;

  public init: boolean = false;
  public mobileDevice: boolean;
  public $: any;
  public icons = {
    r3sourcer: {
      true: 'angle-right',
      false: 'angle-down'
    },
    default: {
      true: 'eye',
      false: 'eye-slash'
    }
  };
  public theme: string;

  public filterSubscription: Subscription;
  public querySubscription: Subscription;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @ViewChildren('d')
  public d: any;

  constructor(
    private fs: FilterService,
    private route: ActivatedRoute
  ) {
    this.$ = require('jquery');
  }

  public ngOnInit() {
    this.createInputs(this.config.input, this.data);
    this.querySubscription = this.route.queryParams.subscribe(
      (params) => this.updateFilter()
    );
    this.filterSubscription = this.fs.reset.subscribe(() => this.updateFilter);
    this.isCollapsed = (this.query || this.picker) ||
      document.body.classList.contains('r3sourcer') ? false : true;
    this.mobileDevice = this.identifyDevice();
    this.theme = document.body.classList.contains('r3sourcer') ? 'r3sourcer' : 'default';
  }

  public ngOnDestroy() {
    this.querySubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
  }

  public identifyDevice() {
    let deviceNamesReg = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    return deviceNamesReg.test(navigator.userAgent.toLowerCase());
  }

  public ngAfterViewInit() {
    if (!this.init && this.d) {
      let dateType = this.mobileDevice ? 'flipbox' : 'calbox';
      this.init = true;
      this.d.forEach((el) => {
        this.$(el.nativeElement).datebox({
          mode: dateType,
          dateFormat: '%d/%m/%Y',
          overrideDateFormat: '%d/%m/%Y',
          useClearButton: false,
          useHeader: false,
          calHighToday: false,
          closeCallback: () => {
            let date = el.nativeElement.value;
            this.onChange(date, el.nativeElement.name);
          }
        });
        el.nativeElement.readOnly = false;
      });
    }
  }

  public selectQuery(query) {
    this.picker = false;
    this.resetData(this.data);
    const newQuery = this.parseDate(query, moment, 'YYYY-MM-DD');
    this.query = newQuery;
    this.fs.generateQuery(newQuery, this.config.key, this.config.listName, { data: this.data, query }); //tslint:disable-line
    this.changeQuery();
    this.updateConfig();
  }

  public onChange(date, name) {
    this.picker = true;
    this.query = '';
    let query = '';
    this.data[name] = date;
    let keys = Object.keys(this.data);
    keys.forEach((el) => {
      if (this.data[el]) {
        query += `${el}=${this.data[el]}&`;
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
      if (el.query.indexOf('_0') > 0) {
        el.maxDate = this.data[arr[1].query];
      } else if (el.query.indexOf('_1') > 0) {
        el.minDate = this.data[arr[0].query];
      }
    });
  }

  public changeQuery() {
    this.event.emit({
      list: this.config.listName
    });
  }

  public parseDate(date, moment, format = undefined) {
    let result = {};
    let queries = [];
    let dates = date.split('&');
    const newDate = [];
    dates.forEach((el) => {
      let query = el.split('=');
      const date = moment.tz(query[1], format || this.dateFormat, 'Australia/Sydney').format(this.dateFormat); //tslint:disable-line
      query[1] = date;
      newDate.push(query.join('='));
      queries.push(query[0]);
      result[query[0]] = date;
    });
    queries.forEach((el) => {
      this.data[el] = result[el];
    });
    return newDate.join('&');
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

  public updateFilter() {
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
    } else {
      this.query = '';
      this.resetData(this.data);
      this.picker = false;
    }
    this.updateConfig();
  }

  public resetFilter() {
    this.query = null;
    this.resetData(this.data);
    this.picker = false;
    this.fs.generateQuery(this.query, this.config.key, this.config.listName);
    this.changeQuery();
  }

}
