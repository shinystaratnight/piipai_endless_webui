import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/finally';

import { GenericFormService, FormService } from '../../services/';
import { UserService } from '../../../services';

import { ToastrService } from '../../../shared/services/toastr.service';

import { Field } from '../../models/field.model';

import { FormatString } from '../../../helpers/format';
import { getElementFromMetadata } from '../../helpers/utils';

import moment from 'moment-timezone';

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
  selector: 'generic-form',
  templateUrl: 'generic-form.component.html'
})
export class GenericFormComponent implements OnChanges, OnDestroy {
  @Input()
  public form: any;
  @Input()
  public id: string;
  @Input()
  public hide: boolean;
  @Input()
  public edit: boolean;
  @Input()
  public mode: string;
  @Input()
  public delay: boolean;
  @Input()
  public metadataQuery: string;
  @Input()
  public path: string;
  @Input()
  public checkEmail: string;

  @Input()
  public endpoint: string = '';
  @Input()
  public data = {};
  @Input()
  public needData: boolean = true;
  @Input()
  public response: any = {};
  @Input()
  public errors = {};
  @Input()
  public relatedField = {};
  @Input()
  public showResponse: boolean = false;

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

  public currentEndpoint: string;
  public currentId: string;
  public formId: number;
  public metadata: Field[] = [];

  public hasTabs: boolean;
  public formData: BehaviorSubject<any>;
  public modeBehaviorSubject: BehaviorSubject<string>;

  public metadataError = [];
  public splitElements: any[] = [];
  public showForm: boolean = false;
  public editForm: boolean = false;
  public hiddenFields: HiddenFields = {
    elements: [],
    keys: [],
    observers: []
  };
  public workflowEndpoints = {
    state: `/ecore/api/v2/core/workflownodes/`,
    app: `/ecore/api/v2/apps/`
  };
  public pictures = {
    '/ecore/api/v2/core/contacts/': '__str__',
    '/ecore/api/v2/candidate/candidatecontacts/': '__str__'
  };
  public workflowData = <any>{
    workflow: null,
    number: null,
    company: null
  };
  public replaceElements: Field[] = [];
  public delayData = {};

  public format = new FormatString();

  public updateDataBeforeSendForm: UpdateDataInfo;
  public updateDataAfterSendForm: UpdateDataInfo;

  public checkObject: any = {};

  private subscriptions: Subscription[];

