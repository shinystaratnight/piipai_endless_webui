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
  public response = {};

  @Input()
  public errors = {};

  @Input()
  public relatedField = {};

  @Input()
  public form: any;

  @Input()
  public id: string;

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
    this.service.getAll(`${endpoint}${id}`).subscribe(
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
      obj['value'] = data[key];
    } else {
      this.getValueOfData(data[prop], keys.join('.'), obj);
    }
  }

  public submitForm(data) {
    if (this.form) {
      let keys = Object.keys(this.form);
      if (keys.length) {
        keys.forEach((el) => {
          data[el] = this.form[el];
        });
      }
    }
    this.sendData = data;
    if (this.editForm) {
      this.service.editForm(`${this.endpoint}${this.id}/`, data).subscribe(
        ((response: any) => this.parseResponse(response)),
        ((errors: any) => this.parseError(errors.errors)));
    } else {
      this.service.submitForm(this.endpoint, data).subscribe(
        ((response: any) => this.parseResponse(response)),
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
    if (event.type === 'change' && event.el.type === 'related' && event.el.related) {
      let key = event.el.related.field;
      let query = `${event.el.related.query}${event.value[0][event.el.related.param]}`;
      this.getData(this.metadata, key, query);
      this.resetRalatedData(this.metadata, event.el.related.reset);
    } else if (event.type === 'change' && event.el.type === 'rule') {
      let key = event.el.related.field;
      let query = `${event.el.related.query}${event.value[0][event.el.related.param]}`;
      this.getRalatedData(this.metadata,
        key, event.el.endpoint, query, event.el.related.prop, true);
    }
    this.event.emit(event);
  }

  public buttonActionHandler(e) {
    this.buttonAction.emit(e);
  }

  public getRalatedData(metadata, key, endpoint, query = null, param = 'options', inner = false) {
    if (query) {
      this.service.getByQuery(endpoint, query).subscribe(
        (response: any) => {
          this.parseMetadata(metadata, {
            [key]: {
              action: 'add',
              data: { [param]: inner ? response : response.results }
            }
          });
          if (key === 'rules') {
            if (response.results) {
              this.updateValueOfRules(response.results);
            }
            if (this.workflowData.company &&
              this.workflowData.number && this.workflowData.workflow) {
              this.updateMetadata(this.metadata, key);
            }
          }
        });
    } else {
      this.service.getAll(endpoint).subscribe(
        (response: any) => {
          this.parseMetadata(metadata, {
            [key]: {
              action: 'add',
              data: { [param]: inner ? response : response.results }
            }
          });
        }
      );
    }
  }

  public getData(metadata, key = null, query = null) {
    metadata.forEach((el) => {
      if (el.type === 'related') {
        if (el.key === key) {
          this.getRalatedData(metadata, key, el.endpoint, query + '&limit=-1');
        }
        if (!el.relate && !key) {
          this.getRalatedData(metadata, el.key, el.endpoint, '?limit=-1');
        }
      } else if (el.children) {
        this.getData(el.children, key, query);
      }
    });
  }

  public parseMetadata(metadata, params) {
    metadata.forEach((el) => {
      if (el && el.key && !!params[el.key]) {
        if (params[el.key].action === 'add') {
          el = Object.assign(el, params[el.key].data);
        } else if (params[el.key].update) {
          this.getRalatedData(this.metadata, el.key, el.endpoint,
            `${params[el.key].query}${params[el.key].id}`);
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
        display: 'name_before_activation'
      }
    };
    let ruleElement = this.getElementFromMetadata(metadata, 'rules');
    if (ruleElement) {
      ruleElement.activeMetadata = [activeMetadata];
      Object.keys(this.workflowEndpoints).forEach((el) => {
        let newMetadata = [ruleElement, activeMetadata];
        let endpoint = this.workflowEndpoints[el];
        let param = el === 'state' ? 'options' : el;
        this.getRalatedData(newMetadata, 'rules', endpoint, '?default=2', param, el === 'app');
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
        'rules', this.workflowEndpoints.state, `?${query.join('&')}`);
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
      res.forEach((el) => {
        if (el.number === +this.workflowData.number) {
          let element = this.getElementFromMetadata(this.metadata, key);
          element.value = el.rules;
        }
      });
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
        this.getRalatedData(newMetadata, 'rules', endpoint, `?${query.join('&')}`);
      }
    }
  }
}
