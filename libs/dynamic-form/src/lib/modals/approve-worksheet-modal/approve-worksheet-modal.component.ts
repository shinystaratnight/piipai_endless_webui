import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TimeSheet } from '@webui/data';
import { DatepickerType } from '@webui/form-controls';
import { Icon, IconSize } from '@webui/icon';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ITable } from './entity-list/entity-list.component';

type ViewType = 'list' | 'form' | undefined;

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

  public get formInvalid(): boolean {
    return this.formGroup.invalid;
  }

  public get timeInvalid(): boolean {
    return this.formGroup.get('times').invalid;
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
    if (this.timeSheet) {
      return {
        head: ['activity', 'amount'],
        rows: [
          {
            cells: [{ content: '121' }, { content: '122' }]
          },
          {
            cells: [{ content: '121' }, { content: '122' }]
          }
        ]
      };
    }
  }

  constructor() {}

  public ngOnInit(): void {
    this.timeSheet = new TimeSheet(this.data);

    if (this.timeSheet.endedAt) {
      this.timeViewType.next('list');
    }

    this.formGroup = new FormGroup({
      pictures: new FormControl(''),
      note: new FormControl(''),
    });
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

  public addActivity(): void {}

  public saveTime(): void {
    const value = this.formGroup.get('times').value;
    this.updateTimeSheet(value);
    this.formGroup.removeControl('times');

    this.timeViewType.next('list');
  }

  public cancelTimeEditing() {
    this.timeViewType.next(this.timeSheet.endedAt ? 'list' : undefined);
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
}
