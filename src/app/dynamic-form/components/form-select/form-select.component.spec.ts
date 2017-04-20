import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { FormSelectComponent } from './form-select.component';

describe('FormSelectComponent', () => {
  let fixture: ComponentFixture<FormSelectComponent>;
  let comp: FormSelectComponent;
  let el;
  let config = {
    type: 'select',
    key: 'country',
    read_only: false,
    templateOptions: {
      label: 'Country',
      required: true,
      description: 'country text',
      placeholder: 'Country',
      options: [{
          key: 'mr',
          value: 'Mr.',
        }, {
          key: 'mrs',
          value: 'Mrs',
        }]
    }
  };
  let errors = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormSelectComponent
      ],
      providers: [FormBuilder],
      imports: [ReactiveFormsModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(FormSelectComponent);
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
