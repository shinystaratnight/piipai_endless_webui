import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Endpoints, TimeSheet, TimesheetRate } from '@webui/data';
import { DatepickerType, DropdownOption } from '@webui/form-controls';
import { Icon, IconSize } from '@webui/icon';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GenericFormService } from '../../services';
import { ITable } from './entity-list/entity-list.component';

type ViewType = 'list' | 'form' | undefined;

const isHourlyWork = (name: string): boolean => {
  return name.toLocaleLowerCase().replace(/ /g, '_').includes('hourly_work');
};

@Component({
  selector: 'app-approve-worksheet-modal',
  templateUrl: './approve-worksheet-modal.component.html',
  styleUrls: ['./approve-worksheet-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApproveWorksheetModalComponent implements OnInit, OnDestroy {
  private destroy: Subject<void> = new Subject<void>();
  private hasTimeForm: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private timeViewType: BehaviorSubject<ViewType> = new BehaviorSubject(
    undefined
  );
  private activityViewType: BehaviorSubject<ViewType> = new BehaviorSubject(
    undefined
  );
  private activities: BehaviorSubject<TimesheetRate[] | null> =
    new BehaviorSubject(null);
  private removedActivities: TimesheetRate[] = [];
  private editingActivity: TimesheetRate | null;

  public activityEndpoint = Endpoints.SkillWorkTypes;
  public activityParams: { [key: string]: any };

  public data: any;
  public timeSheet: TimeSheet;
  public formGroup: FormGroup;
  public Icon = Icon;
  public IconSize = IconSize;
  public timeForm: FormGroup;
  public DatepickerType = DatepickerType;
  public processing$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public timeViewType$ = this.timeViewType.asObservable();
  public activityViewType$ = this.activityViewType.asObservable();
  public activities$ = this.activities.asObservable();

  public get formInvalid(): boolean {
    return this.formGroup.invalid;
  }

  public get timeInvalid(): boolean {
    return this.formGroup.get('times')?.invalid;
  }

  public get activityInvalid(): boolean {
    return this.formGroup.get('activity')?.invalid;
  }

  public get destroy$(): Observable<void> {
    return this.destroy.asObservable();
  }

  public get hasTimeForm$(): Observable<boolean> {
    return this.hasTimeForm.asObservable();
  }

  public get timeTable(): ITable {
    if (this.timeSheet) {
      return {
        head: ['start_time', 'end_time', 'break_time'],
        rows: [
          {
            cells: [
              { content: this.timeSheet.format.startedAt },
              { content: this.timeSheet.format.endedAt },
              { content: this.timeSheet.format.breakTime }
            ]
          }
        ]
      };
    }
  }

  public get activityTable(): ITable {
    const activities = this.activities.value;

    if (activities) {
      return {
        head: ['activity', 'amount'],
        rows: activities.map((activity) => {
          return {
            entity: activity,
            cells: [
              { content: activity.worktype.__str__ },
              { content: activity.value + '' }
            ]
          };
        })
      };
    }
  }

  constructor(private apiService: GenericFormService) {}

  public ngOnInit(): void {
    this.timeSheet = new TimeSheet(this.data);

    if (this.timeSheet.endedAt) {
      this.timeViewType.next('list');
    }

    this.formGroup = new FormGroup({
      pictures: new FormControl(''),
      note: new FormControl('')
    });

    this.activityParams = this.getActivityParams();
    this.getActivities();
  }

  public ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  public submit() {}

  public addTime(): void {
    this.formGroup.addControl('times', this.initTimeForm(this.timeSheet));
    this.timeViewType.next('form');
  }

  public editTime(): void {
    this.formGroup.addControl('times', this.initTimeForm(this.timeSheet));
    this.timeViewType.next('form');
  }

  public deleteTime(): void {
    this.timeSheet.endedAt = null;
    this.timeSheet.breakStartedAt = null;
    this.timeSheet.breakEndedAt = null;
    this.timeViewType.next(undefined);
  }

  public addActivity(): void {
    this.formGroup.addControl(
      'activity',
      this.getActivityForm(undefined, this.timeSheet.id)
    );

    this.activityViewType.next('form');
  }

  public saveTime(): void {
    const value = this.formGroup.get('times').value;
    this.updateTimeSheet(value);
    this.formGroup.removeControl('times');

    this.timeViewType.next('list');
  }

  public saveActivity(): void {
    const newActivity = new TimesheetRate(this.formGroup.get('activity').value);
    this.formGroup.removeControl('activity');
    this.activityViewType.next('list');

    if (this.editingActivity) {
      const activities = [...this.activities.value];
      const activityIndex = activities.indexOf(this.editingActivity);
      activities.splice(activityIndex, 1, newActivity);

      this.activities.next(activities);
    } else {
      this.activities.next([...this.activities.value, newActivity]);
    }
  }

  public cancelTimeEditing() {
    this.timeViewType.next(this.timeSheet.endedAt ? 'list' : undefined);
    this.formGroup.removeControl('times');
  }

  public cancelActivityEditing() {
    this.activityViewType.next(
      this.activities.value.length ? 'list' : undefined
    );
    this.formGroup.removeControl('activity');
  }

  public getAmountPrefix(): string {
    const worktype: DropdownOption = this.formGroup
      .get('activity')
      .get('worktype').value;

    if (worktype instanceof DropdownOption) {
      if (worktype.getField('uom')) {
        return worktype.getField('uom').short_name;
      }
    }

    return '';
  }

  public activityOptionFilter(option: DropdownOption) {
    return !isHourlyWork(option.label);
  }

  public editAvtivity(row: { entity: TimesheetRate }): void {
    const activity = this.activities.value.find((el) => el === row.entity);
    this.formGroup.addControl(
      'activity',
      this.getActivityForm(activity, this.timeSheet.id)
    );
    this.editingActivity = activity;

    this.activityViewType.next('form');
  }

  public deleteActivity(row: { entity: TimesheetRate }) {
    const activity = this.activities.value.find(
      (activity) => activity === row.entity
    );
    const newActivities = this.activities.value.filter(
      (activity) => activity !== row.entity
    );
    this.activities.next(newActivities);

    if (!newActivities.length) {
      this.activityViewType.next(undefined);
    }

    if (!activity.id) {
      return;
    }

    this.removedActivities.push(activity);
  }

  private initTimeForm(timeSheet: TimeSheet): FormGroup {
    const timesForm = new FormGroup({
      shiftStartedAt: new FormControl(timeSheet.startedAt, Validators.required),
      shiftEndedAt: new FormControl(timeSheet.endedAt, Validators.required),
      break: new FormControl('')
    });

    return timesForm;
  }

  private updateTimeSheet(value) {
    this.timeSheet.startedAt = value.shiftStartedAt || null;
    this.timeSheet.endedAt = value.shiftEndedAt || null;
    this.timeSheet.updateBreak(value.break ? value.break.split(':') : null);
  }

  private getActivityParams(): { [key: string]: any } {
    return {
      fields: ['__str__', 'id', 'translations', 'uom', 'skill_rate_ranges'],
      skill: this.timeSheet.position.id,
      company: this.timeSheet.company.id,
      priced: true
    };
  }

  private getActivities(): void {
    this.apiService
      .get(Endpoints.TimesheetRates, {
        timesheet: this.timeSheet.id,
        limit: -1
      })
      .subscribe((response) => {
        const activities = response.results
          .map((activity) => new TimesheetRate(activity))
          .filter((rate) => !isHourlyWork(rate.worktype.__str__));

        console.log(activities);

        if (activities.length) {
          this.activityViewType.next('list');
        }

        this.activities.next(activities);
      });
  }

  private getActivityForm(
    activity: TimesheetRate | undefined,
    timesheet?: string
  ): FormGroup {
    const form = new FormGroup({
      id: new FormControl(activity?.id),
      value: new FormControl(activity?.value, Validators.required),
      rate: new FormControl(activity?.rate),
      timesheet: new FormControl(activity?.timesheet || { id: timesheet }),
      worktype: new FormControl(activity?.worktype, Validators.required)
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
