import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FilterService } from '../../../services';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-filter-choice',
  templateUrl: 'filter-choice.component.html'
})
export class FilterChoiceComponent implements OnInit, OnDestroy {
  public config: any;
  public query: any;
  public isCollapsed = true;
  public theme: string;
  public icons = {
    r3sourcer: {
      true: 'chevron-right',
      false: 'chevron-down'
    },
    default: {
      true: 'eye',
      false: 'eye-slash'
    }
  };

  public querySubscription: Subscription;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fs: FilterService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit() {
    this.querySubscription = this.route.queryParams.subscribe(
      () => this.updateFilter()
    );
    this.isCollapsed = this.query ? false : true;
    this.theme = document.body.classList.contains('r3sourcer') ? 'r3sourcer' : 'default';
  }

  public ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  public select(value) {
    let query = `${this.config.query}=${value}`;
    if (value === this.query) {
      this.query = null;
      query = '';
    } else {
      this.query = value;
    }
    this.fs.generateQuery(query, this.config.key, this.config.listName, value);
    this.changeQuery();
  }

  public changeQuery() {
    this.event.emit({
      list: this.config.listName
    });
  }

  public updateFilter() {
    const data = this.fs.getQueries(this.config.listName, this.config.key);
    if (data && data.byQuery) {
      this.query = data.query.split('=')[1];
    } else {
      this.query = data;
    }
  }

  public resetFilter() {
    this.query = null;
    this.fs.generateQuery(this.query, this.config.key, this.config.listName);
    this.changeQuery();
  }
}
