import { FormGroup } from '@angular/forms';
import { BehaviorSubject, catchError, finalize, Observable, tap, throwError } from 'rxjs';

export class FormElement {
  private _saving = new BehaviorSubject<boolean>(false);
  private _errors = new BehaviorSubject<Record<string, string> | null>(null);

  readonly formGroup!: FormGroup;
  readonly saving$ = this._saving.asObservable();
  readonly errors$ = this._errors.asObservable();

  get formInvalid() {
    return this.formGroup.invalid;
  }

  submitForm<T>(request: () => Observable<T>) {
    this._saving.next(true);
    this._errors.next(null);

    return request().pipe(
      finalize(() => this._saving.next(false)),
      catchError((error) => {
        this._errors.next(error.errors);

        return throwError(() => error);
      })
    );
  }
}
