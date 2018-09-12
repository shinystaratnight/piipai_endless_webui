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

interface Params {
  [query: string]: string;
}

@Component({
  selector: 'filter-date',
  templateUrl: 'filter-date.component.html'
})
export class FilterDateComponent implements OnInit, AfterViewInit, OnDestroy {
  public config: any;
  public data: Params;
  public query: string;
  public mobileDevice: boolean;
  public $: any;

  public displayFormat: string = 'DD/MM/YYYY';
  public queryFormat: string = 'YYYY-MM-DD';
  public timeZone: string = 'Australia/Sydney';
  public moment: any = moment;
  public init: boolean = false;

  public filterSubscription: Subscription;
  public querySubscription: Subscription;

  @Output() public event: EventEmitter<any> = new EventEmitter();

  @ViewChildren('d') public d: any;

  constructor(
    private fs: FilterService,
    private route: ActivatedRoute
  ) {
    this.$ = require('jquery');
  }

  public ngOnInit() {
    this.data = this.createInputs(this.config.input);
    this.mobileDevice = this.identifyDevice();

    this.querySubscription = this.route.queryParams.subscribe(() => this.updateFilter());
    this.filterSubscription = this.fs.reset.subscribe(() => this.updateFilter());
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
          useClearButton: true,
          useCancelButton: true,
          useHeader: false,
          useFocus: true,
          calHighToday: false,
          closeCallback: () => {
            const date = el.nativeElement.value;
            this.onChange(date, el.nativeElement.name);
          }
        });
        el.nativeElement.readOnly = false;
      });
    }
  }

  public selectQuery(query: string) {
    this.resetData(this.data);

    const params = this.getParams(query);
    const queryParams = this.convert(undefined, this.queryFormat, params, moment);

    this.data = this.convert(undefined, this.displayFormat, params, moment);
    this.query = this.getQuery(queryParams);

    this.fs.generateQuery(
      this.query,
      this.config.key,
      this.config.listName,
      { data: this.data, query }
    );

    this.changeQuery();
  }

  public onChange(date: string, param: string) {
    this.query = '';
    this.data[param] = date;

    const queryParams = this.convert(this.displayFormat, this.queryFormat, this.data, moment);

    this.query = this.getQuery(queryParams);

    this.fs.generateQuery(
      this.query,
      this.config.key,
      this.config.listName,
      { data: this.data }
    );

    this.changeQuery();
  }

  public changeQuery() {
    this.event.emit({
      list: this.config.listName
    });
  }

  public createInputs(inputs: any[]): Params {
    const params = {};

    inputs.forEach((el) => {
      params[el.query] = '';
    });

    return params;
  }

  public resetData(data: {[key: string]: string}) {
    const keys = Object.keys(data);

    if (keys.length) {
      keys.forEach((el) => {
        data[el] = '';
      });
    }
  }

  public updateFilter() {
    const data = this.fs.getQueries(this.config.listName, this.config.key);

    if (data) {
      if (data.byQuery) {
        this.query = data.query;
        const params = this.getParams(this.query);
        this.data = this.convert(this.queryFormat, this.displayFormat, params, moment);
      } else {
        this.data = data.data;
        this.query = data.query;
      }
    } else {
      this.query = '';
      this.resetData(this.data);
    }
  }

  public resetFilter() {
    this.query = null;
    this.resetData(this.data);

    this.fs.generateQuery(this.query, this.config.key, this.config.listName);
    this.changeQuery();
  }

  public convert(from: string, to: string, params: Params, moment) {
    const newParams = {...params};

    Object.keys(newParams).forEach((el) => {
      newParams[el] = newParams[el]
        ? this.parseDateValue(newParams[el], moment, from).format(to)
        : '';
    });

    return newParams;
  }

  public parseDateValue(date: string, moment, format: string) {
    return format
      ? moment.tz(date, format, this.timeZone)
      : moment.tz(date, this.timeZone);
  }

  public getParams(query: string): Params {
    const params = query.split('&');
    const result = {};

    params.forEach((param) => {
      const parts = param.split('=');
      result[parts[0]] = parts[1];
    });

    return result;
  }

  public getQuery(params: Params): string {
    const keys = Object.keys(params);

    if (keys.length) {
      const quesries = keys.map((param) => {
        return `${param}=${params[param]}`;
      });

      return quesries.join('&');
    }

    return '';
  }

}
