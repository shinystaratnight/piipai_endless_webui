import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { GenericFormService } from '../../services/generic-form.service';
import { FormatString } from '../../../helpers/format';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

@Component({
  selector: 'form-list',
  templateUrl: 'form-list.component.html'
})

export class FormListComponent implements OnInit, OnDestroy {

  @ViewChild('modal')
  public modalTemplate: any;

  public isCollapsed: boolean;

  public config;
  public errors: any;
  public message: any;
  public key: any;
  public label: boolean;

  public modalData: any;
  public format = new FormatString();

  public modalRef: NgbModalRef;

  constructor(
    private gfs: GenericFormService,
    private modal: NgbModal
  ) { }

  public ngOnInit() {
    this.isCollapsed = this.config.collapsed ? this.config.collapsed : false;
  }

  public ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  public addObject() {
    this.modalData = {};
    this.modalData.endpoint = this.config.endpoint;
    this.modalData.query = this.config.query;
    this.modalData.data = {
      [this.config.field.name]: {
        action: 'add',
        data: {
          value: this.config.field.value,
          read_only: true,
          editForm: true
        }
      }
    };
    this.modalRef = this.modal.open(this.modalTemplate, {size: 'lg'});
  }

  public formEvent(e, closeModal) {
    if (e.type === 'sendForm' && e.status === 'success') {
      closeModal();
    }
  }
}
