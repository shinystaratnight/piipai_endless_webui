import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ReactiveFormsModule } from '@angular/forms';
import { GeoService } from './../../services/geo.service';
import { ContactRegistrationService } from './../../services/contact-registration.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { ContactRegistrationFormComponent } from './contact-registration-form.component';

describe('ContactRegistrationFormComponent', () => {
  let fixture: ComponentFixture<ContactRegistrationFormComponent>;
  let comp: ContactRegistrationFormComponent;
  let el;

  const mockGeoService = {
    getCountries() {
      return Observable.of({
        results: [1, 2, 3]
      });
    },
    getRegions() {
      return Observable.of({
        results: [1, 2, 3]
      });
    },
    getCities() {
      return Observable.of({
        results: [1, 2, 3]
      });
    }
  };

  const metadata = {
    fields: {
      contact: {
        children: {
          address: {
            children: {
              country: {},
              state: {},
              city: {},
              street_address: {},
              postal_code: {}
            }
          },
          title: {},
          first_name: {},
          last_name: {},
          email: {},
          phone_mobile: {},
          birthday: {},
          picture: {}
        }
      },
      company: {
        children: {
          name: {},
          business_id: {}
        }
      }
    }
  };

  const mockContactRegistrationService = {
    getMetaData() {
      return Observable.of(metadata);
    },
    getTags() {
      return Observable.of({
        results: []
      });
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContactRegistrationFormComponent
      ],
      providers: [
        { provide: GeoService, useValue: mockGeoService },
        { provide: ContactRegistrationService, useValue: mockContactRegistrationService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [
        ReactiveFormsModule,
        NgbModule.forRoot()
      ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ContactRegistrationFormComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should have properties', () => {
    fixture.detectChanges();
    expect(comp.isCompany).toEqual(true);
    expect(comp.isRecruitee).toEqual(false);
  });

  describe('onRecruitee method', () => {

    it('should show recruitee form fields', () => {
      fixture.detectChanges();
      expect(comp.isCompany).toEqual(true);
      expect(comp.isRecruitee).toEqual(false);
      comp.onRecruitee();
      fixture.detectChanges();
      expect(comp.regions).toBeNull();
      expect(comp.cities).toBeNull();
      expect(comp.isCompany).toEqual(false);
      expect(comp.isRecruitee).toEqual(true);
    });
  });

  describe('onCompany method', () => {

    it('should show company form fields', () => {
      fixture.detectChanges();
      expect(comp.isCompany).toEqual(true);
      expect(comp.isRecruitee).toEqual(false);
      comp.onRecruitee();
      fixture.detectChanges();
      comp.onCompany();
      fixture.detectChanges();
      expect(comp.regions).toBeNull();
      expect(comp.cities).toBeNull();
      expect(comp.isCompany).toEqual(true);
      expect(comp.isRecruitee).toEqual(false);
    });
  });

  describe('ngOnInit method', () => {

    it('should be defined', () => {
      expect(comp.ngOnInit).toBeDefined();
    });

    it('should update countries property', () => {
      comp.ngOnInit();
      expect(comp.countries).toEqual([1, 2, 3]);
    });

    it('should update metaDataContact property', () => {
      comp.ngOnInit();
      expect(comp.metadata).toEqual(metadata);
    });

  });

  describe('selectCountry method', () => {

    it('should be defined', () => {
      expect(comp.selectCountry).toBeDefined();
    });

    it('should update regions property', () => {
      const data = {
        value: {
          id: 2
        }
      };
      comp.selectCountry(data);
      expect(comp.regions).toEqual([1, 2, 3]);
    });

  });

  describe('selectRegion method', () => {

    it('should be defined', () => {
      expect(comp.selectRegion).toBeDefined();
    });

    it('should update sities property', () => {
      const data = {
        value: {
          id: 2
        }
      };
      comp.selectRegion(data);
      expect(comp.cities).toEqual([1, 2, 3]);
    });

  });

});
