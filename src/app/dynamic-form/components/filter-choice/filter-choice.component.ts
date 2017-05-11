import { Component, Output, EventEmitter } from '@angular/core';
import { FilterService } from './../../services/filter.service';

@Component({
  selector: 'filter-choice',
  templateUrl: 'filter-choice.component.html'
})
export class FilterChoiceComponent {
  public config: any;
  public query: any;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fs: FilterService
  ) {}

  public select(value) {
    let query = `${this.config.query}=${value}`;
    if (value === this.query) {
      this.query = null;
    } else {
      this.query = value;
    }
    this.fs.generateQuery(query, this.config.key, this.config.listName);
    this.changeQuery();
  }

  public changeQuery() {
    this.event.emit({
      list: this.config.listName
    });
  }

  public resetFilter() {
    this.query = null;
    this.fs.generateQuery(this.query, this.config.key, this.config.listName);
    this.changeQuery();
  }
}
