import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChildren,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { FilterService } from '../../../services';
import { isTouchDevice } from '@webui/utilities';

import { date as DateFilter } from '@webui/metadata';
import { Time } from '@webui/time';

interface Params {
  [query: string]: string;
}

@Component({
  selector: 'app-filter-date',
  templateUrl: './filter-date.component.html',
  styleUrls: ['./filter-date.component.scss'],
})
export class FilterDateComponent implements OnInit, AfterViewInit, OnDestroy {
  public config: any;
  public data: Params;
  public query: string;
  public mobileDevice: boolean;

  public displayFormat = 'DD/MM/YYYY';
  public queryFormat = 'YYYY-MM-DD';
  public init = false;

  public filterSubscription: Subscription;
  public querySubscription: Subscription;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @ViewChildren('d')
  public d: any;
  translationKey = '';

  constructor(
    private fs: FilterService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  public ngOnInit() {
    this.data = this.createInputs(this.config.input);
    this.mobileDevice = isTouchDevice();

    if (this.mobileDevice) {
      this.displayFormat = this.queryFormat;
    }

    this.querySubscription = this.route.queryParams.subscribe(() => {
      setTimeout(() => {
        if (!(this.cd as any).destroyed) {
          this.updateFilter();
        }
      }, 200);
    });
    this.filterSubscription = this.fs.reset.subscribe(() =>
      this.updateFilter()
    );

    this.translationKey = `filter.${this.config.key}`;
  }

  public ngOnDestroy() {
    this.querySubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
  }

  public ngAfterViewInit() {
    if (!this.init && this.d) {
      const dateType = this.mobileDevice ? 'flipbox' : 'calbox';
      this.init = true;
      this.d.forEach((el) => {
        (window as any).$(el.nativeElement).datebox({
          mode: dateType,
          dateFormat: '%d/%m/%Y',
          overrideDateFormat: '%d/%m/%Y',
          useClearButton: true,
          useCancelButton: true,
          useHeader: false,
          useFocus: true,
          themeDatePick: 'primary',
          calHighToday: true,
          overrideCalStartDay: 1,
          beforeOpenCallback: () => {
            setTimeout(() => {
              this.refreshDatebox(el.nativeElement);
            }, 200);
          },
          closeCallback: () => {
            const newDate = el.nativeElement.value || '';
            const prevDate = this.data[el.nativeElement.name] || '';

            if (newDate.trim() !== prevDate.trim()) {
              this.onChange(newDate, el.nativeElement.name);
            }
          },
        });
        el.nativeElement.readOnly = false;
      });
    }
  }

  public getListElementQuery(type) {
    return DateFilter.element.getQuery(this.config.key, type);
  }

  public changeDateOnMobile(data) {
    this.query = this.getQuery(this.data);
    this.fs.generateQuery(this.query, this.config.key, this.config.listName, {
      data: this.data,
    });

    this.changeQuery();
  }

  public refreshDatebox(element: HTMLElement) {
    if (element) {
      (window as any).$(element).datebox('refresh');
    }
  }

  public selectQuery(query: string) {
    this.resetData(this.data);

    const params = this.getParams(query);
    const queryParams = this.convert(undefined, this.queryFormat, params);

    this.data = this.convert(undefined, this.displayFormat, params);
    this.query = this.getQuery(queryParams);

    this.fs.generateQuery(this.query, this.config.key, this.config.listName, {
      data: this.data,
      query,
    });

    this.changeQuery();

    return false;
  }

  public onChange(date: string, param: string) {
    this.query = '';
    this.data[param] = date;

    const queryParams = this.convert(
      this.displayFormat,
      this.queryFormat,
      this.data
    );

    this.query = this.getQuery(queryParams);

    this.fs.generateQuery(this.query, this.config.key, this.config.listName, {
      data: this.data,
    });

    this.changeQuery();
  }

  public changeQuery() {
    this.event.emit({
      list: this.config.listName,
    });
  }

  public createInputs(inputs: any[]): Params {
    const params = {};

    inputs.forEach((el) => {
      params[el.query] = '';
    });

    return params;
  }

  public resetData(data: { [key: string]: string }) {
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
        this.data = this.convert(this.queryFormat, this.displayFormat, params);
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

  public convert(from: string, to: string, params: Params) {
    //tslint:disable-line
    const newParams = { ...params };

    Object.keys(newParams).forEach((el) => {
      newParams[el] = newParams[el]
        ? this.parseDateValue(newParams[el], from).format(to)
        : '';
    });

    return newParams;
  }

  public parseDateValue(date: string, format: string) {
    //tslint:disable-line
    return format ? Time.parse(date, { format }) : Time.parse(date);
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

  public getTranslateKey(type: string): string {
    return `filter.${this.config.key}.${type}`;
  }
}
