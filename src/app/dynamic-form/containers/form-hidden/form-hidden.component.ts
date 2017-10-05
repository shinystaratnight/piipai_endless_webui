import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'form-hidden',
  templateUrl: 'form-hidden.component.html'
})

export class FormHiddenComponent {
  public config: any;
  public group: any;
  public errors: any;
  public message: any;

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
