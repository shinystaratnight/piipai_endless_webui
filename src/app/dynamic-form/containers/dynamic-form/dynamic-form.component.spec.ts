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

  describe('ngOnInit method', () => {

    it('should called addData method', async(inject([FormBuilder], (fb: FormBuilder) => {
      let fixture = TestBed.createComponent(DynamicFormComponent);
      let comp = fixture.componentInstance;
      let form = fb.group({});
      comp.config = [];
      comp.ngOnInit();
      // expect(comp.form).toEqual(form);
      expect(comp.currentForm).toEqual([]);
    })));

  });

  describe('ngOnChanges method', () => {

    it('should called addData method', async(() => {
      let fixture = TestBed.createComponent(DynamicFormComponent);
      let comp = fixture.componentInstance;
      spyOn(comp, 'addData');

      comp.ngOnChanges();
      expect(comp.addData).toHaveBeenCalled();
    }));

    it('should update values', async(inject([FormBuilder], (fb: FormBuilder) => {
      let fixture = TestBed.createComponent(DynamicFormComponent);
      let comp = fixture.componentInstance;
      comp.config = ['some'];
      comp.commonFields = [];
      let form = fb.group({});
      comp.form = form;
      let currentForm = [];
      spyOn(comp, 'getValues').and.returnValue({});
      spyOn(comp.formChange, 'emit');
      comp.ngOnChanges();
      expect(comp.currentForm).toEqual(comp.config);
      expect(comp.getValues).toHaveBeenCalled();
      expect(comp.formChange.emit).toHaveBeenCalledWith({});
    })));

  });

  describe('getValues method', () => {

    it('should return values of form', () => {
      let fixture = TestBed.createComponent(DynamicFormComponent);
      let comp = fixture.componentInstance;
      let data = {first_name: 'Tom'};
      let list = ['first_name'];
      spyOn(comp, 'getValue').and.returnValue('Tom');
      let result = comp.getValues(data, list);
      expect(result).toEqual(data);
    });

  });

  describe('getValue method', () => {

    it('should return value of form element', inject([FormBuilder], (fb: FormBuilder) => {
      let fixture = TestBed.createComponent(DynamicFormComponent);
      let comp = fixture.componentInstance;
      let list = ['address.country'];
      comp.form = fb.group({});
      comp.form.addControl('address', fb.group({country: 'Australia'}));
      let result = comp.getValues(comp.form, list);
      expect(result).toEqual({
        'address.country': 'Australia'
      });
    }));

  });

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

  describe('eventHandler method', () => {

    it('should be emit event', () => {
      let fixture = TestBed.createComponent(DynamicFormComponent);
      let comp = fixture.componentInstance;
      spyOn(comp.event, 'emit');
      comp.eventHandler('event');
      expect(comp.event.emit).toHaveBeenCalled();
    });

  });

  describe('buttonActionHandler method', () => {

    it('should be emit event', () => {
      let fixture = TestBed.createComponent(DynamicFormComponent);
      let comp = fixture.componentInstance;
      spyOn(comp.buttonAction, 'emit');
      comp.buttonActionHandler('event');
      expect(comp.buttonAction.emit).toHaveBeenCalled();
    });

  });

  describe('resourseDataHandler method', () => {

    it('should be emit event', () => {
      let fixture = TestBed.createComponent(DynamicFormComponent);
      let comp = fixture.componentInstance;
      spyOn(comp.resourseData, 'emit');
      comp.resourseDataHandler('event');
      expect(comp.resourseData.emit).toHaveBeenCalled();
    });

  });

  describe('addData method', () => {

    it('should update metadata', async(() => {
      let fixture = TestBed.createComponent(DynamicFormComponent);
      let comp = fixture.componentInstance;
      spyOn(comp, 'updateForm');
      comp.config = [{
        key: 'address.country',
        value: '',
        templateOptions: {
          readonly: false
        }
      }];
      comp.data = [{
        key: 'country',
        value: 'Australia',
        read_only: true
      }];
      fixture.detectChanges();
      comp.addData(comp.data, comp.config);
      expect(comp.updateForm).toHaveBeenCalled();
    }));

  });

  describe('updateForm method', () => {

    it('should update metadata', async(inject(
      [FormBuilder], (fb) => {
      let fixture = TestBed.createComponent(DynamicFormComponent);
      let comp = fixture.componentInstance;
      let form = fb.group({});
      form.addControl('address', fb.group({}));
      form.get('address').addControl('country', fb.control(''));
      let data = {
        country: {
          action: 'update',
          value: 'Australia'
        }
      };
      comp.updateForm('address.country'.split('.'), data, form, 'country');
      expect(form.get('address').get('country').value).toEqual('Australia');
    })));

  });

});
