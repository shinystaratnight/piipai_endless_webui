import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  inject,
  async } from '@angular/core/testing';
import { Router } from '@angular/router';

import { FormBuilderComponent } from './form-builder.component';
import { GenericFormService } from './../../dynamic-form/services/generic-form.service';

import { Observable } from 'rxjs/Observable';

describe('FormBuilderComponent', () => {

  let comp: FormBuilderComponent;
  let fixture: ComponentFixture<FormBuilderComponent>;
  let response: any;

  let mockGenericFormService = {
    delete() {
      return Observable.of(response);
    }
  };
  let mockRouter = {
    navigate() {
      return true;
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormBuilderComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: GenericFormService, useValue: mockGenericFormService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(FormBuilderComponent);
        comp = fixture.componentInstance;
      });
  }));

  it('should be defined', () => {
    expect(comp).toBeDefined();
  });

  describe('eventHandler method', () => {
    it('should set data of form', () => {
      let event = {
        type: 'sendForm',
        status: 'success',
        data: {
          id: 'some id',
          __str__: 'some str'
        }
      };
      comp.eventHandler(event);
      expect(comp.id).toEqual('some id');
      expect(comp.label).toEqual('some str');
      expect(comp.previewLink).toEqual(`/ecore/form-builds/${event.data.id}/`);
    });
  });

});
