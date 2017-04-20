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
});
