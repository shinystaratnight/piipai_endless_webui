import { Component, EventEmitter, Input } from '@angular/core';
import { getElementFromMetadata } from '../../../helpers/utils';

import { details, times } from './submission-form.config';

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

  details = details;
  times = times;

  saveProcess: boolean;

  ngOnInit() {
    this.parseMetadata(this.details, this.config.data);
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
}
