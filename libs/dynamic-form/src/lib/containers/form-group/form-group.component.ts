import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isMobile, isCandidate } from '@webui/utilities';

@Component({
  selector: 'app-form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.scss']
})

export class FormGroupComponent implements OnInit {
  public config: any;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public isMobileDevice = isMobile() && isCandidate();
  translationKey: string;

  @Output() public event = new EventEmitter();
  @Output() public buttonAction = new EventEmitter();

  get labelText() {
    return this.config.name
      ? this.config.label || ''
      : this.config.label || ' ';
  }

  ngOnInit() {
    this.translationKey = `group.${this.config.key}`;
  }

  public eventHandler(e) {
    this.event.emit(e);
  }

  public buttonActionHandler(e) {
    this.buttonAction.emit(e);
  }
}
