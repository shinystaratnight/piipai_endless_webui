import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  inject,
  async } from '@angular/core/testing';

import { Observable } from 'rxjs/Observable';

import { CompanyComponent } from './company.component';
import { GenericFormService } from '../../dynamic-form/services/generic-form.service';

describe('CompanyComponent', () => {

  let comp: CompanyComponent;
  let fixture: ComponentFixture<CompanyComponent>;
  let response: any = {
    status: undefined,
    data: {},
    errors: {}
  };

  const mockGenericFormService = {
    submitForm() {
      if (response.status === 'success') {
        return Observable.of(response.data);
      } else {
        return Observable.throw(response.errors);
      }
    },
    getAll() {
      if (response.status === 'success') {
        return Observable.of(response.data);
      } else {
        return Observable.throw(response.errors);
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyComponent],
      providers: [
        { provide: GenericFormService, useValue: mockGenericFormService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CompanyComponent);
        comp = fixture.componentInstance;
      });
  }));

  describe('ngOnInit method', () => {
    it('should get data for edit form', () => {
      response.status = 'success';
      spyOn(comp, 'fillingForm');
      comp.ngOnInit();
      expect(comp.fillingForm).toHaveBeenCalled();
    });

    it('should update errors property', () => {
      response.status = 'error';
      comp.ngOnInit();
      expect(comp.errors).toEqual({});
    });
  });

  describe('submitForm method', () => {
    it('should update object', () => {
      let data = {};
      comp.endpoint = 'some endpoint';
      response.status = 'success';
      comp.submitForm(data);
      expect(comp.response).toEqual({});
    });

    it('should update errors property', () => {
      let data = {};
      comp.endpoint = 'some endpoint';
      response.status = 'error';
      comp.submitForm(data);
      expect(comp.errors).toEqual({});
    });
  });

  describe('fillingForm method', () => {
    it('should filling form by data', () => {
      let metadata = [
        {
          type: 'collapse',
          children: [
            {
              type: 'radio',
              key: 'font'
            }
          ]
        }
      ];
      let data = {
        fobt: 'Roboto'
      };
      spyOn(comp, 'getValueOfData');
      comp.fillingForm(metadata, data);
      expect(comp.getValueOfData).toHaveBeenCalled();
    });
  });

  describe('getValueOfData method', () => {
    it('should set value of element', () => {
      let data = {
        company_setting: {
          color_scheme: 'indigo-theme'
        }
      };
      let key = 'company_setting.color_scheme';
      let object = {
        value: undefined
      };
      comp.getValueOfData(data, key, object);
      expect(object.value).toEqual('indigo-theme');
      expect(comp.currentTheme).toEqual('indigo-theme');
    });
  });

  describe('eventHandler method', () => {
    it('should change color scheme of site', () => {
      let event = {
        type: 'change',
        el: {
          type: 'radio',
          templateOptions: {
            type: 'color'
          }
        },
        value: 'indigo'
      };
      let body = document.body;
      let theme = `${event.value}-theme`;
      comp.eventHandler(event);
      expect(body.classList.contains(theme)).toBeTruthy();
      expect(comp.currentTheme).toEqual(theme);
    });

    it('should change font of site', () => {
      let event = {
        type: 'change',
        el: {
          type: 'radio',
          templateOptions: {
            type: 'text'
          }
        },
        value: 'Lato'
      };
      let body = document.body;
      let font = `${event.value}, sans-serif`;
      comp.eventHandler(event);
      expect(body.style.fontFamily).toEqual(font);
      expect(comp.currentFont).toEqual(event.value);
    });
  });

});
