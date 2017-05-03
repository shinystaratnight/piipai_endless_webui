import { Component, Input } from '@angular/core';

@Component({
  selector: 'filter-block',
  templateUrl: 'filter-block.component.html'
})
export class FilterBlockComponent {
  @Input()
  public config: any[] = [];
}
