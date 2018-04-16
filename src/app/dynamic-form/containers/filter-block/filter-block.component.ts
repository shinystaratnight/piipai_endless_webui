import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'filter-block',
  templateUrl: 'filter-block.component.html'
})
export class FilterBlockComponent {
  @Input()
  public config: any[] = [];

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  public direction: string = 'down';

  public changeQuery(e) {
    this.event.emit(e);
  }

  public resetAll() {
    this.event.emit('resetAll');
  }
}
