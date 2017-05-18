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
          this.getData(this.metadata);
          if (this.id && this.metadata) {
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
    this.show = true;
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
    this.service.submitForm(this.endpoint, data).subscribe(
      ((response: any) => this.parseResponse(response)),
      ((errors: any) => this.parseError(errors.errors)));
  }

  public parseError(errors) {
    if (errors.register) {
      this.redirect.emit({
        field: errors.register,
        value: this.sendData.username
      });
      return;
    }
    this.resetData(this.errors);
    this.errors = this.updateErrors(this.errors, errors, this.response);
    this.errorForm.emit(this.errors);
  }

  public parseResponse(response) {
    this.resetData(this.response);
    this.response = response;
    this.responseForm.emit(response);
  }

  public eventHandler(event) {
    if (event.type === 'change' && event.el.type === 'related' && event.el.related) {
      let key = event.el.related.field;
      let query = `${event.el.related.query}${event.value[0][event.el.related.param]}`;
      this.getData(this.metadata, key, query);
      this.resetRalatedData(this.metadata, event.el.related.reset);
    }
    this.event.emit(event);
  }

  public buttonActionHandler(e) {
    this.buttonAction.emit(e);
  }

  public getRalatedData(key, endpoint, query = null) {
    if (query) {
      this.service.getByQuery(endpoint, query).subscribe(
      (response: any) => {
        this.parseMetadata(this.metadata, {
          [key]: {
            action: 'add',
            data: { options: response.results }
          }
        });
      });
    } else {
      this.service.getAll(endpoint).subscribe(
        (response: any) => {
          this.parseMetadata(this.metadata, {
            [key]: {
              action: 'add',
              data: { options: response.results }
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
          this.getRalatedData(key, el.endpoint, query);
        }
        if (!el.relate && !key) {
          this.getRalatedData(el.key, el.endpoint);
        }
      } else if (el.children) {
        this.getData(el.children, key, query);
      }
    });
  }

  public parseMetadata(metadata, params) {
    metadata.forEach((el) => {
      if (el.key && !!params[el.key]) {
        if (params[el.key].action === 'add') {
          el = Object.assign(el, params[el.key].data);
        } else if (params[el.key].update) {
          this.getRalatedData(el.key, el.endpoint,
            `${params[el.key].query}${params[el.key].id}`);
        }
      } else if (el.children) {
        this.parseMetadata(el.children, params);
      }
    });
    return metadata;
  }

  public resetRalatedData(metadata, key) {
    metadata.forEach((el) => {
      if (el.key === key) {
        delete el.options;
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
}
