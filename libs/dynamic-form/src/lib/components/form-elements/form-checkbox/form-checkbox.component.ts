import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs';

import { BasicElementComponent } from './../basic-element/basic-element.component';
import { SiteSettingsService } from '@webui/core';

@Component({
  selector: 'app-form-checkbox',
  templateUrl: './form-checkbox.component.html',
  styleUrls: ['./form-checkbox.component.scss']
})
export class FormCheckboxComponent extends BasicElementComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('checkbox', { static: false })
  public checkbox;

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;
  public value = true;
  public label: boolean;

  public checkboxValue: string;
  public checkboxClass = '';
  public checkboxColor = '';

  public isDisabled: boolean;
  public disabledTitle: string;

  public viewMode: boolean;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public buttonAction: EventEmitter<any> = new EventEmitter();

  private subscriptions: Subscription[];

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private siteSettings: SiteSettingsService
  ) {
    super();
    this.subscriptions = [];
  }

  get hasButton() {
    const { showButtonIf } = this.config.templateOptions;

    if (typeof showButtonIf === 'boolean') {
      return this.config.templateOptions.showButtonIf === this.config.value;
    }
  }

  public ngOnInit() {
    this.addControl(this.config, this.fb);
    this.viewMode = this.config.read_only;
    this.setInitValue();
    this.checkModeProperty();
    this.checkHiddenProperty();
    this.createEvent();

    this.isDisabled = this.checkDisabled();
    this.disabledTitle = this.getDisabledTitle(this.isDisabled);

    if (this.config.templateOptions.disabled) {
      this.group.get(this.key).disable();
    }

    if (this.isDisabled) {
      this.group.get(this.key).patchValue(false);
      this.group.get(this.key).disable();
    }
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(s => s && s.unsubscribe());
  }

  public checkHiddenProperty() {
    if (this.config && this.config.hidden) {
      const subscription = this.config.hidden.subscribe(hide => {
        if (hide) {
          this.config.hide = hide;
          this.group.get(this.key).patchValue(undefined);
          this.setInitValue();
        } else {
          this.config.hide = hide;
        }

        if (!(<any>this.cd).destroyed) {
          this.cd.detectChanges();
        }
      });

      this.subscriptions.push(subscription);
    }
  }

  public checkModeProperty() {
    if (this.config && this.config.mode) {
      const subscription = this.config.mode.subscribe(mode => {
        if (mode === 'view') {
          this.viewMode = true;
        } else {
          this.viewMode = this.config.read_only || false;
        }
        this.setInitValue();
      });

      this.subscriptions.push(subscription);
    }
  }

  public setInitValue() {
    let value;
    if (this.config.updateFromForm) {
      value =
        this.group.get(this.key).value !== null
          ? this.group.get(this.key).value
          : this.config.value || (!this.viewMode && this.config.default);
    } else {
      value = this.config.value || (!this.viewMode && this.config.default);
    }

    if (this.config.value === null) {
      value = this.config.value;
    }

    if (this.viewMode) {
      if (this.config.templateOptions.type === 'checkbox') {
        this.defaultValues(value);
      }
    }
    if (this.config.templateOptions.type === 'icon') {
      this.customizeCheckbox(value);
    }
    this.group.get(this.key).patchValue(value === null ? value : (value || false));
  }

  public defaultValues(value) {
    if (value) {
      this.checkboxClass = 'text-success';
      this.checkboxValue = 'check-circle';
    } else if (value === null) {
      this.checkboxClass = 'text-muted';
      this.checkboxValue = 'minus-circle';
    } else {
      this.checkboxClass = 'text-danger';
      this.checkboxValue = 'times-circle';
    }
  }

  public customizeCheckbox(value): void {
    this.checkboxValue = this.config.templateOptions.values[value];
    const color = this.config.templateOptions.color;
    const classes = ['primary', 'danger', 'info', 'success', 'warning'];
    this.checkboxClass = classes.indexOf(color) > -1 ? `text-${color}` : '';
    if (!this.checkboxClass) {
      this.checkboxColor = color || '';
    }
  }

  public ngAfterViewInit() {
    if (this.checkbox) {
      this.addFlags(this.checkbox, this.config);
    }
  }

  public eventHandler(e) {
    this.event.emit({
      type: e.type,
      el: this.config,
      value: this.group.controls[this.key].value
    });
  }

  public checkDisabled(): boolean {
    const disableFields = [
      'by_phone',
      'send_supervisor_message',
      'send_candidate_message'
    ];

    return (
      disableFields.indexOf(this.config.key) !== -1 &&
      !this.siteSettings.isSmsEnabled()
    );
  }

  public getDisabledTitle(disabled?: boolean): string {
    return disabled ? this.siteSettings.getSmsSendTitle() : '';
  }

  sendAction(e) {
    this.buttonAction.emit({
      type: e.type,
      el: this.config,
      value: this.config.templateOptions.action,
    })
  }
}
