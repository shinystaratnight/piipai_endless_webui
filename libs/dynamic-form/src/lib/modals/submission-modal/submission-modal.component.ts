import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Endpoints, TimeSheet } from '@webui/data';
import { DatepickerType, DropdownOption } from '@webui/form-controls';
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
          text: this.timeSheet.company.__str__
        },
        {
          label: 'Shift date',
          icon: Icon.Calendar,
          text: this.timeSheet.shift.__str__
        }
      ],
      [
        {
          label: 'Jobsite',
          icon: Icon.JobSite,
          text: this.timeSheet.jobSite.__str__
        },
        {
          label: 'Position',
          icon: Icon.Position,
          text: this.timeSheet.position.__str__
        }
      ]
    ];
  }
  public formGroup?: FormGroup;

  public activityParams: { [key: string]: any };

  public ngOnInit() {
    this.timeSheet = new TimeSheet(this.data);

    this.formGroup = new FormGroup({
      shiftStartedAt: new FormControl(),
      shiftEndedAt: new FormControl(),
      break: new FormControl(),
      activity: new FormControl()
    });

    this.formGroup.valueChanges.subscribe((value) => this.updateTimeSheet(value));
    this.activityParams = this.getActivityParams();

    this.formGroup.get('activity').valueChanges.subscribe((option: DropdownOption) => {
      if (option && !this.formGroup.get('amount')) {
        this.formGroup.addControl('amount', new FormControl(0));
      } else if (!option) {
        this.formGroup.removeControl('amount');
      }
    });
  }

  public getActivityParams(): { [key: string]: any } {
    return {
      fields: ['__str__', 'id', 'translations', 'uom', 'skill_rate_ranges'],
      skill: this.timeSheet.position.id,
      company: this.timeSheet.company.id,
      priced: true
    };
  }

  public getAmountPrefix(): string {
    const activity: DropdownOption = this.formGroup.get('activity').value;

    if (activity.getField('uom')) {
      return activity.getField('uom').short_name;
    }

    return '';
  }

  public submitForm(): void {}

  private updateTimeSheet(value) {
    console.log(value);
  }
}
