import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TimeSheet } from '@webui/data';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { GenericFormService } from '../../services';
import { Modal, Status } from '../modal/modal.component';

@Component({
  selector: 'webui-evaluate-candidate-modal',
  templateUrl: './evaluate-candidate-modal.component.html',
  styleUrls: ['./evaluate-candidate-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateCandidateModalComponent extends Modal implements OnInit, OnDestroy {
  private destroy: Subject<void> = new Subject<void>();
  public data: any;
  public endpoint!: string;
  public timeSheet!: TimeSheet;
  public processing$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public formGroup!: FormGroup;

  public get formInvalid(): boolean {
    return !!this.formGroup?.invalid;
  }

  public get destroy$(): Observable<void> {
    return this.destroy.asObservable();
  }

  constructor(private service: GenericFormService, modal: NgbActiveModal) {
    super(modal);
  }

  ngOnInit(): void {
    this.timeSheet = new TimeSheet(this.data);

    this.formGroup = new FormGroup({
      rating: new FormControl(
        this.timeSheet.evaluation
          ? this.timeSheet.evaluation.evaluation_score
          : 5
      )
    });
  }

  public ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  public evaluate() {
    this.processing$.next(true);

    this.service
      .editForm(this.endpoint, {
        evaluation_score: this.formGroup.value.rating
      })
      .pipe(finalize(() => this.processing$.next(false)))
      .subscribe(
        () => this.close(Status.Success),
        (err) => console.error(err)
      );
  }
}
