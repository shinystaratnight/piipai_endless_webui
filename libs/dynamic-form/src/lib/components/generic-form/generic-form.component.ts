import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import isObject from 'isobject';

import { BehaviorSubject, Subject, Subscription, forkJoin, of } from 'rxjs';
import { finalize, skip, catchError } from 'rxjs/operators';

import {
  UserService,
  SiteSettingsService,
  AuthService,
  CompanyPurposeService,
  ToastService,
  MessageType
} from '@webui/core';
import { Field, Purpose, Endpoints } from '@webui/data';
import {
  FormatString,
  isCandidate,
  isMobile,
  getTimeInstance
} from '@webui/utilities';

import {
  GenericFormService,
  FormService,
  FormMode,
  ActionService,
  TimelineService,
  TimelineAction
} from '../../services';
import { getElementFromMetadata, removeValue } from '../../helpers';
import { getCurrencySymbol } from '@angular/common';
import { Form } from '../../models';

export interface HiddenFields {
  elements: Field[];
  keys: string[];
  observers: string[];
}

interface UpdateRelatedFieldConfig {
  before?: boolean;
  endpoint?: string;
  getValue: string;
  setValue: {
    field: string;
    value: string;
  };
  data?: any;
}

interface UpdateDataInfo {
  config: UpdateRelatedFieldConfig[];
  requests?: any[];
}

@Component({
  selector: 'app-generic-form',
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.scss'],
  providers: [ActionService, TimelineService]
})
export class GenericFormComponent implements OnChanges, OnDestroy, OnInit {
  @Input()
  public form: any;
  @Input()
  public id: string;
  @Input()
  public hide: boolean;
  @Input()
  public edit: boolean;
  @Input()
  public mode: FormMode;
  @Input()
  public delay: boolean;
  @Input()
  public metadataQuery: string;
  @Input()
  public path: string;
  @Input()
  public checkEmail: string;
  @Input()
  public title: string;
  @Input()
  public changeMetadata: Subject<any>;

  @Input()
  public endpoint = '';
  @Input()
  public data = {};
  @Input()
  public needData = true;
  @Input()
  public response: any = {};
  @Input()
  public errors = {};
  @Input()
  public relatedField = {};
  @Input()
  public showResponse = false;
  @Input()
  public showToastr = true;
  @Input()
  public extendData: any;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();
  @Output()
  public buttonAction: EventEmitter<any> = new EventEmitter();
  @Output()
  public redirect: EventEmitter<any> = new EventEmitter();
  @Output()
  public responseForm: EventEmitter<any> = new EventEmitter();
  @Output()
  public errorForm: EventEmitter<any> = new EventEmitter();
  @Output()
  public str: EventEmitter<any> = new EventEmitter();
  @Output()
  public modeEvent: EventEmitter<any> = new EventEmitter();
  @Output()
  public permissionError: EventEmitter<any> = new EventEmitter();

  @ViewChild('confirmProfileModal')
  public confirmProfileModal: ElementRef;

  public currentEndpoint: string;
  public currentId: string;
  public formId: number;
  public metadata: Field[] = [];

  public modalInfo: any;
  public modalRef: NgbModalRef;
  public saveProcess: boolean;
  public strValue: string;

  public hasTabs: boolean;
  public formData: BehaviorSubject<any>;
  public modeBehaviorSubject: BehaviorSubject<string>;

  public metadataError = [];
  public splitElements: any[] = [];
  public showForm = false;
  public editForm = false;
  public hiddenFields: HiddenFields = {
    elements: [],
    keys: [],
    observers: []
  };
  public workflowEndpoints = {
    state: Endpoints.WorkflowNode,
    app: `/apps/`
  };
  public pictures = {
    [Endpoints.Contact]: '__str__',
    [Endpoints.CandidateContact]: '__str__'
  };
  public replaceEndpoints = {
    [Endpoints.JobsiteClient]: Endpoints.Jobsite,
    [Endpoints.ClientJobs]: Endpoints.Job
  };
  public workflowData = <any>{
    workflow: null,
    number: null,
    company: null
  };
  public replaceElements: Field[] = [];
  public delayData = {};
  public timeInstance = getTimeInstance();

  public format = new FormatString();

  public updateDataBeforeSendForm: UpdateDataInfo;
  public updateDataAfterSendForm: UpdateDataInfo;

  public checkObject: any = {};
  public relatedObjects: any[] = [];
  public formGroup: FormGroup;
  public formName: string;
  public selectedDates: string[];

  public activeTabId: string;
  public canEdit = true;

  private subscriptions: Subscription[] = [];

  constructor(
    private service: GenericFormService,
    private formService: FormService,
    private toastrService: ToastService,
    private userService: UserService,
    private authService: AuthService,
    private settingsService: SiteSettingsService,
    private router: Router,
    private modal: NgbModal,
    private purposeService: CompanyPurposeService,
    private timelineService: TimelineService,
    private route: ActivatedRoute
  ) {
    this.updateDataAfterSendForm = {
      config: [],
      requests: []
    };
    this.updateDataBeforeSendForm = {
      config: [],
      requests: []
    };
  }

  public ngOnInit() {
    if (this.endpoint === Endpoints.Timesheet) {
      this.formName = 'Timesheets';
    }

    if (this.changeMetadata) {
      const changeMetadataSubscription = this.changeMetadata.subscribe(
        (boolean) => {
          this.service
            .getMetadata(
              this.endpoint,
              (this.id || this.edit ? '?type=form' : '?type=formadd') +
                (this.metadataQuery ? `&${this.metadataQuery}` : '')
            )
            .subscribe((metadata) => {
              this.hiddenFields = {
                elements: [],
                keys: [],
                observers: []
              };
              this.parseMetadata(metadata, this.data);
              this.metadata = metadata;
              this.updateMetadataByProps(
                this.metadata,
                this.generateActionToSetProps()
              );
            });
        }
      );

      this.subscriptions.push(changeMetadataSubscription);
    }
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(
      (subscription) => subscription && subscription.unsubscribe()
    );
  }

  public ngOnChanges(changes: SimpleChanges) {
    const params = this.route.snapshot.queryParams;

    if (params['tab']) {
      this.activeTabId = params['tab'];
    }

    if (!this.formId && this.formId !== 0) {
      this.formId = this.formService.registerForm(this.endpoint, this.mode);

      this.event.emit({
        type: 'formRegistration',
        form: this.formService.getForm(this.formId)
      });

      const subscription = this.formService
        .getForm(this.formId)
        .mode.pipe(skip(1))
        .subscribe((mode: FormMode) => {
          this.mode = mode;
          this.modeEvent.emit(this.mode);
        });

      this.subscriptions.push(subscription);
    }

    Object.keys(changes).forEach((input) => {
      if (input === 'mode') {
        this.resetData(this.errors);
        this.resetData(this.response);

        this.toggleModeMetadata(this.mode);
        this.formService.getForm(this.formId).setErrors(this.errors);
      }
    });

    if (this.currentId !== this.id && this.metadata) {
      this.currentId = this.id;
      this.editForm = true;
      this.splitElements.forEach((el) => {
        el.id = this.id;
      });
      this.getData(this.splitElements);
      this.metadata.push(...this.splitElements);
      this.parseMetadata(this.metadata, this.data);
    }
    if (this.endpoint !== this.currentEndpoint) {
      const patt = /\?/;
      if (patt.test(this.endpoint)) {
        this.endpoint = this.endpoint.slice(0, this.endpoint.indexOf('?'));
      }
      this.currentEndpoint = this.endpoint;
      this.getMetadata(this.endpoint);
    } else if (this.data && this.metadata) {
      this.parseMetadata(this.metadata, this.data);
    }
    if (this.id && this.mode && this.metadata) {
      if (this.mode === 'edit') {
        this.toggleModeMetadata(this.mode);
      }
    }
  }

  public isEmail(value) {
    let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/; //tslint:disable-line

    return reg.test(value) ? true : false;
  }

