import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { FilterService } from './../../services/filter.service';

@Component({
  selector: 'filter-range',
  templateUrl: 'filter-range.component.html'
})

export class FilterRangeComponent implements OnInit, OnDestroy {

  public config: any;
  public query: string;
  public data: any;
  public isCollapsed: boolean = true;
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

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fs: FilterService,
    private route: ActivatedRoute
  ) { }

  public ngOnInit() {
    this.route.queryParams.subscribe(
      (params) => this.updateFilter()
    );
    this.filterSubscription = this.fs.reset.subscribe(() => this.updateFilter());
    this.isCollapsed = this.query || document.body.classList.contains('r3sourcer') ? false : true;
    this.theme = document.body.classList.contains('r3sourcer') ? 'r3sourcer' : 'default';
    this.data = this.config.default || 0;
    this.fs.generateQuery(this.genericQuery(this.config.key, this.data), this.config.key, this.config.listName, this.data); //tslint:disable-line
  }

  public ngOnDestroy() {
    this.filterSubscription.unsubscribe();
  }

  public onChange() {
    this.fs.generateQuery(
      this.genericQuery(this.config.key, this.data),
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
    this.data = query.split('=')[1];
  }

  public updateFilter() {
    this.data = '';
    this.query = '';
    let data = this.fs.getQueries(this.config.listName, this.config.key);
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
    this.data = this.config.defaut || '';
    this.query = '';
    this.fs.generateQuery('', this.config.key, this.config.listName);
    this.changeQuery();
  }
}
