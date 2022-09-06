import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'webui-list-column',
  templateUrl: 'list-column.component.html'
})
export class ListColumnComponent {
  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public buttonAction: EventEmitter<any> = new EventEmitter();

  public config: any;

  public eventHandler(e: any) {
    this.event.emit(e);
  }

  public buttonHandler(e: any) {
    this.buttonAction.emit(e);
  }
}
