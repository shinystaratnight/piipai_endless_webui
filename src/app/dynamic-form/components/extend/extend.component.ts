import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import { Field } from '../../models/field.model';

@Component({
  selector: 'extend',
  templateUrl: './extend.component.html',
  styleUrls: ['./extend.component.scss']
})
export class ExtendComponent implements OnInit, OnDestroy {

  public config: Field;
  public viewData: FormGroup;
  public shifts: FormArray;
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
      time: {
        key: 'time',
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
        templateOptions: {
          min: 1,
          required: false,
          label: 'Number of workers',
          max: 32767,
          type: 'number'
        },
        type: 'input'
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
    console.log(e);

    this.generateShifts();
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

  public generateShifts() {
    this.shifts = this.fb.array([
      this.fb.group({})
    ]);
  }

}
