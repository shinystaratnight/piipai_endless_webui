import {
  Component,
  ViewContainerRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter,
  ElementRef,
  HostListener
} from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BasicElementComponent } from './../basic-element/basic-element.component';

import { FormatString } from '../../../helpers/format';

import * as moment from 'moment-timezone';

@Component({
  selector: 'form-input',
  templateUrl: 'form-input.component.html'
})

export class FormInputComponent extends BasicElementComponent implements OnInit, AfterViewInit {
  @ViewChild('input')
  public input;

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;
  public label: boolean;

  public query = '';
  public filteredList: any[];
  public list = [];
  public limit = 10;
  public lastElement = 0;
  public elementRef;
  public hideAutocomplete = true;

  public modalScrollDistance = 2;
  public modalScrollThrottle = 50;

  public displayValue: string;

  public viewMode: boolean;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private myElement: ElementRef
  ) {
    super();
    this.elementRef = myElement;
  }

  public ngOnInit() {
    if (this.config.type !== 'static') {
      this.addControl(this.config, this.fb);
    }
    this.setInitValue();
    this.checkModeProperty();
    this.checkHiddenProperty();
    if (this.config.type !== 'static') {
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
            if (breakStart && breakEnded) {
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
    if (this.config && this.config.hidden && this.config.type !== 'static') {
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
        } else {
          this.viewMode = this.config.read_only || false;
        }
        this.setInitValue();
      });
    }
  }

  public setInitValue() {
    if (this.config.type !== 'static') {
      if (this.config.value === 0 || this.config.value ||
        this.config.default || this.config.default === 0) {
        let value = (this.config.value === 0 || this.config.value) ?
           this.config.value : this.config.default;
        this.group.get(this.key).patchValue(value);
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
