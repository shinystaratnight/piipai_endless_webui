import { Component } from '@angular/core';
import { FilterService } from './../../services/filter.service';

@Component({
  selector: 'filter-choice',
  templateUrl: 'filter-choice.component.html'
})
export class FilterChoiceComponent {
  public config: any;
  public query: any;

  constructor(
    private fs: FilterService
  ) {}

  public select(value) {
    if (value === this.query) {
      this.query = null;
    } else {
    this.query = value;
    }
    this.fs.generateQuery(value, this.config.key, this.config.listName);
  }
}
