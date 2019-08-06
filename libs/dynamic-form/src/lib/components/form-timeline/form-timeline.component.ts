import {
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, BehaviorSubject } from 'rxjs';

import { FormatString } from '@webui/utilities';
import { GenericFormService } from '../../services';
import { PassTestModalComponent, PassTestModalConfig } from '../../modals';
import { SiteSettingsService } from '@webui/core';
import { Endpoints } from '@webui/data';

@Component({
  selector: 'app-form-timeline',
  templateUrl: 'form-timeline.component.html',
  styleUrls: ['./form-timeline.component.scss']
})
export class FormTimelineComponent implements OnInit, OnDestroy {
  @ViewChild('stateModal', { static: false })
  public stateModal;

  public config: any;
  public modalData: any;
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
  public loading: boolean;
  public saveProcess: boolean;
  public advancedSeving: boolean;
  public answerEndpoint = '/acceptance-tests/workflowobjectanswers/';

  public passTestAction: BehaviorSubject<number>;
  public passedTests: Map<string, any[]> = new Map();

  public workflowObjectEndpoint = Endpoints.WorkflowObject;

  private subscriptions: Subscription[];

  constructor(
    public modalService: NgbModal,
    private genericFormService: GenericFormService,
    private cd: ChangeDetectorRef,
    private companySettings: SiteSettingsService
  ) {
    this.subscriptions = [];
  }

  public ngOnInit() {
    this.advancedSeving = this.companySettings.settings.company_settings.advance_state_saving;
    this.dropdown = this.config.dropdown;
    this.query = [];
    if (!this.config.hide) {
      this.initialize();
    }
    if (this.config.timelineSubject) {
      const subscription = this.config.timelineSubject.subscribe((value) => {
        if (value === 'update') {
          this.getTimeline();
          return;
        }

        if (value !== 'reset') {
          this.config.options = value;

          if (this.dropdown) {
            this.updateDropdown();
          }

          if (!(<any> this.cd).destroyed) {
            this.cd.detectChanges();
          }
        }

      });

      this.subscriptions.push(subscription);
    }
  }

