import { Component } from '@angular/core';

@Component({
  selector: 'filter-choice',
  templateUrl: 'filter-choice.component.html'
})
export class FilterChoiceComponent {
  public config: any;
  public query: any;

  public select(value) {
    if (value === this.query) {
      this.query = null;
    } else {
    this.query = value;
    }
  }
}
