import { Component, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';

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

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  public isCollapsed: boolean;

  public config;
  public errors: any;
  public message: any;
  public key: any;
  public label: boolean;
  public count: number;

  public modalData: any;
  public format = new FormatString();

  public modalRef: NgbModalRef;

  public update: BehaviorSubject<boolean>;
  public query: string;
  public showButton: boolean;

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
    if (this.config.delay) {
      this.config.data = {
        length: 0,
        results: [],
        sendData: []
      };
      this.config.delayData[this.config.endpoint] = this.config;
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
            value: this.config.delay ? undefined : this.config.prefilled[el],
            read_only: true,
            editForm: true,
            hide: this.config.delay
          }
        };
      });
    }
    this.modalRef = this.modal.open(this.modalTemplate, {size: 'lg'});
  }

  public formEvent(e, closeModal) {
    if (e.type === 'sendForm' && e.status === 'success') {
      closeModal();
      this.updateList(e);
    }
  }

  public updateList(event) {
    if (this.config.delay) {
      this.config.data.sendData.push(event.sendData);
      this.config.data.results.push(event.viewData);
      this.config.data.length = this.config.data.length;
    }
    this.update.next(true);
  }

  public checkedHandler(e) {
    this.event.emit(e);
  }

  public eventHandler(e) {
    if (e) {
      this.config.templateOptions.label = e.__str__;
    }
  }

  public checkCount(e: number): void {
    this.count = e;
    if (this.config.max) {
      this.showButton = this.config.templateOptions.add_label && this.config.max > this.count;
    } else {
      this.showButton = this.config.templateOptions.add_label;
    }
  }
}
