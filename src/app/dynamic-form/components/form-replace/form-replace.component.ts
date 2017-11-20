import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { BasicElementComponent } from '../basic-element/basic-element.component';
import { FormatString } from '../../../helpers/format';
import { GenericFormService } from '../../services/generic-form.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { ViewChild } from '@angular/core/src/metadata/di';

@Component({
  selector: 'form-replace',
  templateUrl: 'form-replace.component.html'
})

export class FormReplaceComponent extends BasicElementComponent implements OnInit, OnDestroy {

  @ViewChild('modal')
  public modalTemplate: any;

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;
  public label: boolean;

  public metadata: any;
  public selfGroup: any;

  public modalData: any;
  public modalRef: any;

  constructor(
    private fb: FormBuilder,
    private gfs: GenericFormService,
    private modal: NgbModal
  ) {
    super();
  }

  public ngOnInit() {
    this.metadata = [];
    this.selfGroup = this.fb.group({});
    this.modalData = {};
    this.addControl(this.config, this.fb);
    this.generateMetadata(this.config.replace_by);
  }

  public ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  public generateMetadata(array: any[]) {
    array.forEach((el) => {
      let element = Object.keys(el)[0];
      let key = el[element];
      let value = this.getValueByKey(key, this.config.data);
      if (value) {
        let format = new FormatString();
        let elConfig = Object.assign(this.config.elements[element]);
        if (elConfig.endpoint) {
          elConfig.endpoint = format.format(elConfig.endpoint, this.config.data);
          if (elConfig.query) {
            elConfig.query = format.format(elConfig.query, this.config.data);
          }
        }
        if (elConfig.id) {
          elConfig.id = format.format(elConfig.query, this.config.data);
        }
        if (elConfig.key) {
          elConfig.value = this.getValueByKey(elConfig.key, this.config.data);
        }
        this.metadata.push(elConfig);
      }
    });
  }

  public getValueByKey(key: string, data: any): any {
    let keysArray = key.split('.');
    let firstKey = keysArray.shift();
    if (keysArray.length === 0) {
      return data[firstKey];
    } else if (keysArray.length > 0) {
      let combineKeys = keysArray.join('.');
      return this.getValueByKey(combineKeys, data[firstKey]);
    }
  }

  public eventHandler(event): void {
    let endpoint: string;
    let query: string;
    if (event.target && event.target === 'form') {
      endpoint = event.endpoint;
      query = event.query;
      this[`${event.action}Action`](endpoint, query, event.el);
    }
    if (event.type && event.type === 'click') {
      endpoint = event.el.endpoint;
      query = event.el.query;
      this[`${event.action}Action`](endpoint, query, event.el);
    }
  }

  public addAction(endpoint: string, query: string = undefined, el): void {
    if (query) {
      endpoint += `?${query}`;
    }
    this.modalData = {};
    this.modalData.endpoint = endpoint;
    this.modalData.el = el;
    this.modalRef.open(this.modalTemplate, {size: 'lg'});
  }

  public sendAction(endpoint: string, query: string): void {
    if (query) {
      endpoint += `?${query}`;
      this.gfs.getByQuery(endpoint, query).subscribe(
        (res: any) => {
          this.gfs.getAll(this.config.formEndpoint).subscribe(
            (response: any) => {
              this.config.data = response;
              this.generateMetadata(this.config.replace_by);
            }
          );
        }
      );
    } else {
      return;
    }
  }

  public editAction(endpoint: string, query: string, el: any) {
    this.modalData = {};
    this.modalData.endpoint = endpoint;
    this.modalData.id = el.id;
    this.modalData.el = el;
    this.modalRef.open(this.modalTemplate, {size: 'lg'});
  }

  public deleteAction(endpoint: string, query: string, el) {
    this.modalData = {};
    this.modalData.type = 'delete';
    this.modalData.endpoint = endpoint;
    this.modalData.id = el.id;
    this.modalData.el = el;
    this.modalRef.open(this.modalTemplate, {size: 'lg'});
  }

  public deleteElement(closeModal) {
    closeModal();
    this.gfs.delete(this.modalData.endpoint, this.modalData.id).subscribe(
      (res: any) => {
        this.gfs.getAll(this.config.formEndpoint).subscribe(
          (response: any) => {
            this.config.data = response;
            this.generateMetadata(this.config.replace_by);
          }
        );
      }
    );
  }

  public formEvent(e, closeModal, el) {
    if (e.type === 'sendForm' && e.status === 'success') {
      closeModal();
      this.gfs.getAll(this.config.formEndpoint).subscribe(
        (res: any) => {
          this.config.data = res;
          this.generateMetadata(this.config.replace_by);
        }
      );
    }
  }
}
