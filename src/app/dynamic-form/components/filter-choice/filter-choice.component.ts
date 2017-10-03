import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FilterService } from './../../services/filter.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'filter-choice',
  templateUrl: 'filter-choice.component.html'
})
export class FilterChoiceComponent implements OnInit {
  public config: any;
  public query: any;
  public isCollapsed: boolean = true;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fs: FilterService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit() {
    this.route.queryParams.subscribe(
      (params) => this.updateFilter()
    );
    this.isCollapsed = this.query ? false : true;
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
    let data = this.fs.getQueries(this.config.listName, this.config.key);
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
