import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject, delay, Subject, takeUntil } from 'rxjs';

import { FilterService } from '../../../services';
import { DateRange } from '@webui/utilities';

import { date as DateFilter } from '@webui/metadata';
import { Moment, Time } from '@webui/time';
import { FormControl } from '@angular/forms';

type Params = Record<string, string>;

class DateControl {
  private _hasDatepicker = new BehaviorSubject<boolean>(false);

  control = new FormControl('');
  hasDatepicker$ = this._hasDatepicker.asObservable().pipe(delay(16));
  date = Time.now();
  key: string;
  query: string;

  constructor(key: string, query: string) {
    this.key = key;
    this.query = query;
  }

  showDatepicker() {
    this._hasDatepicker.next(true);
  }

  hideDatepicker() {
    this._hasDatepicker.next(false);
  }
}

@Component({
  selector: 'webui-filter-date',
  templateUrl: './filter-date.component.html',
  styleUrls: ['./filter-date.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterDateComponent implements OnInit, OnDestroy {
  private _destroy = new Subject<void>();
  private _hasQuery = new BehaviorSubject<boolean>(false);

  public config: any;
  public displayFormat = 'DD/MM/YYYY';
  public queryFormat = 'YYYY-MM-DD';

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  type = DateRange.Day;
  currentDate = Time.now();
  controls?: DateControl[];
  hasQuery$ = this._hasQuery.asObservable();

  constructor(private fs: FilterService, private route: ActivatedRoute) {}

  public ngOnInit() {
    this.controls = this.config.input.map(
      (el: { key: string; query: string }) => {
        const item = new DateControl(el.key, el.query);

        this.subscribeOnChange(item);

        return item;
      }
    );

    this.route.queryParams.pipe(takeUntil(this._destroy)).subscribe({
      next: () => this.updateFilter(),
    });

    this.fs.reset
      .pipe(takeUntil(this._destroy))
      .subscribe(() => this.updateFilter(true));
  }

  public ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
  }

  public selectQuery(item: any, event: MouseEvent) {
    event.preventDefault();

    const query = DateFilter.element.getQuery(this.config.key, item.query);
    const queryParams: Params = this.getParams(query);

    this.controls?.forEach((item) => {
      if (item.query in queryParams) {
        this.setDate(item, Time.parse(queryParams[item.query]));
      }
    });
  }

  public onChange() {
    const queryParams: Params = {};

    this.controls?.forEach((item) => {
      if (item.control.value) {
        queryParams[item.query] = item.date.format(this.queryFormat);
      }
    });

    this.fs.generateQuery(
      this.getQuery(queryParams),
      this.config.key,
      this.config.listName,
      {
        data: this.controls,
      }
    );

    this.changeQuery();
  }

  public changeQuery() {
    this.event.emit({
      list: this.config.listName,
    });

    this._hasQuery.next(this.controls?.some((el) => el.control.value) || false);
  }

  public updateFilter(reset?: boolean) {
    const data = this.fs.getQueries(this.config.listName, this.config.key);

    if (data) {
      this._hasQuery.next(true);

      if (data.byQuery) {
        const params = this.getParams(data.query);

        this.controls?.forEach((item) => {
          if (item.query in params) {
            this.setDate(
              item,
              Time.parse(params[item.query], { format: this.queryFormat }),
              false
            );
          }
        });
      } else {
        // this.data = data.data;
        // this.query = data.query;
      }
    } else {
      this._hasQuery.next(false);
      this.resetFilter(reset);
    }
  }

  public getParams(query: string): Params {
    const params = query.split('&');
    const result: Record<string, any> = {};

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

  resetFilter(reset = false) {
    this.controls?.forEach((item) => {
      item.date = Time.now();
      item.control.patchValue('', { emitEvent: !reset });
    });
  }

  setDate(item: DateControl, date: Moment, emitEvent = true) {
    const queryDate = date.format(this.displayFormat);

    item.date = date;
    item.control.patchValue(queryDate, { emitEvent });
    item.hideDatepicker();
  }

  onClose(item: DateControl) {
    item.hideDatepicker();
  }

  private subscribeOnChange(item: DateControl) {
    item.control.valueChanges.pipe(takeUntil(this._destroy)).subscribe(() => {
      this.onChange();
    });
  }
}
