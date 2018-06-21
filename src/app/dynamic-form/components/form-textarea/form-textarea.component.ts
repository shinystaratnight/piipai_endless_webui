import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import { BasicElementComponent } from './../basic-element/basic-element.component';

@Component({
  selector: 'form-textarea',
  templateUrl: 'form-textarea.component.html'
})

export class FormTextareaComponent
  extends BasicElementComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('textarea')
  public textarea;

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;
  public label: boolean;

  public viewMode: boolean;
  public displayValue: string;

  private subscriptions: Subscription[];

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
    super();
    this.subscriptions = [];
  }

  public ngOnInit() {
    this.addControl(this.config, this.fb);
    this.setInitValue();
    this.checkModeProperty();
    this.checkHiddenProperty();
    this.createEvent();
  }

  public ngOnDestroy() {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }

  public checkHiddenProperty() {
    if (this.config && this.config.hidden && this.config.type !== 'static') {
      const subscription = this.config.hidden.subscribe((hide) => {
        if (hide) {
          this.config.hide = hide;
          this.group.get(this.key).patchValue(undefined);
          this.setInitValue();
        } else {
          this.config.hide = hide;
        }

        this.cd.detectChanges();
      });

      this.subscriptions.push(subscription);
    }
  }

  public checkModeProperty() {
    if (this.config && this.config.mode) {
      const subscription = this.config.mode.subscribe((mode) => {
        if (mode === 'view') {
          this.viewMode = true;
          this.group.get(this.key).patchValue(undefined);
        } else {
          this.viewMode = this.config.read_only || false;
        }
        this.setInitValue();
      });

      this.subscriptions.push(subscription);
    }
  }

  public setInitValue() {
    if (this.config.value) {
      this.group.get(this.key).patchValue(this.config.value);
      this.displayValue = this.config.value;
    } else {
      this.displayValue = '-';
    }
  }

  public ngAfterViewInit() {
    if (!this.config.read_only) {
      if (this.textarea) {
        this.addFlags(this.textarea, this.config);
      }
    }
  }
}
