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

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public buttonAction: EventEmitter<any> = new EventEmitter();

  @Output()
  public redirect: EventEmitter<any> = new EventEmitter();

  public metadata = [];
  public metadataError = [];
  public response = null;
  public errors = null;
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
        ((data: any) => this.metadata = data),
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
        key: errors.register,
        value: this.sendData.username
      });
      return;
    }
    this.errors = errors;
  }

  public parseResponse(response) {
    this.response = response;
  }

  public eventHandler(event) {
    this.event.emit(event);
  }

  public buttonActionHandler(e) {
    this.buttonAction.emit(e);
  }
}
