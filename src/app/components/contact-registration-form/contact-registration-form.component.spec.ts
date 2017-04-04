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
      },
      user: {
        children: {
          password: {}
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
    },
    registerContact(contact) {
      if (response.status === 'error') {
        return Observable.throw(response);
      }
      return Observable.of(response);
    },
    getCompaniesOfCountry(code2) {
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

    it('should update metaDataContact property', () => {
      comp.ngOnInit();
      expect(comp.metadata).toEqual(metadata);
    });

    it('updating username values with phone number', () => {
      comp.ngOnInit();
      expect(comp.username.phone_mobile).toBeTruthy();
      expect(comp.username.value).toEqual(mockLoginService.username.value);
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
      comp.selectCountry(data);
      expect(comp.regions).toEqual([1, 2, 3]);
      expect(comp.getCompaniesOfCountry).toHaveBeenCalled();
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

  describe('newContact method', () => {

    it('should be defined', () => {
      expect(comp.newContact).toBeDefined();
    });

    it('should called dateGenarate method', () => {
      response = {
        status: 'success',
        message: 'new contact create'
      };
      spyOn(comp, 'dataGenerate');
      comp.newContact();
      expect(comp.dataGenerate).toHaveBeenCalled();
    });

    it('should update response property', () => {
      response = {
        status: 'success',
        message: 'new contact create'
      };
      comp.newContact();
      expect(comp.response).toEqual(response);
    });

    it('should update error property', () => {
      response = {
        status: 'error',
        errors: {}
      };
      comp.newContact();
      expect(comp.error).toEqual(response);
    });

  });

  describe('dateGenerate method', () => {

    it('should be defined', () => {
      expect(comp.newContact).toBeDefined();
    });

    it('should create data for request', () => {
      const result = {
        type: 'company',
        data: {
          title: 'Mr.',
          first_name: 'Test',
          last_name: 'Testovich',
          email: 'test@test.com',
          phone_mobile: '+380985236987',
          name: 'Home',
          address: {
            country: 'Australia',
            state: 'NSW',
            city: 'Sydney',
            street_address: 'Backer street',
            postal_code: '65789'
          }
        }
      };

      comp.contactForm.patchValue({title: result.data.title});
      comp.contactForm.patchValue({first_name: result.data.first_name});
      comp.contactForm.patchValue({last_name: result.data.last_name});
      comp.contactForm.patchValue({email: result.data.email});
      comp.contactForm.patchValue({phone_mobile: result.data.phone_mobile});
      comp.companyContactForm.patchValue({name: result.data.name});
      comp.companyContactForm.patchValue({country: {id: result.data.address.country}});
      comp.companyContactForm.patchValue({state: {id: result.data.address.state}});
      comp.companyContactForm.patchValue({city: {id: result.data.address.city}});
      comp.companyContactForm.patchValue({street_address: result.data.address.street_address});
      comp.companyContactForm.patchValue({postal_code: result.data.address.postal_code});

      comp.dataGenerate();

      expect(comp.contact.type).toEqual(result.type);
      expect(comp.contact.data.title).toEqual(result.data.title);
      expect(comp.contact.data.first_name).toEqual(result.data.first_name);
      expect(comp.contact.data.last_name).toEqual(result.data.last_name);
      expect(comp.contact.data.email).toEqual(result.data.email);
      expect(comp.contact.data.phone_mobile).toEqual(result.data.phone_mobile);
      expect(comp.contact.data.name).toEqual(result.data.name);
      expect(comp.contact.data.address.country).toEqual(result.data.address.country);
      expect(comp.contact.data.address.state).toEqual(result.data.address.state);
      expect(comp.contact.data.address.city).toEqual(result.data.address.city);
      expect(comp.contact.data.address.street_address).toEqual(result.data.address.street_address);
      expect(comp.contact.data.address.postal_code).toEqual(result.data.address.postal_code);
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
      expect(comp.companiesList).toEqual('result');
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

});
