import { Component } from '@angular/core';

@Component({
  selector: 'filter-date',
  templateUrl: 'filter-date.component.html'
})
export class FilterDateComponent {
  public from: any;
  public to: any;
  public config: any;
  public data = {
    from: '',
    to: ''
  };
}
