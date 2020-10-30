import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Subscription } from 'rxjs';

import { BasicElementComponent } from './../basic-element/basic-element.component';
import { getTranslationKey } from '@webui/utilities';

@Component({
  selector: 'app-form-select',
  templateUrl: 'form-select.component.html',
})
export class FormSelectComponent extends BasicElementComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('select')
  public select;

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;
  public options: any;
  public label: boolean;

  public displayValue: string;
  public displayValueKey: string;
  public textColor: string;

  public viewMode: boolean;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  getTranslationKey = getTranslationKey;

  private subscriptions: Subscription[];

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
    super();
    this.subscriptions = [];
  }

  public ngOnInit() {
    this.addControl(this.config, this.fb, this.config.templateOptions.required);
    this.options = !this.config.templateOptions.doNotSort
      ? this.config.templateOptions.options.sort((p, n) =>
          p.label > n.label ? 1 : -1
        )
      : this.config.templateOptions.options.slice();
    this.setInitValue();
    this.checkModeProperty();
    this.checkHiddenProperty();
    this.createEvent();
  }

  public ngOnDestroy() {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }

  public checkHiddenProperty() {
    if (this.config && this.config.hidden) {
      const subscription = this.config.hidden.subscribe((hide) => {
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
      const subscription = this.config.mode.subscribe((mode) => {
        if (mode === 'view') {
          this.viewMode = true;
          this.group.get(this.key).patchValue(undefined);
        } else {
          this.viewMode = this.config.read_only || false;
        }
        this.setInitValue();

        this.eventHandler({ type: 'change' });
      });

      this.subscriptions.push(subscription);
    }
  }

  public getValue(
    options: any[],
    value: string
  ): { value: string; color?: string, key?: string } {
    let element = options.find((el) => el.value == value); // tslint:disable-line
    if (element) {
      return {
        key: element.value,
        value: element.label,
        color: element.color,
      };
    } else {
      return { value: '-' };
    }
  }

  public setInitValue() {
    let value = this.config.value;
    if (value || this.config.default) {
      const option = this.getValue(this.options, this.config.value);
      if (option.value === '-' || !option) {
        value = this.config.default;
      }
    }

    if (value != undefined) {
      this.group.get(this.key).patchValue(value);
    } else {
      this.group.get(this.key).patchValue('');
    }
    if ((this.viewMode || this.config.read_only) && !this.config.hide) {
      const option = this.getValue(this.options, value);
      if (option.value !== '-') {
        this.displayValueKey = this.getOptionTranslationKey(option.key);
      }
      this.displayValue = option.value;
      this.textColor = option.color ? `text-${option.color}` : '';
    }
  }

  public ngAfterViewInit() {
    if (this.select) {
      this.addFlags(this.select, this.config);
    }
  }

  public eventHandler(e) {
    this.event.emit({
      type: e.type,
      el: this.config,
      value: this.group.get(this.key).value,
    });
  }

  getOptionTranslationKey(optionKey: string): string {
    return `${this.key}.${optionKey}`;
  }
}