  public updateMetadataByProps(metadata: Field[], callback: Function) {
    metadata.forEach((el) => {
      if (el) {
        callback.call(this, el);
      }

      if (el.children) {
        this.updateMetadataByProps(el.children, callback);
      }
    });
  }

  public generateActionToSetProps(): Function {
    this.formData = new BehaviorSubject({ data: {} });
    this.modeBehaviorSubject = new BehaviorSubject(this.mode);

    this.subscriptions.push(
      this.timelineService.action$.subscribe((timeline) =>
        this.checkTimeline(timeline)
      )
    );
    const props = {
      formId: this.formId,
      formData: this.formData,
      mode: this.modeBehaviorSubject,
      autocompleteData: new Subject()
    };

    return (el: Field) => {
      // if (
      //   el.key === 'timeline' || el.type === 'list' || el.type === 'related' ||
      //   (el.endpoint && el.endpoint === '/core/workflowobjects/')
      // ) {
      //   el.timelineSubject = this.timelineService.action$;
      // }

      if (this.purposeService.purpose === Purpose.SelfUse) {
        const { templateOptions } = el;

        if (
          templateOptions &&
          templateOptions.label &&
          templateOptions.label.toLowerCase() === 'client'
        ) {
          el.read_only = true;
          el.default = '{company_id}';
        }
      }

      if (el.type === 'tabs') {
        this.hasTabs = true;

        if (this.activeTabId) {
          el.activeId = this.activeTabId;
        }
      }

      if (el.key || el.type === 'list' || el.type === 'collapse') {
        el = Object.assign(el, props);
      }

      if (el.showIf && el.showIf.length) {
        if (this.hiddenFields.keys.indexOf(el.key) === -1) {
          this.hiddenFields.keys.push(el.key);
          this.hiddenFields.elements.push(el);
          this.hiddenFields.observers = this.observeFields(
            el.showIf,
            this.hiddenFields.observers
          );
          el.hidden = new BehaviorSubject(true);
        }
      }

      if (el.key && el.checkObject) {
        this.checkObject[el.key] = el.checkObject;
      }

      if (el.key && el.update) {
        if (el.update.before) {
          this.updateDataBeforeSendForm.config.push(el.update);
        } else {
          this.updateDataAfterSendForm.config.push(el.update);
        }
      }
    };
  }

  public getRelatedDataForOptions(metadata, data) {
    metadata.forEach((el) => {
      if (el.key && el.type === 'related' && el.useOptions) {
        this.getRalatedData(
          this.metadata,
          el.key,
          el.endpoint,
          {},
          '?limit=-1' + this.generateQuery(el.query, data)
        );
      } else if (el.children) {
        this.getRelatedDataForOptions(el.children, data);
      }
    });
  }

  public checkFormInfoElement(metadata: any[]) {
    let infoElement = getElementFromMetadata(metadata, 'id');
    if (
      infoElement &&
      infoElement.hideOnMobile &&
      isMobile() &&
      isCandidate()
    ) {
      const index = metadata.indexOf(infoElement);
      metadata.splice(index, 1);
      infoElement = getElementFromMetadata(metadata, 'id');
    }

    if (infoElement && infoElement.type === 'info') {
      const keys = Object.keys(infoElement.values);
      infoElement.metadata = <any>{};
      infoElement.companyPicture = Endpoints.Company === this.endpoint;
      keys.forEach((el) => {
        const value = infoElement.values[el];
        if (typeof value === 'string') {
          const key = value.replace('.__str__', '');
          const element = getElementFromMetadata(metadata, key);

          const fieldsWithLabel = [
            'carrier_list_reserve',
            'website',
            'name',
            'title',
            'first_name',
            'last_name',
            'address'
          ];

          if (element) {
            element.saveField = element.saveField !== false;
            infoElement.metadata[el] = Object.assign(
              {},
              element,
              { hide: false },
              {
                templateOptions: {
                  ...element.templateOptions,
                  label:
                    element.type === 'checkbox' ||
                    fieldsWithLabel.indexOf(element.key) > -1
                      ? element.templateOptions.label
                      : ''
                }
              }
            );
          }
        }
      });

      const timeline = getElementFromMetadata(metadata, 'timeline');

      if (timeline) {
        infoElement.metadata['timeline'] = Object.assign({}, timeline);
        infoElement.metadata['timeline'].dropdown = true;
      }
    }
  }

  public toggleModeMetadata(mode: string) {
    if (this.modeBehaviorSubject) {
      this.modeBehaviorSubject.next(mode);
    }
  }

  public getMetadata(endpoint) {
    this.service
      .getMetadata(
        endpoint,
        (this.id || this.edit ? '?type=form' : '?type=formadd') +
          (this.metadataQuery ? `&${this.metadataQuery}` : '')
      )
      .subscribe(
        (data: any) => {
          this.getReplaceElements(data);
          this.metadata = this.parseMetadata(data, this.data);
          this.metadata = this.parseMetadata(data, this.relatedField);

          if (this.extendData) {
            this.fillinForm(this.metadata, this.extendData);
            this.formService
              .getForm(this.formId)
              .setInitialData(this.extendData);
          }

          if (!(this.id || this.editForm)) {
            this.checkRuleElement(this.metadata);
          }

          this.checkFormBuilder(this.metadata, this.endpoint);
          this.checkFormStorage(this.metadata, this.endpoint);
          this.updateMetadataByProps(
            this.metadata,
            this.generateActionToSetProps()
          );

          this.getData(this.metadata);

          if ((this.id || this.edit) && this.metadata) {
            if (this.id) {
              this.editForm = true;
            }
            this.showForm = false;
            if (this.needData) {
              this.getDataForForm(this.endpoint, this.id);
              this.updateElements(this.metadata, 'id', 'list', this.id);
              this.updateElements(this.metadata, 'editForm', undefined, true);
            } else {
              this.showForm = true;
            }
          } else {
            this.str.emit({
              str: 'Add'
            });
            this.showForm = true;
            this.checkFormInfoElement(this.metadata);
          }
        },
        (error: any) => (this.metadataError = error)
      );
  }

  public checkRelatedObjects(metadata, data) {
    metadata.forEach((el) => {
      if (el.relatedObjects) {
        const formatedData = {};

        Object.keys(el.relatedObjects.data).forEach((key) => {
          formatedData[key] = this.format.format(
            el.relatedObjects.data[key],
            data
          );
        });

        this.relatedObjects.push({
          el,
          data: { ...el.relatedObjects, data: formatedData },
          value: el.value
        });
      } else if (el.children) {
        this.checkRelatedObjects(el.children, data);
      }
    });
  }

