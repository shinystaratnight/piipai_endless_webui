import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { GenericFormService } from './../../dynamic-form/services/generic-form.service';

@Component({
  selector: 'form-builder',
  templateUrl: 'form-builder.component.html'
})

export class FormBuilderComponent {

  @Input()
  public endpoint: string;

  @Input()
  public id: string;

  @Input()
  public path: string;

  public label: string;
  public previewLink: string;
  public data: any;

  constructor(
    private router: Router,
    private genericFormService: GenericFormService
  ) {}

  public eventHandler(event: any) {
    if (event.type === 'sendForm' && event.status === 'success') {
      this.id = event.data.id;
      this.label = event.data.__str__;
      this.previewLink = `/ecore/form-builds/${this.id}/`;
      this.data = {
        groups: {
          action: 'add',
          data: {
            fields: event.data.model_fields
          }
        }
      };
    }
  }

  public eventForm(e) {
    if (e && e.data) {
      this.label = e.data.__str__;
      this.previewLink = `/ecore/form-builds/${e.data.id}/`;
      this.data = {
        groups: {
          action: 'add',
          data: {
            fields: e.data.model_fields,
            id: e.data.id
          }
        }
      };
    }
  }

  public delete() {
    if (this.id) {
      this.genericFormService.delete(this.endpoint, this.id).subscribe(
        (res: any) => {
          this.router.navigate([this.path]);
        }
      );
    }
  }
}
