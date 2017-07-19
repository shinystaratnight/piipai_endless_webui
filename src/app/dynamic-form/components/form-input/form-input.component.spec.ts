import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormInputComponent } from './form-input.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

describe('FormInputComponent', () => {
  let fixture: ComponentFixture<FormInputComponent>;
  let comp: FormInputComponent;
  let el;
  let config = {
    type: 'input',
    key: 'test',
    templateOptions: {
      placeholder: 'test',
      max: 2,
      min: 2,
      label: 'test',
      type: 'text',
      required: true,
      description: 'test'
    }
  };
  let errors = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormInputComponent
      ],
      providers: [FormBuilder],
      imports: [ReactiveFormsModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(FormInputComponent);
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

    it('should called addControl method', async(inject([FormBuilder], (fb) => {
      let form = fb.group({});
      let key = 'email';
      let metadata = {
        key: 'email',
        value: 'test@test.com',
        read_only: false
      };
      form.addControl(key, fb.control(''));
      comp.group = form;
      comp.config = metadata;
      comp.key = key;
      spyOn(comp, 'addControl');
      comp.ngOnInit();
      expect(comp.addControl).toHaveBeenCalled();
      expect(comp.group.get(key).value).toEqual('test@test.com');
    })));

  });

  describe('ngAfterViewInit method', () => {

    it('should called addControl method', async(() => {
      spyOn(comp, 'addFlags');
      comp.ngAfterViewInit();
      expect(comp.addFlags).toHaveBeenCalled();
    }));

  });

  describe('eventHandler method', () => {

    it('should be emit event', async(inject([FormBuilder], (fb) => {
      let form = fb.group({});
      let key = 'active';
      let metadata = {
        key: 'active',
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

  describe('filter method', () => {

    it('should update filteredList', async(inject([FormBuilder], (fb) => {
      let form = fb.group({});
      let metadata = {
        autocomplete: [{ name: 'anna' }, { name: 'banana' }]
      };
      let key = 'email';
      form.addControl('email', fb.control(''));
      comp.group = form;
      comp.config = metadata;
      comp.filter(key);
      expect(comp.filteredList).toEqual([]);
      form.get(key).patchValue('an');

      comp.filter(key);
      expect(comp.filteredList.length).toEqual(2);
    })));

  });

  describe('select method', () => {

    it('should update field', async(inject([FormBuilder], (fb) => {
      let form = fb.group({});
      let key = 'email';
      form.addControl('email', fb.control(''));
      comp.group = form;
      comp.key = key;
      comp.select('anna');
      expect(comp.group.get(key).value).toEqual('anna');
      expect(comp.filteredList).toEqual([]);
    })));

  });

  describe('handleClick method', () => {

    it('should reset filteredList', async(inject([FormBuilder], (fb) => {
      comp.filteredList = [{ name: 'anna' }, { name: 'banana' }];
      comp.handleClick({target: {}});
      expect(comp.filteredList).toEqual([]);
    })));

  });
});
