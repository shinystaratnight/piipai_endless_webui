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

});
