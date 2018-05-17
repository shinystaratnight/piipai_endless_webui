import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'form-tabs',
  templateUrl: './form-tabs.component.html',
  styleUrls: ['./form-tabs.component.scss']
})

export class FormTabsComponent {

  public config: any;

  public group: FormGroup;
  public errors: any;
  public message: any;

  @Output() public event = new EventEmitter();
  @Output() public buttonAction = new EventEmitter();

  public eventHandler(e) {
    this.event.emit(e);
  }

  public buttonActionHandler(e) {
    this.buttonAction.emit(e);
  }
}
