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
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { BasicElementComponent } from './../basic-element/basic-element.component';

import { Subscription } from 'rxjs/Subscription';

import { FormatString } from '../../../helpers/format';

import * as moment from 'moment-timezone';

@Component({
  selector: 'form-input',
  templateUrl: 'form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class FormInputComponent
  extends BasicElementComponent
  implements OnInit, AfterViewInit, OnDestroy {

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;
  public label: boolean;
  public filteredList: any[];
  public displayValue: string;
  public viewMode: boolean;

  public query = '';
  public list = [];
  public limit = 10;
  public lastElement = 0;
  public hideAutocomplete = true;
  public modalScrollDistance = 2;
  public modalScrollThrottle = 50;
  public autocompleteFields = {
    country: {
      label: 'short_name',
      field: 'country',
      value: '',
    },
    administrative_area_level_1: {
      label: 'long_name',
      field: 'state',
      value: '',
      related: ['country'],
    },
    locality: {
      label: 'long_name',
      field: 'city',
      value: '',
      related: ['country', 'state']
    },
    postal_code: {
      label: 'short_name',
      field: 'postal_code',
      value: '',
    },
    keys: ['country', 'administrative_area_level_1', 'locality', 'postal_code']
  };
  public address = '';
  public formData: any;
  public autocompleteValue: any;

  @ViewChild('input') public input;

  @Output() public event: EventEmitter<any> = new EventEmitter();

  private subscriptions: Subscription[];

  constructor(
    private fb: FormBuilder,
    public elementRef: ElementRef,
    private cd: ChangeDetectorRef
  ) {
    super();
    this.subscriptions = [];
  }

  public ngOnInit() {
    if (this.config.type !== 'static' || this.config.key === 'strength') {
      this.addControl(this.config, this.fb);
    }
    this.setInitValue();
    this.checkModeProperty();
    this.checkHiddenProperty();
    this.checkAutocomplete();
    this.checkFormData();
    if (this.config.type !== 'static' || this.config.key === 'strength') {
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
        if (this.config.type === 'static' && this.config.key === 'total_worked') {
          const shiftStart = moment(data.data.shift_started_at);
          const shiftEnded = moment(data.data.shift_ended_at);
          const breakStart = moment(data.data.break_started_at);
          const breakEnded = moment(data.data.break_ended_at);

          if (shiftStart.isBefore(shiftEnded) && breakStart.isBefore(breakEnded)) {
            const shiftTime = moment.utc(shiftEnded.diff(shiftStart));
            const breakTime = moment.utc(breakEnded.diff(breakStart));

            const shiftDiff = shiftTime.format('HH:mm');
            if (breakStart && breakEnded && !data.data.no_break) {
              const breakDiff = breakTime.format('HH:mm');
              const totalTime = moment.utc(shiftTime.diff(breakTime)).format('HH:mm');

              this.displayValue = `${shiftDiff} - ${breakDiff} = ${totalTime} hours`;
            } else {
              this.displayValue = `${shiftDiff} - 00:00 = ${shiftDiff} hours`;
            }
          }
        } else {
          this.setInitValue();
        }

      });

      this.subscriptions.push(subscription);
    }
  }

  public checkHiddenProperty() {
    if (this.config && this.config.hidden && (this.config.type !== 'static' || this.config.key === 'strength')) { //tslint:disable-line
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

          if (this.group.get(this.key) && !this.config.hide) {
            this.group.get(this.key).patchValue(undefined);
          }
        } else {
          this.viewMode = this.config.read_only || false;
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
        if (data.hasOwnProperty(this.config.key)) {
          this.autocompleteValue = data[this.config.key];
        }
      });

      this.subscriptions.push(subscription);
    }
  }

  public setInitValue() {
    if (this.config.type !== 'static' || this.config.key === 'strength') {
      if (this.autocompleteValue) {
        this.displayValue = this.autocompleteValue;
        this.group.get(this.key).patchValue(this.autocompleteValue);
      } else if (this.config.value === 0
        || this.config.value
        || this.config.default
        || this.config.default === 0) {
          const format = new FormatString();

          let value = (this.config.value === 0 || this.config.value)
            ? this.config.value
            : (typeof this.config.default === 'string')
              ? format.format(this.config.default, this.formData)
              : this.config.default;
          this.group.get(this.key).patchValue(value);

          if (this.config.type === 'address'
            || this.key === 'address'
            || this.key === 'street_address') {
            this.address = value;
          }
          this.displayValue = value || value === 0 ? value : '-';
      }
    } else {
      if (this.config.value instanceof Object) {
        this.displayValue = this.config.value.__str__ || '-';
      } else {
        this.displayValue = this.config.templateOptions.text || this.config.value || '-';
      }
    }

    this.cd.detectChanges();
  }

  public ngAfterViewInit() {
    if (!this.config.read_only) {
      if (this.input) {
        this.addFlags(this.input, this.config);
      }
    }
  }

  public eventHandler(e) {
    setTimeout(() => {
      this.event.emit({
        type: e.type,
        el: this.config,
        value: this.group.get(this.key).value
      });
    }, 250);
  }

  public filter(key) {
    this.lastElement = 0;
    let query = this.group.get(key).value;
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
      this.list = this.config.autocomplete
        .sort((p, n) => p.name > n.name ? 1 : -1);
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
