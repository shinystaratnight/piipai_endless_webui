import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'list-column',
  templateUrl: 'list-column.component.html'
})

export class ListColumnComponent {
  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  public config: any;
  public head: boolean;

  public sort() {
    this.event.emit({
      type: 'sort',
      name: this.config.name
    });
  }

}
