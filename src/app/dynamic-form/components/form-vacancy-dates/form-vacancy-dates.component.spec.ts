import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormVacancyDatesComponent } from './form-vacancy-dates.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';

describe('FormVacancyDatesComponent', () => {
  let fixture: ComponentFixture<FormVacancyDatesComponent>;
  let comp: FormVacancyDatesComponent;
  let el;
  let config = {
    type: 'vacancydates',
    key: 'vacancydates',
    templateOptions: {
      label: 'Vacancy Dates',
      required: true,
      description: 'test'
    }
  };
  let errors = {};

  let moment = require('moment');

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormVacancyDatesComponent
      ],
      providers: [FormBuilder],
      imports: [ReactiveFormsModule, NgbModule.forRoot(), FormsModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(FormVacancyDatesComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should be defined', () => {
    expect(comp).toBeDefined();
  });

  describe('ngOnInit method', () => {
    it('should initialize properties', async(inject([FormBuilder], (fb: FormBuilder) => {
      comp.config = config;
      spyOn(comp, 'calcMinDate');
      spyOn(comp, 'addControl');
      comp.ngOnInit();
      expect(comp.vacancyDates).toEqual([]);
      expect(comp.calcMinDate).toHaveBeenCalled();
      expect(comp.addControl).toHaveBeenCalledWith(comp.config, fb);
    })));
  });

  describe('calcMinDate method', () => {
    it('should calc min date for datepicker', () => {
      comp.calcMinDate(moment);
      expect(comp.minDate).toEqual({
        year: moment().year(),
        month: moment().month() + 1,
        day: moment().date()
      });
    });
  });

  describe('selectVacancyDate method', () => {
    it('should update vacancyDates property', () => {
      let event = {
        day: 1,
        month: 2,
        year: 2017
      };
      comp.vacancyDates = [];
      comp.vacancyDates.push({
        shift_date: '2017-03-25',
        workers: 1
      });
      spyOn(comp, 'updateResults');
      spyOn(comp, 'checkIfExistVacancyDate');
      comp.selectVacancyDate(event, moment);
      expect(comp.vacancyDates).toEqual([
        {
          shift_date: '2017-02-01',
          workers: 1
        },
        {
          shift_date: '2017-03-25',
          workers: 1
        }
      ]);
      expect(comp.checkIfExistVacancyDate).toHaveBeenCalledWith(comp.vacancyDates, {
        shift_date: '2017-02-01',
        workers: 1
      });
      expect(comp.updateResults).toHaveBeenCalledWith(comp.vacancyDates);
    });
  });

  describe('checkIfExistVacancyDate method', () => {
    it('should check if exist vacancy date', () => {
      let vacancyDate = {
        shift_date: '2017-02-01',
        workers: 1
      };
      let vacancyDates = [];
      let result = comp.checkIfExistVacancyDate(vacancyDates, vacancyDate);
      expect(result).toBeFalsy();
    });
  });

  describe('removeVacancyDate method', () => {
    it('should remove element from vacancyDates', () => {
      let element = {
        shift_date: '2017-03-01',
        workers: 1
      };
      comp.vacancyDates = [
        {
          shift_date: '2017-03-25',
          workers: 1
        }
      ];
      comp.vacancyDates.push(element);
      spyOn(comp, 'updateResults');
      comp.removeVacancyDate(element);
      expect(comp.vacancyDates).toEqual([
        {
          shift_date: '2017-03-25',
          workers: 1
        }
      ]);
      expect(comp.updateResults).toHaveBeenCalledWith(comp.vacancyDates);
    });
  });

  describe('updateResults method', () => {
    it('should update value of component', async(inject([FormBuilder], (fb: FormBuilder) => {
      let value = [{
          shift_date: '2017-03-25',
          workers: 1
      }];
      comp.config = config;
      comp.group = fb.group({});
      comp.key = config.key;
      comp.group.addControl(comp.key, fb.control(''));
      comp.updateResults(value);
      expect(comp.group.get(comp.key).value).toEqual(value);
    })));
  });

});
