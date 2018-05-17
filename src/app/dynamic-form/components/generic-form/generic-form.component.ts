import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/finally';

import { GenericFormService } from './../../services/generic-form.service';

import { Field } from '../../models/field.model';

import { FormatString } from '../../../helpers/format';

interface HiddenFields {
  elements: Field[];
  keys: string[];
  observers: string[];
}

@Component({
  selector: 'generic-form',
  templateUrl: 'generic-form.component.html'
})

export class GenericFormComponent implements OnChanges, OnInit {

  @Input()
  public endpoint: string = '';

  @Input()
  public data = {};

  @Input()
  public modal: boolean;

  @Input()
  public title: boolean;

  @Input()
  public needData: boolean = true;

  @Input()
  public response: any = {};

  @Input()
  public errors = {};

  @Input()
  public relatedField = {};

  @Input()
  public form: any;

  @Input()
  public id: string;

  @Input()
  public commonFields: string;

  @Input()
  public hide: boolean;

  @Input()
  public edit: boolean;

  @Input()
  public showResponse: boolean = false;

  @Input()
  public mode: string;

  @Input()
  public delay: boolean;

  @Input()
  public metadataQuery: string;

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

  public metadata: Field[] = [];
  public metadataError = [];
  public sendData = null;
  public currentEndpoint: string;
  public currentId: string;
  public splitElements: any[] = [];
  public show: boolean = false;
  public editForm: boolean = false;
  public formObject: any;
  public hiddenFields: HiddenFields = {
    elements: [],
    keys: [],
    observers: []
  };

  public workflowEndpoints = {
    state: `/ecore/api/v2/core/workflownodes/`,
    app: `/ecore/api/v2/apps/`
  };

  public workflowData = <any> {};

  public replaceElements: Field[] = [];

  public format = new FormatString();

  public delayData = {};

  public candidateFill: boolean;

  public pictures = {
    '/ecore/api/v2/core/contacts/': '__str__',
    '/ecore/api/v2/candidate/candidatecontacts/': '__str__',
  };

  constructor(
    private service: GenericFormService
  ) {}

  public ngOnInit() {
    if (this.id && !this.mode) {
      this.mode = 'view';
      setTimeout(() => {
        this.modeEvent.emit(this.mode);
      }, 100);
    }

    if (this.endpoint.indexOf('candidate_fill')) {
      this.candidateFill = true;
    }
  }

