import { Component, EventEmitter, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserService } from '@webui/core';
import { Endpoints } from '@webui/data';
import { FormatString } from '@webui/utilities';
import { BehaviorSubject, pipe } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { getElementFromMetadata } from '../../../helpers/utils';
import { GenericFormService } from '../../../services';

import {
  details,
  skillActivities,
  times,
  notes,
  workType
} from './submission-form.config';

enum TimesheetType {
  Times = 'times',
  Activity = 'activity',
  Activities = 'activitites'
}

@Component({
  selector: 'app-submission-form',
  templateUrl: './submission-form.component.html',
  styleUrls: ['./submission-form.component.scss']
})
export class SubmissionFormComponent {
  @Input() config: any;
  @Input() event: EventEmitter<void> = new EventEmitter();

  type: TimesheetType;
  timesheetType = TimesheetType;
  formData = new BehaviorSubject<any>({ data: {} });
  formGroup = new FormGroup({});

  details = details();
  times = times();
  skillActivity = workType();
  skillActivities = skillActivities();
  notes = notes();

  saveProcess: boolean;
  formFilled: boolean;

  errors: { [key: string]: any };

  constructor(
    private gfs: GenericFormService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.parseMetadata(this.details, this.config.data);
    this.formData.next({
      data: this.config.extendData
    });
    console.log(this);
  }

  public formEvent(e) {
    if (e.type === 'saveStart') {
      this.saveProcess = true;
    }

    if (e.type === 'sendForm' && e.status === 'success') {
      this.event.emit(e);
    }
  }

  public errorEvent() {
    this.saveProcess = false;
  }

  setTimesheetType(type: TimesheetType) {
    this.type = type;

    if (type === TimesheetType.Times) {
      this.parseMetadata(this.times, this.config.data);
      this.updateMetadata(this.getMetadataConfig(this.times));
      this.formFilled = true;
    }

    if (type === TimesheetType.Activity) {
      this.parseMetadata(this.skillActivity, this.config.data);
      this.updateMetadata(this.getMetadataConfig(this.skillActivity));
    }

    if (type === TimesheetType.Activities) {
      this.parseMetadata(this.skillActivities, this.config.data);
      this.updateMetadata(this.getMetadataConfig(this.skillActivities));
      console.log(this.skillActivities);
    }
  }

  saveSkillActivity(data) {
    const body = { ...data };
    this.saveProcess = true;
    this.gfs
      .submitForm(Endpoints.TimesheetRates, body)
      .pipe(
        finalize(() => (this.saveProcess = false)),
        catchError((err) => {
          this.errors = err.errors;
          return err;
        })
      )
      .subscribe(() => {
        this.setTimesheetType(TimesheetType.Activities);
        this.formFilled = true;
      });
    console.log(data);
  }

  private getMetadataConfig(metadata) {
    return {
      metadata,
      formData: this.formData,
      data: this.config.extendData
    };
  }

  private parseMetadata(metadata, params) {
    metadata.forEach((el) => {
      if (el && el.key && params && !!params[el.key]) {
        if (params[el.key].action === 'add') {
          let elem = getElementFromMetadata(metadata, el.key);
          elem = Object.assign(elem, params[elem.key].data);
        }
      } else if (el && el.children) {
        this.parseMetadata(el.children, params);
      }
    });
  }

  private updateMetadata(config) {
    const { metadata, formData, data } = config;

    metadata.forEach((el) => {
      this.parseParams(el.prefilled, data);
      this.parseParams(el.query, data);

      if (el.key) {
        el.formData = formData;
      } else if (el.children) {
        this.updateMetadata({ metadata: el.children, formData, data });
      }
    });
  }

  private parseParams(
    params: { [key: string]: any },
    data
  ): { [key: string]: any } {
    if (!params) {
      return;
    }

    const format = new FormatString();
    const fullData = {
      ...data,
      session: this.userService.user
    };

    Object.keys(params).forEach((elem) => {
      if (typeof params[elem] === 'string') {
        params[elem] = format.format(params[elem], fullData);
      }
    });

    return params;
  }
}
