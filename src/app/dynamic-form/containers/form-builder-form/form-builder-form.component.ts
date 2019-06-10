import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';

import { FormBuilderService } from '../../services';
import { ToastService } from '../../../shared/services';
import { HiddenFields } from '../../components/generic-form/generic-form.component';
import { Field } from '../../models';
import { getElementFromMetadata } from '../../helpers';
import { PassTestModalComponent, PassTestModalConfig } from '../../modals';

@Component({
  selector: 'app-form-builder-form',
  templateUrl: './form-builder-form.component.html',
  styleUrls: ['./form-builder-form.component.scss']
})
export class FormBuilderFormComponent implements OnInit, OnDestroy {

  @Input() public id: string;
  @Input() public companyId: string;
  @Input() public config: any;

  @Output() public formConfig: EventEmitter<any> = new EventEmitter();

  public form: FormGroup;
  public modalRef: NgbModalRef;

  public error = {};
  public hiddenFields: HiddenFields = {
    elements: [],
    keys: [],
    observers: []
  };

  public currentStep = 0;
  public saveProcess = false;
  public disableNextButton = false;
  public formInvalid = true;
  public formChangeSubscription: Subscription;

  public passedTests: any[];

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
    private modalService: NgbModal
  ) { }

  public ngOnInit() {
    this.form = new FormGroup({});

    this.formChangeSubscription = this.form.valueChanges.subscribe(() => {
      this.formInvalid = this.validateForm(this.currentStep);
    });

    this.industyField.query = {
      company: this.companyId
    };

    this.getRenderData();
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
    if (field) {
      field.type = to;
    }
  }

  public eventHandler(event: any) {
    if (event.type === 'blur') {
      ['email', 'phone'].forEach((field) => {
        if (event.el.key.indexOf(field) > -1 && event.value) {
          this.validate(field, event.value, event.el.key);
        }
      });
    }

    if (event.type === 'address') {
      this.parseAddress(event.value, event.el);
    }

    if (event.type === 'test') {
      const tests = event.tests;
      const passTestAction = new BehaviorSubject(0);

      passTestAction.subscribe((index) => {
        const test = tests[index];
        this.modalRef = this.modalService.open(PassTestModalComponent);
        this.modalRef.componentInstance.config = {
          test,
          description: test.description,
          send: false
        } as PassTestModalConfig;

        this.modalRef.result
          .then((res: any[]) => {
            if (!this.passedTests) {
              this.passedTests = [];
            }

            this.passedTests = [...this.passedTests, ...res];

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
      tests: [
        {
          id: 'b4966aa8-b0b1-429e-858d-3ab666a04749',
          acceptance_tests_skills: [
            { id: '', skill: { id: '30dc3620-8977-4e4a-9072-0022bf0f68ab'} }
          ],
          acceptance_test_questions: [
            {
              id: '8addcdc0-709a-4d63-a37c-344020dbac8e',
              question: 'What is your name?',
              details: 'Without last name',
              order: 4,
              type: 1,
              acceptance_test_answers: [],
              __str__: 'What is your name?'
            },
            {
              id: '69226e88-4d96-44a8-80fb-81636ba15566',
              question: 'Are you sure?',
              details: 'Details',
              order: 3,
              type: 2,
              acceptance_test_answers: [
                {
                  id: '4a830663-add7-401f-b4be-d3a37848ed18',
                  answer: 'Yes',
                  order: 1,
                  score: 5,
                  __str__: 'Are you sure?: Yes'
                },
                {
                  id: 'e3448331-9777-48e0-b2c8-f0ffa80d35dd',
                  answer: 'No',
                  order: 2,
                  score: 1,
                  __str__: 'Are you sure?: No'
                }
              ],
              __str__: 'Are you sure?'
            },
            {
              id: 'b47a097e-85db-4f82-b9be-f2c9d87d2fe3',
              question: 'English',
              details: '',
              order: 2,
              type: 0,
              acceptance_test_answers: [
                {
                  id: '484cf13b-aa54-4cd6-b0e0-ae32c1d53efc',
                  answer: 'Excellent',
                  order: 1,
                  score: 5,
                  __str__: 'English: Excellent'
                },
                {
                  id: 'd92b5642-e9c3-4058-847e-7dd3a8eafd79',
                  answer: 'Good',
                  order: 2,
                  score: 4,
                  __str__: 'English: Good'
                },
                {
                  id: 'c9e6b8d6-90d4-4332-9736-72f6effb079b',
                  answer: 'Average',
                  order: 3,
                  score: 3,
                  __str__: 'English: Average'
                },
                {
                  id: 'c1516b83-bba2-4cee-b2ce-069fe03c3294',
                  answer: 'Poor',
                  order: 4,
                  score: 2,
                  __str__: 'English: Poor'
                },
                {
                  id: 'f2dc74fa-f0bb-45a7-81c0-72ec14c47111',
                  answer: 'No English',
                  order: 5,
                  score: 1,
                  __str__: 'English: No English'
                }
              ],
              __str__: 'English'
            }
          ],
        },
        {
          id: 'b4966aa8-b0b1-429e-858d-3ab666a04749',
          acceptance_tests_skills: [
            { id: '', skill: { id: '30dc3620-8977-4e4a-9072-0022bf0f68ab'} }
          ],
          acceptance_test_questions: [
            {
              id: '8addcdc0-709a-4d63-a37c-344020dbac8e',
              question: 'What is your name?',
              details: 'Without last name',
              order: 4,
              type: 1,
              acceptance_test_answers: [],
              __str__: 'What is your name?'
            },
            {
              id: '69226e88-4d96-44a8-80fb-81636ba15566',
              question: 'Are you sure?',
              details: 'Details',
              order: 3,
              type: 2,
              acceptance_test_answers: [
                {
                  id: '4a830663-add7-401f-b4be-d3a37848ed18',
                  answer: 'Yes',
                  order: 1,
                  score: 5,
                  __str__: 'Are you sure?: Yes'
                },
                {
                  id: 'e3448331-9777-48e0-b2c8-f0ffa80d35dd',
                  answer: 'No',
                  order: 2,
                  score: 1,
                  __str__: 'Are you sure?: No'
                }
              ],
              __str__: 'Are you sure?'
            },
            {
              id: 'b47a097e-85db-4f82-b9be-f2c9d87d2fe3',
              question: 'English',
              details: '',
              order: 2,
              type: 0,
              acceptance_test_answers: [
                {
                  id: '484cf13b-aa54-4cd6-b0e0-ae32c1d53efc',
                  answer: 'Excellent',
                  order: 1,
                  score: 5,
                  __str__: 'English: Excellent'
                },
                {
                  id: 'd92b5642-e9c3-4058-847e-7dd3a8eafd79',
                  answer: 'Good',
                  order: 2,
                  score: 4,
                  __str__: 'English: Good'
                },
                {
                  id: 'c9e6b8d6-90d4-4332-9736-72f6effb079b',
                  answer: 'Average',
                  order: 3,
                  score: 3,
                  __str__: 'English: Average'
                },
                {
                  id: 'c1516b83-bba2-4cee-b2ce-069fe03c3294',
                  answer: 'Poor',
                  order: 4,
                  score: 2,
                  __str__: 'English: Poor'
                },
                {
                  id: 'f2dc74fa-f0bb-45a7-81c0-72ec14c47111',
                  answer: 'No English',
                  order: 5,
                  score: 1,
                  __str__: 'English: No English'
                }
              ],
              __str__: 'English'
            }
          ],
        }
      ]
    };
  }

  public validate(key, value, field) {
    this.service.validate(key, value).subscribe(
      (res) => {
        delete this.error[field];
        this.disableNextButton = false;
      },
      (err) => {
        this.updateErrors(this.error, {
          [field]: err.errors.message
        }, {});
        this.disableNextButton = true;
      });
  }

  public validateForm(step: number) {
    const fields = this.steps[step].content;
    let result = false;

    fields.forEach((key) => {
      if (Array.isArray(key)) {
        key.forEach((field) => {
          result = (this.form.get(field) && this.form.get(field).invalid) || result;
        });
      } else {
        result = (this.form.get(key) && this.form.get(key).invalid) || result;
      }
    });

    return result;
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
