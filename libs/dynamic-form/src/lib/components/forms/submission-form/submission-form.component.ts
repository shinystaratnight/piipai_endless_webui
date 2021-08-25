import { Component, EventEmitter, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getElementFromMetadata } from '../../../helpers/utils';

import {
  details,
  skillActivities,
  times,
  notes,
  workType
} from './submission-form.config';

enum TimesheetType {
  Times = 'times',
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

  details = details();
  times = times();
  skillActivity = workType();
  skillActivities = skillActivities();
  notes = notes();

  saveProcess: boolean;

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
      this.addFormData(this.times, this.formData);
    }

    if (type === TimesheetType.Activities) {
      this.parseMetadata(this.skillActivity, this.config.data);
      this.addFormData(this.skillActivity, this.formData);
    }
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

  private addFormData(metadata, formData) {
    metadata.forEach((el) => {
      if (el.key) {
        el.formData = formData;
      } else if (el.children) {
        this.addFormData(el.children, formData);
      }
    });
  }
}
