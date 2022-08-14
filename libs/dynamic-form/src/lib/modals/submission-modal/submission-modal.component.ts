import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { TimeSheet, TimesheetRate } from '@webui/data';
import { DatepickerType, DropdownOption } from '@webui/form-controls';
import { Icon, IconSize } from '@webui/icon';
import { GenericFormService } from '../../services';
import { BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Modal, Status } from '../modal/modal.component';
import { Endpoints } from '@webui/models';

const isHourlyWork = (name: string): boolean => {
  return name.toLocaleLowerCase().replace(/ /g, '_').includes('hourly_work');
};

@Component({
  selector: 'webui-submission-modal',
  templateUrl: './submission-modal.component.html',
  styleUrls: ['./submission-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmissionModalComponent
  extends Modal
  implements OnInit, OnDestroy
{
  public data: any;
  public activityEndpoint = Endpoints.SkillWorkTypes;
  public timeSheet!: TimeSheet;
  public Icon = Icon;
  public IconSize = IconSize;
  public DatepickerType = DatepickerType;
  public processing$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public formGroup!: FormGroup;

  public activityParams?: { [key: string]: any };

  public get activitiesForm(): FormGroup[] {
    return (this.formGroup.get('activities') as FormArray)
      .controls as FormGroup[];
  }

  public get hasActivities(): boolean {
    return !!this.formGroup.get('activities');
  }

  public get invalidActivities(): boolean {
    return (
      !this.hasActivities || this.activitiesForm.some((form) => form.invalid)
    );
  }

  public get formInvalid(): boolean {
    return (
      !this.timeSheet.isValid ||
      this.invalidActivities ||
      (!this.timeSheet.endedAt && !this.activitiesForm.length)
    );
  }

  public get title(): string {
    return this.timeSheet.status === 7 ? 'worksheet' : 'worksheet_submission';
  }

  private destroy$: Subject<void> = new Subject<void>();
  private removedActivities: TimesheetRate[] = [];

  constructor(
    private apiService: GenericFormService,
    private cd: ChangeDetectorRef,
    modal: NgbActiveModal
  ) {
    super(modal);
  }

  public ngOnInit() {
    this.timeSheet = new TimeSheet(this.data);

    this.formGroup = new FormGroup({
      shiftStartedAt: new FormControl(this.timeSheet.startedAt),
      shiftEndedAt: new FormControl(this.timeSheet.endedAt),
      break: new FormControl(),
      activity: new FormControl(),
    });

    this.formGroup.valueChanges.subscribe((value) =>
      this.updateTimeSheet(value)
    );
    this.activityParams = this.getActivityParams();

    this.formGroup.get('activity')?.valueChanges
      .subscribe((option: DropdownOption) => {
        if (option && !this.formGroup.get('amount')) {
          this.formGroup.addControl('amount', new FormControl(0));
        } else if (!option) {
          this.formGroup.removeControl('amount');
        }
      });

    this.getActivities();

    if (this.timeSheet.status === 7) {
      this.formGroup.disable();
    }
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getActivityParams(): { [key: string]: any } {
    return {
      fields: ['__str__', 'id', 'translations', 'uom', 'skill_rate_ranges'],
      skill: this.timeSheet.position.id,
      company: this.timeSheet.company.id,
      priced: true,
    };
  }

  public getAmountPrefix(activity: FormGroup): string {
    const worktype: DropdownOption = activity.get('worktype')?.value;

    if (worktype instanceof DropdownOption) {
      if (worktype.getField('uom')) {
        return worktype.getField('uom').short_name;
      }
    }

    return '';
  }

  public submitForm(): void {
    const creationRequests = this.formGroup.value.activities.map((activity: any) => {
      const timesheetRate = new TimesheetRate(activity);

      return timesheetRate.id
        ? this.apiService.updateForm(
            timesheetRate.editApiEndpoint,
            timesheetRate.requestBody
          )
        : this.apiService.submitForm(
            timesheetRate.apiEndpoint,
            timesheetRate.requestBody
          );
    });

    creationRequests.push(
      ...this.removedActivities.map((activity) =>
        this.apiService.delete(activity.apiEndpoint, activity.id as string)
      )
    );

    const submitRequest = this.apiService.editForm(
      this.timeSheet.editApiEndpoint + 'submit/',
      this.timeSheet.getRequestBody(creationRequests.length > 0)
    );

    creationRequests.push(submitRequest);

    this.processing$.next(true);

    forkJoin(creationRequests)
      .pipe(finalize(() => this.processing$.next(false)))
      .subscribe(() => {
        this.close(Status.Success);
      });
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

  public activityOptionFilter(option: DropdownOption) {
    return !isHourlyWork(option.label);
  }

  private updateTimeSheet(value: any) {
    if ('shiftStartedAt' in value) {
      this.timeSheet.startedAt = value.shiftStartedAt || null;
    }

    if ('shiftEndedAt' in value) {
      this.timeSheet.endedAt = value.shiftEndedAt || null;
    }

    if ('break' in value) {
      this.timeSheet.updateBreak(value.break ? value.break.split(':') : null);
    }
  }

  private getActivities(): void {
    this.apiService
      .get(Endpoints.TimesheetRates, {
        timesheet: this.timeSheet.id,
        limit: -1,
      })
      .subscribe((response) => {
        const activities = response.results
          .map((activity: any) => new TimesheetRate(activity))
          .filter((rate: any) => !isHourlyWork(rate.worktype.__str__));
        this.formGroup.addControl(
          'activities',
          new FormArray(
            activities.map((activity: any) => this.getActivityForm(activity))
          )
        );
        this.cd.detectChanges();
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
      worktype: new FormControl(activity?.worktype, Validators.required),
    });

    form.get('worktype')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((worktype: DropdownOption) => {
        const rate = worktype.getField('skill_rate_ranges')[0]?.default_rate;

        form.get('rate')?.patchValue(rate, { emitEvent: false });
      });

    if (this.timeSheet.status === 7) {
      form.disable();
    }

    return form;
  }
}
