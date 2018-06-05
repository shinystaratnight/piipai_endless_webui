import {
  Component,
  ViewContainerRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
  ViewEncapsulation
} from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BasicElementComponent } from './../basic-element/basic-element.component';

import { FormatString } from '../../../helpers/format';

import * as moment from 'moment-timezone';

@Component({
  selector: 'form-input',
  templateUrl: 'form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class FormInputComponent extends BasicElementComponent implements OnInit, AfterViewInit {

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;
  public label: boolean;
  public filteredList: any[];
  public elementRef: ElementRef;
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

  @ViewChild('input') public input;

  @Output() public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private myElement: ElementRef
  ) {
    super();
    this.elementRef = myElement;
  }

  public ngOnInit() {
    if (this.config.type !== 'static' || this.config.key === 'strength') {
      this.addControl(this.config, this.fb);
    }
    this.setInitValue();
    this.checkModeProperty();
    this.checkHiddenProperty();
    this.checkAutocomplete();
    if (this.config.type !== 'static' || this.config.key === 'strength') {
      this.createEvent();
    }
    if (this.config.formData) {
      this.config.formData.subscribe((data) => {
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
        }
      });
    }
  }

  public checkHiddenProperty() {
    if (this.config && this.config.hidden && (this.config.type !== 'static' || this.config.key === 'strength')) { //tslint:disable-line
      this.config.hidden.subscribe((hide) => {
        if (hide) {
          this.config.hide = hide;
          this.group.get(this.key).patchValue(undefined);
          this.setInitValue();
        } else {
          this.config.hide = hide;
        }
      });
    }
  }

  public checkModeProperty() {
    if (this.config && this.config.mode) {
      this.config.mode.subscribe((mode) => {
        if (mode === 'view') {
          this.viewMode = true;

          if (this.group.get(this.key) && !this.config.hide) {
            this.group.get(this.key).patchValue(undefined);
          }
        } else {
          this.viewMode = this.config.read_only || false;
        }
        this.setInitValue();
      });
    }
  }

  public checkAutocomplete() {
    if (this.config.autocompleteData) {
      this.config.autocompleteData.subscribe((data) => {
        if (data.hasOwnProperty(this.config.key)) {
          this.group.get(this.key).patchValue(data[this.config.key].value);
        }
      });
    }
  }

  public setInitValue() {
    if (this.config.type !== 'static' || this.config.key === 'strength') {
      if (this.config.value === 0 || this.config.value ||
        this.config.default || this.config.default === 0) {
        let value = (this.config.value === 0 || this.config.value) ?
           this.config.value : this.config.default;
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

    this.autocompleteFields.keys.forEach((field: string) => {
      this.autocompleteFields[field].value = undefined;
      this.autocompleteFields[field].long_name_value = '';
    });

    for (let i = address.address_components.length - 1; i; i--) {
      let addressElement = address.address_components[i];
      let addressType = addressElement.types[0];

      if (this.autocompleteFields[addressType]) {
        let val = addressElement[this.autocompleteFields[addressType].label];

        this.autocompleteFields[addressType].value = val;
      }
    }

    const result =  {};
    this.autocompleteFields.keys.forEach((field: string) => {
      const target = this.autocompleteFields[field];

      result[target.field] = {
        value: target.value,
        related: target.related
      };
    });

    // this.config.autocompleteData.next(result);
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
