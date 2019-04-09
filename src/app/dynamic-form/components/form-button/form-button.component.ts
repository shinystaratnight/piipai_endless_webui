import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs';

import { SiteSettingsService } from '../../../services/site-settings.service';

@Component({
  selector: 'app-form-button',
  templateUrl: 'form-button.component.html',
  styleUrls: ['./form-button.component.scss']
})
export class FormButtonComponent implements OnInit, OnDestroy {
  public config;
  public group: FormGroup;
  public label: boolean;
  public replacyValue: string;
  public buttonClass = '';
  public textClass = '';
  public buttonColor: string;
  public repeatArray: any[];
  public showButton: boolean;
  public last: boolean;

  public isDisabled: boolean;
  public disabledTitle: string;

  public subscriptions: Subscription[] = [];

  @Output()
  public buttonAction: EventEmitter<any> = new EventEmitter();

  constructor(
    private siteSettings: SiteSettingsService
  ) {}

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

    this.isDisabled = this.checkSmsDisabled(this.config.endpoint);
    this.disabledTitle = this.getSmsTitle(this.isDisabled);
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
    const color = this.config.color;
    const classes = ['primary', 'danger', 'info', 'success', 'warning', 'link'];

    if (!this.config.inverse) {
      this.buttonClass = classes.indexOf(color) > -1 ? `btn-${color}` : '';
      if (!this.buttonClass) {
        this.buttonColor = color || '';
      }
    } else {
      this.textClass = classes.indexOf(color) > -1 ? `text-${color} py-2` : '';
    }
  }

  public action(e) {
    if (!this.checkSmsDisabled(this.config.endpoint)) {
      if (this.config.templateOptions.type !== 'submit' && !this.config.disableAction) {
        let id;
        if (this.config.name === 'id') {
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

  public checkSmsDisabled(endpoint = ''): boolean {
    if (!this.siteSettings.isSmsEnabled()) {
      if (this.config.templateOptions.action === 'resend') {
        return true;
      }

      const endpointParts = [
        'resend_sms',
        'resend_supervisor_sms',
        'send',
        'resend',
      ];

      return endpointParts.some((part) => {
        return endpoint.indexOf(part) !== -1;
      });
    }
  }

  public getSmsTitle(disabled?: boolean): string {
    return disabled
      ? this.siteSettings.getSmsSendTitle()
      : '';
  }
}