  public initialize() {
    const formatString = new FormatString();
    const keys = Object.keys(this.config.query);
    const type = this.config.value.type;
    keys.forEach((el) => {
      if (el === 'object_id') {
        if (Array.isArray(this.config.query[el])) {
          if (!this.objectId && type !== 'master') {
            this.objectId = formatString.format(this.config.query[el][2], this.config.value);
          }

          this.config.query[el].forEach((query) => {
            if (!this.objectId) {
              this.objectId = formatString.format(query, this.config.value);
            }
          });
        } else {
          this.objectId = formatString.format(
            this.config.query[el],
            this.config.value
          );
        }

        this.query.push(`${el}=${this.objectId}`);
      } else {

        if (type && type === 'master') {
          this.query.push(`${el}=${this.config.query[el][1]}`);
        } else {
          if (Array.isArray(this.config.query[el])) {
            this.query.push(`${el}=${this.config.query[el][0]}`);
          } else {
            this.query.push(`${el}=${this.config.query[el]}`);
          }
        }
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
    if (this.saveProcess) {
      return;
    }
    this.modalData = {};
    if (state.state === 1 && !this.advancedSeving && !state.acceptance_tests.length && !state.substates.length) {
      state.saveProcess = true;
      this.activeState(state.id)
        .subscribe(() => {
          this.saveProcess = false;
          this.getTimeline(this.config.query.model === 'hr.job');
        });
      return;
    }

    if (state.acceptance_tests.length) {
      const tests = state.acceptance_tests.filter((test) => test.score === 0);

      if (tests.length) {
        const passTestAction = new BehaviorSubject(0);

        passTestAction.subscribe((index) => {
          const testId = tests[index].acceptance_test.id;
          this.modalRef = this.modalService.open(PassTestModalComponent);
          this.modalRef.componentInstance.config = {
            testId,
            send: false
          } as PassTestModalConfig;

          this.modalRef.result
            .then((res: any[]) => {

              if (this.passedTests.has(testId)) {
                this.passedTests.set(testId, [...this.passedTests.get(testId), ...res]);
              } else {
                this.passedTests.set(testId, res);
              }

              if (tests[index + 1]) {
                passTestAction.next(index + 1);
              } else if (this.passedTests.size === tests.length) {
                if (state.wf_object_id) {
                  const passedtests = this.updateTests(state.wf_object_id);

                  this.genericFormService.submitForm(this.answerEndpoint, passedtests)
                    .subscribe(() => {
                      this.saveProcess = false;
                      this.getTimeline(this.config.query.model === 'hr.job');
                    });
                } else {
                  this.activeState(state.id)
                    .subscribe((workflowObject) => {
                      const passedtests = this.updateTests(workflowObject.id);

                      this.genericFormService.submitForm(this.answerEndpoint, passedtests)
                        .subscribe(() => {
                          this.saveProcess = false;
                          this.getTimeline(this.config.query.model === 'hr.job');
                        });
                    });
                }
              }
            })
            .catch(() => {
              this.passedTests.clear();
            });
        });

        return;
      }
    }

    if (state.state === 1 || state.state === 2) {
      let title = '';
      if (state.state === 1) {
        title = state.name_before_activation;
      } else if (state.state === 2) {
        title = state.name_after_activation
          ? state.name_after_activation
          : state.name_before_activation;
      }
      this.modalData.id = state.wf_object_id || undefined;
      this.modalData.title = title;
      this.modalData.tests =
        state.acceptance_tests.length &&
        state.acceptance_tests.map((el) => {
          if (el.score) {
            const score = parseFloat(el.score);

            el.score = score.toFixed(2);
          }
          return el;
        });
      this.modalData.substates = state.substates.length && state.substates;
      this.modalData.workflowObject = state.wf_object_id;
      if (state.total_score) {
        const score = parseFloat(state.total_score);

        state.total_score = score.toFixed(2);
      }

      this.modalData.state = state;
      this.stateData = this.setDataForState(
        state,
        !this.modalData.tests && !this.modalData.substates
      );
      this.modalRef = this.modalService.open(this.stateModal);
    }
  }

  public updateTests(id: string) {
    const tests = [];
    Array.from(this.passedTests.values()).forEach((el) => {
      if (el) {
        el.forEach((q) => q.workflow_object = id);
        tests.push(...el);
      }
    });

    return tests;
  }

  public getTimeline(resetPage?: boolean): void {
    this.loading = true;

    this.genericFormService
      .getByQuery(this.config.endpoint, `?${this.query.join('&')}`)
      .subscribe(
        (res) => {
          this.loading = false;
          this.config.timelineSubject.next(resetPage ? 'reset' : res);
        },
        (err: any) => (this.loading = false)
      );
  }

  public setDataForState(state, hideScore) {
    const fields = ['object_id', 'state', 'active'];
    const result = {};
    fields.forEach((el) => {
      const value =
        el === 'state' ? state.id : el === 'object_id' ? this.objectId : true;
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

    result['score'] = {
      action: 'add',
      data: {
        editForm: true,
        hide: hideScore,
        send: false,
        value: 5
      }
    };

    return result;
  }

  public sendEventHandler(e, closeModal): void {
    if (e.type === 'saveStart') {
      this.saveProcess = true;
    }
    if (e.status === 'success') {
      closeModal();
      this.saveProcess = false;
      this.getTimeline(this.config.query.model === 'hr.job');
      this.modalData = null;
    }
  }

  public formError() {
    this.saveProcess = false;
  }

  public fillinTest(e, id: string, closeModal) {
    e.preventDefault();
    e.stopPropagation();
    closeModal();

    this.testId = id;

    if (!this.modalData.workflowObject) {
      this.createWorkflowObject(this.modalData.state.id);

      return;
    }

    this.modalRef = this.modalService.open(PassTestModalComponent);
    this.modalRef.componentInstance.config = {
      send: true,
      testId: id,
      workflowObject: this.modalData.workflowObject
    } as PassTestModalConfig;
  }

  public createWorkflowObject(stateId: string) {
    const body = {
      object_id: this.objectId,
      state: {
        id: stateId
      },
      comment: null,
      active: false
    };

    this.genericFormService
      .submitForm(this.workflowObjectEndpoint, body)
      .subscribe((res) => {
        this.modalData.state.wf_object_id = res.id;
        this.modalData.workflowObject = res.id;

        this.modalRef = this.modalService.open(PassTestModalComponent);
        this.modalRef.componentInstance.config = {
          send: true,
          testId: res.id,
          workflowObject: this.modalData.workflowObject
        } as PassTestModalConfig;
      });
  }

  public activeState(stateId: string) {
    this.saveProcess = true;
    const body = {
      object_id: this.objectId,
      state: {
        id: stateId
      },
      comment: null,
      active: true
    };

    return this.genericFormService
      .submitForm(this.workflowObjectEndpoint, body);
  }

  public testComplete(closeModal) {
    closeModal();

    this.getTimeline();
    this.modalData = null;
  }

  public calculateProgress(state) {
    if (state.substates && state.substates.length) {
      const substatesCount = state.substates.length;

      let activeCount = 0;

      state.substates.forEach((el) => {
        if (el.state === 2 || el.state === 3) {
          activeCount += 1;
        }
      });

      return `${activeCount} / ${substatesCount}`;
    }
  }
}