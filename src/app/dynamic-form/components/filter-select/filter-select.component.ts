import { ActivatedRoute } from '@angular/router';
import { FilterService } from './../../services/filter.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'filter-select',
  templateUrl: 'filter-select.component.html'
})
export class FilterSelectComponent implements OnInit {
  public config: any;
  public data: string = '';
  public query: string;

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
    let value = query.split('=')[1];
    let existValue = this.config.options.filter((el) => el.value === value);
    if (existValue.length > 0) {
        this.data = value;
    }
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
    }
  }

  public resetFilter() {
    this.data = '';
    this.query = '';
    this.fs.generateQuery('', this.config.key, this.config.listName);
    this.changeQuery();
  }

}
