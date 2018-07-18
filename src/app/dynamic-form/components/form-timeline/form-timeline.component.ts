import {
  Component,
  ViewChild,
  OnInit,
  Output,
  OnDestroy,
  ViewEncapsulation,
  ChangeDetectorRef
} from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';

import { FormatString } from '../../../helpers/format';
import { GenericFormService } from '../../services';

@Component({
  selector: 'form-timeline',
  templateUrl: 'form-timeline.component.html',
  styleUrls: ['./form-timeline.component.scss']
})

export class FormTimelineComponent implements OnInit, OnDestroy {

  @ViewChild('stateModal') public stateModal;
  @ViewChild('test') public testModal;

  public config: any;
  public modalData: any;
  public objectEndpoint: string;
  public stateData: any = {};
  public requirements: any[];
  public modalRef: NgbModalRef;
  public objectId: string;
  public query: any;
  public testId: string;

  public currentState: any;

  public dropdown: boolean;
  public selectArray: any[];
  public updated: boolean;

  private subscriptions: Subscription[];

  constructor(
    public modalService: NgbModal,
    private genericFormService: GenericFormService,
    private cd: ChangeDetectorRef
  ) {
    this.subscriptions = [];
  }

  public ngOnInit() {
    this.dropdown = this.config.dropdown;
    this.query = [];
    this.objectEndpoint = '/ecore/api/v2/core/workflowobjects/';
    if (!this.config.hide) {
      this.initialize();
    }
    if (this.config.timelineSubject) {
      const subscription = this.config.timelineSubject.subscribe((value) => {
        this.config.options = value;

        if (this.dropdown) {
          this.updateDropdown();
        }

        this.cd.detectChanges();
      });

      this.subscriptions.push(subscription);
    }
  }

  public initialize() {
    let formatString = new FormatString();
    let keys = Object.keys(this.config.query);
    keys.forEach((el) => {
      if (el === 'object_id') {
        if (Array.isArray(this.config.query[el])) {
          this.config.query[el].forEach((query) => {
            if (!this.objectId) {
              this.objectId = formatString.format(query, this.config.value);
            }
          });
        } else {
          this.objectId = formatString.format(this.config.query[el], this.config.value);
        }

        this.query.push(`${el}=${this.objectId}`);
      } else {
        this.query.push(`${el}=${this.config.query[el]}`);
      }
    });
    if (!this.config.options) {
      this.getTimeline();
    }
  }

  public updateDropdown() {
    if (this.dropdown) {
      this.selectArray = this.config.options.filter((el) => {
        return el.state < 3;
      });

      let key = 0;
      const setKey = false;
      this.selectArray.forEach((el, i) => {
        if (el.state === 2) {
          key = i;
        }
      });

      if (key === 0 && !setKey) {
        this.selectArray.forEach((el, i) => {
          if (el.state === 1 && key === 0) {
            key = i;
          }
        });
      }
      this.currentState = this.selectArray[key] && this.selectArray[key].id;
    }
  }

  public getState(state: string): any {
    if (this.config.options) {
      return this.config.options.find((el) => el.id === state);
    }
  }

  public ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }

    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }

  public open(state, closeModal?): void {
    if (closeModal) {
      closeModal();
    }
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
      this.modalData.tests = state.acceptance_tests.length && state.acceptance_tests;
      this.modalData.substates = state.substates.length && state.substates;
      this.modalData.workflowObject = state.wf_object_id;
      this.stateData = this.setDataForState(state);
      this.modalRef = this.modalService.open(this.stateModal, {size: 'lg'});
    }
  }

  public getTimeline(): void {

    this.genericFormService.getByQuery(this.config.endpoint, `?${this.query.join('&')}`)
      .subscribe((res) => {
        this.config.timelineSubject.next(res);
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

  public fillinTest(id: string) {
    this.testId = id;

    this.modalRef = this.modalService.open(this.testModal, { size: 'lg'});
  }

}
