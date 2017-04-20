import { TestBed, async, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { DynamicFormComponent } from './dynamic-form.component';

describe('DynamicFormComponent', () => {

  const config = [{}];
  const errors = {
    non_field_errors: ''
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [DynamicFormComponent],
      providers: [
        FormBuilder,
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .overrideComponent(DynamicFormComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents();
  }));

  it('should enter the input assertion', async(inject(
    [FormBuilder], (fb: FormBuilder) => {
      let fixture = TestBed.createComponent(DynamicFormComponent);
      let comp = fixture.componentInstance;
      comp.config = config;
      comp.errors = errors;
      fixture.detectChanges();
      expect(comp.form).toBeDefined();
      expect(comp.config).toBeDefined();
  })));

  describe('handleSubmit method', () => {

    it('should enter the output assertion', async(() => {
      let fixture = TestBed.createComponent(DynamicFormComponent);
      let comp = fixture.componentInstance;
      comp.errors = errors;
      fixture.detectChanges();
      let formWasSubmited = false;
      let sub = comp.submit.subscribe(() => formWasSubmited = true);
      const selector = By.css('form');
      let form = fixture.debugElement.query(selector);
      let event = {
        preventDefault() {
          return true;
        },
        stopPropagation() {
          return true;
        }
      };
      form.triggerEventHandler('submit', event);
      fixture.detectChanges();
      expect(formWasSubmited).toBeTruthy();
      sub.unsubscribe();
    }));

  });

  describe('checkMetadata method', () => {

    it('should parse config', async(() => {
      let fixture = TestBed.createComponent(DynamicFormComponent);
      let comp = fixture.componentInstance;
      comp.errors = errors;
      fixture.detectChanges();
      comp.config = [{
        read_only: true
      }];
      comp.checkMetadata();
      fixture.detectChanges();
      expect(comp.config).toEqual([]);
    }));

  });

  describe('addData method', () => {

    it('should update metadata', async(() => {
      let fixture = TestBed.createComponent(DynamicFormComponent);
      let comp = fixture.componentInstance;
      comp.config = [{
        key: 'email',
        value: '',
        templateOptions: {
          readonly: false
        }
      }, {
        children: [{
          key: 'phone_mobile',
          value: '',
          templateOptions: {
            readonly: false
          }
        }]
      }];
      comp.data = [{
        key: 'email',
        value: 'test@test.com',
        readonly: true
      }];
      fixture.detectChanges();
      comp.addData(comp.data, comp.config);
      expect(comp.config[0].value).toEqual(comp.data[0].value);
      expect(comp.config[0].templateOptions.readonly).toEqual(comp.data[0].readonly);
    }));

  });

});
