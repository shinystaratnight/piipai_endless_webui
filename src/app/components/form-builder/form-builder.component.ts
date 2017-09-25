import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { GenericFormService } from './../../dynamic-form/services/generic-form.service';

@Component({
  selector: 'form-builder',
  templateUrl: 'form-builder.component.html'
})

export class FormBuilderComponent {

  public formEndpoint: string = '/ecore/api/v2/endless-core/forms/';
  public id: string;
  public label: string;
  public previewLink: string;

  constructor(
    private router: Router,
    private genericFormService: GenericFormService
  ) {}

  public eventHandler(event: any) {
    if (event.type === 'sendForm' && event.status === 'success') {
      this.id = event.data.id;
      this.label = event.data.__str__;
      this.previewLink = `/ecore/form-builds/${this.id}/`;
    }
  }

  public delete() {
    if (this.id) {
      this.genericFormService.delete(this.formEndpoint, this.id).subscribe(
        (res: any) => {
          this.router.navigate(['/']);
        }
      );
    }
  }
}
