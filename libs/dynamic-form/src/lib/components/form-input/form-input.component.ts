import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
  ViewEncapsulation,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Subscription } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
// import * as moment from 'moment-timezone';

import { Field } from '@webui/data';
import { FormatString, getTotalTime, getTimeInstance } from '@webui/utilities';
import { BasicElementComponent } from '../basic-element/basic-element.component';
// import { TimeService } from '@webui/shared';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormInputComponent extends BasicElementComponent
  implements OnInit, AfterViewInit, OnDestroy {
  public config: Field;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;

  public label: boolean;
  public filteredList: any[];
  public displayValue: string;
  public viewMode: boolean;
  public formData: any;
  public autocompleteValue: any;
  public editMode: boolean;
  public hovered: number;

  public query = '';
  public list = [];
  public limit = 10;
  public lastElement = 0;
  public hideAutocomplete = true;
  public modalScrollDistance = 2;
  public modalScrollThrottle = 50;
  public address = '';
  public timeInstance = getTimeInstance();

  public colors = {
    0: '#FA5C46',
    1: '#FA5C46',
    2: '#fc9183',
    3: '#FFA236',
    4: '#ffbf00',
    5: '#FFD042'
  };

  public requiredField: boolean;

  @ViewChild('input', { static: false })
  public input;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  private subscriptions: Subscription[];

  constructor(
    private fb: FormBuilder,
    public elementRef: ElementRef,
    private cd: ChangeDetectorRef,
    // private time: TimeService
  ) {
    super();
    this.subscriptions = [];

    this.editMode = true;
  }

  public ngOnInit() {
    if (
      this.config.type !== 'static' ||
      (this.config.type === 'static' || !this.config.read_only)
    ) {
      this.requiredField = (this.config.key === 'score' || this.config.key === 'hourly_rate') && this.config.templateOptions.required;
      this.requiredField = this.requiredField
      || (this.config.templateOptions.required
        && !(this.config.hide || this.config.send === false));

      if (this.config.templateOptions.type === 'number') {
        this.addControl(this.config, this.fb, this.requiredField, this.config.templateOptions.min, this.config.templateOptions.max);
      } else {
        this.addControl(this.config, this.fb, this.requiredField);
      }
    }
    if (this.group.get(this.key)) {
      this.subscriptions.push(
        this.group.get(this.key).valueChanges
          .pipe(
            distinctUntilChanged(),
            debounceTime(400)
          )
          .subscribe(() => {
            this.eventHandler({ type: 'blur' });
          })
      );
    }

    this.setInitValue();
    this.checkModeProperty();
    this.checkHiddenProperty();
    this.checkAutocomplete();
    this.checkFormData();
    if (
      this.config.type !== 'static' ||
      (this.config.type === 'static' && !this.config.read_only)
    ) {
      this.createEvent();
    }
  }

  public ngOnDestroy() {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }

  public checkFormData() {
    if (this.config.formData) {
      const subscription = this.config.formData.subscribe((data) => {
        this.formData = data.data;
        this.checkTimesheetTime(data);
        this.checkTotalTime(data.data);
        this.checkIfExistDefaultValue(data.key);
        this.checkAttributes();
      });

      this.subscriptions.push(subscription);
    }
  }

  public checkTotalTime(data) {
    if (this.config.key === 'total_time') {
      const formatString = new FormatString();
      const newData = {...data};

      if (newData.noBreak) {
        newData['break_started_at'] = null;
        newData['break_ended_at'] = null;
      }

      this.displayValue = formatString.format('{totalTime}',
        { ...newData, totalTime: getTotalTime(this.timeInstance, newData) }
      );
    }
  }

  public checkAttributes() {
    if (this.config.attributes) {
      const formatString = new FormatString();
      const attributes = Object.keys(this.config.attributes);

      attributes.forEach((key) => {
        this.config.templateOptions[key] = formatString.format(
          this.config.attributes[key],
          this.formData
        );
      });

      if (!this.config.read_only) {
        if (this.input) {
          this.addFlags(this.input, this.config);
        }
      }
    }
  }

  public checkTimesheetTime(data: { key: string; data: any }) {
    const keys = [
      'shift_started_at',
      'shift_ended_at',
      'break_started_at',
      'break_ended_at'
    ];

    if (keys.indexOf(data.key) > -1) {
      if (this.config.type === 'static' && this.config.key === 'total_worked') {
        const shiftStart = this.timeInstance(data.data.shift_started_at);
        const shiftEnded = this.timeInstance(data.data.shift_ended_at);
        const breakStart = this.timeInstance(data.data.break_started_at);
        const breakEnded = this.timeInstance(data.data.break_ended_at);

        if (
          shiftStart.isBefore(shiftEnded) &&
          breakStart.isBefore(breakEnded)
        ) {
          const shiftTime = this.timeInstance.utc(shiftEnded.diff(shiftStart));
          const breakTime = this.timeInstance.utc(breakEnded.diff(breakStart));

          const shiftDiff = shiftTime.format('HH:mm');
          if (breakStart && breakEnded && !data.data.no_break) {
            const breakDiff = breakTime.format('HH:mm');
            const totalTime = this.timeInstance
              .utc(shiftTime.diff(breakTime))
              .format('HH:mm');

            this.displayValue = `${shiftDiff} - ${breakDiff} = ${totalTime} hours`;
          } else {
            this.displayValue = `${shiftDiff} - 00:00 = ${shiftDiff} hours`;
          }
        }
      }
    }
  }

  public checkIfExistDefaultValue(field: string) {
    if (
      this.config.default &&
      typeof this.config.default === 'string' &&
      this.config.default.includes('{') &&
      this.config.default.includes('}')
    ) {
      if (
        this.config.type !== 'address' &&
        this.key !== 'address' &&
        this.key !== 'street_address'
      ) {
        if (this.config.updated && !this.config.updated.includes(field)) {
          return;
        }
        this.setInitValue(true);
      }
    }
  }

  public checkHiddenProperty() {
    if (
      this.config &&
      this.config.hidden &&
      (this.config.type !== 'static' ||
        (this.config.type === 'static' && !this.config.read_only))
    ) {
      const subscription = this.config.hidden.subscribe((hide) => {
        if (hide) {
          this.config.hide = hide;
          this.group.get(this.key).patchValue(undefined);
          this.setInitValue();
        } else {
          this.config.hide = hide;
        }

        if (!(<any> this.cd).destroyed) {
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

          if (this.group.get(this.key) && !this.config.hide) {
            this.group.get(this.key).patchValue(undefined);
          }
        } else {
          this.viewMode = this.config.read_only || false;

          this.editMode = true;

          setTimeout(() => {
            if (!this.config.read_only) {
              if (this.input) {
                this.addFlags(this.input, this.config);
              }
            }
          }, 200);
        }
        this.autocompleteValue = undefined;
        this.setInitValue();
      });

      this.subscriptions.push(subscription);
    }
  }

  public checkAutocomplete() {
    if (this.config.autocompleteData) {
      const subscription = this.config.autocompleteData.subscribe((data) => {
        const key = this.propertyMatches(Object.keys(data), this.config.key);
        if (
          key &&
          (this.config.type !== 'address' &&
            this.config.key !== 'address' &&
            !this.config.key.includes('street_address'))
        ) {
          this.viewMode = true;
          this.autocompleteValue = data[key] || '-';
          this.setInitValue();
        }

        if (!(<any> this.cd).destroyed) {
          this.cd.detectChanges();
        }
      });

      this.subscriptions.push(subscription);
    }
  }

  public propertyMatches(keys: string[], key: string): string {
    return keys.find((el) => key.includes(el));
  }

  public setInitValue(update?: boolean) {
    const format = new FormatString();

    if (this.key === 'street_address' && this.group.get(this.key).value) {
      this.address = this.group.get(this.key).value.formatted_address;
    }

    if (this.key === 'postal_code' && this.group.get(this.key).value) {
      this.config.value = this.group.get(this.key).value;
      this.displayValue = this.group.get(this.key).value;
    }

    if (
      this.config.type !== 'static' ||
      (this.config.type === 'static' && !this.config.read_only)
    ) {
      if (this.autocompleteValue) {
        this.displayValue = this.autocompleteValue;
        if (this.group.get(this.key)) {
          this.group.get(this.key).patchValue(this.autocompleteValue);
        }
      } else if (
        this.config.value === 0 ||
        this.config.value ||
        this.config.default ||
        this.config.default === 0
      ) {
        const defaultValue = typeof this.config.default === 'string'
            ? format.format(this.config.default, this.formData)
            : this.config.default;

        const value =
          (this.config.value === 0 || this.config.value) &&
          !(update && defaultValue !== this.config.value && !this.config.useValue)
            ? this.config.value
            : defaultValue;

        if (this.group.get(this.key)) {
          this.group.get(this.key).patchValue(value);
        }

        if (
          this.config.type === 'address' ||
          this.key === 'address' ||
          this.key === 'street_address'
        ) {
          this.address = value;
        }
        const text = format.format(this.config.templateOptions.text, {
          [this.config.key]: value
        });
        this.displayValue = text || (value || value === 0 ? value : '-');

        if (this.config.templateOptions.display) {
          this.displayValue = format.format(
            this.config.templateOptions.display.replace(/{field}/gi, `{${this.config.key}}`),
            { [this.key]: this.displayValue }
          );
        }
      }
    } else {
      if (this.config.value instanceof Object) {
        this.displayValue = this.config.value.__str__ || '-';
      } else {
        const text = format.format(this.config.templateOptions.text, {
          [this.config.key]: this.config.value
        });

        this.displayValue = text || this.config.value || '-';
      }
    }

    setTimeout(() => {
      if (!(<any> this.cd).destroyed) {
        this.cd.detectChanges();
      }
    }, 200);
  }

  public ngAfterViewInit() {
    if (!this.config.read_only) {
      if (this.input) {
        this.addFlags(this.input, this.config);
      }
    }
  }

  public eventHandler(e) {
    this.event.emit({
      type: e.type,
      el: this.config,
      value: this.group.get(this.key).value
    });
  }

  public filter(key) {
    this.lastElement = 0;
    const query = this.group.get(key).value;
    if (query !== '') {
      if (this.config.autocomplete) {
        this.filteredList = this.config.autocomplete.filter((el) => {
          return el.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
        });
      }
      this.list = this.filteredList;
      this.generatePreviewList(this.list);
    } else {
      this.generateList();
    }
  }

  public select(item) {
    this.group.get(this.key).patchValue(item);
    this.filteredList = null;
    this.generateList();
  }

  public generateList(): void {
    if (this.config.autocomplete) {
      this.hideAutocomplete = false;
      this.list = this.config.autocomplete.sort(
        (p, n) => (p.name > n.name ? 1 : -1)
      );
      this.generatePreviewList(this.list);
    }
  }

  public onModalScrollDown() {
    this.generatePreviewList(this.filteredList);
  }

  public generatePreviewList(list) {
    this.lastElement += this.limit;
    if (list) {
      this.list = list.slice(0, this.lastElement);
    }
  }

  public switchType(type) {
    switch (type) {
      case 'text':
        this.config.templateOptions.type = 'password';
        break;
      case 'password':
        this.config.templateOptions.type = 'text';
        break;
      default:
        break;
    }
  }

  public getAddress(address) {
    this.group.get(this.key).patchValue(address);

    this.event.emit({
      type: 'change',
      el: this.config,
      value: address
    });

    this.event.emit({
      type: 'address',
      el: this.config,
      value: address
    });

    setTimeout(() => {
      if (!(<any> this.cd).destroyed) {
        this.cd.detectChanges();
      }
    }, 1000);
  }

  public parseScore(score) {
    if (!score) {
      return 0;
    }

    return parseFloat(score);
  }

  @HostListener('document:click', ['$event'])
  public handleClick(event) {
    let clickedComponent = event.target;
    let inside = false;
    do {
      if (clickedComponent === this.elementRef.nativeElement) {
        inside = true;
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if (!inside) {
      this.filteredList = [];
    }
  }
}