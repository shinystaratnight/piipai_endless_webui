import { async, inject, TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  BaseRequestOptions,
  Http,
  HttpModule,
  Response,
  ResponseOptions,
  RequestOptions,
  ConnectionBackend
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { ContactRegistrationService } from './contact-registration.service';

describe('ContactRegistrationService', () => {

  const companyContactUrl: string = `/ecore/api/v2/endless_core/company_contacts/`;
  const tagsUrl: string = `/ecore/api/v2/endless_core/tags/`;
  const contactUrl = `/ecore/api/v2/endless_core/contacts/`;
  const companyUrl = `/ecore/api/v2/endless_core/companies/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContactRegistrationService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: ConnectionBackend, useClass: MockBackend },
        { provide: RequestOptions, useClass: BaseRequestOptions },
      ],
      imports: [
        HttpModule
      ]
    });
  });

  it('should be defined', async(inject(
    [ContactRegistrationService, MockBackend], (service, mockBackend) => {

    expect(service).toBeDefined();
  })));

  it('should have url', async(inject(
    [ContactRegistrationService, MockBackend], (service, mockBackend) => {

    expect(service.companyContactUrl).toEqual(companyContactUrl);
    expect(service.tagsUrl).toEqual(tagsUrl);
    expect(service.contactUrl).toEqual(contactUrl);
    expect(service.companyUrl).toEqual(companyUrl);
  })));

  describe('getMataData method', () => {

    it('should parse response', async(inject(
      [ContactRegistrationService, MockBackend], (service, mockBackend) => {

      const mockResponse = {
        status: 'ok'
      };

      mockBackend.connections.subscribe((conn) => {
        conn.mockRespond(
            new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
      });

      const result = service.getMetaData();

      result.subscribe((res) => {
        expect(res).toEqual({
          status: 'ok'
        });
      });
    })));

    it('should parse error', async(inject(
      [ContactRegistrationService, MockBackend], (service, mockBackend) => {

      const mockError = {
        register: 'email'
      };

      mockBackend.connections.subscribe((conn) => {
        conn.mockError(
            new Response(new ResponseOptions({ body: JSON.stringify(mockError) })));
      });

      const result = service.getMetaData();

      result.subscribe((res) => {
        expect(res).toBeUndefined();
      },
      (err) => {
        expect(err).toBeDefined();
      });
    })));

  });

  describe('getTags method', () => {

    it('should parse response', async(inject(
      [ContactRegistrationService, MockBackend], (service, mockBackend) => {

      const mockResponse = {
        results: []
      };

      mockBackend.connections.subscribe((conn) => {
        conn.mockRespond(
            new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
      });

      const result = service.getTags();

      result.subscribe((res) => {
        expect(res).toEqual({
          results: []
        });
      });
    })));

    it('should parse error', async(inject(
      [ContactRegistrationService, MockBackend], (service, mockBackend) => {

      const mockError = {
        register: 'email'
      };

      mockBackend.connections.subscribe((conn) => {
        conn.mockError(
            new Response(new ResponseOptions({ body: JSON.stringify(mockError) })));
      });

      const result = service.getTags();

      result.subscribe((res) => {
        expect(res).toBeUndefined();
      },
      (err) => {
        expect(err).toBeDefined();
      });
    })));

  });

  describe('registerContact method', () => {

    it('should parse response', async(inject(
      [ContactRegistrationService, MockBackend], (service, mockBackend) => {

      const mockResponse = {
        results: []
      };
      const contact = {
        type: 'company',
        data: {}
      };

      mockBackend.connections.subscribe((conn) => {
        conn.mockRespond(
            new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
      });

      const result = service.registerContact(contact);

      result.subscribe((res) => {
        expect(res).toEqual({
          results: []
        });
      });
    })));

    it('should parse error', async(inject(
      [ContactRegistrationService, MockBackend], (service, mockBackend) => {

      const mockError = {
        register: 'email'
      };
      const contact = {
        type: 'company',
        data: {}
      };

      mockBackend.connections.subscribe((conn) => {
        conn.mockError(
            new Response(new ResponseOptions({ body: JSON.stringify(mockError) })));
      });

      const result = service.registerContact(contact);

      result.subscribe((res) => {
        expect(res).toBeUndefined();
      },
      (err) => {
        expect(err).toBeDefined();
      });
    })));

  });

  describe('emailValidate method', () => {

    it('should parse response', async(inject(
      [ContactRegistrationService, MockBackend], (service, mockBackend) => {

      const mockResponse = {
        status: 'success',
        data: {
          message: 'email is valid'
        }
      };

      mockBackend.connections.subscribe((conn) => {
        conn.mockRespond(
            new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
      });

      const result = service.emailValidate('test@test.com');

      result.subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });
    })));

    it('should parse error', async(inject(
      [ContactRegistrationService, MockBackend], (service, mockBackend) => {

      const mockError = {
        status: 'error',
        errors: {
          message: 'email is not valid'
        }
      };

      mockBackend.connections.subscribe((conn) => {
        conn.mockError(
            new Response(new ResponseOptions({ body: JSON.stringify(mockError) })));
      });

      const result = service.emailValidate('adasdasdas');

      result.subscribe((res) => {
        expect(res).toBeUndefined();
      },
      (err) => {
        expect(err).toEqual(mockError);
      });
    })));

  });

  describe('phoneValidate method', () => {

    it('should parse response', async(inject(
      [ContactRegistrationService, MockBackend], (service, mockBackend) => {

      const mockResponse = {
        status: 'success',
        data: {
          message: 'phone is valid'
        }
      };

      mockBackend.connections.subscribe((conn) => {
        conn.mockRespond(
            new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
      });

      const result = service.phoneValidate('+380978223695');

      result.subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });
    })));

    it('should parse error', async(inject(
      [ContactRegistrationService, MockBackend], (service, mockBackend) => {

      const mockError = {
        status: 'error',
        errors: {
          message: 'phone is not valid'
        }
      };

      mockBackend.connections.subscribe((conn) => {
        conn.mockError(
            new Response(new ResponseOptions({ body: JSON.stringify(mockError) })));
      });

      const result = service.phoneValidate('123123123');

      result.subscribe((res) => {
        expect(res).toBeUndefined();
      },
      (err) => {
        expect(err).toEqual(mockError);
      });
    })));

  });

  describe('getCompaniesOfCountry method', () => {

    it('should parse response', async(inject(
      [ContactRegistrationService, MockBackend], (service, mockBackend) => {

      const mockResponse = {
        status: 'success',
        data: {
          message: 'phone is valid'
        }
      };

      mockBackend.connections.subscribe((conn) => {
        conn.mockRespond(
            new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
      });

      const result = service.getCompaniesOfCountry('AU');

      result.subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });
    })));

    it('should parse error', async(inject(
      [ContactRegistrationService, MockBackend], (service, mockBackend) => {

      const mockError = {
        status: 'error',
        errors: {
          message: 'phone is not valid'
        }
      };

      mockBackend.connections.subscribe((conn) => {
        conn.mockError(
            new Response(new ResponseOptions({ body: JSON.stringify(mockError) })));
      });

      const result = service.getCompaniesOfCountry('AU');

      result.subscribe((res) => {
        expect(res).toBeUndefined();
      },
      (err) => {
        expect(err).toEqual(mockError);
      });
    })));

  });

  describe('getCompany method', () => {

    it('should parse response', async(inject(
      [ContactRegistrationService, MockBackend], (service, mockBackend) => {

      const mockResponse = {
        status: 'success',
        data: {
          message: 'phone is valid'
        }
      };

      mockBackend.connections.subscribe((conn) => {
        conn.mockRespond(
            new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
      });

      const result = service.getCompany({business_id: 5});

      result.subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });
    })));

    it('should parse error', async(inject(
      [ContactRegistrationService, MockBackend], (service, mockBackend) => {

      const mockError = {
        status: 'error',
        errors: {
          message: 'phone is not valid'
        }
      };

      mockBackend.connections.subscribe((conn) => {
        conn.mockError(
            new Response(new ResponseOptions({ body: JSON.stringify(mockError) })));
      });

      const result = service.getCompany({business_id: 5});

      result.subscribe((res) => {
        expect(res).toBeUndefined();
      },
      (err) => {
        expect(err).toEqual(mockError);
      });
    })));

  });

});
