import { Observable } from 'rxjs/Observable';
import { RequestOptions } from '@angular/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { GenericFormService } from './../../services/generic-form.service';

@Component({
  selector: 'generic-form',
  templateUrl: 'generic-form.component.html'
})

export class GenericFormComponent implements OnChanges {

  @Input()
  public endpoint: string = '';

  @Input()
  public data = {};

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

  public metadata = [];
  public metadataError = [];
  public sendData = null;
  public currentEndpoint: string;
  public show: boolean = false;
  public editForm: boolean = false;
  public formObject: any;

  public workflowEndpoints = {
    state: `/ecore/api/v2/endless-core/workflownodes/`,
    app: `/ecore/api/v2/apps/`
  };

  public workflowData = <any> {};

  constructor(
    private service: GenericFormService
  ) {}

  public ngOnChanges() {
    if (this.endpoint !== this.currentEndpoint) {
      this.currentEndpoint = this.endpoint;
      this.getMetadata(this.endpoint);
    } else if (this.data && this.metadata) {
      this.parseMetadata(this.metadata, this.data);
    }
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
          this.metadata = this.parseMetadata(data, this.relatedField);
          this.metadata = this.parseMetadata(data, this.data);
          this.checkRuleElement(this.metadata);
          this.getData(this.metadata);
          if (this.id && this.metadata) {
            this.editForm = true;
            this.show = false;
            this.getDataForForm(this.endpoint, this.id);
          } else {
            this.show = true;
          }
        }),
        ((error: any) => this.metadataError = error));
  }

  public getDataForForm(endpoint, id) {
    this.service.getAll(`${endpoint}${id}/`).subscribe(
      ((data: any) => {
        this.fillingForm(this.metadata, data);
        this.show = true;
      }
    ));
  }

  public fillingForm(metadata, data) {
    metadata.forEach((el) => {
      if (el.key) {
        this.getValueOfData(data, el.key, el);
      } else if (el.children) {
        this.fillingForm(el.children, data);
      }
    });
    this.getDataForRules(data);
  }

  public getValueOfData(data, key, obj) {
    let keys = key.split('.');
    let prop = keys.shift();
    if (keys.length === 0) {
      if (data) {
        obj['value'] = data[key];
      }
    } else {
      if (data[prop]) {
        this.getValueOfData(data[prop], keys.join('.'), obj);
      }
    }
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
    this.errors = this.updateErrors(this.errors, errors, this.response);
    this.errorForm.emit(this.errors);
  }

  public parseResponse(response) {
    this.resetData(this.response);
    if (!this.editForm) {
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
        event.el.endpoint, null, event.query, null, true);
    }
    this.event.emit(event);
  }

  public buttonActionHandler(e) {
    this.buttonAction.emit(e);
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
          });
          if (key === 'rules') {
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
              });
            }
            if (this.workflowData.company &&
              this.workflowData.number &&
              this.workflowData.workflow && update) {
              this.updateMetadata(this.metadata, key);
            }
          } else if (update) {
            this.updateMetadata(this.metadata, key);
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
          }
          this.getRalatedData(metadata, el.key, el.endpoint, fields, '?limit=-1');
        }
      } else if (el.children) {
        this.getData(el.children, key, query);
      }
    });
  }

  public parseMetadata(metadata, params) {
    metadata.forEach((el) => {
      if (el.type === 'hidden') {
        el.hide = this.hide;
      }
      if (el && el.key && !!params[el.key]) {
        if (params[el.key].action === 'add') {
          el = Object.assign(el, params[el.key].data);
          let elem = this.getElementFromMetadata(metadata, el.key);
          if (elem.related) {
            this.resetRalatedData(metadata, elem.related.reset);
          }
          this.updateMetadata(metadata, el.key);
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
    return error;
  }

  public resetData(data) {
    let keys = Object.keys(data);
    keys.forEach((el) => {
      delete data[el];
    });
  }

  public checkRuleElement(metadata) {
    let activeMetadata = {
      type: 'related',
      key: 'rules',
      read_only: false,
      many: true,
      templateOptions: {
        label: 'Active',
        display: 'name_before_activation',
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
    if (keys.length === 3) {
      let query = [];
      keys.forEach((el) => {
        if (this.workflowData[el]) {
          if (el !== 'number' && el !== 'el') {
            query.push(`${el}=${this.workflowData[el]}`);
          }
        }
      });
      let element = this.getElementFromMetadata(this.metadata, 'rules');
      this.getRalatedData([element, element.activeMetadata[0]],
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

  public getDataForRules(data) {
    let element = this.getElementFromMetadata(this.metadata, 'rules');
    if (element) {
      ['company', 'number', 'workflow'].forEach((el) => {
        if (data[el]) {
          this.workflowData[el] = data[el];
        }
      });
      if (this.workflowData.workflow && this.workflowData.company) {
        let keys = Object.keys(this.workflowData);
        let newMetadata = [element, element.activeMetadata[0]];
        let endpoint = this.workflowEndpoints['state'];
        let query = [];
        keys.forEach((el) => {
          if (this.workflowData[el]) {
            if (el !== 'number' && el !== 'el') {
              if (this.workflowData[el].id) {
                query.push(`${el}=${this.workflowData[el].id}`);
              } else {
                query.push(`${el}=${this.workflowData[el]}`);
              }
            }
          }
        });
        this.getRalatedData(newMetadata, 'rules', endpoint, null, `?${query.join('&')}`);
      }
    }
  }
}