  public parseCheckObject(data) {
    const endpoints = [
      Endpoints.CompanyContact,
      Endpoints.CandidateContact,
      Endpoints.Job
    ];

    if (endpoints.includes(this.endpoint as Endpoints)) {
      const keys = Object.keys(this.checkObject);
      if (keys.length) {
        const formatString = new FormatString();

        keys.forEach((key) => {
          const query = { ...this.checkObject[key].query };
          const queryParams = Object.keys(query);
          queryParams.forEach((param) => {
            query[param] =
              typeof query[param] === 'string'
                ? formatString.format(query[param], data)
                : query[param];
          });

          let send = !queryParams.some(
            (param) => query[param] == null || query[param] === ''
          );

          if (!send) {
            this.formGroup.removeControl('non_field_errors');
            this.formGroup.updateValueAndValidity({ onlySelf: true });
            this.updateErrors(
              this.errors,
              { [key]: '  ', non_field_errors: [''] },
              this.response
            );

            this.formService.getForm(this.formId).setErrors(this.errors);
          }

          if (send && this.checkObject[key].cache) {
            send = queryParams.some(
              (param) => query[param] !== this.checkObject[key].cache[param]
            );
          }
          this.checkObject[key].cache = query;

          if (send) {
            this.service
              .get(this.checkObject[key].endpoint, query)
              .subscribe((res) => {
                if (res.count) {
                  const error = this.checkObject[key].error;
                  const obj = res.results[0];
                  let errors;
                  if (this.endpoint === Endpoints.CompanyContact) {
                    errors = {
                      [key]: this.generateCustomError(
                        obj['company_contact'],
                        error,
                        '/mn/core/companycontacts/'
                      )
                    };
                  } else if (this.endpoint === Endpoints.CandidateContact) {
                    errors = {
                      [key]: this.generateCustomError(
                        obj,
                        error,
                        '/mn/candidate/candidatecontacts/'
                      )
                    };
                  } else if (this.endpoint === Endpoints.Job) {
                    errors = {
                      non_field_errors: this.generateCustomError(
                        obj,
                        error,
                        '/mn/hr/jobs/',
                        true
                      )
                    };
                  }
                  this.formGroup.setControl(
                    'non_field_errors',
                    new FormControl('', Validators.required)
                  );
                  this.updateErrors(this.errors, errors, this.response);
                } else {
                  this.formGroup.removeControl('non_field_errors');
                  this.formGroup.updateValueAndValidity({ onlySelf: true });
                  this.updateErrors(
                    this.errors,
                    { [key]: '  ', non_field_errors: [''] },
                    this.response
                  );
                }

                this.formService.getForm(this.formId).setErrors(this.errors);
              });
          }
        });
      }
    }
  }

  public generateCustomError(
    data: any,
    error?: any,
    path?: string,
    nonField?: boolean
  ) {
    const endpoint = `${this.endpoint}${data.id}/`;
    const link = `${path || this.path}${data.id}/change`;
    const errors = [error, data.__str__, link, { ...data, endpoint }];

    if (nonField) {
      errors.unshift(true);
    }

    return errors;
  }

  public observeFields(fields: any[], observers) {
    fields.forEach((field: any) => {
      if (field instanceof Object) {
        const keys = Object.keys(field);
        keys.forEach((key) => {
          if (observers.indexOf(key) === -1) {
            observers.push(key);
          }
        });
      } else {
        if (observers.indexOf(field) === -1) {
          observers.push(field);
        }
      }
    });
    return observers;
  }

  public updateFormData(metadata, formData) {
    metadata.forEach((el) => {
      if (el.key || el.type === 'list' || el.type === 'tracking') {
        el.formData = formData;
      } else if (el.children) {
        this.updateFormData(el.children, formData);
      }
    });
  }

  public updateDataOfReplaceElements(element) {
    if (this.id) {
      const endp = `${this.endpoint}${this.id}/`;
      this.service.getAll(endp).subscribe((data: any) => {
        this.replaceElements.forEach((el) => {
          if (el.data) {
            el.data.next(data);
          }
        });
        if (element.type === 'related') {
          element.data.next(
            this.getValueOfData(data, element.key, element, undefined, true)
          );
        }
      });
    } else {
      return;
    }
  }

  public getDataForForm(endpoint, id) {
    if (this.replaceEndpoints[endpoint]) {
      endpoint = this.replaceEndpoints[endpoint];
      this.endpoint = endpoint;
      this.currentEndpoint = endpoint;
    }

    let endp = '';
    if (endpoint === Endpoints.CandidatePool) {
      endp = id ? `/candidate/candidatecontacts/${id}/pool_detail/` : endpoint;
    } else {
      endp = id ? `${endpoint}${id}/` : endpoint;
    }

    this.service
      .getAll(endp)
      .pipe(
        catchError((res) => {
          this.permissionError.emit();
          return res;
        })
      )
      .subscribe((data: any) => {
        if (this.endpoint === Endpoints.Tag) {
          this.canEdit = data.owner !== 'system';
        }

        this.getRelatedDataForOptions(this.metadata, data);
        this.fillinForm(this.metadata, data);
        this.checkRuleElement(this.metadata);
        this.checkRelatedObjects(this.metadata, data);
        this.updateDatepickerByTimezone(this.metadata, data);
        this.formService.getForm(this.formId).setInitialData(data);

        this.addCustomTemplates(this.metadata, data);
        this.showForm = true;
        const formData = new BehaviorSubject({ data });
        this.updateFormData(this.metadata, formData);
        this.checkFormInfoElement(this.metadata);
        this.strValue = data.__str__;
        this.str.emit({
          str: data && data.__str__ ? data.__str__ : '',
          data
        });
      });
  }

  public updateDatepickerByTimezone(metadata, data) {
    metadata.forEach((el) => {
      if (el.type === 'datepicker') {
        if (data && (data.time_zone || data.timezone)) {
          el.time_zone = data.time_zone || data.timezone;
        }
      } else if (el.children) {
        this.updateDatepickerByTimezone(el.children, data);
      }
    });
  }

  public fillinForm(metadata, data) {
    metadata.forEach((el) => {
      const { templateOptions } = el;

      if (el.dataList) {
        el.dataList = this.getValueOfData(data, el.dataList, {});
      }

      if (el.relatedData) {
        el.relatedData = this.getValueOfData(data, el.relatedData, {});
      }

      if (el.update) {
        const value = this.getValueOfData(data, el.key, metadata, {});
        el.update['data'] =
          Array.isArray(value) && value.length
            ? value.map((item) => item.id)
            : value;
      }

      const currency = getCurrencySymbol(
        this.settingsService.settings.currency,
        'wide'
      );

      if (templateOptions) {
        const { label, text, pattern } = templateOptions;

        templateOptions.label = this.format.format(label, {
          ...data,
          currency
        });
        templateOptions.text = this.format.format(text, { ...data, currency });
        templateOptions.pattern = this.getValueOfData(data, pattern, {});
      }
      if (el.type === 'input') {
        if (el.templateOptions && el.templateOptions.type === 'picture') {
          el.companyContact = this.endpoint === Endpoints.Company;
          if (this.pictures[this.endpoint]) {
            el.contactName = data['__str__'];
          }
        }
      }
      if (el.key && el.key !== 'timeline' && el.type !== 'group') {
        if (el.type === 'replace') {
          el.data = new BehaviorSubject(data);
        }
        if (el.type === 'related' && typeof el.read_only === 'string') {
          el.read_only = this.format.format(el.read_only, data);
        }
        if (el.type === 'related' && el.list) {
          el.data = new BehaviorSubject(
            this.getValueOfData(data, el.key, el, metadata)
          );
          if (el.prefilled) {
            const keys = Object.keys(el.prefilled);
            keys.forEach((elem) => {
              el.prefilled[elem] = this.format.format(el.prefilled[elem], {
                ...data,
                session: this.userService.user
              });
            });
          }
        }
        this.getValueOfData(data, el.key, el, metadata);
        if (el.key === 'total_time') {
          const formatString = new FormatString();
          el.value = formatString.format('{totalTime}', {
            ...data,
            totalTime: this.getTotalTime(data)
          });
        }
      } else if (el.key && el.key === 'timeline') {
        el.value = data;
      } else if (el.type === 'list' || el.type === 'testList') {
        if (el.endpoint) {
          el.endpoint = this.format.format(el.endpoint, data);
        }
        if (el.add_endpoint) {
          el.add_endpoint = this.format.format(el.add_endpoint, data);
        }
        if (el.query) {
          const queryKeys = Object.keys(el.query);
          queryKeys.forEach((elem) => {
            if (Array.isArray(el.query[elem])) {
              if (elem !== 'fields') {
                let value;
                const type = data.type;
                if (type !== 'master') {
                  value = this.format.format(el.query[elem][2], data);
                }

                el.query[elem].forEach((query) => {
                  if (!value) {
                    value = this.format.format(query, data);
                  }
                });

                el.query[elem] = value;
              }
            } else {
              if (el.query[elem].indexOf('session') > -1) {
                el.query[elem] = this.userService.user.data.contact.contact_id;
              } else {
                el.query[elem] = this.format.format(el.query[elem], data);
              }
            }
          });
        }
        if (el.prefilled) {
          const keys = Object.keys(el.prefilled);
          keys.forEach((elem) => {
            el.prefilled[elem] = this.format.format(el.prefilled[elem], {
              ...data,
              session: this.userService.user
            });
          });
        }
      } else if (el.children) {
        if (el.type === 'row') {
          el.label = this.format.format(el.label, data);
        }
        this.fillinForm(el.children, data);
      }
    });
  }

