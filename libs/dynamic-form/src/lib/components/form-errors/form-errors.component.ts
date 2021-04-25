import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Form, IFormErrors } from '@webui/dynamic-form';
import { Subscription } from 'rxjs';
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
  details: string[] = [];
  objectExistError: IObjectExistError;

  @Input() formId: number;

  private errorSubscription: Subscription;

  constructor(private formService: FormService) {}

  ngOnInit() {
    const currentForm: Form = this.formService.getForm(this.formId);
    this.errorSubscription = currentForm.errors$.subscribe(this.updateErrors);
  }

  ngOnDestroy() {
    this.errorSubscription.unsubscribe();
  }

  private updateErrors(errors: IFormErrors) {
    const { detail, non_field_errors } = errors;
    let details = [];
    this.objectExistError = null;

    if (Array.isArray(non_field_errors) && non_field_errors.length > 1) {
      if (non_field_errors[0]) {
        const [, description, title, href] = non_field_errors;

        this.objectExistError = {
          description,
          href,
          title
        };
      } else {
        details = non_field_errors.filter((el) => el);
      }
    } else if (detail) {
      details.push(detail);
    } else if (non_field_errors) {
      details.push(non_field_errors as string);
    }

    this.details = details.filter((el) => !!el);
  }
}
