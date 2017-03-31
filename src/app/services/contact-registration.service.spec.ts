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

});