  public getTotalTime(data) {
    const shift_ended_at = getTimeInstance()(data.shift_ended_at);
    const shift_started_at = getTimeInstance()(data.shift_started_at);

    if (shift_ended_at.isBefore(shift_started_at)) {
      return '0hr 0min';
    }

    let breakTime = 0;

    if (data.break_ended_at && data.break_started_at) {
      const break_ended_at = getTimeInstance()(data.break_ended_at);
      const break_started_at = getTimeInstance()(data.break_started_at);

      if (
        break_started_at.isAfter(shift_ended_at) ||
        break_ended_at.isAfter(shift_ended_at) ||
        break_started_at.isBefore(shift_started_at) ||
        break_ended_at.isBefore(shift_started_at)
      ) {
        return '0hr 0min';
      }

      breakTime = break_ended_at.diff(break_started_at);
    }

    const workTime = shift_ended_at.diff(shift_started_at);
    const totalTime = getTimeInstance().duration(workTime - breakTime);

    return `${Math.floor(totalTime.asHours())}hr ${totalTime.minutes()}min`;
  }

  public getValueOfData(data, key, obj, metadata?, update = false) {
    if (!key) {
      return;
    }

    const keys = key.split('.');
    const prop = keys.shift();
    if (keys.length === 0) {
      if (data) {
        if (key.includes('period_zero_reference')) {
          key = 'period_zero_reference';
        }
        if (!obj['value'] || update) {
          if (key === 'id' && obj.type === 'info') {
            obj['value'] = data;
          } else {
            obj['value'] = data[key];
          }
        }
      }
    } else {
      if (data[prop]) {
        this.getValueOfData(data[prop], keys.join('.'), obj, metadata);
      }
    }
    return obj['value'];
  }

  public checkRelatedData(data: any) {
    const result = JSON.parse(JSON.stringify(data));
    const keys = Object.keys(data);

    const requests = [];
    const fields = [];

    keys.forEach((key, index, arr) => {
      if (data[key] instanceof Object) {
        if (data[key].id) {
          const el = getElementFromMetadata(this.metadata, key);

          requests.push(this.createRequest(el.endpoint, data[key].id));
          fields.push(key);
        }
      }
    });

    if (!requests.length) {
      this.event.emit({
        type: 'sendForm',
        viewData: result,
        sendData: data,
        status: 'success'
      });
    } else {
      const subscription = forkJoin(...requests)
        .pipe(
          finalize(() => {
            this.event.emit({
              type: 'sendForm',
              viewData: result,
              sendData: data,
              status: 'success'
            });
          })
        )
        .subscribe((res: any[]) => {
          res.forEach((el, i) => {
            result[fields[i]] = el;
          });
        });

      this.subscriptions.push(subscription);
    }
  }

  public createRequest(endpoint, id) {
    return this.service.getAll(endpoint + id + '/');
  }

  public createUpdateRequests(data: any, info: UpdateDataInfo) {
    const store = {};
    info.config.forEach((config: UpdateRelatedFieldConfig) => {
      const currentValue = this.getValueOfData(data, config.getValue, {});

      if (config.data !== currentValue) {
        let endpoint;
        if (config.endpoint) {
          endpoint = this.format.format(config.endpoint, data);
          store[endpoint] = store[endpoint] || {};
        } else if (!Array.isArray(currentValue)) {
          endpoint = `${this.endpoint}${data.id}/`;
          store[endpoint] = store[endpoint] || {};
        }

        if (Array.isArray(currentValue)) {
          const addArray = currentValue.filter(
            (a) => !config.data.find((b) => a === b)
          );
          const removeArray = config.data.filter(
            (a) => !currentValue.find((b) => a === b)
          );
          const value = this.format.format(config.setValue.value, data);

          if (addArray.length) {
            addArray.forEach((el) => {
              const end = `${this.endpoint}${el}/`;
              store[end] = { ...store[end], [config.setValue.field]: value };
            });
          }

          if (removeArray) {
            removeArray.forEach((el) => {
              const end = `${this.endpoint}${el}/`;
              store[end] = { ...store[end], [config.setValue.field]: null };
            });
          }
        } else {
          store[endpoint] = {
            ...store[endpoint],
            [config.setValue.field]: currentValue
          };
        }
      }
    });

    info.requests = Object.keys(store).map((el) => {
      return this.createUpdateRequest(el, store[el]);
    });
  }

  public createUpdateRequest(endpoint: string, data: any) {
    return this.service.updateForm(endpoint, data);
  }

  public checkExistValue(target: string[], value: string) {
    return target.indexOf(value) > -1;
  }

  public extendJob(data, sendEvent = true) {
    const shiftDatesRequests = {};

    data.job_shift.forEach((shiftDate) => {
      const body = {
        shift_date: shiftDate.date,
        job: data.id,
        skill: data.skill
      };
      const shifts = shiftDate.data.value;

      shiftDatesRequests[shiftDate.date] = {
        shiftDate: this.service.submitForm(Endpoints.ShiftDate, body),
        shifts
      };
    });

    const dates = Object.keys(shiftDatesRequests);

    if (dates.length) {
      dates.forEach((date) => {
        shiftDatesRequests[date].shiftDate.subscribe((res: any) => {
          const shiftsRequests = {
            date: res.shift_date,
            requests: []
          };

          shiftDatesRequests[date].shifts.forEach((shift) => {
            const body = {
              date: res.id,
              time: shift.time,
              workers: shift.workers
            };

            shiftsRequests.requests.push(
              this.service.submitForm(Endpoints.Shift, body)
            );
          });

          if (shiftsRequests.requests.length) {
            shiftsRequests.requests.forEach((request, i) => {
              request
                .pipe(
                  catchError((err) => {
                    return of(false);
                  })
                )
                .subscribe((response) => {
                  if (!response) {
                    return;
                  }

                  const fillInBody = {
                    candidates: shiftDatesRequests[date].shifts[i].candidates,
                    shifts: [response.id]
                  };

                  const message = `${shiftsRequests.date} ${getTimeInstance()(
                    response.time,
                    'HH:mm:ss'
                  ).format('hh:mm A')} created`;

                  if (fillInBody.candidates) {
                    this.service
                      .submitForm(`/hr/jobs/${data.id}/fillin/`, fillInBody)
                      .subscribe(() => {
                        this.toastrService.sendMessage(
                          message,
                          MessageType.Success
                        );
                        this.event.emit({
                          type: 'extend'
                        });
                      });
                  } else {
                    this.toastrService.sendMessage(
                      message,
                      MessageType.Success
                    );
                    this.event.emit({
                      type: 'extend'
                    });
                  }
                });
            });
          }
        });
      });
    }

    if (sendEvent) {
      this.event.emit({
        type: 'sendForm',
        status: 'success'
      });
    }
  }

  public getJobStartDate(shifts) {
    if (shifts && shifts.length) {
      return shifts.reduce((prev, next) => (prev > next ? next : prev));
    }
  }

  public generateDataForJobCreation(data) {
    const time = data.default_shift_starting_time;
    const workers = data.workers;
    const skill = data.position;
    const job_shift = [];

    this.selectedDates.forEach((date) => {
      const shift = {
        date,
        data: {
          value: [
            {
              time,
              workers
            }
          ]
        }
      };

      job_shift.push(shift);
    });

    return {
      id: data.id,
      skill,
      job_shift
    };
  }

