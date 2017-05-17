import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { FormTextareaComponent } from './form-textarea.component';

describe('FormTextareaComponent', () => {
  let fixture: ComponentFixture<FormTextareaComponent>;
  let comp: FormTextareaComponent;
  let el;
  let config = {
    type: 'textarea',
    key: 'note',
    read_only: false,
    templateOptions: {
      placeholder: 'Placeholder',
      max: 200,
      min: 2,
      cols: 3,
      rows: 5,
      label: 'Note',
      required: true,
      description: 'Note text',
    }
  };
  let errors = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormTextareaComponent
      ],
      providers: [FormBuilder],
      imports: [ReactiveFormsModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(FormTextareaComponent);
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

    it('should called addControl method', async(() => {
      comp.config = config;
      spyOn(comp, 'addControl');
      comp.ngOnInit();
      expect(comp.addControl).toHaveBeenCalled();
    }));

    it('should update value', async(inject([FormBuilder], (fb: FormBuilder) => {
      let form = fb.group({});
      comp.group = form;
      comp.config = config;
      comp.config.value = 'Some value';
      comp.ngOnInit();
      expect(comp.group.get(comp.config.key).value).toEqual('Some value');
    })));

  });

  describe('ngAfterViewInit method', () => {

    it('should called addControl method', async(() => {
      spyOn(comp, 'addFlags');
      comp.ngAfterViewInit();
      expect(comp.addFlags).toHaveBeenCalled();
    }));

  });
});
