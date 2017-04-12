import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'form-button',
  templateUrl: 'form-button.component.html'
})

export class FormButtonComponent {
  public config;
  public group: FormGroup;
}
