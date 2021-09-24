import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';

import { FormBuilderService, FormService } from '../../services';
import { MessageType, ToastService } from '@webui/core';
import { HiddenFields } from '../../components/generic-form/generic-form.component';
import { Endpoints, Field } from '@webui/data';
import { getElementFromMetadata } from '../../helpers';
import { PassTestModalComponent, PassTestModalConfig } from '../../modals';

@Component({
  selector: 'app-form-builder-form',
  templateUrl: './form-builder-form.component.html',
  styleUrls: ['./form-builder-form.component.scss'],
  providers: [FormService]
})
export class FormBuilderFormComponent implements OnInit, OnDestroy {
  @Input() public id: string;
  @Input() public companyId: string;
  @Input() public config: any;

  @Output() public formConfig: EventEmitter<any> = new EventEmitter();

  public form: FormGroup;
  public modalRef: NgbModalRef;
  public formId: number;

  public error = {};
  public hiddenFields: HiddenFields = {
    elements: [],
    keys: [],
    observers: []
  };
  public process: boolean;

  public currentStep = 0;
  public saveProcess = false;
  public disableNextButton = false;
  public formInvalid = true;
  public formChangeSubscription: Subscription;

  public passedTests: Map<string, any[]> = new Map();

  public industryField = {
    type: 'related',
    send: false,
    endpoint: '/pricing/industries/',
    key: 'industry',
    templateOptions: {
      label: 'Industry',
      type: 'related',
      values: ['__str__', 'id', 'translations']
    },
    query: {}
  };

