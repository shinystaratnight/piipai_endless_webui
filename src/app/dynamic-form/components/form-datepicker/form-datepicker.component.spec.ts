import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { NgbModule, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormDatepickerComponent } from './form-datepicker.component';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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
  let moment = require('moment-timezone');

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

    it('should called addControl method', async(inject([FormBuilder], (fb: FormBuilder) => {
      comp.config = config;
      comp.key = comp.config.key;
      comp.group = fb.group({});
      comp.group.addControl(comp.config.key, fb.control(undefined));
      comp.config.hidden = new BehaviorSubject(true);
      spyOn(comp, 'addControl');
      spyOn(comp, 'identifyDevice').and.returnValue(true);
      spyOn(comp, 'setInitValue');
      comp.ngOnInit();
      expect(comp.addControl).toHaveBeenCalled();
      expect(comp.identifyDevice).toHaveBeenCalled();
      expect(comp.setInitValue).toHaveBeenCalled();
      expect(comp.mobileDevice).toEqual(true);
      expect(comp.group.get(comp.key).value).toBeUndefined();
      expect(comp.config.hide).toBeTruthy();
      comp.config.hidden = null;
    })));

  });

  describe('setInitValue method', () => {
    it('should init value', async(inject([FormBuilder], (fb: FormBuilder) => {
      comp.config = config;
      comp.key = config.key;
      comp.config.value = 'value';
      comp.group = fb.group({});
      comp.group.addControl(comp.key, fb.control(undefined));
      spyOn(comp, 'setDate');
      comp.setInitValue();
      expect(comp.setDate).toHaveBeenCalled();
    })));
  });

  describe('identifyDevice method', () => {
    it('should identify device', () => {
      let isMobileDevice = comp.identifyDevice();
      expect(isMobileDevice).toBeFalsy();
    });
  });

  describe('ngAfterViewInit method', () => {

    it('should called addControl method', async(() => {
      comp.init = true;
      comp.d = {};
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
      let date = {
        format() {
          return true;
        }
      };
      comp.config = config;
      comp.config.templateOptions.type = 'datetime';
      comp.key = config.key;
      comp.group = fb.group({});
      comp.group.addControl(comp.config.key, fb.control(''));
      spyOn(date, 'format').and.returnValue('2017-06-06');
      comp.updateDate(date);
      expect(comp.date).toEqual('2017-06-06');
      expect(comp.time).toEqual('2017-06-06');
      expect(comp.group.get(comp.key).value).toEqual('2017-06-06');
    })));

  });

  describe('setDate method', () => {
    it('should set date from api', async(() => {
      let value = '2017-06-06T00:00:00+10:00';
      spyOn(comp, 'updateDate');
      comp.setDate(value, moment);
      expect(comp.updateDate).toHaveBeenCalled();
    }));

    it('should set date from picker', async(() => {
      let value = '2017-06-06 02:02 AM';
      spyOn(comp, 'updateDate');
      comp.setDate(value, moment, true);
      expect(comp.updateDate).toHaveBeenCalled();
    }));
  });
});
