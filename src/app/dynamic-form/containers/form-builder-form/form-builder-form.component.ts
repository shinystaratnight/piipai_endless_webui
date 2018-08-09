import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Subject } from 'rxjs/Subject';

import { FormBuilderService } from '../../services/form-builder.service';
import { ToastrService } from '../../../shared/services/toastr.service';

@Component({
  selector: 'form-builder-form',
  templateUrl: './form-builder-form.component.html',
  styleUrls: ['./form-builder-form.component.scss']
})
export class FormBuilderFormComponent implements OnInit {

  @Input() public id: string;
  @Input() public config: any;

  @Output() public formConfig: EventEmitter<any> = new EventEmitter();

  public error = {};

  constructor(
    private service: FormBuilderService,
    private toastr: ToastrService
  ) { }

  public ngOnInit() {
    this.getRenderData();
  }

  public getRenderData() {
    this.service.getRenderData(this.id)
      .subscribe((res) => {
        this.config = res;
        this.formConfig.emit(res);

        this.addAutocompleteProperty(this.config.ui_config);
      });
  }

  public eventHandler(event: any) {
    if (event.type === 'address') {
      this.parseAddress(event.value, event.el);
    }
  }

  public submitForm(data: any) {
    this.service.sendFormData(this.id, data)
      .subscribe(
        (res: any) => { this.toastr.sendMessage(this.config.submit_message, 'success'); },
        (err: any) => { this.parseError(err.errors); }
      );
  }

  public parseAddress(data, el) {
    this.service.parseAddress(data)
      .subscribe(
        (res) => {
          el.autocompleteData.next(res);
        },
        (err: any) => {
          this.parseError(Object.assign({}, this.error, { [el.key]: err.errors}));
        });
  }

  public parseError(errors) {
    this.resetData(this.error);
    this.updateErrors(this.error, errors, {});
  }

  public resetData(data) {
    if (data) {
      let keys = Object.keys(data);
      keys.forEach((el) => {
        delete data[el];
      });
    }
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

  public addAutocompleteProperty(metadata: any, property?: Subject<any>) {
    property = property || new Subject<any>();
    metadata.forEach((element) => {
      if (element.key) {
        element.autocompleteData = property;
      } else if (element.children) {
        this.addAutocompleteProperty(element.children, property);
      }
    });
  }
}
