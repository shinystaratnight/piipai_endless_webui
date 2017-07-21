import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'form-timeline',
  templateUrl: 'form-timeline.component.html'
})

export class FormTimelineComponent implements OnInit {

  @ViewChild('stateModal')
  public stateModal;

  public config: any;
  public modalData: any;
  public objectEndpoint: string;

  constructor(public modalService: NgbModal) {}

  public ngOnInit() {
    this.modalData = {};
    this.objectEndpoint = '/ecore/api/v2/endless-core/workflowobjects/';
  }

  public open(state) {
    if (state.state === 1 || state.state === 2) {
      let title = '';
      if (state.state === 1) {
        title = state.name_before_activation;
      } else if (state.state === 2) {
        title = (state.name_after_activation) ? state.name_after_activation
          : state.name_before_activation;
      }
      this.modalData.title = title;
      this.modalService.open(this.stateModal);
    }
  }

}