  public ngOnChanges() {
    if (this.currentId !== this.id) {
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
        this.toggleModeMetadata(this.metadata, this.mode);
      }
    }
  }

  public setModeForElement(metadata: Field[], mode) {
    if (mode === 'view') {
      metadata.forEach((el) => {
        if (el.key) {
          el.mode = new BehaviorSubject(mode);
        } else if (el.children) {
          this.setModeForElement(el.children, mode);
        }
      });
    }
  }

  public toggleModeMetadata(metadata: Field[], mode: string) {
    metadata.forEach((el) => {
      if (el.key) {
        el.mode.next(mode);
        if (el.type === 'related' && el.list) {
          this.toggleModeMetadata(el.metadata, mode);
        }
      } else if (el.children) {
        this.toggleModeMetadata(el.children, mode);
      }
    });
  }

  public formChange(data) {
    let newData = {};
    Object.keys(data).forEach((el) => {
      newData[el] = {
        action: 'add',
        data: {
          value: data[el]
        }
      };
    });
    this.metadata = this.parseMetadata(this.metadata, newData);
    this.parseError(Object.assign({}, this.errors));
  }

  public getMetadata(endpoint) {
    this.service
      .getMetadata(endpoint, '?type=form' + (this.metadataQuery ? `&${this.metadataQuery}` : ''))
      .subscribe(
        ((data: any) => {

          if (endpoint) {
            data = candidate_metadata; //tslint:disable-line
          }
          console.dir(data);

          this.setModeForElement(data, this.mode);
          this.getReplaceElements(data);
          this.metadata = this.parseMetadata(data, this.data);
          this.saveHiddenFields(this.metadata);
          this.metadata = this.parseMetadata(data, this.relatedField);
          this.checkRuleElement(this.metadata);
          this.checkFormBuilder(this.metadata, this.endpoint);
          this.checkFormStorage(this.metadata, this.endpoint);
          this.getData(this.metadata);
          if ((this.id || this.edit) && this.metadata) {
            if (this.id) {
              this.editForm = true;
            }
            this.show = false;
            if (this.needData) {
              this.getDataForForm(this.endpoint, this.id);
              this.updateElements(this.metadata, 'id', 'list', this.id);
              this.updateElements(this.metadata, 'editForm', undefined, true);
            } else {
              this.show = true;
            }
          } else {
            this.str.emit({
              str: 'Add'
            });
            this.show = true;
          }
        }),
        ((error: any) => this.metadataError = error));
  }

  public saveHiddenFields(metadata: Field[]) {
    metadata.forEach((el) => {
      if (el.showIf && el.showIf.length) {
        if (this.hiddenFields.keys.indexOf(el.key) === -1) {
          this.hiddenFields.keys.push(el.key);
          this.hiddenFields.elements.push(el);
          this.hiddenFields.observers = this.observeFields(el.showIf, this.hiddenFields.observers);
          el.hidden = new BehaviorSubject(true);
        }
      } else if (el.children) {
        this.saveHiddenFields(el.children);
      }
    });
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
      this.service.getAll(endp).subscribe(
        (data: any) => {
          this.replaceElements.forEach((el) => {
            if (el.data) {
              el.data.next(data);
            }
          });
          if (element.type === 'related') {
            element.data.next(this.getValueOfData(data, element.key, element, undefined, true));
          }
        }
      );
    } else {
      return;
    }
  }

  public getDataForForm(endpoint, id) {
    let endp = id ? `${endpoint}${id}/` : endpoint;
    this.service.getAll(endp).subscribe(
      ((data: any) => {
        this.fillingForm(this.metadata, data);
        this.addCustomTemplates(this.metadata, data);
        this.show = true;
        const formData = new BehaviorSubject({ data });
        this.updateFormData(this.metadata, formData);
        this.str.emit({
          str: data && data.__str__ ? data.__str__ : '',
          data
        });
      }
    ));
  }

  public fillingForm(metadata, data) {
    metadata.forEach((el) => {
      if (el.templateOptions) {
        el.templateOptions.label = this.format.format(el.templateOptions.label, data);
        el.templateOptions.text = this.format.format(el.templateOptions.text, data);
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
          el.data = new BehaviorSubject(this.getValueOfData(data, el.key, el, metadata));
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

  public getValueOfData(data, key, obj, metadata, update = false) {
    let keys = key.split('.');
    let prop = keys.shift();
    if (keys.length === 0) {
      if (data) {
        if (!obj['value'] || update) {
          if (key === 'self') {
            obj['value'] = data;
          } else {
            obj['value'] = data[key];
          }
        }
        if (obj.type === 'related') {
          let endpoint;
          if (obj.value) {
            if (obj.value instanceof Object) {
              if (obj.value.id && obj.value.__str__) {
                obj.options = [obj.value];
              }
            } else if (Array.isArray(obj.value) && obj.value.length) {
              if (!(obj.value[0] instanceof Object) && !obj.list) {
                endpoint = obj.endpoint;
              }
            } else {
              endpoint = obj.endpoint && `${obj.endpoint}${obj.value}/`;
            }
          } else {
            obj.options = [];
          }
          if (endpoint) {
            this.getRalatedData(metadata, obj.key, endpoint, {}, null, 'value', true);
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
          const el = this.getElementFromMetadata(this.metadata, key);

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
      Observable.forkJoin(...requests)
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
    }
  }

  public createRequest(endpoint, id) {
    return this.service.getAll(endpoint + id + '/');
  }

  public submitForm(data) {
    if (!this.checkDelayData()) {
      return;
    }
    let newData = {};
    if (this.form) {
      newData = Object.assign({}, data, this.form);
    } else {
      newData = data;
    }
    this.sendData = newData;
    if (this.response.message) {
      this.response.message = '';
    }
    this.event.emit({
      type: 'saveStart'
    });
    if (this.delay) {
      this.checkRelatedData(newData);
      return;
    }
    if (this.editForm || this.edit) {
      let endpoint = this.editForm ? `${this.endpoint}${(this.id ? this.id + '/' : '')}` : this.endpoint; //tslint:disable-line
      this.service.editForm(endpoint, newData).subscribe(
        ((response: any) => {
          this.parseResponse(response);
          this.event.emit({
            type: 'sendForm',
            data: response,
            status: 'success'
          });
        }),
        ((errors: any) => this.parseError(errors.errors)));
    } else {
      this.service.submitForm(this.endpoint, newData).subscribe(
        ((response: any) => {
          this.parseResponse(response);
        }),
        ((errors: any) => this.parseError(errors.errors)));
    }
  }

  public parseError(errors) {
    if (errors) {
      if (errors.register) {
        this.redirect.emit({
          field: errors.register,
          value: this.sendData.username
        });
        return;
      }
    }
    this.resetData(this.errors);
    this.resetData(this.response);
    this.errors = this.updateErrors(this.errors, errors, this.response);
    this.errorForm.emit(this.errors);
  }

  public checkDelayData() {
    const delayEndppoints = Object.keys(this.delayData);

    let count = 0;
    if (delayEndppoints.length) {
      delayEndppoints.forEach((el) => {
        if (this.delayData[el].data.sendData && this.delayData[el].data.sendData.length) {
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
      this.response = response;
    }

    this.responseForm.emit(response);
    const delayEndppoints = Object.keys(this.delayData);

    if (delayEndppoints.length) {
      delayEndppoints.forEach((endpoint: string) => {
        const prefilledDataKeys = Object.keys(this.delayData[endpoint].prefilled);
        prefilledDataKeys.forEach((el) => {
          this.delayData[endpoint].prefilled[el] = this.format.format(this.delayData[endpoint].prefilled[el], response); //tslint:disable-line
        });

        this.delayData[endpoint].data.sendData.forEach((element, index, arr) => {
          const body = Object.assign(element, this.delayData[endpoint].prefilled);

          this.service.submitForm(endpoint, body).subscribe(() => {
            if (arr.length - 1 === index) {
              this.event.emit({
                type: 'sendForm',
                data: response,
                status: 'success'
              });
            }
          });
        });
      });
    } else {
      this.event.emit({
        type: 'sendForm',
        data: response,
        status: 'success'
      });
    }
  }

  public eventHandler(event) {
    this.updateWorkflowData(event);
    if (event.type === 'update' && event.el.type === 'related') {
      this.getData(this.metadata, event.el.key, event.currentQuery);
    } else if (event.type === 'change' && event.el.type === 'related' && event.el.related) {
      let key = event.el.related.field;
      let query = `${event.el.related.query}${event.value[0][event.el.related.param]}`;
      this.resetRalatedData(this.metadata, event.el.related.reset);
      this.getData(this.metadata, key, query);
    } else if (event.type === 'change' && event.el.type === 'rule') {
      let key = event.el.related.field;
      let query = `${event.el.related.query}${event.value[0][event.el.related.param]}`;
      this.getRalatedData(this.metadata,
        key, event.el.endpoint, null, query, event.el.related.prop, false);
    } else if (event.type === 'delete') {
      this.service.delete(event.endpoint, event.id).subscribe(
        (response: any) => this.parseResponse(response),
        (err: any) => this.parseError(err)
      );
    } else if (event.type === 'update' && event.el.key === 'timeline') {
      this.getRalatedData(this.metadata, event.el.key,
        event.el.endpoint, null, event.query, undefined, false);
    } else if (event.type === 'updateData') {
      this.updateDataOfReplaceElements(event.el);
    }
    this.event.emit(event);
  }

  public buttonActionHandler(e) {
    this.buttonAction.emit(e);
  }

  public getRelatedMetadata(metadata, key, endpoint, metadataQuery) {
    let query = '?type=formset';
    if (metadataQuery) {
      query += `&${metadataQuery}`;
    }
    this.service.getMetadata(endpoint, query).subscribe(
      (response: any) => {
        this.setModeForElement(response.fields, this.mode);
        this.parseMetadata(metadata, {
          [key]: {
            action: 'add',
            data: {
              metadata: response.fields
            }
          }
        });
        this.getData(response.fields);
      }
    );
  }

  public getRalatedData
    (metadata, key, endpoint, fields, query = null, param = 'options', update = true) {
    if (!endpoint) {
      return;
    }
    let currentQuery = query;
    let fieldsQuery;
    if (fields) {
      fieldsQuery = this.generateQueryForRelatedFields(fields);
    }
    if (query) {
      if (fieldsQuery) {
        query += `&${fieldsQuery}`;
      }
      this.service.getByQuery(endpoint, query).subscribe(
        (response: any) => {
          this.parseMetadata(metadata, {
            [key]: {
              action: 'add',
              data: {
                [param]: response.results ? response.results : response,
                currentQuery: query
              }
            }
          }, update);
          if (key === 'rules' && this.endpoint === '/ecore/api/v2/core/workflownodes/') {
            if (response.results) {
              let rules = this.getElementFromMetadata(metadata, 'rules');
              this.updateValueOfRules(response.results);
              this.parseMetadata(rules.activeMetadata, {
                [key]: {
                  action: 'add',
                  data: {
                    [param]: response.results ? response.results : response,
                    currentQuery: query
                  }
                }
              }, update);
            }
            if (this.workflowData.company &&
              this.workflowData.number &&
              this.workflowData.workflow && update) {
              this.updateMetadata(metadata, key);
            }
          } else if (update) {
            this.updateMetadata(metadata, key);
          }
        });
    } else {
      this.service.getAll(endpoint).subscribe(
        (response: any) => {
          this.parseMetadata(metadata, {
            [key]: {
              action: 'add',
              data: { [param]: response.results ? response.results : response }
            }
          });
        }
      );
    }
  }

  public generateQueryForRelatedFields(fields) {
    let query = '';
    let display = (fields.display) ? fields.display : '__str__';
    let param = (fields.param) ? fields.param : 'id';
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
          this.getRalatedData(metadata, key, el.endpoint, {}, query + '&limit=-1');
        }
        if (!el.relate && !key) {
          let fields = <any> {};
          if (el.templateOptions.display) {
            fields.display = el.templateOptions.display;
          } else if (el.templateOptions.param) {
            fields.param = el.templateOptions.param;
          }
          let keys = el.key.split('.');
          if (keys.indexOf('country') > -1) {
            fields.code2 = 'code2';
            this.getRalatedData(metadata, el.key, el.endpoint, fields, '?limit=-1');
          }
          el.options = [];
          if (el.list) {
            let metadataQuery;
            if (el.metadata_query) {
              metadataQuery = this.parseMetadataQuery(el, 'metadata_query');
            }
            this.getRelatedMetadata(metadata, el.key, el.endpoint, metadataQuery);
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
      if (el.type === 'list') {
        if (el.delay && !this.editForm) {
          el.delayData = this.delayData;
        } else {
          el.delay = undefined;
        }
      }
      if (el && el.key && params && !!params[el.key]) {
        if (params[el.key].action === 'add') {
          let elem = this.getElementFromMetadata(metadata, el.key);
          elem = Object.assign(elem, params[elem.key].data);
          if (elem.related) {
            this.resetRalatedData(metadata, elem.related.reset);
          }
          if (update) {
            this.updateMetadata(metadata, el.key);
          }
          if (params[el.key].data && params[el.key].data.value) {
            this.getValueOfData(params[el.key].data.value, el.key, elem, metadata);
          }
        } else if (params[el.key].update) {
          let elem = this.getElementFromMetadata(metadata, el.key);
          if (elem.related) {
            this.resetRalatedData(metadata, elem.related.reset);
          }
          elem.value = params[el.key].value;
          if (params[el.key].block) {
            elem.readonly = true;
          }
          this.getRalatedData(metadata, el.key, el.endpoint, {},
            `${params[el.key].query}${params[el.key].id}&limit=-1`);
        } else if (params[el.key].action === 'update') {
          if (params[el.key].block) {
            let elem = this.getElementFromMetadata(metadata, el.key);
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

  public updateErrors(err, errors, response, field = '') {
    let error = err ? err : {};
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
    return error;
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
    let ruleElement = this.getElementFromMetadata(metadata, 'rules');
    if (ruleElement) {
      ruleElement.activeMetadata = [activeMetadata];
      Object.keys(this.workflowEndpoints).forEach((el) => {
        let newMetadata = [ruleElement, activeMetadata];
        let endpoint = this.workflowEndpoints[el];
        let param = el === 'state' ? 'options' : el;
        this.getRalatedData(newMetadata, 'rules', endpoint,
          null, '?default=2', param, el === 'app');
      });
    }
  }

  public getElementFromMetadata(metadata, key): any {
    let element = null;
    metadata.forEach((el) => {
      if (el.key === key) {
        if (!element) {
          element = el;
        }
      } else if (el.children) {
        if (!element) {
          element = this.getElementFromMetadata(el.children, key);
        }
      }
    });
    return element;
  }

  public updateWorkflowData(event) {
    if (event && event.el) {
      if (event.el.key === 'workflow' || event.el.key === 'number' || event.el.key === 'company') {
        this.workflowData[event.el.key] = Array.isArray(event.value)
          ? event.value[0].id : event.value;
        this.getDataOfWorkflownode();
      }
    }
  }

  public getDataOfWorkflownode() {
    let keys = Object.keys(this.workflowData);
    let active = true;
    keys.forEach((el) => {
      if (active) {
        active = this.workflowData[el];
      } else {
        return;
      }
    });
    if (active) {
      let query = [];
      keys.forEach((el) => {
        if (this.workflowData[el]) {
          if (el !== 'number' && el !== 'el') {
            query.push(`${el}=${this.workflowData[el]}`);
          }
        }
      });
      query.push('limit=-1');
      let element = this.getElementFromMetadata(this.metadata, 'rules');
      this.getRalatedData(this.metadata,
        'rules', this.workflowEndpoints.state, null, `?${query.join('&')}`);
    }
  }

  public updateMetadata(data, key) {
    let element = this.getElementFromMetadata(data, key);
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
      let result = res.filter((el) => el.number === +this.workflowData.number)[0];
      let element = this.getElementFromMetadata(this.metadata, key);
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
    if (endpoint === '/ecore/api/v2/core/selectformfields/' ||
        endpoint === '/ecore/api/v2/core/radiobuttonsformfields/') {
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
          el.customValue.push(this.getValueOfData(data, field, {}, this.metadata));
        });
      } else if (el.children) {
        this.addCustomTemplates(el.children, data);
      }
    });
  }
}

//tslint:disable
var candidate_metadata = [
  {
    "type": "info",
    key: 'self',
    values: {
      picture: 'contact.picture.thumb',
      status: {
        field: 'active_states',
        color: {
          danger: [0, 80, 90],
          color_attr: 'number',
        }
      },
      address: 'contact.address.__str__',
      available: 'contact.is_available',
      title: 'contact.__str__'
    }
  },
  {
    type: 'tabs',
    children: [
      {
        type: 'group',
        label: 'Personal information',
        name: 'Personal Info',
        main: true,
        children: [
          {
            type: 'row',
            children: [
              {
                type: 'group',
                label: 'Contacts',
                width: .5,
                children: [

                ]
              },
              {
                type: 'group',
                label: 'Notify',
                width: .25,
                children: [
                  {
                    "key": "message_by_sms",
                    "default": true,
                    "read_only": false,
                    "type": "checkbox",
                    "templateOptions": {
                      "required": false,
                      "label": "By SMS",
                      "type": "checkbox"
                    }
                  },
                  {
                    "key": "message_by_email",
                    "default": true,
                    "read_only": false,
                    "type": "checkbox",
                    "templateOptions": {
                      "required": false,
                      "label": "By E-Mail",
                      "type": "checkbox"
                    }
                  }
                ]
              },
              {
                type: 'group',
                label: 'Recruitment agent',
                width: .25,
                children: [

                ]
              }
            ]
          },
          {
            type: 'row',
            children: [
              {
                type: 'group',
                label: 'Additional info',
                width: .25,
                children: [
                  {
                    "key": "language",
                    "default": 0,
                    "read_only": false,
                    "type": "input",
                    "templateOptions": {
                      "required": false,
                      "label": "Language",
                      "max": 32767,
                      "type": "number",
                      "min": 0
                    }
                  },
                  {
                    "key": "transportation_to_work",
                    "read_only": false,
                    "type": "select",
                    "templateOptions": {
                      "required": false,
                      "label": "Transportation to Work",
                      "options": [
                        {
                          "label": "Own Car",
                          "value": 1
                        },
                        {
                          "label": "Public Transportation",
                          "value": 2
                        }
                      ],
                      "type": "select"
                    }
                  },
                ]
              },
              {
                type: 'group',
                label: 'Phisical parameters',
                width: .25,
                children: [
                  {
                    "key": "height",
                    "read_only": false,
                    "type": "input",
                    "templateOptions": {
                      "required": false,
                      "label": "Height, cm",
                      "type": "text"
                    }
                  },
                  {
                    "key": "weight",
                    "read_only": false,
                    "type": "input",
                    "templateOptions": {
                      "required": false,
                      "label": "Weight, kg",
                      "type": "number"
                    }
                  },
                ]
              },
              {
                type: 'group',
                label: 'Character',
                width: .25,
                children: [
                  {
                    "type": "input",
                    "key": "candidate_scores.id",
                    "send": false,
                    "read_only": false,
                    "templateOptions": {
                      "required": false,
                      "label": "Id",
                      "type": "text"
                    },
                    "hide": true
                  },
                  {
                    "key": "candidate_scores.loyalty",
                    "send": false,
                    "read_only": true,
                    "type": "static",
                    "templateOptions": {
                      "required": false,
                      "label": "Loyalty Score",
                      "type": "score"
                    }
                  },
                  {
                    "key": "candidate_scores.reliability",
                    "send": false,
                    "read_only": true,
                    "type": "static",
                    "templateOptions": {
                      "required": false,
                      "label": "Reliability Score",
                      "type": "score"
                    }
                  },
                  {
                    "key": "strength",
                    "default": 0,
                    "read_only": false,
                    "type": "input",
                    "templateOptions": {
                      "required": false,
                      "label": "Strength",
                      "max": 32767,
                      "type": "score",
                      "min": 0
                    }
                  },
                ]
              },
              {
                type: 'group',
                label: 'Rating',
                width: .25,
                children: [
                  {
                    "key": "candidate_scores.client_feedback",
                    "send": false,
                    "read_only": true,
                    "type": "static",
                    "templateOptions": {
                      "required": false,
                      "label": "Client Feedback",
                      "type": "score"
                    }
                  },
                  {
                    "key": "candidate_scores.recruitment_score",
                    "send": false,
                    "read_only": true,
                    "type": "static",
                    "templateOptions": {
                      "required": false,
                      "label": "Recruitment Score",
                      "type": "score"
                    }
                  }
                ]
              }
            ]
          },
          {
            type: 'row',
            children: [
              {
                type: 'group',
                label: 'Formalities',
                width: .25,
                children: [
                  {
                    "key": "tax_file_number",
                    "read_only": false,
                    "type": "input",
                    "templateOptions": {
                      "required": false,
                      "label": "Tax File Number",
                      "max": 9,
                      "type": "text"
                    }
                  },
                  {
                    "list": false,
                    "read_only": false,
                    "type": "related",
                    "key": "superannuation_fund",
                    "many": false,
                    "endpoint": "/ecore/api/v2/candidate/superannuationfunds/",
                    "templateOptions": {
                      "label": "Superannuation fund",
                      "add": true,
                      "edit": true,
                      "type": "related",
                      "values": [
                        "__str__"
                      ],
                      "delete": false
                    }
                  },
                  {
                    "key": "super_member_number",
                    "read_only": false,
                    "type": "input",
                    "showIf": [
                      "superannuation_fund.id"
                    ],
                    "templateOptions": {
                      "required": false,
                      "label": "Super Member Number",
                      "max": 63,
                      "type": "text"
                    }
                  },
                ]
              },
              {
                type: 'group',
                width: .5,
                children: [
                  {
                    "list": false,
                    "read_only": false,
                    "type": "related",
                    "key": "bank_account",
                    "many": false,
                    "endpoint": "/ecore/api/v2/core/bankaccounts/",
                    "templateOptions": {
                      "label": "Bank account",
                      "add": true,
                      "edit": true,
                      "type": "related",
                      "values": [
                        "__str__"
                      ],
                      "delete": false
                    }
                  },
                  {
                    "list": false,
                    "read_only": false,
                    "type": "related",
                    "key": "employment_classification",
                    "many": false,
                    "endpoint": "/ecore/api/v2/skills/employmentclassifications/",
                    "templateOptions": {
                      "label": "Employment classification",
                      "add": true,
                      "edit": true,
                      "type": "related",
                      "values": [
                        "__str__"
                      ],
                      "delete": false
                    }
                  },
                ]
              },
              {
                type: 'group',
                label: 'Emergency',
                width: .25,
                children: [
                  {
                    "key": "emergency_contact_name",
                    "read_only": false,
                    "type": "input",
                    "templateOptions": {
                      "required": false,
                      "label": "Emergency Contact Name",
                      "max": 63,
                      "type": "text"
                    }
                  },
                  {
                    "key": "emergency_contact_phone",
                    "read_only": false,
                    "type": "input",
                    "templateOptions": {
                      "required": false,
                      "label": "Emergency Contact Phone Number",
                      "type": "text"
                    }
                  },
                  {
                    "key": "autoreceives_sms",
                    "default": true,
                    "read_only": false,
                    "type": "checkbox",
                    "templateOptions": {
                      "required": false,
                      "label": "Autoreceives SMS",
                      "type": "checkbox"
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      // {
      //   "type": "group",
      //   "name": "Contacts",
      //   "children": [
          // {
          //   "key": "residency",
          //   "default": 0,
          //   "read_only": false,
          //   "type": "select",
          //   "templateOptions": {
          //     "required": false,
          //     "label": "Residency Status",
          //     "options": [
          //       {
          //         "label": "Unknown",
          //         "value": 0
          //       },
          //       {
          //         "label": "Citizen",
          //         "value": 1
          //       },
          //       {
          //         "label": "Permanent Resident",
          //         "value": 2
          //       },
          //       {
          //         "label": "Temporary Resident",
          //         "value": 3
          //       }
          //     ],
          //     "type": "select"
          //   }
          // },
          // {
          //   "list": false,
          //   "read_only": false,
          //   "type": "related",
          //   "key": "visa_type",
          //   "many": false,
          //   "endpoint": "/ecore/api/v2/candidate/visatypes/",
          //   "templateOptions": {
          //     "label": "Visa type",
          //     "add": true,
          //     "edit": true,
          //     "type": "related",
          //     "values": [
          //       "__str__"
          //     ],
          //     "delete": false
          //   },
          //   "showIf": [
          //     {
          //       "residency": "3"
          //     }
          //   ]
          // },
          // {
          //   "key": "visa_expiry_date",
          //   "read_only": false,
          //   "type": "datepicker",
          //   "showIf": [
          //     "visa_type.id"
          //   ],
          //   "templateOptions": {
          //     "required": false,
          //     "label": "Visa Expiry Date",
          //     "type": "date"
          //   }
          // },
          // {
          //   "key": "vevo_checked_at",
          //   "read_only": false,
          //   "type": "datepicker",
          //   "showIf": [
          //     "visa_type.id"
          //   ],
          //   "templateOptions": {
          //     "required": false,
          //     "label": "VEVO checked at",
          //     "type": "date"
          //   }
          // },
          // {
          //   "list": false,
          //   "read_only": false,
          //   "type": "related",
          //   "key": "nationality",
          //   "many": false,
          //   "endpoint": "/ecore/api/v2/core/countries/",
          //   "templateOptions": {
          //     "label": "Nationality",
          //     "add": true,
          //     "edit": true,
          //     "type": "related",
          //     "values": [
          //       "__str__"
          //     ],
          //     "delete": false
          //   }
          // }
      //   ]
      // },
      // {
      //   "type": "collapse",
      //   "name": "Formalities",
      //   "children": [
          // {
          //   "key": "tax_file_number",
          //   "read_only": false,
          //   "type": "input",
          //   "templateOptions": {
          //     "required": false,
          //     "label": "Tax File Number",
          //     "max": 9,
          //     "type": "text"
          //   }
          // },
          // {
          //   "list": false,
          //   "read_only": false,
          //   "type": "related",
          //   "key": "superannuation_fund",
          //   "many": false,
          //   "endpoint": "/ecore/api/v2/candidate/superannuationfunds/",
          //   "templateOptions": {
          //     "label": "Superannuation fund",
          //     "add": true,
          //     "edit": true,
          //     "type": "related",
          //     "values": [
          //       "__str__"
          //     ],
          //     "delete": false
          //   }
          // },
          // {
          //   "key": "super_member_number",
          //   "read_only": false,
          //   "type": "input",
          //   "showIf": [
          //     "superannuation_fund.id"
          //   ],
          //   "templateOptions": {
          //     "required": false,
          //     "label": "Super Member Number",
          //     "max": 63,
          //     "type": "text"
          //   }
          // },
          // {
          //   "list": false,
          //   "read_only": false,
          //   "type": "related",
          //   "key": "bank_account",
          //   "many": false,
          //   "endpoint": "/ecore/api/v2/core/bankaccounts/",
          //   "templateOptions": {
          //     "label": "Bank account",
          //     "add": true,
          //     "edit": true,
          //     "type": "related",
          //     "values": [
          //       "__str__"
          //     ],
          //     "delete": false
          //   }
          // },
          // {
          //   "key": "emergency_contact_name",
          //   "read_only": false,
          //   "type": "input",
          //   "templateOptions": {
          //     "required": false,
          //     "label": "Emergency Contact Name",
          //     "max": 63,
          //     "type": "text"
          //   }
          // },
          // {
          //   "key": "emergency_contact_phone",
          //   "read_only": false,
          //   "type": "input",
          //   "templateOptions": {
          //     "required": false,
          //     "label": "Emergency Contact Phone Number",
          //     "type": "text"
          //   }
          // },
          // {
          //   "list": false,
          //   "read_only": false,
          //   "type": "related",
          //   "key": "employment_classification",
          //   "many": false,
          //   "endpoint": "/ecore/api/v2/skills/employmentclassifications/",
          //   "templateOptions": {
          //     "label": "Employment classification",
          //     "add": true,
          //     "edit": true,
          //     "type": "related",
          //     "values": [
          //       "__str__"
          //     ],
          //     "delete": false
          //   }
          // },
      //     {
      //       "key": "autoreceives_sms",
      //       "default": true,
      //       "read_only": false,
      //       "type": "checkbox",
      //       "templateOptions": {
      //         "required": false,
      //         "label": "Autoreceives SMS",
      //         "type": "checkbox"
      //       }
      //     }
      //   ]
      // },
      // {
      //   "type": "collapse",
      //   "name": "Personal Traits",
      //   "children": [
          // {
          //   "key": "height",
          //   "read_only": false,
          //   "type": "input",
          //   "templateOptions": {
          //     "required": false,
          //     "label": "Height, cm",
          //     "type": "text"
          //   }
          // },
          // {
          //   "key": "weight",
          //   "read_only": false,
          //   "type": "input",
          //   "templateOptions": {
          //     "required": false,
          //     "label": "Weight, kg",
          //     "type": "number"
          //   }
          // },
          // {
          //   "key": "transportation_to_work",
          //   "read_only": false,
          //   "type": "select",
          //   "templateOptions": {
          //     "required": false,
          //     "label": "Transportation to Work",
          //     "options": [
          //       {
          //         "label": "Own Car",
          //         "value": 1
          //       },
          //       {
          //         "label": "Public Transportation",
          //         "value": 2
          //       }
          //     ],
          //     "type": "select"
          //   }
          // },
          // {
          //   "key": "strength",
          //   "default": 0,
          //   "read_only": false,
          //   "type": "input",
          //   "templateOptions": {
          //     "required": false,
          //     "label": "Strength",
          //     "max": 32767,
          //     "type": "number",
          //     "min": 0
          //   }
          // },
          // {
          //   "key": "language",
          //   "default": 0,
          //   "read_only": false,
          //   "type": "input",
          //   "templateOptions": {
          //     "required": false,
          //     "label": "Language",
          //     "max": 32767,
          //     "type": "number",
          //     "min": 0
          //   }
          // }
      //   ]
      // },
      // {
      //   "type": "collapse",
      //   "name": "Candidate rating",
      //   "children": [
          // {
          //   "type": "input",
          //   "key": "candidate_scores.id",
          //   "send": false,
          //   "read_only": false,
          //   "templateOptions": {
          //     "required": false,
          //     "label": "Id",
          //     "type": "text"
          //   },
          //   "hide": true
          // },
          // {
          //   "key": "candidate_scores.loyalty",
          //   "send": false,
          //   "read_only": true,
          //   "type": "static",
          //   "templateOptions": {
          //     "required": false,
          //     "label": "Loyalty Score",
          //     "type": "static"
          //   }
          // },
          // {
          //   "key": "candidate_scores.reliability",
          //   "send": false,
          //   "read_only": true,
          //   "type": "static",
          //   "templateOptions": {
          //     "required": false,
          //     "label": "Reliability Score",
          //     "type": "static"
          //   }
          // },
          // {
          //   "key": "candidate_scores.client_feedback",
          //   "send": false,
          //   "read_only": true,
          //   "type": "static",
          //   "templateOptions": {
          //     "required": false,
          //     "label": "Client Feedback",
          //     "type": "static"
          //   }
          // },
          // {
          //   "key": "candidate_scores.recruitment_score",
          //   "send": false,
          //   "read_only": true,
          //   "type": "static",
          //   "templateOptions": {
          //     "required": false,
          //     "label": "Recruitment Score",
          //     "type": "static"
          //   }
          // }
        // ]
      // },
      // {
      //   "type": "collapse",
      //   "name": "Messages",
      //   "children": [
      //     {
      //       "key": "message_by_sms",
      //       "default": true,
      //       "read_only": false,
      //       "type": "checkbox",
      //       "templateOptions": {
      //         "required": false,
      //         "label": "By SMS",
      //         "type": "checkbox"
      //       }
      //     },
      //     {
      //       "key": "message_by_email",
      //       "default": true,
      //       "read_only": false,
      //       "type": "checkbox",
      //       "templateOptions": {
      //         "required": false,
      //         "label": "By E-Mail",
      //         "type": "checkbox"
      //       }
      //     }
      //   ]
      // },

      // {
      //   "type": "collapse",
      //   "name": "Other",
      //   "children": [
      //     {
      //       "key": "created_at",
      //       "send": false,
      //       "read_only": true,
      //       "type": "datepicker",
      //       "templateOptions": {
      //         "required": false,
      //         "label": "Created at",
      //         "type": "date"
      //       }
      //     },
      //     {
      //       "key": "updated_at",
      //       "send": false,
      //       "read_only": true,
      //       "type": "datepicker",
      //       "templateOptions": {
      //         "required": false,
      //         "label": "Updated at",
      //         "type": "date"
      //       }
      //     }
      //   ]
      // },

      {
        "prefilled": {
          "candidate_contact": "{id}"
        },
        "query": {
          "candidate_contact": "{id}"
        },
        "type": "list",
        "endpoint": "/ecore/api/v2/candidate/skillrels/",
        "templateOptions": {
          "label": "Skills",
          "add_label": "Add",
          "text": "Skills",
          "type": "list"
        }
      },
      {
        "list": true,
        "read_only": false,
        "type": "related",
        "key": "tag_rels",
        "many": true,
        "endpoint": "/ecore/api/v2/candidate/tagrels/",
        "templateOptions": {
          "label": "Candidate Tags",
          "add": true,
          "edit": true,
          "type": "related",
          "values": [
            "__str__"
          ],
          "delete": true
        }
      },
      {
        "prefilled": {
          "contact": "{contact.id}"
        },
        "query": {
          "contact": "{contact.id}"
        },
        "type": "list",
        "endpoint": "/ecore/api/v2/activity/activities/",
        "templateOptions": {
          "label": "Activities",
          "add_label": "Add",
          "text": "Activities",
          "type": "list"
        }
      },
      {
        "key": "timeline",
        "query": {
          "model": "candidate.candidatecontact",
          "object_id": "{id}"
        },
        "endpoint": "/ecore/api/v2/core/workflownodes/timeline/",
        "type": "timeline",
        "templateOptions": {
          "label": "States Timeline",
          "text": "States Timeline",
          "type": "timeline"
        }
      },
      {
        "prefilled": {
          "object_id": "{id}"
        },
        "query": {
          "object_id": "{id}"
        },
        "type": "list",
        "endpoint": "/ecore/api/v2/core/workflowobjects/",
        "templateOptions": {
          "label": "Candidate States History",
          "add_label": "Add",
          "text": "Candidate States History",
          "type": "list"
        }
      },
      {
        "query": {
          "contact": "{contact.id}"
        },
        "endpoint": "/ecore/api/v2/core/contactunavailabilities/",
        "type": "list",
        "templateOptions": {
          "label": "Candidate Unavailabilities",
          "text": "Candidate Unavailabilities",
          "type": "list"
        }
      },
      {
        "query": {
          "candidate_contact": "{id}"
        },
        "endpoint": "/ecore/api/v2/hr/joboffers/candidate/",
        "type": "list",
        "templateOptions": {
          "label": "Job Offers",
          "text": "Job Offers",
          "type": "list"
        }
      },
      {
        "prefilled": {
          "candidate_contact": "{id}"
        },
        "query": {
          "candidate_contact": "{id}"
        },
        "type": "list",
        "endpoint": "/ecore/api/v2/hr/carrierlists/",
        "templateOptions": {
          "label": "Carrier List",
          "add_label": "Add",
          "text": "Carrier List",
          "type": "list"
        }
      },
      {
        "prefilled": {
          "candidate_contact": "{id}"
        },
        "query": {
          "candidate_contact": "{id}"
        },
        "type": "list",
        "endpoint": "/ecore/api/v2/hr/blacklists/",
        "templateOptions": {
          "label": "Black List",
          "add_label": "Add",
          "text": "Black List",
          "type": "list"
        }
      },
      {
        "prefilled": {
          "candidate_contact": "{id}"
        },
        "query": {
          "candidate_contact": "{id}"
        },
        "type": "list",
        "endpoint": "/ecore/api/v2/hr/favouritelists/",
        "templateOptions": {
          "label": "Favorite List",
          "add_label": "Add",
          "text": "Favorite List",
          "type": "list"
        }
      },
      {
        "prefilled": {
          "candidate_contact": "{id}"
        },
        "query": {
          "candidate_contact": "{id}"
        },
        "type": "list",
        "endpoint": "/ecore/api/v2/hr/candidateevaluations/",
        "templateOptions": {
          "label": "Evaluations",
          "add_label": "Add",
          "text": "Evaluations",
          "type": "list"
        }
      }
    ]
  }
]