  public submitForm(data) {
    if (
      (this.endpoint === Endpoints.Job ||
        this.endpoint === Endpoints.ClientJobs) &&
      !this.id
    ) {
      data['work_start_date'] = this.getJobStartDate(data.shifts);
      this.selectedDates = data.shifts;
    }

    if (data.job_shift) {
      this.event.emit({
        type: 'saveStart'
      });
      this.extendJob(data);
      return;
    }

    if (!this.checkDelayData()) {
      return;
    }

    const newData = this.form ? { ...data, ...this.form } : data || {};

    if (newData.hasOwnProperty('apartment')) {
      const { address, street_address, apartment } = newData;
      const addressField = address || street_address;

      if (addressField && isObject(addressField)) {
        Object.assign(addressField, { apartment });
        delete newData.apartment;
      }
    }

    if (this.checkEmail) {
      if (!this.isEmail(newData.username)) {
        this.parseError({ username: 'Invalid email address' });

        return;
      }
    }

    if (this.response.message) {
      this.response.message = '';
    }

    if (this.delay) {
      this.checkRelatedData(newData);

      return;
    }

    // Here

    if (this.updateDataAfterSendForm.config.length) {
      this.createUpdateRequests(newData, this.updateDataAfterSendForm);
    }

    if (this.updateDataBeforeSendForm.config.length) {
      this.createUpdateRequests(newData, this.updateDataBeforeSendForm);

      const subscription = forkJoin([
        ...this.updateDataBeforeSendForm.requests
      ]).subscribe(() => {
        this.sendForm(newData);
      });

      this.subscriptions.push(subscription);

      return;
    }

    if (this.relatedObjects.length) {
      const requests = this.updateRelatedObjects(newData);

      if (requests && requests.length) {
        const subscription = forkJoin([...requests]).subscribe(() => {
          this.sendForm(newData);
        });

        this.subscriptions.push(subscription);

        return;
      }
    }

    this.sendForm(newData);
  }

  public updateRelatedObjects(data): any[] {
    const requests = [];

    this.relatedObjects.forEach((item) => {
      const newValue = this.getValueOfData(data, item.el.key, {});
      const oldValue = item.value;

      removeValue(item.el.key, data);

      if (Array.isArray(newValue)) {
        const addArray = newValue.filter(
          (a) => !oldValue.find((b) => a === b[item.data.field].id)
        );
        const removeArray = oldValue.filter(
          (a) => !newValue.find((b) => a[item.data.field].id === b)
        );

        if (addArray.length) {
          addArray.forEach((el) => {
            const body = {
              ...item.data.data,
              [item.data.field]: el
            };

            requests.push(this.service.submitForm(item.data.endpoint, body));
          });
        }

        if (removeArray.length) {
          removeArray.forEach((el) => {
            requests.push(this.service.delete(item.data.endpoint, el.id));
          });
        }
      }
    });

    return requests;
  }

  public sendForm(data: any) {
    if (data.invoice_rule) {
      const keys = Object.keys(data.invoice_rule);
      keys.forEach((key) => {
        if (key.includes('period_zero_reference')) {
          if (key === 'period_zero_reference_date') {
            data.invoice_rule[key] =
              getTimeInstance()(data.invoice_rule[key], 'YYYY-MM-DD').date() ||
              undefined;
          }

          data.invoice_rule['period_zero_reference'] =
            parseInt(data.invoice_rule[key], 10) || undefined;
          delete data.invoice_rule[key];
        }
      });
    }

    if (this.editForm || this.edit) {
      const endpoint = this.editForm
        ? `${this.endpoint}${this.id ? this.id + '/' : ''}`
        : this.endpoint;

      this.saveForm(endpoint, data, true);
    } else {
      if (this.endpoint === Endpoints.JobsiteClient) {
        this.endpoint = Endpoints.Jobsite;
      }

      if (this.endpoint === Endpoints.ClientJobs) {
        this.endpoint = Endpoints.Job;
      }

      this.saveForm(this.endpoint, data);
    }
  }

  public saveForm(endpoint: string, data, edit?: boolean) {
    if (endpoint[endpoint.length - 1] !== '/') {
      endpoint += '/';
    }

    this.event.emit({
      type: 'saveStart'
    });
    this.formService.getForm(this.formId).setSaveProcess(true);

    if (edit) {
      this.service.editForm(endpoint, data).subscribe(
        (response: any) => this.responseHandler(response, data),
        (errors: any) => this.parseError(errors.errors)
      );
    } else {
      this.service.submitForm(endpoint, data).subscribe(
        (response: any) => this.responseHandler(response, data),
        (errors: any) => this.parseError(errors.errors)
      );
    }
  }

  public confirmJob(id: string, response) {
    const query = {
      model: 'hr.job',
      object_id: id
    };

    this.timelineService.getTimeline(query).subscribe(
      (timeline) => {
        const confirmState = timeline.find((state) => state.number === 20);

        if (confirmState) {
          this.timelineService
            .activateState(id, confirmState.id, true)
            .pipe(
              finalize(() => {
                this.event.emit({
                  type: 'sendForm',
                  data: { ...response, ...this.formData.value.data },
                  status: 'success'
                });
              })
            )
            .subscribe(() => {
              const shifts = this.generateDataForJobCreation(response);

              if (shifts.job_shift.length) {
                this.extendJob(shifts, false);
              }
            });
        }
      },
      () => {
        this.event.emit({
          type: 'sendForm',
          data: { ...response, ...this.formData.value.data },
          status: 'success'
        });
      }
    );
  }

  public responseHandler(response: any, sendData: any) {
    this.formService.getForm(this.formId).setSaveProcess(false);
    this.parseResponse(response);

    if (
      (this.endpoint === Endpoints.Job &&
        !this.id &&
        this.selectedDates &&
        this.selectedDates.length) ||
      sendData.client_contact_page
    ) {
      this.confirmJob(response.id, response);
      return;
    }

    if (response.message && this.showToastr) {
      setTimeout(() => {
        this.toastrService.sendMessage(response.message, MessageType.Success);
      }, 500);
    }

    this.timelineService.emit(TimelineAction.Reset);

    if (this.endpoint === Endpoints.Note) {
      const formData = this.formGroup.value;

      if (formData.files && formData.files.length) {
        const requests = formData.files.map((file) => {
          const body = new FormData();
          body.append('note', response.id);
          body.append('file', file);
          return this.service.uploadFile('/core/notefiles/', body);
        });

        forkJoin([...requests])
          .pipe(
            finalize(() => {
              this.event.emit({
                type: 'sendForm',
                viewData: response,
                sendData,
                status: 'success'
              });
            })
          )
          .subscribe();
      }
    }

    if (this.updateDataAfterSendForm.requests.length) {
      const subscription = forkJoin([...this.updateDataAfterSendForm.requests])
        .pipe(
          finalize(() => {
            this.event.emit({
              type: 'sendForm',
              viewData: response,
              sendData,
              status: 'success'
            });
          })
        )
        .subscribe();

      this.subscriptions.push(subscription);
    } else {
      this.event.emit({
        type: 'sendForm',
        data: { ...response, ...this.formData.value.data },
        status: 'success'
      });
    }
  }

  public parseError(errors) {
    if (errors) {
      if (errors.register) {
        this.redirect.emit();
        return;
      }
    }
    this.resetData(this.errors);
    this.resetData(this.response);
    this.updateErrors(this.errors, errors, this.response);
    this.errorForm.emit(this.errors);

    const form: Form = this.formService.getForm(this.formId);
    form.setSaveProcess(false);
    form.setErrors(this.errors);
  }

  public checkDelayData() {
    const delayEndppoints = Object.keys(this.delayData);

    let count = 0;
    if (delayEndppoints.length) {
      delayEndppoints.forEach((el) => {
        if (
          this.delayData[el].data.sendData &&
          this.delayData[el].data.sendData.length
        ) {
          count += 1;
          this.delayData[el].message = '';
        } else {
          if (!this.id && !this.editForm) {
            this.delayData[el].message = 'This field is required.';
          }
        }
      });

      return !this.id && !this.editForm
        ? delayEndppoints.length === count
        : true;
    }

    return true;
  }

