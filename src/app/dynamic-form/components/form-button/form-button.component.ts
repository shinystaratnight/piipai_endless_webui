import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'form-button',
  templateUrl: 'form-button.component.html',
  styleUrls: ['./form-button.component.scss']
})

export class FormButtonComponent implements OnInit {
  public config;
  public group: FormGroup;
  public label: boolean;
  public replacyValue: string;
  public buttonClass: string;
  public buttonColor: string;
  public repeatArray: any[];

  @Output()
  public buttonAction: EventEmitter<any> = new EventEmitter();

  public ngOnInit() {
    if (this.config.replace_by) {
      if (this.config.replace_by instanceof Object) {
        this.replacyValue = this.config.replace_by.__str__;
      } else {
        this.replacyValue = this.config.replace_by;
      }
    }
    if (this.config.repeat && this.config.templateOptions.icon) {
      this.repeatArray = new Array(this.config.repeat);
    } else if (this.config.templateOptions.icon) {
      this.repeatArray = [''];
    }
    this.customizeButton();
  }

  public customizeButton() {
    let color = this.config.color;
    let classes = ['primary', 'danger', 'info', 'success', 'warning', 'link'];
    this.buttonClass = classes.indexOf(color) > -1 ? `btn-${color}` : '';
    if (!this.buttonClass) {
      this.buttonColor = color || '';
    }
  }

  public action(e) {
    if (this.config.action !== 'showDetail') {
      if (this.config.templateOptions.type !== 'submit') {
        let id;
        if (this.config.field === 'id') {
          id = this.config.rowId;
        }
        this.buttonAction.emit({
          type: e.type,
          el: this.config,
          value: this.config.templateOptions.action,
          id
        });
      }
    }
  }
}
