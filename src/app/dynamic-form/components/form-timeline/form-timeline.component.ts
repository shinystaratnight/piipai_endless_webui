import { Component, ViewChild, OnInit, EventEmitter, Output } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'form-timeline',
  templateUrl: 'form-timeline.component.html'
})

export class FormTimelineComponent implements OnInit {

  @ViewChild('stateModal')
  public stateModal;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  public config: any;
  public modalData: any;
  public objectEndpoint: string;
  public stateData: any = {};
  public requirements: any[];

  constructor(public modalService: NgbModal) {}

  public ngOnInit() {
    this.modalData = {};
    this.objectEndpoint = '/ecore/api/v2/endless-core/workflowobjects/';
    this.getTimeline();
  }

  public open(state) {
    if (state.state === 1 || state.state === 2) {
      let title = '';
      if (state.state === 1) {
        title = state.name_before_activation;
      } else if (state.state === 2) {
        title = (state.name_after_activation) ? state.name_after_activation
          : state.name_before_activation;
      } else if (state.state === 4) {
        this.requirements = state.requirements;
        return;
      }
      this.modalData.title = title;
      this.stateData = this.setDataForState(state);
      this.modalService.open(this.stateModal, {size: 'lg'});
    }
  }

  public getTimeline() {
    let query = this.config.query.map((el) => {
      return `${el}=${this.config[el]}`;
    });
    this.event.emit({
      type: 'update',
      el: this.config,
      query: `?${query.join('&')}`
    });
  }

  public setDataForState(state) {
    let fields = ['object_id', 'state', 'active'];
    let result = {};
    fields.forEach((el) => {
      let value = (el === 'state') ? state.id : (el === 'object_id') ? this.config[el] : true;
      fields[el] = {
        action: 'add',
        data: {
          read_only: true,
          value,
          readonly: true
        }
      };
    });
    return fields;
  }

  public sendEventHandler(e, closeModal) {
    if (e.status === 'success') {
      closeModal();
      this.getTimeline();
    }
  }

}
