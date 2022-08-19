import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Form, IFormErrors } from '../../models';
import { FormService } from '../../services';

interface IObjectExistError {
  description: string;
  href: string;
  title: string;
}

@Component({
  selector: 'webui-form-errors',
  templateUrl: './form-errors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormErrorsComponent implements OnInit, OnDestroy {
  private _details$: BehaviorSubject<string[] | null> = new BehaviorSubject<string[] | null>(null);
  private _objectExistError$: BehaviorSubject<IObjectExistError | null> = new BehaviorSubject<IObjectExistError | null>(null);

  get errorList$() {
    return this._details$.asObservable();
  }

  get objectExistError$() {
    return this._objectExistError$.asObservable();
  }

  @Input() formId!: number;

  private errorSubscription!: Subscription;

  constructor(private formService: FormService) {}

  ngOnInit() {
    const currentForm: Form = this.formService.getForm(this.formId);
    if (currentForm) {
      this.errorSubscription = currentForm.errors$.subscribe(
        (errors: IFormErrors) => this.updateErrors(errors)
      );
    }
  }

  ngOnDestroy() {
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
  }

  private updateErrors(errors: IFormErrors) {
    const { detail, non_field_errors } = errors;
    let details: string[] = [];
    let objectExistError = null;

    if (Array.isArray(non_field_errors)) {
      if (non_field_errors.length > 1) {
        if (non_field_errors[0]) {
          const [, description, title, href] = non_field_errors;

          objectExistError = {
            description,
            href,
            title
          };
        } else {
          details = non_field_errors.filter((el) => !!el);
        }
      } else {
        details = [...non_field_errors];
      }
    }

    if (detail) {
      details.push(detail);
    }

    if (
      typeof non_field_errors === 'string' &&
      non_field_errors.trim().length
    ) {
      details.push(non_field_errors);
    }

    const errorList = details.filter((el) => !!el && !!el.trim());

    this._objectExistError$.next(objectExistError);
    this._details$.next(errorList.length ? errorList : null);
  }
}
