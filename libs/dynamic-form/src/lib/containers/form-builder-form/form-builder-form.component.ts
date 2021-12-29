import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subscription, Observable, of, Subject } from 'rxjs';

import { FormBuilderService, FormService } from '../../services';
import { MessageType, ToastService } from '@webui/core';
import { HiddenFields } from '../../components/generic-form/generic-form.component';
import { Endpoints, Field } from '@webui/data';
import { convertPhoneNumber, getElementFromMetadata } from '../../helpers';
import { PassTestModalComponent, PassTestModalConfig } from '../../modals';
import { FormStep, industryField, steps } from './form-builder-form.config';
import { delay, finalize } from 'rxjs/operators';
import { FormEvent } from '../../interfaces';

type Step = {
  key: number;
  position: number;
} & FormStep;

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
  public formChangeSubscription: Subscription;

  public passedTests: Map<string, any[]> = new Map();

  private industryField = industryField;
  private steps = steps;
  private invalid: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private saving: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _step: BehaviorSubject<Step> = new BehaviorSubject({} as Step);
  barWidth: any = 0;
  constructor(
    private service: FormBuilderService,
    private router: Router,
    private toastr: ToastService,
    private modalService: NgbModal,
    private formService: FormService,
    private cd: ChangeDetectorRef
  ) {}

  public get step$(): Observable<Step> {
    return this._step.asObservable();
  }

  public get saving$(): Observable<boolean> {
    return this.saving.asObservable();
  }

  public get invalid$(): Observable<boolean> {
    return this.invalid.asObservable();
  }

  public ngOnInit() {
    this.form = new FormGroup({});

    this.formChangeSubscription = this.form.valueChanges.subscribe(() => {
      this.validate();
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

  public back(): void {
    const currentStep = this._step.getValue();

    if (currentStep.key === 0) {
      this.router.navigate(['/login']);
      return;
    }

    this.changeStep(currentStep.key - 1);
  }

  public next(): void {
    const currentStep = this._step.getValue();
    this.changeStep(currentStep.key + 1);
    this.updateStepProgressBar(currentStep.position);
  }

  // public eventHandler(event: any) {
  //   const { type, el, value } = event;
  //
  //   // TODO: update validation
  //   if (type === 'blur') {
  //     ['email'].forEach((field) => {
  //       if (el.key.indexOf(field) > -1 && value) {
  //         this.validateField(field, value, el.key);
  //       }
  //     });
  //   }
  // }

  public submitForm() {
    const data = this.form.value;
    this.saving.next(true);

    this.passTests(data).subscribe((success) => {
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

      convertPhoneNumber(body);

      this.service.sendFormData(this.id, body).subscribe(
        (res: any) => {
          this.saving.next(false);
          this.toastr.sendMessage(
            this.config.submit_message,
            MessageType.Success
          );
          this.router.navigate(['/login']);
        },
        (err: any) => {
          this.saving.next(false);
          this.parseError(err.errors);
        }
      );
    });
  }

  // private validateField(key, value, field) {
  //   console.log(key, value);
  //
  //   this.service
  //     .validate(key, value)
  //     .pipe(finalize(() => this.cd.detectChanges()))
  //     .subscribe(
  //       (res) => {
  //         delete this.error[field];
  //       },
  //       (err) => {
  //         this.updateErrors(
  //           this.error,
  //           {
  //             [field]: err.errors.message
  //           },
  //           {}
  //         );
  //       }
  //     );
  // }

  private changeType(key: string, to: string): void {
    const field = getElementFromMetadata(this.config.ui_config, key);
    if (field) {
      field.type = to;
    }
  }

  private changeTemplateType(key: string, to: string): void {
    const field = getElementFromMetadata(this.config.ui_config, key);
    if (field) {
      field.templateOptions.type = to;
    }
  }

  private generateSteps() {
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

  private getErrorStep(errors) {
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

  private getRenderData() {
    this.service.getRenderData(this.id).subscribe((res: any) => {
      this.updatePhoneField(res.ui_config);
      this.updateConfigByGroups(res.ui_config, res.tests || []);
      this.updateHiddenFields(res.ui_config);
      // const formData = new BehaviorSubject({ data: {} });

      this.config = res;
      this.formConfig.emit(res);

      // this.updateConfig(this.config.ui_config);
      // this.addAutocompleteProperty(this.config.ui_config);

      this.changeType('contact.title', 'radio');
      this.changeType('contact.gender', 'radio');
      this.changeType('transportation_to_work', 'radio');
      this.changeTemplateType('contact.email', 'email');

      this.generateSteps();
      this.changeStep(0);
    });
  }

  private updateHiddenFields(config) {
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
    });
  }

  private updatePhoneField(fields: any[]) {
    fields.forEach((el) => {
      if (el.key === 'contact.phone_mobile') {
        el.intl = true;
      }
    });
  }

  private parseError(errors) {
    this.resetData(this.error);
    this.updateErrors(this.error, errors, {});

    this.changeStep(this.getErrorStep(errors));
  }

  public resetData(data) {
    if (data) {
      const keys = Object.keys(data);
      keys.forEach((el) => {
        delete data[el];
      });
    }
  }

  private updateErrors(error, errors, response, field = '') {
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

  private updateConfig(config: Field[]) {
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

  private hideDatepickerError(config: Field[]) {
    const pickers = config.filter((el) => el.type === 'datepicker');
    if (pickers.length) {
      pickers.forEach((el) => {
        el.templateOptions.hidePreviewError = true;
      });
    }
  }

  private observeFields(fields: any[], observers) {
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

  private getFields(
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

  private updateSkillField(
    field: Field,
    formData: BehaviorSubject<any>
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
      // tests,
      showIf: ['industry.id'],
      templateOptions: {
        ...field.templateOptions,
        values: ['__str__', 'id', 'translations', 'name']
      }
    };
  }

  private updateTagField(field: Field, formData: BehaviorSubject<any>): Field {
    return {
      ...field,
      endpoint: `${Endpoints.Tag}all/`,
      many: true,
      unique: true,
      // tests,
      formData
    };
  }

  private changeStep(nextStep: number): void {
    const step: Step = {
      ...this.steps[nextStep],
      key: nextStep,
      position: nextStep + 1
    };

    this._step.next(step);
    this.validate();
  }

  private validate(): void {
    let keys = [];
    const currentStep = this._step.getValue();
    currentStep.content.forEach((el) => {
      keys = Array.isArray(el) ? [...keys, ...el] : [...keys, el];
    });

    const invalid = keys.some((key) => {
      const control = this.form.get(key);

      return Boolean(control) ? control.invalid : false;
    });

    this.invalid.next(invalid);
  }

  private updateConfigByGroups(fields: Field[], tests: any[]): void {
    const skills = this.getFields([], 'skill', fields, 0);
    const tags = this.getFields([], 'tag', fields, 0);

    const formData = new BehaviorSubject({});

    if (skills.length) {
      skills[0] = this.updateSkillField(skills[0], formData);
      skills.unshift({ ...this.industryField, formData });
      fields.push(...skills);
    }

    if (tags.length) {
      tags[0] = this.updateTagField(tags[0], formData);
      fields.push(...tags);
    }
  }

  private passTests(formData: any): Observable<boolean> {
    const currentTest: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    const success: Subject<boolean> = new Subject();
    const chosenIndustry = formData.industry.id;
    const chosenSkills = formData.skill || [];
    const chosenTags = formData.tag || [];

    let testsForPassing = this.config.tests.filter((test) => {
      const industries = test.acceptance_tests_industries.map(
        ({ industry }) => industry.id
      );
      const skills = test.acceptance_tests_skills.map(({ skill }) => skill.id);
      const tags = test.acceptance_tests_tags.map(({ tag }) => tag.id);

      if (!industries.length && !skills.length && !tags.length) {
        return true;
      }

      return (
        industries.includes(chosenIndustry) ||
        chosenSkills.some((id) => skills.includes(id)) ||
        chosenTags.some((id) => tags.includes(id))
      );
    });

    const notRelevantTests = Array.from(this.passedTests.keys()).filter(
      (id) => !testsForPassing.some((test) => test.id === id)
    );
    notRelevantTests.forEach((id) => {
      this.passedTests.delete(id);
    });

    testsForPassing = testsForPassing.filter(
      (test) => !this.passedTests.has(test.id)
    );

    if (!testsForPassing.length) {
      return of(true);
    } else {
      const onModalResult = (index: number) => {
        if (testsForPassing[index + 1]) {
          currentTest.next(index + 1);
        } else {
          success.next(true);
        }
      };

      currentTest.subscribe((index) => {
        const test = testsForPassing[index];
        this.modalRef = this.modalService.open(PassTestModalComponent, {
          backdrop: 'static'
        });
        this.modalRef.componentInstance.config = {
          test,
          description: test.description,
          send: false,
          skipScoreForTest: true
        } as PassTestModalConfig;

        this.modalRef.result
          .then((res: any[]) => {
            this.passedTests.set(test.id, [...res]);

            onModalResult(index);
          })
          .catch(() => {
            onModalResult(index);
          });
      });
    }

    return success.asObservable();
  }

  updateStepProgressBar(step){ 
    if(step == 1){
      this.barWidth = 30;
    }else if(step == 2){
      this.barWidth = 65;
    }else if(step == 3){
        this.barWidth = 96;
    }
  }
}
