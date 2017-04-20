import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'form-button',
  templateUrl: 'form-button.component.html'
})

export class FormButtonComponent {
  public config;
  public group: FormGroup;

  @Output()
  public buttonAction: EventEmitter<any> = new EventEmitter();

  public action(e) {
    this.buttonAction.emit({
      type: e.type,
      el: this.config,
      value: this.config.templateOptions.action
    });
  }
}
