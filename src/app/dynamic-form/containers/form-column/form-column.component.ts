import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'form-column',
  templateUrl: 'form-column.component.html'
})

export class FormColumnComponent {

  public config: any;
  public errors: any;
  public message: any;
  public group: any;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public buttonAction: EventEmitter<any> = new EventEmitter();

  public eventHandler(e) {
    this.event.emit(e);
  }

  public buttonActionHandler(e) {
    this.buttonAction.emit(e);
  }
}