  public parseResponse(response) {
    this.resetData(this.errors);
    this.resetData(this.response);

    if (!this.editForm && this.showResponse) {
      this.response = { ...response };
    }

    this.responseForm.emit({ ...response, formData: this.formData.value.data });
    const delayEndppoints = Object.keys(this.delayData);

    if (delayEndppoints.length) {
      delayEndppoints.forEach((endpoint: string) => {
        const prefilledDataKeys = Object.keys(
          this.delayData[endpoint].prefilled
        );
        prefilledDataKeys.forEach((el) => {
          this.delayData[endpoint].prefilled[el] = this.format.format(
            this.delayData[endpoint].prefilled[el],
            response
          ); //tslint:disable-line
        });

        this.delayData[endpoint].data.sendData.forEach(
          (element, index, arr) => {
            const body = Object.assign(
              element,
              this.delayData[endpoint].prefilled
            );

            this.service
              .submitForm(endpoint, body, { showMessage: true })
              .subscribe(() => {
                if (arr.length - 1 === index) {
                  this.event.emit({
                    type: 'sendForm',
                    data: response,
                    status: 'success'
                  });
                }
              });
          }
        );
      });
    }

    this.formService.getForm(this.formId).setErrors(this.errors);
  }

  public eventHandler(event) {
    this.updateWorkflowData(event);
    if (event.type === 'update' && event.el.type === 'related') {
      this.getData(this.metadata, event.el.key, event.currentQuery);
    } else if (
      event.type === 'change' &&
      event.el.type === 'related' &&
      event.el.related
    ) {
      const key = event.el.related.field;
      const query = `${event.el.related.query}${
        event.value[0][event.el.related.param]
      }`;
      this.resetRalatedData(this.metadata, event.el.related.reset);
      this.getData(this.metadata, key, query);
    } else if (event.type === 'change' && event.el.type === 'rule') {
      const key = event.el.related.field;
      const query = `${event.el.related.query}${
        event.value[0][event.el.related.param]
      }`;
      this.getRalatedData(
        this.metadata,
        key,
        event.el.endpoint,
        null,
        query,
        event.el.related.prop,
        false
      );
    } else if (event.type === 'delete') {
      this.service.delete(event.endpoint, event.id).subscribe(
        (response: any) => this.parseResponse(response),
        (err: any) => this.parseError(err)
      );
      // } else if (event.type === 'update' && event.el.key === 'timeline') {
      //   this.getRalatedData(
      //     this.metadata,
      //     event.el.key,
      //     event.el.endpoint,
      //     null,
      //     event.query,
      //     undefined,
      //     false
      //   );
    } else if (event.type === 'address') {
      this.parseAddress(event.value, event.el);
    }
    this.event.emit(event);
  }

  public parseAddress(data, el) {
    this.service.submitForm('/core/addresses/parse/', data).subscribe(
      (res) => {
        this.parseError({});
        el.autocompleteData.next(res);
      },
      (err: any) => {
        this.parseError({ ...this.errors, [el.key]: err.errors['address'] });
      }
    );
  }

  public buttonActionHandler(e) {
    const { value } = e;

    switch (value) {
      case 'autoGenerate':
        this.generatePassword(e);
        break;

      case 'resend':
        this.resend(e);
        break;

      case 'syncInvoice':
        this.syncInvoice(this.id, e);
        break;

      case 'noBreak':
        this.noBreak(e);
        break;

      case 'buyProfile':
        this.buyProfile();
        break;

      case 'resendEmail':
        this.resendContactCheck(e, 'emails');
        break;

      case 'resendSms':
        this.resendContactCheck(e, 'smses');
        break;
    }

    this.buttonAction.emit(e);
  }

  resendContactCheck(e, type: 'emails' | 'smses') {
    const { data } = e;
    const contactId = data.contact ? data.contact.id : data.id;
    const endpoint = `${Endpoints.Contact}${contactId}/${type}/`;

    this.service.submitForm(endpoint, {}).subscribe((res) => {
      if (res.message) {
        this.toastrService.sendMessage(res.message, MessageType.Success);
      }
    });
  }

  public buyProfile() {
    const price = getElementFromMetadata(this.metadata, 'profile_price');
    const currency = getCurrencySymbol(
      this.settingsService.settings.currency,
      'wide'
    );

    this.modalInfo = {
      amount: currency + price.value
    };

    this.modalRef = this.modal.open(this.confirmProfileModal);
  }

  public confirmCandidateBuy() {
    this.saveProcess = true;

    const endpoint = `${Endpoints.CandidateContact}${this.id}/buy/`;
    const body = {
      company: this.userService.user.data.contact.company_id
    };

    this.service
      .submitForm(endpoint, body)
      .pipe(
        finalize(() => {
          this.saveProcess = false;
        })
      )
      .subscribe(
        () => {
          this.modalRef.close();
          this.toastrService.sendMessage(
            `${this.strValue} has been added to your Candidate Contact list`,
            MessageType.Success
          );
          this.router.navigate(['/mn/candidate/candidatecontacts/pool']);
        },
        () => {
          this.modalRef.close();
          this.toastrService.sendMessage(
            `Please add Credit Card for paid services!`,
            MessageType.Error
          );
          this.router.navigate(['/billing']);
        }
      );
  }

  public syncInvoice(id: string, e: any) {
    const endpoint = `${Endpoints.Invoice}${id}/sync/`;

    this.service.submitForm(endpoint, {}).subscribe((res) => {
      const synced_at = getElementFromMetadata(this.metadata, 'synced_at');
      synced_at.value = getTimeInstance().format();
      this.updateMetadata(this.metadata, 'synced_at');
      this.toastrService.sendMessage(
        'The invoice will be synchronized in a few minutes',
        MessageType.Success
      );
      if (e.el.hidden) {
        e.el.hidden.next(true);
      }
    });
  }

  public noBreak(e) {
    const noBreakCheckbox = getElementFromMetadata(this.metadata, 'noBreak');
    const value = !noBreakCheckbox.value;
    e.el.templateOptions.text = value ? 'Set break' : 'No Break';

    this.parseMetadata(
      this.metadata,
      {
        ['noBreak']: {
          action: 'add',
          data: {
            value
          }
        }
      },
      true
    );
  }

  public resend(e) {
    const endpoint = `/hr/joboffers/${e.data.resend_id}/resend/`;

    this.service.submitForm(endpoint, {}).subscribe(() => {
      this.event.emit({
        type: 'sendForm',
        status: 'success'
      });
    });
  }

  public generatePassword(e) {
    const formatString = new FormatString();

    const endpoint = formatString.format(
      '/core/contacts/{contact.id}/send_password/',
      e.data
    );

    if (e.data.by_email || e.data.by_phone) {
      this.service
        .submitForm(endpoint, { email: e.data.by_email, sms: e.data.by_phone })
        .subscribe((res: any) => {
          if (this.id === this.userService.user.data.user) {
            this.authService.logout();
          }
          setTimeout(() => {
            this.toastrService.sendMessage(res.message, MessageType.Success);
          }, 500);
        });
    }
  }

  public getRelatedMetadata(metadata, key, endpoint, metadataQuery) {
    let query = '?type=formset';
    if (metadataQuery) {
      query += `&${metadataQuery}`;
    }
    this.service.getMetadata(endpoint, query).subscribe((response: any) => {
      this.parseMetadata(metadata, {
        [key]: {
          action: 'add',
          data: {
            metadata: response.fields
          }
        }
      });
      this.getData(response.fields);
    });
  }

