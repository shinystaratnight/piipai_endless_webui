import { ChangeDetectionStrategy, Component, Input, OnChanges } from "@angular/core";

interface IFormErrors {
  non_field_errors?: string[] | string;
  detail?: string;
}

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
export class FormErrorsComponent implements OnChanges {
  details: string[] = [];
  objectExistError: IObjectExistError;

  @Input() keys: string[];
  @Input() errors: IFormErrors;

  ngOnChanges() {
    this.updateErrors();
  }

  private updateErrors() {
    const { detail, non_field_errors } = this.errors;
    this.objectExistError = null;
    this.details = [];

    if (Array.isArray(non_field_errors) && non_field_errors.length > 1) {
      if (non_field_errors[0]) {
        const [exist, description, title, href] = non_field_errors;

        this.objectExistError = {
          description,
          href,
          title,
        };
      } else {
        this.details = non_field_errors.filter(el => el);
      }
    } else if (detail) {
      this.details.push(detail);
    } else if (non_field_errors) {
      this.details.push(Array.isArray(non_field_errors) ? non_field_errors[0]: non_field_errors);
    }
  }

}
