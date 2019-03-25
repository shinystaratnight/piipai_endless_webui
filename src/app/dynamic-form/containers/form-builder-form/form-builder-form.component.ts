import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { Subject, BehaviorSubject } from 'rxjs';

import { FormBuilderService } from '../../services';
import { ToastService } from '../../../shared/services';
import { HiddenFields } from '../../components/generic-form/generic-form.component';
import { Field } from '../../models';
import { getElementFromMetadata } from '../../helpers';

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

  public form: FormGroup;

  public error = {};
  public hiddenFields: HiddenFields = {
    elements: [],
    keys: [],
    observers: []
  };

  public currentStep = 0;
  public saveProcess = false;

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

  public steps = [
    {
      title: 'Contact information',
      metadata: [],
      content: [
        'contact.picture',
        'contact.title',
        'contact.first_name',
        'contact.last_name',
        'contact.birthday',
        'contact.gender',
        'contact.phone_mobile',
        'contact.email',
        'contact.address.street_address',
        // 'contact.address.city',
        // 'contact.address.postal_code',
        // 'contact.address.state',
        // 'contact.address.country'
      ],
    },
    {
      title: 'Additional information',
      metadata: [],
      content: [
        'nationality',
        'residency',
        'tax_file_number',
        'transportation_to_work',
        ['weight', 'height'],
      ],
    },
    {
      title: 'Bank and superannuation informatioin',
      metadata: [],
      content: [
        'bank_account.bank_name',
        'bank_account.bank_account_name',
        'bank_account.bsb',
        'bank_account.account_number',
        'superannuation_fund',
        'superannuation_membership_number'
      ],
    },
    {
      title: 'Industry and skills',
      metadata: [],
      content: [
        'industry',
        'skill'
      ]
    }
  ];

  constructor(
    private service: FormBuilderService,
    private router: Router,
    private toastr: ToastService,
  ) { }

  public ngOnInit() {
    this.form = new FormGroup({});

    this.industyField.query = {
      company: this.companyId
    };

    this.getRenderData();
  }

  public generateSteps() {
    this.steps.forEach((step) => {
      step.metadata = [];
      step.content.forEach((key: string | string[]) => {
        if (Array.isArray(key)) {
          const metadata = [];
          key.forEach((el) => {
            const field = getElementFromMetadata(this.config.ui_config, el);

            if (field) {
              metadata.push(field);
            }
          });

          if (metadata.length) {
            metadata.forEach((field, i) => {
              if (i === 0 && metadata.length > 1) {
                field.className = 'mr-3';
              } else if (i > 0 && metadata.length !== i + 1) {
                field.className = 'mx-3';
              } else {
                field.className = 'ml-3';
              }
            });

            step.metadata.push({
              type: 'row',
              children: metadata
            });
          }
        } else {
          const field = getElementFromMetadata(this.config.ui_config, key);

          if (field) {
            step.metadata.push(field);
          }
        }
      });
    });
  }

  public getErrorStep(errors) {
    let step = 3;
    this.steps.forEach((el, i) => {
      el.content.forEach((field) => {
        if (Array.isArray(field)) {
          field.forEach((item) => {
            if (errors[item]) {
              step = i + 1 < step ? i + 1 : step;
            }
          });
        } else if (errors[field]) {
          step = i < step ? i : step;
        }
      });
    });
    return step;
  }

  public getRenderData() {
    this.service.getRenderData(this.id)
      .subscribe((res: any) => {
        this.updateConfigByGroups(res.ui_config);

        this.config = res;
        this.formConfig.emit(res);

        this.updateConfig(this.config.ui_config);
        this.addAutocompleteProperty(this.config.ui_config);

        this.changeType('contact.title', 'radio');
        this.changeType('contact.gender', 'radio');
        this.changeType('transportation_to_work', 'radio');

        this.generateSteps();

      });
  }

  back() {
    if (this.currentStep !== 0) {
      this.currentStep -= 1;
    }
  }

  next() {
    this.currentStep += 1;
  }

  public changeType(key: string, to: string) {
    const field = getElementFromMetadata(this.config.ui_config, key);
    field.type = to;
  }

  public eventHandler(event: any) {
    if (event.type === 'blur') {
      ['email', 'phone'].forEach((field) => {
        if (event.el.key.indexOf(field) > -1) {
          this.validate(field, event.value, event.el.key);
        }
      });
    }

    if (event.type === 'address') {
      this.parseAddress(event.value, event.el);
    }
  }

  public submitForm() {
    this.saveProcess = true;
    const data = this.form.value;
    this.service.sendFormData(this.id, data)
      .subscribe(
        (res: any) => {
          this.saveProcess = false;
          this.toastr.sendMessage(this.config.submit_message, 'success');
          this.router.navigate(['/login']);
        },
        (err: any) => {
          this.parseError(err.errors);
          this.saveProcess = false;
         }
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
    this.currentStep = this.getErrorStep(errors);
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
    this.hideDatepickerError(config);

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
          field.mode = new BehaviorSubject('view');
          field.send = false;
          field.hide = true;
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

  public hideDatepickerError(config: Field[]) {
    const pickers = config.filter((el) => el.type === 'datepicker');
    if (pickers.length) {
      pickers.forEach((el) => {
        el.templateOptions.hidePreviewError = true;
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

  public validate(key, value, field) {
    this.service.validate(key, value).subscribe(
      (res) => {
        this.resetData(this.error);
        this.updateErrors(this.error, {
          [field]: ''
        }, {});
      },
      (err) => {
        this.parseError({
          [field]: err.errors.message
        });
      });
  }

  private updateConfigByGroups(fields: Field[]): void {
    const skills = this.getFields([], 'skill', fields, 0);
    if (skills.length) {
      const formData = new BehaviorSubject({});
      skills[0] = this.updateSkillField(skills[0], formData);
      skills.unshift({ ...this.industyField, formData });
      fields.push(...skills);
    }
  }
}
