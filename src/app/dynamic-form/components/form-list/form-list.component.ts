import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { FormatString } from '../../../helpers/format';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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

  public update: BehaviorSubject<boolean>;
  public query: string;

  constructor(
    private modal: NgbModal
  ) { }

  public ngOnInit() {
    if (!this.config.hide) {
      this.initialize();
    }
  }

  public initialize(): void {
    this.update = new BehaviorSubject(false);
    this.isCollapsed = this.config.collapsed ? this.config.collapsed : false;
    if (this.config.query) {
      let queryKeys = Object.keys(this.config.query);
      let queryArray = [];
      queryKeys.forEach((el) => {
        queryArray.push(`${el}=${this.config.query[el]}`);
      });
      this.query = queryArray.join('&');
    }
  }

  public ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  public addObject() {
    this.modalData = {};
    this.modalData.title = this.config.templateOptions.add_label;
    this.modalData.endpoint = this.config.add_endpoint || this.config.endpoint;
    if (this.config.prefilled) {
      this.modalData.data = {};
      const keys = Object.keys(this.config.prefilled);
      keys.forEach((el) => {
        this.modalData.data[el] = {
          action: 'add',
          data: {
            value: this.config.prefilled[el],
            read_only: true,
            editForm: true
          }
        };
      });
    }
    this.modalRef = this.modal.open(this.modalTemplate, {size: 'lg'});
  }

  public formEvent(e, closeModal) {
    if (e.type === 'sendForm' && e.status === 'success') {
      closeModal();
      this.updateList();
    }
  }

  public updateList() {
    this.update.next(true);
  }
}
