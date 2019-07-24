import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-list-table',
  templateUrl: 'list-table.component.html'
})

export class ListTableComponent {

  @Input()
  public config: any;

}