  public steps = [
    {
      title: 'contact_information',
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
        'contact.address.street_address'
      ]
    },
    {
      title: 'additional_information',
      metadata: [],
      content: [
        'nationality',
        'residency',
        'tax_file_number',
        'transportation_to_work',
        ['weight', 'height']
      ]
    },
    {
      title: 'bank_and_superannuation_informatioin',
      metadata: [],
      content: [
        'contact.bank_accounts.bank_account_number',
        'contact.bank_accounts.bank_account_name',
        'contact.bank_accounts.bsb_number',
        'contact.bank_accounts.AccountholdersName',
        'contact.bank_accounts.bank_name',
        'contact.bank_accounts.IBAN',
        'contact.bank_accounts.TestBankAccountField',
        'formalities.tax_number',
        'formalities.personal_id',
        'superannuation_fund',
        'superannuation_membership_number'
      ]
    },
    {
      title: 'industry_and_skills',
      metadata: [],
      content: ['industry', 'skill', 'tag']
    }
  ];

  constructor(
    private service: FormBuilderService,
    private router: Router,
    private toastr: ToastService,
    private modalService: NgbModal,
    private formService: FormService
  ) {}

  public ngOnInit() {
    this.form = new FormGroup({});

    this.formChangeSubscription = this.form.valueChanges.subscribe(() => {
      this.formInvalid = this.isInvalid(this.currentStep);
    });

    this.industryField.query = {
      company: this.companyId
    };

    this.getRenderData();

    this.formId = this.formService.registerForm(
      this.service.formEndpoint,
      'edit'
    );
  }

  public ngOnDestroy() {
    if (this.formChangeSubscription) {
      this.formChangeSubscription.unsubscribe();
    }
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
                field.className = 'mr-3';
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
            if (key === 'superannuation_membership_number') {
              field.templateOptions.label = 'Superannuation membership number';
            }

            step.metadata.push(field);
          }
        }
      });
      if (step.metadata.length === 0) {
        step['empty'] = true;
      }
    });

    this.steps = this.steps.filter((step) => !step['empty']);
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
    this.service.getRenderData(this.id).subscribe((res: any) => {
      this.updatePhoneField(res.ui_config);
      this.updateConfigByGroups(res.ui_config, res.tests || []);
      this.updateHiddenFields(res.ui_config);
      const formData = new BehaviorSubject({ data: {} });

      this.config = res;
      this.formConfig.emit(res);

      // this.updateConfig(this.config.ui_config);
      // this.addAutocompleteProperty(this.config.ui_config);

      this.changeType('contact.title', 'radio');
      this.changeType('contact.gender', 'radio');
      this.changeType('transportation_to_work', 'radio');

      this.generateSteps();
    });
  }

  updateHiddenFields(config) {
    config.forEach((field) => {
      if (field.showIf && field.showIf.length) {
        if (this.hiddenFields.keys.indexOf(field.key) === -1) {
          this.hiddenFields.keys.push(field.key);
          this.hiddenFields.elements.push(field);

          this.hiddenFields.observers = this.observeFields(
            field.showIf,
            this.hiddenFields.observers
          );

          field.hidden = new BehaviorSubject(true);
        }
      }
    })
  }

  updatePhoneField(fields: any[]) {
    fields.forEach((el) => {
      if (el.key === 'contact.phone_mobile') {
        el.intl = true;
      }
    });
  }

  back() {
    if (this.currentStep !== 0) {
      this.process = true;
      this.currentStep -= 1;

      setTimeout(() => {
        this.process = false;
      }, 1000);
    } else {
      this.router.navigate(['/login']);
    }
  }

  next() {
    this.currentStep += 1;
    this.process = true;

    setTimeout(() => {
      this.process = false;
    }, 1000);
  }

  public changeType(key: string, to: string) {
    const field = getElementFromMetadata(this.config.ui_config, key);
    if (field) {
      field.type = to;
    }
  }

  public eventHandler(event: any) {
    const { type, item, list, el, value } = event;

    // TODO: update validation
    // if (type === 'blur') {
    //   ['email', 'phone'].forEach((field) => {
    //     if (el.key.indexOf(field) > -1 && value) {
    //       this.validate(field, value, el.key);
    //     }
    //   });
    // }

    // if (type === 'address') {
    //   this.parseAddress(value, el);
    // }

    if (type === 'chenge' && (el.key === 'skill' || el.key === 'tag')) {
      const ids = list.map((item: any) => item.id);

      // if (!list.length) {
      //   this.passedTests.clear();
      // } else {
        Array.from(this.passedTests.keys(), (key: string) => {
          if (!ids.includes(key)) {
            this.passedTests.delete(key);
          }
        });
      // }
    }

    if (type === 'test') {
      // const tests = item.tests;
      this.passTests(item.tests, item.id, item);
    }
  }

  passTests(tests, id?, item?) {
    const passTestAction = new BehaviorSubject(0);

    passTestAction.subscribe((index) => {
      const test = tests[index];
      this.modalRef = this.modalService.open(PassTestModalComponent, {
        backdrop: 'static'
      });
      this.modalRef.componentInstance.config = {
        test,
        description: test.description,
        send: false
      } as PassTestModalConfig;

      this.modalRef.result
        .then((res: any[]) => {
          if (this.passedTests.has(id)) {
            this.passedTests.set(id, [
              ...this.passedTests.get(id),
              ...res
            ]);
          } else {
            this.passedTests.set(id, res);
          }

          if (item) {
            item.passed = true;
          }

          if (tests[index + 1]) {
            passTestAction.next(index + 1);
          }
        })
        .catch(() => {
          if (tests[index + 1]) {
            passTestAction.next(index + 1);
          }
        });
    });
  }

  public submitForm() {
    const data = this.form.value;

    if (data.industry && data.industry.id && !this.passedTests.has(data.industry.id)) {
      const industryTests = this.config.tests.filter((test) => {
        return test.acceptance_tests_industries
          .some((relation) => relation.industry.id === data.industry.id);
      })

      if (industryTests.length) {
        this.passTests(industryTests, data.industry.id);
        return;
      }
    }


    this.saveProcess = true;
    let body;

    if (this.passedTests.size) {
      const tests = [];
      Array.from(this.passedTests.values()).forEach((el) => {
        if (el) {
          tests.push(...el);
        }
      });
      body = { ...this.form.value, tests };
    } else {
      body = this.form.value;
    }

    Object.keys(body).map((key: string) => {
      const value: any = body[key];

      if (Array.isArray(value)) {
        const newValue = value.map((item) => {
          if (typeof item === 'string') {
            return {
              id: item
            };
          }

          return item;
        });

        body[key] = newValue;
      }
    });

    // if (body.industry && body.industry.id) {
    //   const industryTests = this.config.tests.filter((test) => {
    //     return test.acceptance_tests_industries
    //       .some((relation) => relation.industry.id === body.industry.id);
    //   })

    //   if (industryTests.length) {
    //     this.passTests(industryTests, body.industry.id);
    //   }
    // }

    this.service.sendFormData(this.id, body).subscribe(
      (res: any) => {
        this.saveProcess = false;
        this.toastr.sendMessage(
          this.config.submit_message,
          MessageType.Success
        );
        this.router.navigate(['/login']);
      },
      (err: any) => {
        this.parseError(err.errors);
        this.saveProcess = false;
      }
    );
  }

  public parseAddress(data, el) {
    this.service.parseAddress(data).subscribe(
      (res) => {
        this.parseError({ [el.key]: [] });
        el.autocompleteData.next(res);
      },
      (err: any) => {
        this.parseError(
          Object.assign({ ...this.error, [el.key]: err.errors['address'] })
        );
      }
    );
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
      const keys = Object.keys(errors);
      keys.forEach((el) => {
        if (errors[el].length) {
          if (field) {
            error[`${field}.${el}`] = errors[el];
            delete response[`${field}.${el}`];
          } else {
            error[el] = errors[el].toString();
            delete response[el];
          }
        } else {
          this.updateErrors(error, errors[el], response, el);
        }
      });
    }
  }

  // public addAutocompleteProperty(metadata: any, property?: Subject<any>) {
  //   property = property || new Subject<any>();
  //   metadata.forEach((element) => {
  //     if (element.key) {
  //       element.autocompleteData = property;
  //     } else if (element.children) {
  //       this.addAutocompleteProperty(element.children, property);
  //     }
  //   });
  // }

  public updateConfig(config: Field[]) {
    // this.hideDatepickerError(config);

    const streetAddress = config.find((field) => {
      if (field.key) {
        return field.key.includes('street_address');
      }
    });

    if (streetAddress) {
      streetAddress.updateFormData = true;
      streetAddress.formData = new BehaviorSubject({ data: {} });
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
            this.hiddenFields.observers = this.observeFields(
              field.showIf,
              this.hiddenFields.observers
            );
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

  public getFields(
    result: Field[],
    key: string,
    target: Field[],
    index: number
  ): Field[] {
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

  public updateSkillField(
    field: Field,
    formData: BehaviorSubject<any>,
    tests: any[]
  ): Field {
    return {
      ...field,
      query: {
        industry: '{industry.id}',
        company: 'currentCompany'
      },
      formData,
      many: true,
      unique: true,
      tests,
      showIf: ['industry.id'],
      templateOptions: {
        ...field.templateOptions,
        values: ['__str__', 'id', 'translations', 'name']
      }
    };
  }

  public updateTagField(field: Field, formData: BehaviorSubject<any>, tests: any[]): Field {
    return {
      ...field,
      endpoint: `${Endpoints.Tag}all/`,
      many: true,
      unique: true,
      tests,
      formData
    };
  }

  public validate(key, value, field) {
    this.service.validate(key, value).subscribe(
      (res) => {
        delete this.error[field];
        this.disableNextButton = false;
      },
      (err) => {
        this.updateErrors(
          this.error,
          {
            [field]: err.errors.message
          },
          {}
        );
        this.disableNextButton = true;
      }
    );
  }

  public isInvalid(step: number) {
    const keys = this.steps[step].content;
    let result = false;

    keys.forEach((key) => {
      if (Array.isArray(key)) {
        key.forEach((el) => {
          const control = this.form.get(el);

          if (control) {
            result = control.invalid;
          }
        });
      } else {
        const control = this.form.get(key);

        if (control) {
          result = control.invalid;
        }
      }
    });

    return result;
  }

  private updateConfigByGroups(fields: Field[], tests: any[]): void {
    const skills = this.getFields([], 'skill', fields, 0);
    const tags = this.getFields([], 'tag', fields, 0);
    const industry = this.getFields([], 'industry', fields, 0);

    const formData = new BehaviorSubject({});

    if (skills.length) {
      skills[0] = this.updateSkillField(skills[0], formData, tests);
      skills.unshift({ ...this.industryField, formData });
      fields.push(...skills);
    }

    if (tags.length) {
      tags[0] = this.updateTagField(tags[0], formData, tests);
      fields.push(...tags);
    }
  }
}
