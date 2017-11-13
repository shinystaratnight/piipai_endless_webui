import { Component, ViewChild, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { FormatString } from '../../../helpers/format';

@Component({
  selector: 'form-timeline',
  templateUrl: 'form-timeline.component.html'
})

export class FormTimelineComponent implements OnInit, OnDestroy {

  @ViewChild('stateModal')
  public stateModal;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  public config: any;
  public modalData: any;
  public objectEndpoint: string;
  public stateData: any = {};
  public requirements: any[];
  public modalRef: any;
  public objectId: string;

  constructor(public modalService: NgbModal) {}

  public ngOnInit() {
    this.objectEndpoint = '/ecore/api/v2/core/workflowobjects/';
    if (!this.config.options) {
      this.getTimeline();
    }
  }

  public ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  public open(state): void {
    this.modalData = {};
    if (state.state === 1 || state.state === 2) {
      let title = '';
      if (state.state === 1) {
        title = state.name_before_activation;
      } else if (state.state === 2) {
        title = (state.name_after_activation) ? state.name_after_activation
          : state.name_before_activation;
        this.modalData.id = state.wf_object_id;
      }
      this.modalData.title = title;
      this.stateData = this.setDataForState(state);
      this.modalRef = this.modalService.open(this.stateModal, {size: 'lg'});
    }
  }

  public getTimeline(): void {
    let formatString = new FormatString();
    let query = this.config.query.map((el) => {
      if (el === 'object_id') {
        if (!this.objectId) {
          this.objectId = formatString.format(this.config[el], this.config.value);
        }
        return `${el}=${this.objectId}`;
      }
      return `${el}=${this.config[el]}`;
    });
    this.event.emit({
      type: 'update',
      el: this.config,
      query: `?${query.join('&')}`
    });
  }

  public setDataForState(state): {} {
    let fields = ['object_id', 'state', 'active'];
    let result = {};
    fields.forEach((el) => {
      let value = (el === 'state') ? state.id : (el === 'object_id') ? this.objectId : true;
      result[el] = {
        action: 'add',
        data: {
          read_only: el === 'active' ? false : true,
          value,
          readonly: true,
          editForm: true
        }
      };
    });
    return result;
  }

  public sendEventHandler(e, closeModal): void {
    if (e.status === 'success') {
      closeModal();
      this.getTimeline();
      this.modalData = null;
    }
  }

}
