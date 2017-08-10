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

  const mockContactRegistrationService = {
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
    getAddressOfCompany(id) {
      if (response.status === 'error') {
        return Observable.throw(response);
      }
      return Observable.of(response);
    },
    fieldValidation(field, value) {
      if (response.status === 'error') {
        return Observable.throw(response);
      }
      return Observable.of(response);
    }
  };

  const fields = {
    email: 'email',
    phoneMobile: 'phone_mobile',
    country: 'address.country',
    state: 'address.state',
    city: 'address.city',
    name: 'company.name',
    businessId: 'company.business_id',
    postalCode: 'address.postal_code',
    streetAddress: 'address.street_address'
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

  describe('ngOnInit method', () => {

    it('should be defined', () => {
      expect(comp.ngOnInit).toBeDefined();
    });

    it('should udate data', () => {
      let result = {
        [mockLoginService.username.field]: {
          action: 'add',
          data: {
            value: mockLoginService.username.value,
            read_only: true
          }
        }
      };
      comp.ngOnInit();
      expect(comp.data).toEqual(result);
    });

  });

  describe('getCompaniesOfCountry method', () => {

    it('should be defined', () => {
      expect(comp.getCompaniesOfCountry).toBeDefined();
    });

    it('should update data property', () => {
      response = {
        results: {
          data: {
            results: 'result'
          }
        }
      };
      let data = {
        [fields.name]: {
          action: 'add',
          data: { autocomplete: response.results }
        }
      };
      comp.getCompaniesOfCountry('AU');
      expect(comp.data).toEqual(data);
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
      expect(comp.getCompanyLocalization).toBeDefined();
    });

    it('should update companiesList property', () => {
      response = {
        count: 1,
        results: [{verbose_value: 'Business ID', help_text: 'help text'}]
      };
      let data = {
        [fields.businessId]: {
          action: 'add',
          data: {
            templateOptions: {
              label: response.results[0].verbose_value,
              description: response.results[0].help_text
            }
          }
        }
      };
      comp.getCompanyLocalization('AU');
      expect(comp.data).toEqual(data);
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
      let formData = {
        [fields.name]: 'Home LTD',
        [fields.businessId]: '7777'
      };
      response = {
        count: 1,
        message: 'Already exsist',
        results: [{
          name: 'Home LTD',
          business_id: '7777',
          company: 'name',
          address: {
            street_address: 'Backer street',
            postal_code: 2060,
            country: {
              id: 123
            },
            state: {
              id: 12
            },
            city: {
              id: 13
            }
          }
        }]
      };
      let data = {
        [fields.postalCode]: {
          action: 'update',
          value: response.results[0].address.postal_code,
          block: true
        },
        [fields.streetAddress]: {
          action: 'update',
          value: response.results[0].address.street_address,
          block: true
        },
        [fields.country]: {
          action: 'add',
          data: {
            value: response.results[0].address.country.id,
            readonly: true
          }
        },
        [fields.state]: {
          action: 'update',
          value: response.results[0].address.state.id,
          update: true,
          query: '?country=',
          id: response.results[0].address.country.id,
          block: true
        },
        [fields.city]: {
          action: 'update',
          value: response.results[0].address.city.id,
          update: true,
          query: '?region=',
          id: response.results[0].address.state.id,
          block: true
        }
      };
      comp.getCompany(formData);
      expect(comp.data).toEqual(data);
      expect(comp.response[fields.name]).toEqual(response.message);
      expect(comp.form).toEqual({company: response.results[0].id});
    });

    it('should update error property', () => {
      let formData = {
        [fields.name]: 'Home LTD',
        [fields.businessId]: '7777'
      };
      response = {
        status: 'error',
        errors: {}
      };
      comp.getCompany(formData);
      expect(comp.error).toEqual(response);
    });

  });

  describe('checkCompany method', () => {

    it('should be defined', () => {
      expect(comp.checkCompany).toBeDefined();
    });

    it('should called with new company', () => {
      let companyData = {
        [fields.name]: 'Home LTD',
        [fields.businessId]: 7777,
      };
      comp.companyData = companyData;
      spyOn(comp, 'getCompany');
      comp.checkCompany();
      expect(comp.getCompany).toHaveBeenCalled();
    });

  });

  describe('fieldValidation method', () => {

    it('should be defined', () => {
      expect(comp.fieldValidation).toBeDefined();
    });

    it('should update companiesList property', () => {
      let field = 'email';
      let message = 'Email is Valid';
      response = {
        data: {
          message
        }
      };
      comp.response = {};
      spyOn(comp, 'clearResult');
      comp.fieldValidation(field, 'test@test.com');
      expect(comp.response[field]).toEqual(message);
      expect(comp.clearResult).toHaveBeenCalled();
    });

    it('should update error property', () => {
      let field = 'email';
      let message = 'Email is invalid';
      response = {
        status: 'error',
        errors: {
          message
        }
      };
      comp.error = {};
      spyOn(comp, 'clearResult');
      comp.fieldValidation(field, 'test@test.com');
      expect(comp.error[field]).toEqual(message);
      expect(comp.clearResult).toHaveBeenCalled();
    });

  });

  describe('eventHandler method', () => {

    it('should be defined', () => {
      expect(comp.eventHandler).toBeDefined();
    });

    it('should called fieldValidation method', () => {
      let event = {
        type: 'blur',
        el: {
          key: fields.email
        }
      };
      spyOn(comp, 'fieldValidation');
      comp.eventHandler(event);
      expect(comp.fieldValidation).toHaveBeenCalled();
    });

    it('should called getCompaniesOfCountry and getCompanyLocalization methods', () => {
      let event = {
        type: 'change',
        el: {
          key: fields.country
        },
        value: [{code2: 'AU'}]
      };
      spyOn(comp, 'getCompaniesOfCountry');
      spyOn(comp, 'getCompanyLocalization');
      comp.eventHandler(event);
      expect(comp.getCompaniesOfCountry).toHaveBeenCalled();
      expect(comp.getCompanyLocalization).toHaveBeenCalled();
    });

    it('should called checkCompany method', () => {
      let event = {
        type: 'blur',
        el: {
          key: fields.name
        },
        value: 'Home LTD'
      };
      spyOn(comp, 'checkCompany');
      comp.eventHandler(event);
      expect(comp.checkCompany).toHaveBeenCalled();
      expect(comp.companyData[event.el.key]).toEqual(event.value);
    });

  });

  describe('buttonActionHandler method', () => {

    it('should be defined', () => {
      expect(comp.buttonActionHandler).toBeDefined();
    });

    it('should called some method', () => {
      let event = {
        value: 'register_company_contact'
      };
      spyOn(comp, 'register_company_contact');
      comp.buttonActionHandler(event);
      expect(comp.register_company_contact).toHaveBeenCalled();
    });

  });

  describe('clearResult method', () => {

    it('should be defined', () => {
      expect(comp.clearResult).toBeDefined();
    });

    it('should delete prop', () => {
      let field = 'email';
      let result = {
        [field]: 'test@test.com'
      };
      comp.clearResult(result, field);
      expect(result[field]).toBeUndefined();
    });

  });

  describe('register_company_contact method', () => {

    it('should be defined', () => {
      expect(comp.register_company_contact).toBeDefined();
    });

    it('should update endpoint', () => {
      let endpoint = `/ecore/api/v2/contacts`;
      comp.companyContactEndpoint = endpoint;
      comp.error = {};
      spyOn(comp, 'reset');
      comp.register_company_contact();
      expect(comp.reset).toHaveBeenCalledWith({});
      expect(comp.endpoint).toEqual(endpoint);
      expect(comp.data).toEqual({});
      expect(comp.hide).toBeFalsy();
    });

  });

  describe('register_candidate_contact method', () => {

    it('should be defined', () => {
      expect(comp.register_candidate_contact).toBeDefined();
    });

    it('should update endpoint', () => {
      let endpoint = `/ecore/api/v2/endless-core/companycontacts/register/`;
      comp.candidateContactEndpoint = endpoint;
      comp.error = {};
      spyOn(comp, 'reset');
      comp.register_company_contact();
      expect(comp.reset).toHaveBeenCalledWith({});
      expect(comp.endpoint).toEqual(endpoint);
      expect(comp.data).toEqual({});
      expect(comp.hide).toBeFalsy();
    });

  });

  describe('reset method', () => {

    it('should be defined', () => {
      expect(comp.reset).toBeDefined();
    });

    it('should update endpoint', () => {
      let data = <any> {
        title: ['Some error'],
        first_name: ['some error']
      };
      let commonFileds = ['title'];
      comp.commonFields = commonFileds;
      comp.reset(data);
      expect(data).toEqual({title: ['Some error']});
    });

  });

});
