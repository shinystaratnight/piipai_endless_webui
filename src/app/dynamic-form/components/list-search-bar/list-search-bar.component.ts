import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FilterService } from './../../services/filter.service';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'list-search-bar',
  templateUrl: 'list-search-bar.component.html',
  styleUrls: ['./list-search-bar.component.scss']
})
export class ListSerachBarComponent implements OnInit, OnDestroy {

  @Input() public count: string;
  @Input() public label: string;

  @Input()
  public list: string;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  public searchValue: string;
  public querySubscription: Subscription;

  constructor(
    private fs: FilterService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit() {
    this.querySubscription = this.route.queryParams.subscribe(
      (params) => this.updateSearchBar()
    );
  }

  public ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  public search(event) {
    event.preventDefault();
    event.stopPropagation();
    this.fs.generateQuery(
      `search=${this.searchValue}`,
      'search',
      this.list,
      { data: this.searchValue, query: this.searchValue }
    );
    this.changeQuery();
  }

  public changeQuery() {
    this.event.emit({
      list: this.list
    });
  }

  public updateSearchBar() {
    let data = this.fs.getQueries(this.list, 'search');
    if (data) {
      if (data.byQuery) {
        this.searchValue = data.query.split('=')[1];
      } else {
        this.searchValue = data.data;
      }
    } else {
      this.searchValue = '';
    }
  }
}
