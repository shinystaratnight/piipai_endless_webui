import { Component, Input } from '@angular/core';

@Component({
  selector: 'list-table',
  templateUrl: 'list-table.component.html'
})

export class ListTableComponent {

  @Input()
  public config: any;

}
