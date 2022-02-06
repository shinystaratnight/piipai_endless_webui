import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TimeSheet } from '@webui/data';
import { Icon, IconSize } from '@webui/icon';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

interface ICell {
  content: string;
}

interface IRow {
  cells: ICell[];
}

interface ITable {
  rows: IRow[];
  head: string[];
}

@Component({
  selector: 'app-approve-worksheet-modal',
  templateUrl: './approve-worksheet-modal.component.html',
  styleUrls: ['./approve-worksheet-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApproveWorksheetModalComponent implements OnInit, OnDestroy {
  private destroy: Subject<void> = new Subject<void>();
  public data: any;
  public workSheet: TimeSheet;
  public processing$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public formGroup?: FormGroup;
  public Icon = Icon;
  public IconSize = IconSize;

  public get formInvalid(): boolean {
    return this.formGroup.invalid;
  }

  public get destroy$(): Observable<void> {
    return this.destroy.asObservable();
  }

  public get timeTable(): ITable {
    if (this.workSheet) {
      return {
        head: ['start_time', 'end_time', 'break_time'],
        rows: [
          {
            cells: [
              { content: this.workSheet.format.startedAt },
              { content: this.workSheet.format.endedAt },
              { content: this.workSheet.format.breakTime },
            ]
          }
        ]
      }
    }
  }

  public get activityTable(): ITable {
    if (this.workSheet) {
      return {
        head: ['activity', 'amount'],
        rows: [
          {
            cells: [
              { content: '121'},
              { content: '122'},
            ]
          },
          {
            cells: [
              { content: '121'},
              { content: '122'},
            ]
          }
        ]
      }
    }
  }

  constructor() { }

   public ngOnInit(): void {
    this.workSheet = new TimeSheet(this.data);

    this.formGroup = new FormGroup({
      pictures: new FormControl(''),
      note: new FormControl('')
    });
  }

  public ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  public submit() {

  }

  public addTime(): void {

  }

  public addActivity(): void {

  }

}
