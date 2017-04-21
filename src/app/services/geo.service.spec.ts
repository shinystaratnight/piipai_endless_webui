import { async, inject, TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  BaseRequestOptions,
  Http,
  HttpModule,
  Response,
  ResponseOptions,
  RequestOptions,
  ConnectionBackend,
  ResponseType,
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { GeoService } from './geo.service';

describe('GeoService', () => {

  const countriesUrl: string = `/ecore/api/v2/endless_core/countries/`;
  const regionsUrl: string = `/ecore/api/v2/endless_core/regions/`;
  const citiesUrl: string = `/ecore/api/v2/endless_core/cities/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GeoService,
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
    [GeoService, MockBackend], (service, mockBackend) => {

    expect(service).toBeDefined();
  })));

  describe('getRegions method', () => {

    it('should parse response', async(inject(
      [GeoService, MockBackend], (service, mockBackend) => {

      const mockResponse = {
        status: 'ok'
      };

      mockBackend.connections.subscribe((conn) => {
        conn.mockRespond(
            new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
      });

      const result = service.getRegions();

      result.subscribe((res) => {
        expect(res).toEqual({
          status: 'ok'
        });
      });
    })));

    it('should parse error', async(inject(
      [GeoService, MockBackend], (service, mockBackend) => {

      const mockError = {
        error: 'error'
      };

      mockBackend.connections.subscribe((conn) => {
        conn.mockError(
            new Response(new ResponseOptions({
              type: ResponseType.Error,
              status: 400,
              body: JSON.stringify(mockError)
            })));
      });

      const result = service.getRegions();

      expect(result).toBeDefined();

      result.subscribe((res) => {
        expect(res).toBeUndefined();
      },
      (err) => {
        expect(err).toEqual(mockError);
      });
    })));

  });

  describe('getCities method', () => {

    it('should parse response', async(inject(
      [GeoService, MockBackend], (service, mockBackend) => {

      const mockResponse = {
        status: 'ok'
      };

      mockBackend.connections.subscribe((conn) => {
        conn.mockRespond(
            new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
      });

      const result = service.getCities();

      result.subscribe((res) => {
        expect(res).toEqual({
          status: 'ok'
        });
      });
    })));

    it('should parse error', async(inject(
      [GeoService, MockBackend], (service, mockBackend) => {

      const mockError = {
        error: 'error'
      };

      mockBackend.connections.subscribe((conn) => {
        conn.mockError(
            new Response(new ResponseOptions({
              type: ResponseType.Error,
              status: 400,
              body: JSON.stringify(mockError)
            })));
      });

      const result = service.getCities();

      expect(result).toBeDefined();

      result.subscribe((res) => {
        expect(res).toBeUndefined();
      },
      (err) => {
        expect(err).toEqual(mockError);
      });
    })));

  });
});
