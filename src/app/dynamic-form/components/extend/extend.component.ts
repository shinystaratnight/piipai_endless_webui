import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Field } from '../../models/field.model';
import { CustomEvent } from '../../models/custom-event.model';

import moment from 'moment-timezone';

@Component({
  selector: 'extend',
  templateUrl: './extend.component.html',
  styleUrls: ['./extend.component.scss']
})
export class ExtendComponent implements OnInit, OnDestroy {

  public config: Field;
  public viewData: FormGroup;
  public shifts: any[] = [];
  public viewConfig: { [key: string]: Field };
  public formData: any;
  public autoFillData: any;

  private formSubscription: Subscription;

  constructor(
    private fb: FormBuilder
  ) {}

  public ngOnInit() {
    this.viewData = this.fb.group({});

    this.viewConfig = {
      shiftsDates: {
        key: 'shifts',
        type: 'jobdates',
        value: this.config.value || []
      },
      extendDates: {
        key: 'extendDates',
        type: 'checkbox',
        templateOptions: {
          label: 'Dates'
        }
      },
      extendCandidates: {
        key: 'extendCandidates',
        type: 'checkbox',
        templateOptions: {
          label: 'Candidates'
        }
      },
    };

    this.checkFormData();
  }

  public ngOnDestroy() {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  public eventHandler(e) {
    this.viewData.value.shifts.forEach((date) => {
      if (!this.shifts.find((el) => el.date === date)) {
        this.shifts.push(this.generateShift(date));
      }
    });
  }

  public checkFormData() {
    if (this.config.formData) {
      const subscription = this.config.formData.subscribe((data) => {
        this.formData = data.data;

        this.autoFillData = this.formData.last_fullfilled;
      });

      this.formSubscription = subscription;
    }
  }

  public generateShift(date: string) {
    const shift = {
      date,
      config: {
        0: this.generateConfig(this.formData.id, date)
      },
      data: this.fb.array([ this.fb.group({}) ])
    };

    return shift;
  }

  public addTime(shift) {
    shift.config[shift.data.length] = this.generateConfig(this.formData.id, shift.date);
    shift.data.insert(shift.length, this.fb.group({}));
  }

  public generateConfig(id, date) {
    const formData = new BehaviorSubject({ data: { shift: date } });

    return {
      time: {
        key: 'time',
        formData,
        templateOptions: {
          required: true,
          label: 'Select time',
          type: 'time'
        },
        type: 'datepicker'
      },
      workers: {
        default: 1,
        key: 'workers',
        formData,
        templateOptions: {
          min: 1,
          required: false,
          label: 'Number of workers',
          max: 32767,
          type: 'number'
        },
        type: 'input'
      },
      candidates: {
        type: 'related',
        endpoint: `/ecore/api/v2/hr/jobs/${id}/extend_fillin/`,
        key: 'candidates',
        many: true,
        formData,
        hidden: new BehaviorSubject(true),
        templateOptions: {
          label: 'Select workers',
          info: {
            score: '{candidate_scores.average_score}',
            distance: '{distance}'
          },
          values: ['__str__']
        },
        query: {
          shift: `{shift}T{time}%2B${moment.tz('Australia/Sydney').format('Z').slice(1)}`
        }
      }
    };
  }

  public timeChange(e, config) {
    if (e.type === 'change') {
      config.candidates.hidden.next(!e.value);
    }

    const newData = this.generateData(e.el.key, e.el.formData.getValue().data, e);

    config.candidates.formData.next({
      key: e.el.key,
      data: newData
    });
  }

  public generateData(key: string, data = {}, event: CustomEvent): any {
    const keys = key.split('.');
    const firstKey = keys.shift();

    if (keys.length === 0) {
      if (event.el.type === 'related' && firstKey !== 'id') {
        if (data[firstKey]) {
          data[firstKey] = {
            ...data[firstKey],
            ...event.additionalData
          };
        } else {
          data[firstKey] = {
            id: event.value,
            ...event.additionalData
          };
        }
      } else {
        data[firstKey] = event.value;
      }
    } else {
      if (data[firstKey]) {
        this.generateData(keys.join('.'), data[firstKey], event);
      } else {
        data[firstKey] = {};
        this.generateData(keys.join('.'), data[firstKey], event);
      }
    }

    return data;
  }

  public removeTime(target: FormArray, index: number) {
    target.removeAt(index);
  }
}
