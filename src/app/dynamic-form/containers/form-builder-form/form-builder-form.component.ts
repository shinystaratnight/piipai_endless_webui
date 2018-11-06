import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Subject, BehaviorSubject } from 'rxjs';

import { FormBuilderService } from '../../services';
import { ToastService } from '../../../shared/services';
import { HiddenFields } from '../../components/generic-form/generic-form.component';
import { Field } from '../../models';

@Component({
  selector: 'app-form-builder-form',
  templateUrl: './form-builder-form.component.html',
  styleUrls: ['./form-builder-form.component.scss']
})
export class FormBuilderFormComponent implements OnInit {

  @Input() public id: string;
  @Input() public config: any;

  @Output() public formConfig: EventEmitter<any> = new EventEmitter();

  public error = {};
  public hiddenFields: HiddenFields = {
    elements: [],
    keys: [],
    observers: []
  };

  constructor(
    private service: FormBuilderService,
    private router: Router,
    private toastr: ToastService
  ) { }

  public ngOnInit() {
    this.getRenderData();
  }

  public getRenderData() {
    this.service.getRenderData(this.id)
      .subscribe((res: any) => {
        const bankAccount = this.getFields([], 'bank_account', res.ui_config, 0);

        if (bankAccount.length) {
          res.ui_config.push(this.createGroup('Bank Account', bankAccount));
        }

        const syperannuationFund = this.getFields([], 'superannuation_fund', res.ui_config, 0);

        if (syperannuationFund.length) {
          res.ui_config.push(this.createGroup('Superannuation fund', syperannuationFund));
        }

        this.config = res;
        this.formConfig.emit(res);

        this.updateConfig(this.config.ui_config);
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
        (res: any) => {
          this.toastr.sendMessage(this.config.submit_message, 'success');
          this.router.navigate(['/login']);
        },
        (err: any) => { this.parseError(err.errors); }
      );
  }

  public parseAddress(data, el) {
    this.service.parseAddress(data)
      .subscribe(
        (res) => {
          this.parseError({ [el.key]: [] });
          el.autocompleteData.next(res);
        },
        (err: any) => {
          this.parseError(Object.assign({}, this.error, { [el.key]: err.errors }));
        });
  }

  public parseError(errors) {
    this.resetData(this.error);
    this.updateErrors(this.error, errors, {});
  }

  public resetData(data) {
    if (data) {
      const keys = Object.keys(data);
      keys.forEach((el) => {
        delete data[el];
      });
    }
  }

  public updateErrors(error, errors, response, field = '') {
    if (errors) {
      const keyss = Object.keys(errors);
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

  public updateConfig(config: Field[]) {
    const streetAddress = config.find((field) => {
      if (field.key) {
        return field.key.includes('street_address');
      }
    });

    if (streetAddress) {
      streetAddress.updateFormData = true;
      streetAddress.formData = new BehaviorSubject({data: {}});
      config.forEach((field) => {
        if (
          field.key &&
          (field.key.includes('postal_code') ||
          field.key.includes('state') ||
          field.key.includes('country') ||
          field.key.includes('city'))
        ) {
          field.showIf = [streetAddress.key];
        }

        if (field.showIf && field.showIf.length) {
          if (this.hiddenFields.keys.indexOf(field.key) === -1) {
            this.hiddenFields.keys.push(field.key);
            this.hiddenFields.elements.push(field);
            this.hiddenFields.observers =
              this.observeFields(field.showIf, this.hiddenFields.observers);
            field.hidden = new BehaviorSubject(true);
          }
        }
      });
    }
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

  public createGroup(label: string, children: Field[]) {
    return {
      type: 'group',
      border: true,
      label,
      children
    };
  }

  public getFields(result: Field[], key: string, target: Field[], index: number) {
    if (index === target.length) {
      return result;
    }

    if (target[index].key && target[index].key.includes(key)) {
      result = [...result, ...target.splice(index, 1)];

      index = index - 1;
    }

    index = index + 1;

    return this.getFields(result, key, target, index);
  }
}
