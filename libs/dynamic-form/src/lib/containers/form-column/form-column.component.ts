import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'webui-form-column',
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

  public eventHandler(e: any) {
    this.event.emit(e);
  }

  public buttonActionHandler(e: any) {
    this.buttonAction.emit(e);
  }
}
