import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ReactiveFormsModule } from '@angular/forms';
import { GeoService } from './../../services/geo.service';
import { ContactRegistrationService } from './../../services/contact-registration.service';
import { LoginService } from './../../services/login.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { ContactRegistrationFormComponent } from './contact-registration-form.component';

describe('ContactRegistrationFormComponent', () => {
  let fixture: ComponentFixture<ContactRegistrationFormComponent>;
  let comp: ContactRegistrationFormComponent;
  let el;
  let response: any;

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

  const mockContactRegistrationService = {
    getTags() {
      return Observable.of({
        results: []
      });
    },
    getCompaniesOfCountry(code2) {
      if (response.status === 'error') {
        return Observable.throw(response);
      }
      return Observable.of(response);
    },
    getCompanyLocalization(code2) {
      if (response.status === 'error') {
        return Observable.throw(response);
      }
      return Observable.of(response);
    },
    getCompany(name, businessId) {
      if (response.status === 'error') {
        return Observable.throw(response);
      }
      return Observable.of(response);
    },
    checkCompany() {
      return true;
    },
    getAddressOfCompany(id) {
      if (response.status === 'error') {
        return Observable.throw(response);
      }
      return Observable.of(response);
    }
  };

  const mockLoginService = {
    username: {
      field: 'phone_mobile',
      value: '+380978107718'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContactRegistrationFormComponent
      ],
      providers: [
        { provide: GeoService, useValue: mockGeoService },
        { provide: ContactRegistrationService, useValue: mockContactRegistrationService },
        { provide: LoginService, useValue: mockLoginService }
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
      spyOn(comp, 'getCompaniesOfCountry').and.returnValue(true);
      spyOn(comp, 'getCompanyLocalization').and.returnValue(true);
      comp.selectCountry(data);
      expect(comp.regions).toEqual([1, 2, 3]);
      expect(comp.getCompaniesOfCountry).toHaveBeenCalled();
      expect(comp.getCompanyLocalization).toHaveBeenCalled();
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

  describe('getCompaniesOfCountry method', () => {

    it('should be defined', () => {
      expect(comp.getCompaniesOfCountry).toBeDefined();
    });

    it('should update companiesList property', () => {
      response = {
        results: {
          data: {
            results: 'result'
          }
        }
      };
      comp.getCompaniesOfCountry('AU');
      expect(comp.companiesList).toEqual(response.results);
    });

    it('should update error property', () => {
      response = {
        status: 'error',
        errors: {}
      };
      comp.getCompaniesOfCountry('AU');
      expect(comp.error).toEqual(response);
    });

  });

  describe('getCompanyLocalization method', () => {

    it('should be defined', () => {
      expect(comp.companyLocalization).toBeDefined();
    });

    it('should update companiesList property', () => {
      response = {
        count: 1,
        results: [{company: 'name'}]
      };
      comp.getCompanyLocalization('AU');
      expect(comp.companyLocalization).toEqual(response.results[0]);
    });

    it('should update error property', () => {
      response = {
        status: 'error',
        errors: {}
      };
      comp.getCompanyLocalization('AU');
      expect(comp.error).toEqual(response);
    });

  });

  describe('getCompany method', () => {

    it('should be defined', () => {
      expect(comp.getCompany).toBeDefined();
    });

    it('should update getCompany property', () => {
      response = {
        count: 1,
        message: 'Already exsist',
        results: [{
          company: 'name',
          address: {
            street_address: 'Backer street',
            postal_code: 2060
          }
        }]
      };
      comp.getCompany('Test', 5);
      expect(comp.company).toEqual(response.results[0]);
    });

    it('should update error property', () => {
      response = {
        status: 'error',
        errors: {}
      };
      comp.getCompany('Test', 5);
      expect(comp.error).toEqual(response);
    });

  });

  describe('checkCompany method', () => {

    it('should be defined', () => {
      expect(comp.getCompany).toBeDefined();
    });

    it('should called with new company', () => {
      spyOn(comp, 'checkCompany');
      comp.companyContactForm.patchValue({bussiness_id: 5});
      comp.companyContactForm.patchValue({name: 'Home LTD'});
      comp.checkCompany();
      expect(comp.checkCompany).toHaveBeenCalled();
    });

    it('should called with exist company', () => {
      spyOn(comp, 'checkCompany');
      comp.companyContactForm.patchValue({bussiness_id: 5});
      comp.companyContactForm.patchValue({name: {name: 'Home LTD'}});
      comp.checkCompany();
      expect(comp.checkCompany).toHaveBeenCalled();
    });

  });

});
