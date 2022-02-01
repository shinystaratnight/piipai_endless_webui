import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TimeSheet } from '@webui/data';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

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

  public get formInvalid(): boolean {
    return this.formGroup.invalid;
  }

  public get destroy$(): Observable<void> {
    return this.destroy.asObservable();
  }

  constructor() { }

   public ngOnInit(): void {
    this.workSheet = new TimeSheet(this.data);

    this.formGroup = new FormGroup({
      pictures: new FormControl(''),
    });
  }

  public ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  public submit() {

  }

}
