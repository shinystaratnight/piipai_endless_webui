import { Observable } from 'rxjs/Observable';
import { RequestOptions } from '@angular/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { GenericFormService } from './../../services/generic-form.service';

import { customTemplates } from '../../models/custom-templates';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Field } from '../../models/field.model';
import { FormatString } from '../../../helpers/format';

interface HiddenFields {
  elements: Field[];
  keys: string[];
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
  public showResponse: boolean = true;

  @Input()
  public mode: string;

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
    keys: []
  };

  public workflowEndpoints = {
    state: `/ecore/api/v2/core/workflownodes/`,
    app: `/ecore/api/v2/apps/`
  };

  public workflowData = <any> {};

  public replaceElements: Field[] = [];

  public format = new FormatString();

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
    this.service.getMetadata(endpoint, '?type=form').subscribe(
        ((data: any) => {
          this.setModeForElement(data, this.mode);
          this.getReplaceElements(data);
          this.metadata = this.parseMetadata(data, this.data);
          this.saveHiddenFields(this.metadata);
          this.metadata = this.parseMetadata(data, this.relatedField);
          this.addCustomTemplates(customTemplates[endpoint], this.metadata);
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
          el.hidden = new BehaviorSubject(true);
        }
      } else if (el.children) {
        this.saveHiddenFields(el.children);
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
        this.show = true;
        this.str.emit({
          str: data && data.__str__ ? data.__str__ : '',
          data
        });
      }
    ));
  }

  public fillingForm(metadata, data) {
    metadata.forEach((el) => {
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
          obj['value'] = data[key];
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
              endpoint = `${obj.endpoint}${obj.value}/`;
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

  public submitForm(data) {
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
    if (this.editForm || this.edit) {
      let endpoint = this.editForm ? `${this.endpoint}${this.id}/` : this.endpoint;
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
          this.event.emit({
            type: 'sendForm',
            data: response,
            status: 'success'
          });
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

  public parseResponse(response) {
    this.resetData(this.errors);
    this.resetData(this.response);
    if (!this.editForm && this.showResponse) {
      this.response = response;
    }
    this.responseForm.emit(response);
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
        if (el.key === key) {
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
              metadataQuery = this.parseMetadataQuery(el);
            }
            this.getRelatedMetadata(metadata, el.key, el.endpoint, metadataQuery);
          }
        }
      } else if (el.children) {
        this.getData(el.children, key, query);
      }
    });
  }

  public parseMetadataQuery(data) {
    const keys = Object.keys(data);
    const result = keys.map((query) => {
      return `${query}=${data[query]}`;
    });
    return result.join('&');
  }

  public parseMetadata(metadata, params, update = true) {
    metadata.forEach((el) => {
      if (el.type === 'hidden') {
        el.hide = this.hide;
      }
      if (el.type === 'timeline' || el.type === 'list') {
        if (this.edit || this.editForm) {
          el.hide = false;
        } else {
          el.hide = true;
        }
      }
      if (el && el.key && params && !!params[el.key]) {
        if (params[el.key].action === 'add') {
          el = Object.assign(el, params[el.key].data);
          let elem = this.getElementFromMetadata(metadata, el.key);
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

  public addCustomTemplates(customFields, metadata) {
    if (customFields) {
      metadata.forEach((el) => {
        if (el.key) {
          el.custom = customFields[el.key];
        } else if (el.children) {
          this.addCustomTemplates(customFields, el.children);
        }
      });
    }
  }
}
