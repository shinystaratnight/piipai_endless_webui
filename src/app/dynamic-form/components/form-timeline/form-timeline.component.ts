import { Component, ViewChild, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { FormatString } from '../../../helpers/format';

@Component({
  selector: 'form-timeline',
  templateUrl: 'form-timeline.component.html',
  styleUrls: ['./form-timeline.component.scss']
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
  public query: any;

  public previousState: any;
  public currentState: any;

  public dropdown: boolean = false;
  public droped: boolean;

  constructor(public modalService: NgbModal) {}

  public ngOnInit() {
    this.query = [];
    this.objectEndpoint = '/ecore/api/v2/core/workflowobjects/';
    if (!this.config.hide) {
      this.initialize();
    }
  }

  public initialize() {
    let formatString = new FormatString();
    let keys = Object.keys(this.config.query);
    keys.forEach((el) => {
      if (el === 'object_id') {
        this.objectId = formatString.format(this.config.query[el], this.config.value);
        this.query.push(`${el}=${this.objectId}`);
      } else {
        this.query.push(`${el}=${this.config.query[el]}`);
      }
    });
    if (!this.config.options) {
      this.getTimeline();
    }

    if (this.config.options) {
      this.config.options.sort(
        (prev, next) => {
          if (next.state < 4) {
            if (prev.state < next.state) {
              return 1;
            }
            return -1;
          }
          return -1;
        }
      );

      if (this.dropdown) {
        this.config.options.forEach((el) => el.collapse = true);

        let state;
        for (let i = 0; i < this.config.options.length; i++) {
          if (this.config.options[i].state === 1) {
            if (state && state.state !== 1) {
              state = this.config.options[i];
            } else if (!state) {
              state = this.config.options[i];
            }
          }

          if (this.config.options[i].state === 0) {
            if (state && state.state !== 0) {
              state = this.config.options[i];
            }
          }
        }

        if (state) {
          state.collapse = false;
        }
      }
    }
  }

  public ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  public open(state): void {
    if (this.dropdown && !this.droped) {
      this.droped = true;
      this.config.options.forEach((el) => el.collapse = false);
      return;
    }

    this.modalData = {};
    if (state.state === 1 || state.state === 2) {
      this.currentState = state;
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
    this.event.emit({
      type: 'update',
      el: this.config,
      query: `?${this.query.join('&')}`
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
