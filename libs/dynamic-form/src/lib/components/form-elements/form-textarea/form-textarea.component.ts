import { 
  Component, 
  OnInit, 
  ViewChild, 
  AfterViewInit, 
  OnDestroy, 
  ChangeDetectorRef, 
  ElementRef, 
  EventEmitter, 
  Output 
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Subscription } from 'rxjs';

import { BasicElementComponent } from './../basic-element/basic-element.component';
import { FormatString, getTranslationKey } from '@webui/utilities';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-form-textarea',
  templateUrl: 'form-textarea.component.html',
  styleUrls: ['./form-textarea.component.scss'],
})
export class FormTextareaComponent extends BasicElementComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('textarea')
  public textarea: ElementRef;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;
  public label: boolean;

  public viewMode: boolean;
  public displayValue: string;
  public editMode: boolean;
  public className: string;
  public formData: any;

  private subscriptions: Subscription[];

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
    super();
    this.subscriptions = [];
    this.editMode = true;
  }

  getTranslationKey = getTranslationKey;

  public ngOnInit() {
    this.addControl(this.config, this.fb);
    this.setInitValue();
    this.checkModeProperty();
    this.checkHiddenProperty();
    this.createEvent();
    this.checkFormData();

    if (this.group.get(this.key)) {
      this.subscriptions.push(
        this.group
          .get(this.key)
          .valueChanges.pipe(distinctUntilChanged(), debounceTime(400))
          .subscribe(() => {
            this.eventHandler({ type: 'blur' });
          })
      );
    }

    this.className = this.config.templateOptions.background ? 'message-text' : '';
  }

  public ngOnDestroy() {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }

  public checkFormData() {
    if (this.config.formData) {
      const subscription = this.config.formData.subscribe((value) => {
        const { data, key } = value;

        this.formData = data;
        this.checkIfExistDefaultValue(key);
      });

      this.subscriptions.push(subscription);
    }
  }

  public checkIfExistDefaultValue(key: string) {
    if (
      this.config.default &&
      typeof this.config.default === 'string' &&
      this.config.default.includes('{') &&
      this.config.default.includes('}')
    ) {
      if (this.config.updated && !this.config.updated.includes(key)) {
        return;
      }
      this.setInitValue(true);
    }
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
          this.editMode = false;

          this.group.get(this.key).patchValue(undefined);
        } else {
          this.viewMode = this.config.read_only || false;
          this.editMode = true;
        }
        this.setInitValue();
      });

      this.subscriptions.push(subscription);
    }
  }

  public setInitValue(update?: boolean) {
    if (this.config.value || this.config.value === '') {
      this.group.get(this.key).patchValue(this.config.value);

      if (this.config.templateOptions.array) {
        this.displayValue = this.config.value[0].content
      } else {
        this.displayValue = this.config.value;
      }
    } else {
      const format = new FormatString();
      const defaultValue =
          typeof this.config.default === 'string'
            ? format.format(this.config.default, this.formData)
            : this.config.default;

      if (defaultValue || update) {
        this.group.get(this.key).patchValue(defaultValue);
        this.displayValue = this.displayValue;
        return;
      }

      this.displayValue = '-';
    }
  }

  public ngAfterViewInit() {
    if (!this.config.read_only) {
      if (this.textarea) {
        this.addFlags(this.textarea, this.config);

        if (this.config.templateOptions.autofocus) {
          this.textarea.nativeElement.focus();
        }
      }
    }
  }

  public eventHandler(e) {
    this.event.emit({
      type: e.type,
      el: this.config,
      value: this.group.get(this.key).value,
    });
  }
}
