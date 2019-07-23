import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { GenericFormService } from './../../dynamic-form/services/generic-form.service';

@Component({
  selector: 'app-form-builder',
  templateUrl: 'form-builder.component.html'
})

export class FormBuilderComponent {

  @Input()
  public endpoint: string;

  @Input()
  public id: string;

  @Input()
  public path: string;

  @ViewChild('modal', { static: false })
  public modalTemplate: ElementRef;

  @Output()
  public str: EventEmitter<any> = new EventEmitter();

  public label: string;
  public previewLink: string;
  public data: any;
  public error: any;
  public config: any;
  public modalRef: NgbModalRef;

  public links: any[];
  public domain = location.origin;
  public formLink: string;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private genericFormService: GenericFormService
  ) {
    this.formLink = location.origin + '/registration';
  }

  public eventHandler(event: any) {
    if (event.type === 'sendForm' && event.status === 'success' && !this.id) {
      this.id = event.data.id;
      this.links = event.data.company_links;
      this.label = event.data.__str__;
      if (event.data.groups && !event.data.groups.length) {
        this.data = {
          groups: {
            action: 'add',
            data: {
              fields: [...event.data.model_fields, ...event.data.extra_fields]
            }
          },
          id: {
            action: 'add',
            data: {
              value: event.data.id
            }
          }
        };
      }
      this.str.emit({
        str: event.data.__str__
      });
    } else if (event.type === 'sendForm' && event.status === 'success' && this.id) {
      this.router.navigate([this.path]);
    }
  }

  public eventForm(e) {
    if (e && e.data) {
      this.label = e.data.__str__;
      this.links = e.data.company_links;
      this.data = {
        groups: {
          action: 'add',
          data: {
            fields: [...e.data.model_fields, ...e.data.extra_fields],
            id: e.data.id
          }
        }
      };
      this.str.emit({
        str: e.data.__str__
      });
    } else if (e.str) {
      this.str.emit({
        str: e.str
      });
    }
  }

  public showPreview() {
    this.modalRef = this.modalService.open(this.modalTemplate);

    return false;
  }

  public setFormConfig(config) {
    this.config = config;
  }

  public delete() {
    if (this.id) {
      this.genericFormService.delete(this.endpoint, this.id).subscribe(
        (res: any) => {
          this.router.navigate([this.path]);
        },
        (err: any) => this.error = err
      );
    }
  }
}
