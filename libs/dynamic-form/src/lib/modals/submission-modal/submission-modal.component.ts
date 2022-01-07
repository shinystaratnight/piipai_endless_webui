import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Endpoints, TimeSheet, TimesheetRate } from '@webui/data';
import { DatepickerType, DropdownOption } from '@webui/form-controls';
import { Icon, IconSize } from '@webui/icon';
import { GenericFormService } from '../../services';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-submission-modal',
  templateUrl: './submission-modal.component.html',
  styleUrls: ['./submission-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubmissionModalComponent implements OnInit, OnDestroy {
  public data: any;
  public activityEndpoint = Endpoints.SkillWorkTypes;
  public timeSheet: TimeSheet;
  public Icon = Icon;
  public IconSize = IconSize;
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

  public get activitiesForm(): FormGroup[] {
    return (this.formGroup.get('activities') as FormArray).controls as FormGroup[];
  }

  public get hasActivities(): boolean {
    return !!this.formGroup.get('activities');
  }

  private destroy$: Subject<void> = new Subject<void>();
  private removedActivities: TimesheetRate[] = [];

  constructor(private apiService: GenericFormService, private cd: ChangeDetectorRef) {}

  public ngOnInit() {
    this.timeSheet = new TimeSheet(this.data);

    this.formGroup = new FormGroup({
      shiftStartedAt: new FormControl(this.timeSheet.startedAt),
      shiftEndedAt: new FormControl(this.timeSheet.endedAt),
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

    this.getActivities();
  }

  public ngOnDestroy() {
    this.destroy$.next();
  }

  public getActivityParams(): { [key: string]: any } {
    return {
      fields: ['__str__', 'id', 'translations', 'uom', 'skill_rate_ranges'],
      skill: this.timeSheet.position.id,
      company: this.timeSheet.company.id,
      priced: true
    };
  }

  public getAmountPrefix(activity: FormGroup): string {
    const worktype: DropdownOption = activity.get('worktype').value;

    if (worktype instanceof DropdownOption) {
      if (worktype.getField('uom')) {
        return worktype.getField('uom').short_name;
      }
    }

    return '';
  }

  public submitForm(): void {
    const creationRequests = this.formGroup.value.activities.map((activity) => {
      const timesheetRate = new TimesheetRate(activity);

      return timesheetRate.id
        ? this.apiService.updateForm(timesheetRate.editApiEndpoint, timesheetRate.requestBody)
        : this.apiService.submitForm(timesheetRate.apiEndpoint, timesheetRate.requestBody);
    });

    creationRequests.push(
      ...this.removedActivities.map((activity) =>
        this.apiService.delete(activity.apiEndpoint, activity.id)
      )
    );

    forkJoin(creationRequests).subscribe((response) => console.log(response));
  }

  public addActivityControl(): void {
    const array = this.formGroup.controls['activities'] as FormArray;

    array.push(this.getActivityForm(undefined, this.timeSheet.id));
  }

  public removeActivity(activity: FormGroup, index: number): void {
    const timesheetRate = new TimesheetRate(activity.value);
    const array = this.formGroup.controls['activities'] as FormArray;
    array.removeAt(index);

    if (!timesheetRate.id) {
      return;
    }

    this.removedActivities.push(timesheetRate);
  }

  private updateTimeSheet(value) {
    this.timeSheet.startedAt = value.shiftStartedAt || null;
    this.timeSheet.endedAt = value.shiftEndedAt || null;
    this.timeSheet.updateBreak(value.break ? value.break.split(':') : null);
  }

  private getActivities(): void {
    // if (this.timeSheet.status !== 5) {
    //   this.formGroup.addControl('activities', new FormArray([this.getActivityForm(undefined, this.timeSheet.id)]));
    //   return;
    // }

    this.apiService
      .get(Endpoints.TimesheetRates, { timesheet: this.timeSheet.id, limit: -1 })
      .subscribe((response) => {
        const activities = response.results.map((activity) => new TimesheetRate(activity));
        this.formGroup.addControl(
          'activities',
          new FormArray(activities.map((activity) => this.getActivityForm(activity)))
        );
        this.cd.detectChanges();
      });
  }

  private getActivityForm(activity: TimesheetRate | undefined, timesheet?: string): FormGroup {
    const form = new FormGroup({
      id: new FormControl(activity?.id),
      value: new FormControl(activity?.value),
      rate: new FormControl(activity?.rate),
      timesheet: new FormControl(activity?.timesheet || { id: timesheet }),
      worktype: new FormControl(activity?.worktype)
    });

    form
      .get('worktype')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((worktype: DropdownOption) => {
        const rate = worktype.getField('skill_rate_ranges')[0]?.default_rate;

        form.get('rate').patchValue(rate, { emitEvent: false });
      });

    return form;
  }
}
