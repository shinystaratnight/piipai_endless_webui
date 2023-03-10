import { FormGroup } from '@angular/forms';
import {
  BehaviorSubject,
  catchError,
  finalize,
  Observable,
  throwError,
} from 'rxjs';

export class FormElement {
  private _saving = new BehaviorSubject<boolean>(false);
  private _errors = new BehaviorSubject<Record<string, string> | null>(null);

  readonly formGroup!: FormGroup;
  readonly saving$ = this._saving.asObservable();
  readonly errors$ = this._errors.asObservable();

  init() {
    this.subscribeOnChanges();
  }

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

  private subscribeOnChanges() {
    this.formGroup.valueChanges.subscribe(() => {
      const errors: Record<string, string> = {};

      for (const key in this.formGroup.controls) {
        if (
          this.formGroup.get(key)?.untouched &&
          this.formGroup.get(key)?.pristine
        ) {
          continue;
        }

        const getError = (errors?: Record<string, string> | null) => {
          return errors
            ? Object.keys(errors).reduce((acc, prev) => errors[prev], '')
            : '';
        };

        errors[key] = getError(this.formGroup.get(key)?.errors);
      }

      this._errors.next(errors);
    });
  }
}
