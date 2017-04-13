import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NgbModule, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormDatepickerComponent } from './form-datepicker.component';

describe('FormDatepickerComponent', () => {
  let fixture: ComponentFixture<FormDatepickerComponent>;
  let comp: FormDatepickerComponent;
  let el;
  let config = {
    type: 'datepicker',
    key: 'birthday',
    read_only: false,
    templateOptions: {
      placeholder: '--/--/----',
      label: 'Birthday',
      type: 'text',
      required: true,
      description: 'birthday text',
    }
  };
  let errors = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormDatepickerComponent
      ],
      providers: [FormBuilder],
      imports: [ReactiveFormsModule, NgbModule.forRoot()],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(FormDatepickerComponent);
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
