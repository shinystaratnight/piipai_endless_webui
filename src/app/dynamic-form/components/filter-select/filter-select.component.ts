import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { FilterService } from './../../services/filter.service';

@Component({
  selector: 'app-filter-select',
  templateUrl: 'filter-select.component.html'
})
export class FilterSelectComponent implements OnInit, OnDestroy {
  public config: any;
  public data: string;
  public query: string;
  public isCollapsed = true;
  public options: any;
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

  constructor(
    private fs: FilterService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit() {
    this.options = this.config.options.sort((p, n) => p.label > n.label ? 1 : -1 );
    this.isCollapsed = this.query || document.body.classList.contains('r3sourcer') ? false : true;
    this.theme = document.body.classList.contains('r3sourcer') ? 'r3sourcer' : 'default';
    this.data = this.config.default || '';
    this.querySubscription = this.route.queryParams.subscribe(
      (params) => this.updateFilter()
    );
    this.filterSubscription = this.fs.reset.subscribe(() => this.updateFilter());
  }

  public ngOnDestroy() {
    this.querySubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
  }

  public onChange() {
    this.fs.generateQuery(
      this.genericQuery(this.config.query, this.data),
        this.config.key, this.config.listName, this.data);
    this.changeQuery();
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
    const value = query.split('=')[1];
    const existValue = this.config.options.find((el) => el.value + '' === value + '');
    if (existValue) {
      this.data = existValue.value;
    }
  }

  public updateFilter() {
    this.data = '';
    this.query = '';
    const data = this.fs.getQueries(this.config.listName, this.config.key);
    if (data) {
      if (data.byQuery) {
        this.parseQuery(data.query);
      } else {
        this.data = data;
      }
    } else {
      this.data = '';
    }
  }

  public resetFilter() {
    this.data = '';
    this.query = '';
    this.fs.generateQuery('', this.config.key, this.config.listName);
    this.changeQuery();
  }

}
