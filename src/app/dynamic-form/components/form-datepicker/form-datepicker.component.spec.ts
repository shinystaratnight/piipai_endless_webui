import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
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
      type: 'date',
      required: true,
      description: 'birthday text',
    }
  };
  let errors = {};
  let moment = require('moment');

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormDatepickerComponent
      ],
      providers: [FormBuilder],
      imports: [ReactiveFormsModule, NgbModule.forRoot(), FormsModule],
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

  });

  describe('ngAfterViewInit method', () => {

    it('should called addControl method', async(() => {
      spyOn(comp, 'addFlags');
      comp.ngAfterViewInit();
      expect(comp.addFlags).toHaveBeenCalled();
    }));

  });

  describe('updateDate method', () => {

    it('should be defined', () => {
      expect(comp.updateDate).toBeDefined();
    });

    it('should update datepicker value (date type)',
      async(inject([FormBuilder], (fb: FormBuilder) => {
      comp.config = config;
      comp.group = fb.group({});
      comp.errors = errors;
      comp.date = {
        year: 2017,
        month: 3,
        day: 23
      };
      comp.time = {
        hour: 7,
        minute: 2
      };
      fixture.detectChanges();
      comp.updateDate();
      fixture.detectChanges();
      expect(comp.group.get(comp.config.key).value)
        .toEqual(new Date(Date.UTC(comp.date.year, comp.date.month - 1, comp.date.day)));
    })));

    it('should update datepicker value (datetime type)',
      async(inject([FormBuilder], (fb: FormBuilder) => {
      fixture = TestBed.createComponent(FormDatepickerComponent);
      comp = fixture.componentInstance;
      config.templateOptions.type = 'datetime';
      comp.config = config;
      comp.group = fb.group({});
      comp.errors = errors;
      comp.date = {
        year: 2017,
        month: 3,
        day: 23
      };
      comp.time = {
        hour: 7,
        minute: 2
      };
      fixture.detectChanges();
      comp.updateDate();
      fixture.detectChanges();
      expect(comp.group.get(comp.config.key).value)
        .toEqual(new Date(Date.UTC(
          comp.date.year,
          comp.date.month - 1,
          comp.date.day,
          comp.time.hour,
          comp.time.minute
        )));
    })));
  });

  describe('setDate method', () => {
    it('should set date', async(() => {
      let value = '2017-05-17T21:28:43';
      comp.config = config;
      let result = {
        year: 2017,
        month: 5,
        day: 17
      };
      let time = {
        hour: 21,
        minute: 28,
        second: 43
      };
      spyOn(comp, 'updateDate');
      comp.setDate(value, moment);
      expect(comp.date).toEqual(result);
      expect(comp.time).toEqual(time);
      expect(comp.updateDate).toHaveBeenCalled();
    }));
  });
});
