import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'form-button',
  templateUrl: 'form-button.component.html',
  styleUrls: ['./form-button.component.scss']
})
export class FormButtonComponent implements OnInit, OnDestroy {
  public config;
  public group: FormGroup;
  public label: boolean;
  public replacyValue: string;
  public buttonClass: string;
  public buttonColor: string;
  public repeatArray: any[];
  public showButton: boolean;

  public subscriptions: Subscription[] = [];

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
    this.checkHiddenProperty();
    this.customizeButton();
  }

  public ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe);
  }

  public checkHiddenProperty() {
    if (this.config && this.config.hidden && this.config.hidden.subscribe) {
      const subscription = this.config.hidden.subscribe((hide) => {
        this.showButton = !hide;
      });

      this.subscriptions.push(subscription);
    }
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
    if (this.config.templateOptions.type !== 'submit' && !this.config.disableAction) {
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
