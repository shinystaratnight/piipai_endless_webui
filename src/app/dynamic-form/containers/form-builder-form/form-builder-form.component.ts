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
  @Input() public companyId: string;
  @Input() public config: any;

  @Output() public formConfig: EventEmitter<any> = new EventEmitter();

  public error = {};
  public hiddenFields: HiddenFields = {
    elements: [],
    keys: [],
    observers: []
  };

  public industyField = {
    type: 'related',
    send: false,
    endpoint: '/pricing/industries/',
    key: 'industry',
    templateOptions: {
      label: 'Industry',
      type: 'related',
      values: ['__str__', 'id']
    },
    query: {}
  };

  constructor(
    private service: FormBuilderService,
    private router: Router,
    private toastr: ToastService
  ) { }

  public ngOnInit() {
    this.getRenderData();

    this.industyField.query = {
      comapny: this.companyId
    }
  }

  public getRenderData() {
    this.service.getRenderData(this.id)
      .subscribe((res: any) => {
        this.updateConfigByGroups(res.ui_config);

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
          field.send = false;
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

  public getFields(result: Field[], key: string, target: Field[], index: number): Field[] {
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

  public updateSkillField(field: Field, formData: BehaviorSubject<any>): Field {
    return {
      ...field,
      query: {
        industry: '{industry.id}',
      },
      formData,
      many: true,
      unique: true,
    };
  }

  private updateConfigByGroups(fields: Field[]): void {
    this.createNewGroup(fields, 'bank_account', 'Bank Account');

    const skills = this.getFields([], 'skill', fields, 0);
    if (skills.length) {
      const formData = new BehaviorSubject({});
      skills[0] = this.updateSkillField(skills[0], formData);
      skills.unshift({ ...this.industyField, formData });
      fields.push(this.createGroup('Skills', skills));
    }

    this.createNewGroup(
      fields,
      ['superannuation_fund', 'superannuation_membership_number'],
      'Superannuation fund'
    );
  }

  private createNewGroup(fields: Field[], fieldKey: string | string[], groupLabel: string): void {
    let findedFields = [];

    if (Array.isArray(fieldKey)) {
      fieldKey.forEach((key) => findedFields.push(...this.getFields([], key, fields, 0)));
    } else {
      findedFields = this.getFields([], fieldKey, fields, 0);
    }

    if (findedFields.length) {
      fields.push(this.createGroup(groupLabel, findedFields));
    }
  }
}