  public getRalatedData(
    metadata,
    key,
    endpoint,
    fields,
    query = null,
    param = 'options',
    update = true
  ) {
    if (!endpoint) {
      return;
    }
    let fieldsQuery;
    if (fields) {
      fieldsQuery = this.generateQueryForRelatedFields(fields);
    }
    if (query) {
      if (fieldsQuery) {
        query += `&${fieldsQuery}`;
      }
      this.service.getByQuery(endpoint, query).subscribe((response: any) => {
        this.parseMetadata(
          metadata,
          {
            [key]: {
              action: 'add',
              data: {
                [param]: response.results ? response.results : response,
                currentQuery: query
              }
            }
          },
          update
        );
        if (key === 'rules' && this.endpoint === Endpoints.WorkflowNode) {
          if (response) {
            const rules = getElementFromMetadata(metadata, 'rules');
            this.updateValueOfRules(response.results);
            this.parseMetadata(
              rules.activeMetadata,
              {
                [key]: {
                  action: 'add',
                  data: {
                    [param]: response.results ? response.results : response,
                    currentQuery: query
                  }
                }
              },
              update
            );
          }
          if (
            this.workflowData.company &&
            this.workflowData.number &&
            this.workflowData.workflow &&
            update
          ) {
            this.updateMetadata(metadata, key);
          }
        } else if (update) {
          this.updateMetadata(metadata, key);
        }
      });
    } else {
      this.service.getAll(endpoint).subscribe((response: any) => {
        this.parseMetadata(metadata, {
          [key]: {
            action: 'add',
            data: { [param]: response.results ? response.results : response }
          }
        });
      });
    }
  }

  public generateQueryForRelatedFields(fields) {
    let query = '';
    const display = fields.display ? fields.display : '__str__';
    const param = fields.param ? fields.param : 'id';
    if (fields.code2) {
      query += `fields=${fields.code2}&`;
    }
    query += `fields=${display}&fields=${param}`;
    return query;
  }

  public getData(metadata, key = null, query = null) {
    metadata.forEach((el) => {
      if (el.type === 'related') {
        if (el.key === key && el.endpoint) {
          this.getRalatedData(
            metadata,
            key,
            el.endpoint,
            {},
            query + '&limit=-1'
          );
        }
        if (!el.relate && !key) {
          const fields = <any>{};
          if (el.templateOptions.display) {
            fields.display = el.templateOptions.display;
          } else if (el.templateOptions.param) {
            fields.param = el.templateOptions.param;
          }
          // const keys = el.key.split('.');
          // if (keys.indexOf('country') > -1) {
          //   fields.code2 = 'code2';
          //   this.getRalatedData(metadata, el.key, el.endpoint, fields, '?limit=-1');
          // }
          el.options = [];
          if (el.list) {
            let metadataQuery;
            if (el.metadata_query) {
              metadataQuery = this.parseMetadataQuery(el, 'metadata_query');
            }
            this.getRelatedMetadata(
              metadata,
              el.key,
              el.endpoint,
              metadataQuery
            );
          }
        }
      } else if (el.children) {
        this.getData(el.children, key, query);
      }
    });
  }

  public parseMetadataQuery(data, field) {
    const keys = Object.keys(data[field]);
    const result = keys.map((query) => {
      return `${query}=${data[field][query]}`;
    });
    return result.join('&');
  }

  public parseMetadata(metadata, params, update = true) {
    metadata.forEach((el) => {
      if (el.type === 'hidden') {
        el.hide = this.hide;
      }
      if (el.type === 'timeline' || (el.type === 'list' && !el.delay)) {
        if (this.edit || this.editForm) {
          el.hide = false;
        } else {
          el.hide = true;
        }
      }
      if (el.type === 'list' || el.type === 'related') {
        el.delayData = this.delayData;
      }
      if (el && el.key && params && !!params[el.key]) {
        if (params[el.key].action === 'add') {
          let elem = getElementFromMetadata(metadata, el.key);
          elem = Object.assign(elem, params[elem.key].data);
          if (elem.related) {
            this.resetRalatedData(metadata, elem.related.reset);
          }
          if (update) {
            this.updateMetadata(metadata, el.key);

            const formInfo = getElementFromMetadata(metadata, 'id');

            if (formInfo && formInfo.metadata && formInfo.metadata[el.key]) {
              const newElem = Object.assign(
                formInfo.metadata[el.key],
                params[el.key].data
              );

              formInfo.metadata[el.key] = null;
              setTimeout(() => {
                formInfo.metadata[el.key] = newElem;
              }, 200);
            }
          }
          if (params[el.key].data && params[el.key].data.value) {
            this.getValueOfData(
              params[el.key].data.value,
              el.key,
              elem,
              metadata
            );
          }
        } else if (params[el.key].update) {
          const elem = getElementFromMetadata(metadata, el.key);
          if (elem.related) {
            this.resetRalatedData(metadata, elem.related.reset);
          }
          elem.value = params[el.key].value;
          if (params[el.key].block) {
            elem.readonly = true;
          }
          this.getRalatedData(
            metadata,
            el.key,
            el.endpoint,
            {},
            `${params[el.key].query}${params[el.key].id}&limit=-1`
          );
        } else if (params[el.key].action === 'update') {
          if (params[el.key].block) {
            const elem = getElementFromMetadata(metadata, el.key);
            elem.read_only = true;
          }
        }
      } else if (el && el.children) {
        this.parseMetadata(el.children, params);
      }
    });

    this.updateDatepickerByTimezone(metadata, params);

    return metadata;
  }

  public resetRalatedData(metadata, key, param = 'options') {
    metadata.forEach((el) => {
      if (el.key === key) {
        delete el[param];
        delete el.value;
      } else if (el.children) {
        this.resetRalatedData(el.children, key);
      }
    });
  }

  public updateErrors(error, errors, response, field = '') {
    if (errors) {
      const keyss = Object.keys(errors);
      keyss.forEach((el) => {
        if (errors[el].length) {
          if (field) {
            error[`${field}.${el}`] = errors[el];
            delete response[`${field}.${el}`];
          } else {
            error[el] = errors[el];
            delete response[el];
          }
        } else {
          this.updateErrors(error, errors[el], response, el);
        }
      });
    }
  }

  public resetData(data) {
    if (data) {
      const keys = Object.keys(data);
      keys.forEach((el) => {
        delete data[el];
      });
    }
  }

  public checkRuleElement(metadata) {
    const activeMetadata = {
      type: 'related',
      key: 'rules',
      read_only: false,
      many: true,
      useOptions: true,
      templateOptions: {
        label: 'Active',
        display: '{name_before_activation}',
        param: 'number'
      }
    };
    const ruleElement = getElementFromMetadata(metadata, 'rules');
    if (ruleElement) {
      ruleElement.activeMetadata = <any>[activeMetadata];
      Object.keys(this.workflowEndpoints).forEach((el, i) => {
        const newMetadata = [ruleElement, activeMetadata];
        const endpoint = this.workflowEndpoints[el];
        const param = el === 'state' ? 'options' : el;

        let query = '';
        if (el === 'state') {
          const company = getElementFromMetadata(metadata, 'company');
          const workflow = getElementFromMetadata(metadata, 'workflow');

          if (company && company.value) {
            query += `company=${company.value.id}&`;
          }

          if (workflow && workflow.value) {
            query += `workflow=${workflow.value.id}`;
          }
        }
        this.getRalatedData(
          newMetadata,
          'rules',
          endpoint,
          null,
          '?limit=-1&' + query,
          param
        );
      });
    }
  }

  public updateWorkflowData(event) {
    if (this.endpoint === Endpoints.WorkflowNode) {
      if (event && event.el) {
        if (
          event.el.key === 'workflow' ||
          event.el.key === 'number' ||
          event.el.key === 'company'
        ) {
          if (this.workflowData[event.el.key] !== event.value) {
            this.workflowData[event.el.key] = event.value;
            this.getDataOfWorkflownode();
          }
        }
      }
    }
  }

