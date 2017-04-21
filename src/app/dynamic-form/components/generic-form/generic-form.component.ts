import { RequestOptions } from '@angular/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { GenericFormService } from './../../services/generic-form.service';

@Component({
  selector: 'generic-form',
  templateUrl: 'generic-form.component.html'
})

export class GenericFormComponent implements OnInit, OnChanges {

  @Input()
  public endpoint: string = '';

  @Input()
  public data = [];

  @Input()
  public response = null;

  @Input()
  public errors = null;

  @Input()
  public relatedField = null;

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

  constructor(
    private service: GenericFormService
  ) {}

  public ngOnInit() {
    if (this.endpoint) {
      this.getMetadata(this.endpoint);
    }
  }

  public ngOnChanges() {
    if (this.endpoint) {
      this.getMetadata(this.endpoint);
    }
  }

  public getMetadata(endpoint) {
    this.service.getMetadata(endpoint).subscribe(
        ((data: any) => this.metadata = this.updateMatadata(data)),
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
    this.event.emit(event);
  }

  public buttonActionHandler(e) {
    this.buttonAction.emit(e);
  }

  public resourseDataHandler(e) {
    if (!this.relatedField) {
      this.getRalatedData(e.key, e.endpoint);
    } else {
      let fields = Object.keys(this.relatedField);
      fields.forEach((el) => {
        if (el !== e.key) {
          this.getRalatedData(e.key, e.endpoint);
        }
      });
    }
    this.getRalatedData(e.key, e.endpoint);
  }

  public getRalatedData(key, endpoint) {
     this.service.getAll(endpoint).subscribe(
      (response: any) => {
        this.data = [{
          key,
          data: { options: response.results }
        }];
      }
    );
  }

  public updateMatadata(metadata) {
    if (this.relatedField) {
      metadata.forEach((el) => {
        if (el.key && this.relatedField[el.key]) {
          el.related = this.relatedField[el.key];
        } else if (el.children) {
          this.updateMatadata(el.children);
        }
      });
    }
    return metadata;
  }
}
