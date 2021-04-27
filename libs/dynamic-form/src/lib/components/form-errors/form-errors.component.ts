import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Form, IFormErrors } from '@webui/dynamic-form';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormService } from '../../services';

interface IObjectExistError {
  description: string;
  href: string;
  title: string;
}

@Component({
  selector: 'app-form-errors',
  templateUrl: './form-errors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormErrorsComponent implements OnInit, OnDestroy {
  private _details$: BehaviorSubject<string[]> = new BehaviorSubject(null);
  private _objectExistError$: BehaviorSubject<IObjectExistError> = new BehaviorSubject(
    null
  );

  get errorList$() {
    return this._details$.asObservable();
  }

  get objectExistError$() {
    return this._objectExistError$.asObservable();
  }

  @Input() formId: number;

  private errorSubscription: Subscription;

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
    this.errorSubscription.unsubscribe();
  }

  private updateErrors(errors: IFormErrors) {
    const { detail, non_field_errors } = errors;
    let details = [];
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
    this._details$.next(!!errorList.length ? errorList : null);
  }
}
