import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import * as nouislider from 'nouislider';
import * as wnumb from 'wnumb';

import { FilterService } from './../../services/filter.service';

@Component({
  selector: 'app-filter-range',
  templateUrl: 'filter-range.component.html'
})

export class FilterRangeComponent implements OnInit, OnDestroy, AfterViewInit {

  public config: any;
  public query: string;
  public data: any;
  public isCollapsed = true;
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
  public slider: any;
  public noUiSlider: any;
  public toggle: boolean;

  public filterSubscription: Subscription;
  public querySubscription: Subscription;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fs: FilterService,
    private route: ActivatedRoute
  ) {
    this.slider = nouislider;
  }

  public ngOnInit() {
    this.querySubscription = this.route.queryParams.subscribe(
      () => this.updateFilter()
    );
    this.filterSubscription = this.fs.reset.subscribe(() => this.updateFilter());
    this.isCollapsed = this.query || document.body.classList.contains('r3sourcer') ? false : true;
    this.theme = document.body.classList.contains('r3sourcer') ? 'r3sourcer' : 'default';
    this.data = this.data || this.config.default || 0;
    this.fs.generateQuery(this.genericQuery(this.config.query, this.data), this.config.key, this.config.listName, this.data); //tslint:disable-line
  }

  public ngOnDestroy() {
    this.querySubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
  }

  public onChange() {
    this.fs.generateQuery(
      this.genericQuery(this.config.query, this.data),
      this.config.key,
      this.config.listName,
      this.data
    );
    this.changeQuery();
  }

  public ngAfterViewInit() {

    const rangePicker = document.getElementById('slider');

    if (rangePicker && !this.noUiSlider) {

      const wNumb = wnumb;

      this.noUiSlider = this.slider.create(rangePicker, {
        start: [80],
        step: 10,
        connect: 'lower',
        tooltips: wNumb({ decimals: 0, suffix: 'km' }),
        range: {
          min: this.config.min,
          max: this.config.max
        }
      });

      if (this.noUiSlider) {
        this.noUiSlider.set(this.data + '');
      }

      this.noUiSlider.on('set.one', (e, handle) => {
        const value = parseInt(e[0], 10);

        if (this.data !== value) {
          this.data = value;

          this.onChange();
        }
      });
    }
  }

  public toggleRange(event) {
    if (!event) {
      this.resetFilter();
    }
  }

  public genericQuery(query, data) {
    let result = '';
    if (data) {
      result = `${query}=${data}`;
    }
    this.query = result;
    return result;
  }

  public changeQuery() {
    this.event.emit({
      list: this.config.listName
    });
  }

  public parseQuery(query) {
    this.query = query;
    this.data = query.split('=')[1];

    if (this.noUiSlider) {
      this.noUiSlider.set(this.data + '');
    }
  }

  public updateFilter() {
    this.data = '';
    this.query = '';
    const data = this.fs.getQueries(this.config.listName, this.config.key);
    if (data) {
      if (data.byQuery) {
        this.parseQuery(data.query);

        this.fs.generateQuery(
          this.genericQuery(this.config.query, this.data),
          this.config.key,
          this.config.listName,
          this.data
        );
      } else {
        this.data = data;

        this.fs.generateQuery(
          this.genericQuery(this.config.query, this.data),
          this.config.key,
          this.config.listName,
          this.data
        );
        if (this.noUiSlider) {
          this.noUiSlider.set(this.data + '');
        }
      }
      this.toggle = true;
    } else {
      this.data = '';
      this.toggle = false;
    }
  }

  public resetFilter() {
    this.data = this.config.defaut || 0;
    this.query = '';
    this.fs.generateQuery('', this.config.key, this.config.listName);
    this.changeQuery();
  }
}
