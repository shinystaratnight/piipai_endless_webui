import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ProfileComponent } from './profile.component';
import { GenericFormService } from '../../dynamic-form/services/generic-form.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

describe('ProfileComponent', () => {
  let comp: ProfileComponent;
  let fixture;

  let response: any;
  let mockService = {
    getAll() {
      if (response.status === 'success') {
        return Observable.of(response.body);
      } else {
        return Observable.throw(response.error);
      }
    },
    getMetadata() {
      if (response.status === 'success') {
        return Observable.of(response.body);
      } else {
        return Observable.throw(response.error);
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProfileComponent
      ],
      providers: [
        {provide: GenericFormService, useValue: mockService}
      ],
      imports: [],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ProfileComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should be defined', () => {
    expect(comp).toBeDefined();
  });

  describe('ngOnInit method', () => {

    it('should be defined', () => {
      expect(comp.ngOnInit).toBeDefined();
    });

    it('should call getMetadata method', () => {
      let personalTraits = {
        type: 'list',
        viewData: [],
        elementList: [
          'contact.gender',
          'weight',
          'transportation_to_work',
          'strength',
          'language',
          'reliability_score',
          'loyalty_score',
          'total_score'
        ]
      };
      let residency = {
        type: 'list',
        viewData: [],
        elementList: [
          'residency',
          'visa_type.__str__',
          'visa_expiry_date',
          'nationality.__str__'
        ]
      };
      let contactDetails = {
        type: 'list',
        viewData: [],
        elementList: [
          'contact.email',
          'contact.phone_mobile'
        ]
      };
      spyOn(comp, 'getMetadata');
      comp.ngOnInit();
      expect(comp.personalTraits).toEqual(personalTraits);
      expect(comp.residency).toEqual(residency);
      expect(comp.contactDetails).toEqual(contactDetails);
      expect(comp.getMetadata).toHaveBeenCalled();
    });

  });

  describe('getMetadata method', () => {

    it('should be defined', () => {
      expect(comp.getMetadata).toBeDefined();
    });

    it('should call getData method', () => {
      response = {
        status: 'success',
        body: []
      };
      spyOn(comp, 'getData');
      comp.getMetadata();
      expect(comp.metadata).toEqual([]);
      expect(comp.getData).toHaveBeenCalled();
    });

    it('should update error property', () => {
      response = {
        status: 'error',
        error: []
      };
      comp.getMetadata();
      expect(comp.error).toEqual([]);
    });

  });

  describe('getData method', () => {

    it('should be defined', () => {
      expect(comp.getData).toBeDefined();
    });

    it('should call getData method', () => {
      response = {
        status: 'success',
        body: []
      };
      spyOn(comp, 'generateView');
      comp.getMetadata();
      expect(comp.data).toEqual([]);
      expect(comp.generateView).toHaveBeenCalled();
    });

    it('should update error property', () => {
      response = {
        status: 'error',
        error: []
      };
      comp.getMetadata();
      expect(comp.error).toEqual([]);
    });

  });

  describe('generateView method', () => {

    it('should be defined', () => {
      expect(comp.generateView).toBeDefined();
    });

    it('should call generate method', () => {
      let components = ['personalTraits', 'residency', 'contactDetails'];
      spyOn(comp, 'generate');
      comp.generateView();
      expect(comp.generate).toHaveBeenCalledTimes(3);
      expect(comp.generate).toHaveBeenCalledWith(components[0]);
      expect(comp.generate).toHaveBeenCalledWith(components[1]);
      expect(comp.generate).toHaveBeenCalledWith(components[2]);
    });

  });

  describe('generate method', () => {

    it('should be defined', () => {
      expect(comp.generate).toBeDefined();
    });

    it('should call generateList method', () => {
      comp.contactDetails = {
        type: 'list',
        viewData: [],
        elementList: [
          'contact.email',
          'contact.phone_mobile'
        ]
      };
      spyOn(comp, 'generateList');
      comp.generate('contactDetails');
      expect(comp.generateList)
        .toHaveBeenCalledWith(comp.contactDetails.elementList, comp.contactDetails.viewData);
    });

    it('should call generateTable method', () => {
      comp.contactDetails = {
        type: 'table',
        viewData: [],
        elementList: [
          'contact.email',
          'contact.phone_mobile'
        ]
      };
      spyOn(comp, 'generateTable');
      comp.generate('contactDetails');
      expect(comp.generateTable)
        .toHaveBeenCalledWith(comp.contactDetails.elementList, comp.contactDetails.viewData);
    });

  });

});
