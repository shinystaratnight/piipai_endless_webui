import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Endpoints, TimeSheet } from '@webui/data';
import { DatepickerType } from '@webui/form-controls';
import { Icon } from '@webui/icon';

@Component({
  selector: 'app-submission-modal',
  templateUrl: './submission-modal.component.html',
  styleUrls: ['./submission-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubmissionModalComponent implements OnInit {
  public data: any;
  public activityEndpoint = Endpoints.SkillWorkTypes;
  public timeSheet: TimeSheet;
  public Icon = Icon;
  public DatepickerType = DatepickerType;
  public get info() {
    return [
      [
        {
          label: 'Supervisor',
          icon: Icon.Person,
          text: this.timeSheet.candidate.fullName
        },
        {
          label: 'Company',
          icon: Icon.Company,
          text: this.timeSheet.candidate.fullName
        },
        {
          label: 'Shift date',
          icon: Icon.Calendar,
          text: this.timeSheet.candidate.fullName
        }
      ],
      [
        {
          label: 'Jobsite',
          icon: Icon.JobSite,
          text: this.timeSheet.candidate.fullName
        },
        {
          label: 'Position',
          icon: Icon.Position,
          text: this.timeSheet.candidate.fullName
        }
      ]
    ];
  }
  public formGroup?: FormGroup;

  public ngOnInit() {
    console.log(this);
    this.timeSheet = new TimeSheet(this.data);

    this.formGroup = new FormGroup({
      shiftStartedAt: new FormControl(),
      shiftEndedAt: new FormControl(),
      breakStartedAt: new FormControl(),
      breakEndedAt: new FormControl(),
      activity: new FormControl(),
      amount: new FormControl(0)
    });

    this.formGroup.valueChanges.subscribe((val) => console.log(val));
  }
}
