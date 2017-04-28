import { Component } from '@angular/core';

@Component({
  selector: 'list-column',
  templateUrl: 'list-column.component.html'
})

export class ListColumnComponent {

  public config: any[] = [];
  public head: boolean;

}
