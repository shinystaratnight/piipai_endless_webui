import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormCheckboxComponent } from './form-checkbox.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

describe('FormCheckboxComponent', () => {
  let fixture: ComponentFixture<FormCheckboxComponent>;
  let comp: FormCheckboxComponent;
  let el;
  let config = {
      type: 'checkbox',
      key: 'is_available',
      read_only: true,
      value: false,
      default: true,
      templateOptions: {
        label: 'Test',
        required: true,
        type: 'icon',
        color: 'primary',
        values: {
          true: 'check-circle',
          false: 'times-circle',
          null: 'minus-circle'
        }
      }
    };
  let errors = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormCheckboxComponent
      ],
      providers: [FormBuilder],
      imports: [ReactiveFormsModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(FormCheckboxComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should enter the assertion', async(inject([FormBuilder], (fb: FormBuilder) => {
    comp.config = config;
    comp.group = fb.group({});
    comp.errors = errors;
    fixture.detectChanges();
    expect(comp.errors).toBeDefined();
    expect(comp.config).toBeDefined();
  })));

  describe('ngOnInit method', () => {

    it('should called addControl method', async(inject([FormBuilder], (fb: FormBuilder) => {
      let form = fb.group({});
      comp.key = 'active';
      form.addControl(comp.key, fb.control(''));
      comp.group = form;
      comp.config = config;
      comp.config.read_only = true;
      spyOn(comp, 'addControl');
      spyOn(comp, 'setValue');
      comp.ngOnInit();
      expect(comp.addControl).toHaveBeenCalled();
      expect(comp.setValue).toHaveBeenCalled();
      expect(comp.group.get(comp.key).value).toBeFalsy();
    })));

    it('should set default value', async(inject([FormBuilder], (fb: FormBuilder) => {
      comp.config = config;
      comp.key = config.key;
      comp.group = fb.group({});
      comp.group.addControl(comp.key, fb.control(false));
      comp.config.value = false;
      comp.config.read_only = false;
      spyOn(comp, 'addControl');
      spyOn(comp, 'customizeCheckbox');
      comp.ngOnInit();
      expect(comp.addControl).toHaveBeenCalled();
      expect(comp.customizeCheckbox).toHaveBeenCalled();
      expect(comp.group.get(comp.key).value).toBeFalsy();
    })));

    it('should update value', async(inject([FormBuilder], (fb: FormBuilder) => {
      let form = fb.group({});
      comp.group = form;
      comp.config = config;
      comp.config.value = true;
      comp.ngOnInit();
      expect(comp.group.get(comp.config.key).value).toBeTruthy();
    })));

  });

  describe('setValue method', () => {
    it('should set value and "text-success" class for checkbox', () => {
      let value = true;
      comp.config = config;
      comp.setValue(value);
      expect(comp.checkboxValue).toEqual('check-circle');
      expect(comp.checkboxClass).toEqual('text-success');
    });

    it('should set value and "text-danger" class for checkbox', () => {
      let value = false;
      comp.config = config;
      comp.setValue(value);
      expect(comp.checkboxValue).toEqual('times-circle');
      expect(comp.checkboxClass).toEqual('text-danger');
   });

    it('should set value and "text-muted" class for checkbox', () => {
      let value = null;
      comp.config = config;
      comp.setValue(value);
      expect(comp.checkboxValue).toEqual('minus-circle');
      expect(comp.checkboxClass).toEqual('text-muted');
    });
  });

  describe('customCheckbox method', () => {
    it('should set checkboxClass', () => {
      comp.config = config;
      comp.customizeCheckbox();
      expect(comp.checkboxClass).toEqual(`text-${config.templateOptions.color}`);
      expect(comp.checkboxColor).toEqual('');
    });

    it('should set color', () => {
      comp.config = config;
      comp.config.templateOptions.color = 'purple';
      comp.customizeCheckbox();
      expect(comp.checkboxColor).toEqual(comp.config.templateOptions.color);
      expect(comp.checkboxClass).toEqual('');
    });
  });

  describe('ngAfterViewInit method', () => {

    it('should called addControl method', async(() => {
      comp.checkbox = {};
      spyOn(comp, 'addFlags');
      comp.ngAfterViewInit();
      expect(comp.addFlags).toHaveBeenCalled();
    }));

  });

  describe('eventHandler method', () => {

    it('should be emit event', async(inject([FormBuilder], (fb) => {
      let form = fb.group({});
      let key = 'email';
      let metadata = {
        key: 'email',
        value: 'test@test.com',
        read_only: false
      };
      let event = { type: 'change' };
      form.addControl(key, fb.control(''));
      form.get(key).patchValue('test@test.com');
      comp.group = form;
      comp.config = metadata;
      comp.key = key;
      spyOn(comp.event, 'emit');
      comp.eventHandler(event);
      expect(comp.event.emit).toHaveBeenCalled();
    })));

  });

});
