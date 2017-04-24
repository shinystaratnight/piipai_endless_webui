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
  public response = null;

  @Input()
  public errors = null;

  @Input()
  public relatedField = {};

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
    this.service.getMetadata(endpoint).subscribe(
        ((data: any) => {
          this.metadata = this.parseMetadata(data, this.relatedField);
          this.metadata = this.parseMetadata(data, this.data);
          this.getData(this.metadata);
        }),
        ((error: any) => this.metadataError = error));
  }

  public submitForm(data) {
    this.sendData = data;
    this.response = null;
    this.errors = null;
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
    this.errors = errors;
    this.errorForm.emit(errors);
  }

  public parseResponse(response) {
    this.response = response;
    this.responseForm.emit(response);
  }

  public eventHandler(event) {
    if (event.type === 'change' && event.el.type === 'related' && event.el.related) {
      let key = event.el.related.field;
      let query = `${event.el.related.query}${event.value[0][event.el.related.param]}`;
      this.getData(this.metadata, key, query);
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
        }
      } else if (el.children) {
        this.parseMetadata(el.children, params);
      }
    });
    return metadata;
  }
}
