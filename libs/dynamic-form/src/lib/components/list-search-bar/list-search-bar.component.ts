import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { FilterService } from './../../services';

@Component({
  selector: 'app-list-search-bar',
  templateUrl: './list-search-bar.component.html',
  styleUrls: ['./list-search-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListSerachBarComponent implements OnInit, OnDestroy {
  @Input() public count: string;
  @Input() public label: string;
  @Input() public list: string;
  @Input() public param: string;

  @Output() public event: EventEmitter<any> = new EventEmitter();

  public searchValue: string;
  private subscription: Subscription;
  private type = 'search';

  constructor(private fs: FilterService, private route: ActivatedRoute) {}

  public ngOnInit() {
    this.subscription = this.route.queryParams.subscribe(() =>
      this.updateSearchBar()
    );
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public search() {
    this.fs.generateQuery(
      `${this.param || 'search'}=${this.searchValue}`,
      this.type,
      this.list,
      { data: this.searchValue, query: this.searchValue }
    );
    this.changeQuery();
  }

  private changeQuery() {
    this.event.emit({ list: this.list });
  }

  private updateSearchBar() {
    const filterData = this.fs.getQueries(this.list, this.type);

    if (filterData) {
      const { byQuery, query, data } = filterData;
      this.searchValue = byQuery ? query.split('=')[1] : data;
    } else {
      this.searchValue = '';
    }
  }
}