  constructor(
    private service: GenericFormService,
    private formService: FormService,
    private toastrService: ToastrService,
    private userService: UserService
  ) {
    this.subscriptions = [];

    this.updateDataAfterSendForm = {
      config: [],
      requests: []
    };
    this.updateDataBeforeSendForm = {
      config: [],
      requests: []
    };
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(
      (subscription) => subscription && subscription.unsubscribe()
    );
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (!this.formId && this.formId !== 0) {
      this.formId = this.formService.registerForm(this.endpoint, this.mode);

      const subscription = this.formService
        .getForm(this.formId)
        .mode.skip(1)
        .subscribe((mode: string) => {
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
      let patt = /\?/;
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

    const timelineSubject = new Subject();
    const props = {
      formId: this.formId,
      formData: this.formData,
      mode: this.mode === 'view' ? this.modeBehaviorSubject : undefined,
      autocompleteData: new Subject()
    };

    return (el: Field) => {
      if (
        el.key === 'timeline' ||
        (el.endpoint && el.endpoint === '/ecore/api/v2/core/workflowobjects/')
      ) {
        el.timelineSubject = timelineSubject;
      }

      if (el.type === 'tabs') {
        this.hasTabs = true;
      }

      if (el.key || el.type === 'list') {
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

      if (el.key && el.type === 'related' && el.useOptions) {
        this.getRalatedData(
          this.metadata,
          el.key,
          el.endpoint,
          {},
          '?limit=-1'
        );
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

  public checkFormInfoElement(metadata: any[]) {
    const infoElement = getElementFromMetadata(metadata, 'id');

    if (infoElement && infoElement.type === 'info') {
      const keys = Object.keys(infoElement.values);
      infoElement.metadata = <any>{};
      keys.forEach((el) => {
        const value = infoElement.values[el];
        if (typeof value === 'string') {
          const key = value.replace('.__str__', '');
          const element = getElementFromMetadata(metadata, key);

          const fieldsWithLabel = [
            'carrier_list_reserve',
            'website',
            'name',
            'jobsite'
          ];

          if (element) {
            element.saveField = element.saveField !== false;
            infoElement.metadata[el] = Object.assign(
              {},
              element,
              {
                hide: false
              },
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
          (this.metadataQuery ? `&${this.metadataQuery}` : '') //tslint:disable-line
      )
      .subscribe(
        (data: any) => {
          this.getReplaceElements(data);
          this.metadata = this.parseMetadata(data, this.data);
          this.metadata = this.parseMetadata(data, this.relatedField);

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

  public parseCheckObject(data) {
    if (
      this.endpoint === '/ecore/api/v2/core/companycontacts/' ||
      this.endpoint === '/ecore/api/v2/candidate/candidatecontacts/'
    ) {
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
          if (send && this.checkObject[key].cache) {
            send = queryParams.some(
              (param) => query[param] !== this.checkObject[key].cache[param]
            );
          }
          this.checkObject[key].cache = query;

          if (send) {
            this.service
              .getByQuery(
                this.checkObject[key].endpoint,
                '?' +
                  Object.keys(query)
                    .map((param) => `${param}=${query[param]}`)
                    .join('&')
              )
              .subscribe((res) => {
                if (res.count) {
                  const config = this.checkObject[key];
                  let errors;
                  if (this.endpoint === '/ecore/api/v2/core/companycontacts/') {
                    errors = {
                      [key]: this.generateCustomError(
                        res,
                        config,
                        '/core/companycontacts/',
                        'company_contact'
                      ) //tslint:disable-line
                    };
                  } else if (
                    this.endpoint ===
                    '/ecore/api/v2/candidate/candidatecontacts/'
                  ) {
                    errors = {
                      [key]: this.generateCustomError(
                        res,
                        config,
                        '/candidate/candidatecontacts/'
                      )
                    };
                  }
                  this.updateErrors(this.errors, errors, this.response);
                } else {
                  this.updateErrors(
                    this.errors,
                    { [key]: '  ' },
                    this.response
                  );
                }
              });
          }
        });
      }
    }
  }

  public generateCustomError(
    response: any,
    field?: any,
    path?: string,
    property?: string
  ) {
    const object = property
      ? response.results[0][property]
      : response.results[0];

    return [
      field.error,
      object.__str__,
      `${this.path || path}${object.id}/change`,
      { ...object, endpoint: this.endpoint }
    ];
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
      if (el.key || el.type === 'list') {
        el.formData = formData;
      } else if (el.children) {
        this.updateFormData(el.children, formData);
      }
    });
  }

  public updateDataOfReplaceElements(element) {
    if (this.id) {
      let endp = `${this.endpoint}${this.id}/`;
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
    let endp = id ? `${endpoint}${id}/` : endpoint;
    this.service.getAll(endp).subscribe((data: any) => {
      this.fillingForm(this.metadata, data);
      this.checkRuleElement(this.metadata);

      this.addCustomTemplates(this.metadata, data);
      this.showForm = true;
      const formData = new BehaviorSubject({ data });
      this.updateFormData(this.metadata, formData);
      this.checkFormInfoElement(this.metadata);
      this.str.emit({
        str: data && data.__str__ ? data.__str__ : '',
        data
      });
    });
  }

  public fillingForm(metadata, data) {
    metadata.forEach((el) => {
      if (el.update) {
        const value = this.getValueOfData(data, el.key, metadata, {});
        el.update['data'] =
          Array.isArray(value) && value.length
            ? value.map((item) => item.id)
            : value;
      }

      if (el.templateOptions) {
        el.templateOptions.label = this.format.format(
          el.templateOptions.label,
          data
        );
        el.templateOptions.text = this.format.format(
          el.templateOptions.text,
          data
        );
      }
      if (el.type === 'input') {
        if (el.templateOptions && el.templateOptions.type === 'picture') {
          el.companyContact = this.endpoint === '/ecore/api/v2/core/companies/';
          if (this.pictures[this.endpoint]) {
            el.contactName = data['__str__'];
          }
        }
      }
      if (el.key && el.key !== 'timeline') {
        if (el.type === 'replace') {
          el.data = new BehaviorSubject(data);
        }
        if (el.type === 'related' && el.list) {
          el.data = new BehaviorSubject(
            this.getValueOfData(data, el.key, el, metadata)
          );
          if (el.prefilled) {
            const keys = Object.keys(el.prefilled);
            keys.forEach((elem) => {
              el.prefilled[elem] = this.format.format(el.prefilled[elem], data);
            });
          }
        }
        this.getValueOfData(data, el.key, el, metadata);
      } else if (el.key && el.key === 'timeline') {
        el.value = data;
      } else if (el.type === 'list') {
        if (el.endpoint) {
          el.endpoint = this.format.format(el.endpoint, data);
        }
        if (el.add_endpoint) {
          el.add_endpoint = this.format.format(el.add_endpoint, data);
        }
        if (el.query) {
          const queryKeys = Object.keys(el.query);
          queryKeys.forEach((elem) => {
            el.query[elem] = this.format.format(el.query[elem], data);
          });
        }
        if (el.prefilled) {
          const keys = Object.keys(el.prefilled);
          keys.forEach((elem) => {
            el.prefilled[elem] = this.format.format(el.prefilled[elem], data);
          });
        }
      } else if (el.children) {
        if (el.type === 'row') {
          el.label = this.format.format(el.label, data);
        }
        this.fillingForm(el.children, data);
      }
    });
  }

  public getValueOfData(data, key, obj, metadata?, update = false) {
    let keys = key.split('.');
    let prop = keys.shift();
    if (keys.length === 0) {
      if (data) {
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
      const subscription = Observable.forkJoin(...requests)
        .finally(() => {
          this.event.emit({
            type: 'sendForm',
            viewData: result,
            sendData: data,
            status: 'success'
          });
        })
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

  public extendJob(data) {
    const shiftDatesRequests = {};

    data.extend.forEach((shiftDate) => {
      const body = {
        shift_date: shiftDate.date,
        job: data.job,
        skill: data.skill
      };
      const shifts = shiftDate.data.value;

      shiftDatesRequests[shiftDate.date] = {
        shiftDate: this.service.submitForm(
          '/ecore/api/v2/hr/shiftdates/',
          body
        ),
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
              this.service.submitForm('/ecore/api/v2/hr/shifts/', body)
            );
          });

          if (shiftsRequests.requests.length) {
            shiftsRequests.requests.forEach((request, i) => {
              request.subscribe((response) => {
                const fillInBody = {
                  candidates: shiftDatesRequests[date].shifts[i].candidates,
                  shifts: [response.id]
                };

                this.service
                  .submitForm(
                    `/ecore/api/v2/hr/jobs/${data.job.id}/fillin/`,
                    fillInBody
                  )
                  .subscribe(() => {
                    const message = `${shiftsRequests.date} ${moment(
                      response.time,
                      'HH:mm:ss'
                    ).format('hh:mm A')} created`; //tslint:disable-line
                    this.toastrService.sendMessage(message, 'success');
                  });
              });
            });
          }
        });
      });
    }

    this.event.emit({
      type: 'sendForm',
      status: 'success'
    });
  }

  public submitForm(data) {
    if (data.extend) {
      this.extendJob(data);
      return;
    }

    if (!this.checkDelayData()) {
      return;
    }

    const newData = this.form ? { ...data, ...this.form } : data || {};

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

    if (this.updateDataAfterSendForm.config.length) {
      this.createUpdateRequests(newData, this.updateDataAfterSendForm);
    }

    if (this.updateDataBeforeSendForm.config.length) {
      this.createUpdateRequests(newData, this.updateDataBeforeSendForm);

      const subscription = Observable.forkJoin(
        ...this.updateDataBeforeSendForm.requests
      ).subscribe(() => {
        this.sendForm(newData);
      });

      this.subscriptions.push(subscription);

      return;
    }

    this.sendForm(newData);
  }

  public sendForm(data: any) {
    if (this.editForm || this.edit) {
      const endpoint = this.editForm
        ? `${this.endpoint}${this.id ? this.id + '/' : ''}`
        : this.endpoint;

      this.saveForm(endpoint, data, true);
    } else {
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
      this.service
        .editForm(endpoint, data)
        .subscribe(
          (response: any) => this.responseHandler(response, data),
          (errors: any) => this.parseError(errors.errors)
        );
    } else {
      this.service
        .submitForm(endpoint, data)
        .subscribe(
          (response: any) => this.responseHandler(response, data),
          (errors: any) => this.parseError(errors.errors)
        );
    }
  }

  public responseHandler(response: any, sendData: any) {
    this.formService.getForm(this.formId).setSaveProcess(false);
    this.parseResponse(response);

    if (response.message) {
      setTimeout(() => {
        this.toastrService.sendMessage(response.message, 'success');
      }, 500);
    }

    if (this.updateDataAfterSendForm.requests.length) {
      const subscription = Observable.forkJoin(
        ...this.updateDataAfterSendForm.requests
      )
        .finally(() => {
          this.event.emit({
            type: 'sendForm',
            viewData: response,
            sendData,
            status: 'success'
          });
        })
        .subscribe();

      this.subscriptions.push(subscription);
    } else {
      this.event.emit({
        type: 'sendForm',
        data: Object.assign(response, this.formData.value.data),
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
    this.formService.getForm(this.formId).setSaveProcess(false);
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
          this.delayData[el].message = 'This field is required.';
        }
      });

      return delayEndppoints.length === count;
    }

    return true;
  }

  public parseResponse(response) {
    this.resetData(this.errors);
    this.resetData(this.response);

    if (!this.editForm && this.showResponse) {
      this.response = { ...response };
    }

    this.responseForm.emit(response);
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

            this.service.submitForm(endpoint, body).subscribe(() => {
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
      let key = event.el.related.field;
      let query = `${event.el.related.query}${
        event.value[0][event.el.related.param]
      }`;
      this.resetRalatedData(this.metadata, event.el.related.reset);
      this.getData(this.metadata, key, query);
    } else if (event.type === 'change' && event.el.type === 'rule') {
      let key = event.el.related.field;
      let query = `${event.el.related.query}${
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
      this.service
        .delete(event.endpoint, event.id)
        .subscribe(
          (response: any) => this.parseResponse(response),
          (err: any) => this.parseError(err)
        );
    } else if (event.type === 'update' && event.el.key === 'timeline') {
      this.getRalatedData(
        this.metadata,
        event.el.key,
        event.el.endpoint,
        null,
        event.query,
        undefined,
        false
      );
    } else if (event.type === 'address') {
      this.parseAddress(event.value, event.el);
    }
    this.event.emit(event);
  }

  public parseAddress(data, el) {
    this.service
      .submitForm('/ecore/api/v2/core/addresses/parse/', data)
      .subscribe(
        (res) => {
          this.parseError({});
          el.autocompleteData.next(res);
        },
        (err: any) => {
          this.parseError(Object.assign(this.errors, { [el.key]: err.errors }));
        }
      );
  }

  public buttonActionHandler(e) {
    if (e.value === 'autoGenerate') {
      this.generatePassword(e);
    }

    this.buttonAction.emit(e);
  }

  public generatePassword(e) {
    const formatString = new FormatString();

    const endpoint = formatString.format(
      '/ecore/api/v2/core/contacts/{contact.id}/send_password/',
      e.data
    );

    if (e.data.by_email || e.data.by_phone) {
      this.service
        .submitForm(endpoint, { email: e.data.by_email, sms: e.data.by_phone })
        .subscribe((res: any) => {
          if (this.id === this.userService.user.data.user) {
            this.userService.logout();
          }
          setTimeout(() => {
            this.toastrService.sendMessage(res.message, 'success');
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
        if (
          key === 'rules' &&
          this.endpoint === '/ecore/api/v2/core/workflownodes/'
        ) {
          if (response) {
            let rules = getElementFromMetadata(metadata, 'rules');
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
    let display = fields.display ? fields.display : '__str__';
    let param = fields.param ? fields.param : 'id';
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
          let fields = <any>{};
          if (el.templateOptions.display) {
            fields.display = el.templateOptions.display;
          } else if (el.templateOptions.param) {
            fields.param = el.templateOptions.param;
          }
          let keys = el.key.split('.');
          if (keys.indexOf('country') > -1) {
            fields.code2 = 'code2';
            this.getRalatedData(
              metadata,
              el.key,
              el.endpoint,
              fields,
              '?limit=-1'
            );
          }
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
        // if (el.delay && !this.editForm) {
        el.delayData = this.delayData;
        // } else {
        //   el.delay = undefined;
        // }
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
          let elem = getElementFromMetadata(metadata, el.key);
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
            let elem = getElementFromMetadata(metadata, el.key);
            elem.read_only = true;
          }
        }
      } else if (el && el.children) {
        this.parseMetadata(el.children, params);
      }
    });
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
      let keyss = Object.keys(errors);
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
      let keys = Object.keys(data);
      keys.forEach((el) => {
        delete data[el];
      });
    }
  }

  public checkRuleElement(metadata) {
    let activeMetadata = {
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
    let ruleElement = getElementFromMetadata(metadata, 'rules');
    if (ruleElement) {
      ruleElement.activeMetadata = <any>[activeMetadata];
      Object.keys(this.workflowEndpoints).forEach((el, i) => {
        let newMetadata = [ruleElement, activeMetadata];
        let endpoint = this.workflowEndpoints[el];
        let param = el === 'state' ? 'options' : el;

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
    if (this.endpoint === '/ecore/api/v2/core/workflownodes/') {
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
    let keys = Object.keys(this.workflowData);
    const res = [];
    keys.forEach((el) => {
      if (this.workflowData[el] || this.workflowData[el] === 0) {
        res.push(true);
      } else {
        return;
      }
    });

    if (res.length === keys.length) {
      let query = [];
      keys.forEach((el) => {
        if (this.workflowData[el]) {
          if (el !== 'number' && el !== 'el') {
            query.push(`${el}=${this.workflowData[el]}`);
          }
        }
      });
      query.push('limit=-1');
      let element = getElementFromMetadata(this.metadata, 'rules');
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
    let element = getElementFromMetadata(data, key);
    data.forEach((el, i) => {
      if (el.key === key) {
        data.splice(i, 1, Object.assign({}, element));
      } else if (el.children) {
        this.updateMetadata(el.children, key);
      }
    });
  }

  public updateValueOfRules(res) {
    let key = 'rules';
    if (res && res.length > 0) {
      let result = res.filter(
        (el) => el.number === +this.workflowData.number
      )[0];
      let element = getElementFromMetadata(this.metadata, key);
      if (result) {
        element.value = result.rules;
      } else {
        element.value = null;
      }
    }
  }

  public updateElements(metadata, param, type = undefined, value) {
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
    if (endpoint === '/ecore/api/v2/core/formstorages/') {
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
    if (endpoint === '/ecore/api/v2/core/forms/') {
      let groupElement: any;
      let groupKey: string = 'groups';
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
      endpoint === '/ecore/api/v2/core/selectformfields/' ||
      endpoint === '/ecore/api/v2/core/radiobuttonsformfields/'
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
}