  public getDataOfWorkflownode() {
    const keys = Object.keys(this.workflowData);
    const res = [];
    keys.forEach((el) => {
      if (this.workflowData[el] || this.workflowData[el] === 0) {
        res.push(true);
      } else {
        return;
      }
    });

    if (res.length === keys.length) {
      const query = [];
      keys.forEach((el) => {
        if (this.workflowData[el]) {
          if (el !== 'number' && el !== 'el') {
            query.push(`${el}=${this.workflowData[el]}`);
          }
        }
      });
      query.push('limit=-1');
      const element = getElementFromMetadata(this.metadata, 'rules');
      this.getRalatedData(
        this.metadata,
        'rules',
        this.workflowEndpoints.state,
        null,
        `?${query.join('&')}`
      );
    }
  }

  public updateMetadata(data, key) {
    const element = getElementFromMetadata(data, key);
    data.forEach((el, i) => {
      if (el.key === key) {
        data.splice(i, 1, Object.assign({}, element));
      } else if (el.children) {
        this.updateMetadata(el.children, key);
      }
    });
  }

  public updateValueOfRules(res) {
    const key = 'rules';
    if (res && res.length > 0) {
      const result = res.filter(
        (el) => el.number === +this.workflowData.number
      )[0];
      const element = getElementFromMetadata(this.metadata, key);
      if (result) {
        element.value = result.rules;
      } else {
        element.value = null;
      }
    }
  }

  public updateElements(metadata, param, type?, value?) {
    metadata.forEach((el) => {
      if (type && el.type === type) {
        el[param] = value;
      } else if (!type) {
        el[param] = value;
        if (el.children) {
          this.updateElements(el.children, param, type, value);
        }
      } else if (el.children) {
        this.updateElements(el.children, param, type, value);
      }
    });
  }

  public checkFormStorage(metadata: any[], endpoint: string) {
    if (endpoint === '/core/formstorages/') {
      metadata.forEach((el, i) => {
        if (el.key === 'data') {
          el.type = 'json';
          el.read_only = true;
        } else if (el.key === 'status') {
          el.hide = true;
        } else if (el.children) {
          this.checkFormStorage(el.children, endpoint);
        }
      });
    }
  }

  public checkFormBuilder(metadata: any[], endpoint: string) {
    if (endpoint === '/core/forms/') {
      let groupElement: any;
      const groupKey = 'groups';
      metadata.forEach((el, i) => {
        if (el.key === groupKey) {
          groupElement = metadata.splice(i, 1)[0];
        }
      });
      if (groupElement) {
        groupElement.read_only = false;
        groupElement.createOnly = true;
        groupElement.type = 'fieldsGroup';
        if (this.editForm) {
          metadata.push(groupElement);
        } else {
          this.splitElements.push(groupElement);
        }
      }
    }
    if (
      endpoint === '/core/selectformfields/' ||
      endpoint === '/core/radiobuttonsformfields/'
    ) {
      metadata.forEach((el) => {
        if (el.key === 'choices') {
          el.type = 'formOptions';
        }
      });
    }
  }

  public getReplaceElements(metadata: Field[]) {
    metadata.forEach((el) => {
      if (el.type === 'replace') {
        this.replaceElements.push(el);
      } else if (el.children) {
        this.getReplaceElements(el.children);
      }
    });
  }

  public addCustomTemplates(metadata, data) {
    metadata.forEach((el) => {
      if (el.custom) {
        el.customValue = [];

        el.custom.forEach((field) => {
          el.customValue.push(
            this.getValueOfData(data, field, {}, this.metadata)
          );
        });
      } else if (el.children) {
        this.addCustomTemplates(el.children, data);
      }
    });
  }

  public generateQuery(queries, data) {
    const format = new FormatString();
    let query = '&';
    if (queries) {
      const keys = Object.keys(queries);
      keys.forEach((el) => {
        query +=
          typeof queries[el] === 'string'
            ? queries[el] === 'currentCompany'
              ? `${el}=${this.settingsService.settings.company}&`
              : `${el}=${format.format(queries[el], data)}&`
            : `${el}=${queries[el]}&`;
      });
      query = query.slice(0, query.length - 1);
    }
    return query.length > 1 ? query : '';
  }

  public setFormGroup(form: FormGroup) {
    this.formGroup = form;
  }

  public checkTimeline(timeline) {
    if (this.endpoint === Endpoints.Job) {
      if (timeline === TimelineAction.Reset) {
        this.event.emit({
          type: 'sendForm',
          data: Object.assign(this.formData.value.data),
          status: 'success'
        });
        return;
      }

      const activeNumber = 2;
      if (Array.isArray(timeline)) {
        const currentState = timeline.find(
          (item) => item.state === activeNumber
        );

        if (currentState) {
          switch (currentState.number) {
            case 10:
              this.updateToNewMetadata();
              break;
            case 40:
              this.updateToOnHoldMetadata();
              break;
            case 60:
              this.updateToCompletedMetadata();
              break;
            default:
              break;
          }
        }
      }
    }

    if (this.endpoint === Endpoints.CandidateContact) {
      if (timeline === TimelineAction.Reset) {
        this.event.emit({
          type: 'sendForm',
          data: Object.assign(this.formData.value.data),
          status: 'success'
        });
        return;
      }

      const activeNumber = 2;
      if (Array.isArray(timeline)) {
        let currentState = timeline.find((item) => item.state === activeNumber);

        currentState =
          timeline.find(
            (item) => item.state === activeNumber && item.number === 70
          ) || currentState;

        if (currentState) {
          switch (currentState.number) {
            case 70:
              this.showPriceForCandidate();
              break;
            default:
              this.showPriceMessage();
              break;
          }
        }
      }
    }
  }

  public showPriceMessage() {
    const profileMessage = getElementFromMetadata(
      this.metadata,
      'profile_message'
    );

    profileMessage.hide = false;
  }

  public showPriceForCandidate() {
    const profilePrice = getElementFromMetadata(this.metadata, 'profile_price');

    profilePrice.hide = false;
  }

  public setPropertyTrueValue(fields: Field[], prop: string) {
    fields.forEach((el) => {
      if (el) {
        el[prop] = true;
      }
    });
  }

  public updateToOnHoldMetadata() {
    const formInfo = getElementFromMetadata(this.metadata, 'id');
    const shifts = getElementFromMetadata(this.metadata, 'shifts', 'listKey');
    const joboffers = getElementFromMetadata(
      this.metadata,
      'joboffers',
      'listKey'
    );

    this.setPropertyTrueValue([formInfo, shifts, joboffers], 'disableButtons');
  }

  public updateToNewMetadata() {
    const formInfo = getElementFromMetadata(this.metadata, 'id');
    const shifts = getElementFromMetadata(this.metadata, 'shifts', 'listKey');
    const joboffers = getElementFromMetadata(
      this.metadata,
      'joboffers',
      'listKey'
    );
    const favouritelists = getElementFromMetadata(
      this.metadata,
      'favouritelists',
      'listKey'
    );

    this.setPropertyTrueValue([formInfo], 'disableButtons');
    this.setPropertyTrueValue([shifts, joboffers, favouritelists], 'hide');
  }

  public updateToCompletedMetadata() {
    const formInfo = getElementFromMetadata(this.metadata, 'id');
    const shifts = getElementFromMetadata(this.metadata, 'shifts', 'listKey');
    const joboffers = getElementFromMetadata(
      this.metadata,
      'joboffers',
      'listKey'
    );
    const favouritelists = getElementFromMetadata(
      this.metadata,
      'favouritelists',
      'listKey'
    );
    const workflowobjects = getElementFromMetadata(
      this.metadata,
      'workflowobjects',
      'listKey'
    );

    this.setPropertyTrueValue(
      [formInfo, shifts, joboffers, favouritelists, workflowobjects],
      'disableButtons'
    );
    this.setPropertyTrueValue(
      [shifts, joboffers, favouritelists],
      'disableActions'
    );
    this.formService.disableEditMode(this.formId);
  }
}
