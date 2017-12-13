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
import { CookieService } from 'angular2-cookie/core';

import { CheckPermissionService } from './check-permission';
import { ErrorsService } from './errors.service';
import { Observable } from 'rxjs/Observable';

describe('CheckPermissionService', () => {

  const url: string = `/ecore/api/v2/login/`;

  const mockErrorsService = {
    parseErrors() {
      return Observable.throw('err');
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CheckPermissionService,
        MockBackend,
        BaseRequestOptions,
        CookieService,
        { provide: ErrorsService, useValue: mockErrorsService },
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
    [CheckPermissionService, MockBackend], (service, mockBackend) => {

    expect(service).toBeDefined();
  })));

  describe('viewCheck method', () => {

    it('should parse response', async(inject(
      [CheckPermissionService, MockBackend], (service, mockBackend) => {

      const mockResponse = {
        status: 'ok',
        results: []
      };
      spyOn(service, 'updateHeaders');
      mockBackend.connections.subscribe((conn) => {
        conn.mockRespond(
            new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
      });

      const result = service.viewCheck(url, `123`);
      expect(service.updateHeaders).toHaveBeenCalled();
      result.subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });
    })));

    it('should parse error', async(inject(
      [CheckPermissionService, MockBackend], (service, mockBackend) => {

      const mockError = {
        errors: {
          message: 'some error'
        }
      };

      mockBackend.connections.subscribe((conn) => {
        conn.mockError(
            new Response(new ResponseOptions({ body: JSON.stringify(mockError) })));
      });

      const result = service.viewCheck(url, `123`);

      result.subscribe((res) => {
        expect(res).toBeUndefined();
      },
      (err) => {
        expect(err).toBeDefined();
      });
    })));

  });

  describe('createCheck method', () => {

    it('should parse response', async(inject(
      [CheckPermissionService, MockBackend], (service, mockBackend) => {

      const mockResponse = {
        status: 'ok',
        results: []
      };
      spyOn(service, 'updateHeaders');
      mockBackend.connections.subscribe((conn) => {
        conn.mockRespond(
            new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
      });

      const result = service.viewCheck(url);
      expect(service.updateHeaders).toHaveBeenCalled();
      result.subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });
    })));

    it('should parse error', async(inject(
      [CheckPermissionService, MockBackend], (service, mockBackend) => {

      const mockError = {
        errors: {
          message: 'some error'
        }
      };

      mockBackend.connections.subscribe((conn) => {
        conn.mockError(
            new Response(new ResponseOptions({ body: JSON.stringify(mockError) })));
      });

      const result = service.viewCheck(url);

      result.subscribe((res) => {
        expect(res).toBeUndefined();
      },
      (err) => {
        expect(err).toBeDefined();
      });
    })));

  });

  describe('updateCheck method', () => {

    it('should parse response', async(inject(
      [CheckPermissionService, MockBackend], (service, mockBackend) => {

      const mockResponse = {
        status: 'ok',
        results: []
      };
      spyOn(service, 'updateHeaders');
      mockBackend.connections.subscribe((conn) => {
        conn.mockRespond(
            new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
      });

      const result = service.viewCheck(url, `123`);
      expect(service.updateHeaders).toHaveBeenCalled();
      result.subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });
    })));

    it('should parse error', async(inject(
      [CheckPermissionService, MockBackend], (service, mockBackend) => {

      const mockError = {
        errors: {
          message: 'some error'
        }
      };

      mockBackend.connections.subscribe((conn) => {
        conn.mockError(
            new Response(new ResponseOptions({ body: JSON.stringify(mockError) })));
      });

      const result = service.viewCheck(url, `123`);

      result.subscribe((res) => {
        expect(res).toBeUndefined();
      },
      (err) => {
        expect(err).toBeDefined();
      });
    })));

  });

  describe('deleteCheck method', () => {

    it('should parse response', async(inject(
      [CheckPermissionService, MockBackend], (service, mockBackend) => {

      const mockResponse = {
        status: 'ok',
        results: []
      };
      spyOn(service, 'updateHeaders');
      mockBackend.connections.subscribe((conn) => {
        conn.mockRespond(
            new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
      });

      const result = service.viewCheck(url, `123`);
      expect(service.updateHeaders).toHaveBeenCalled();
      result.subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });
    })));

    it('should parse error', async(inject(
      [CheckPermissionService, MockBackend], (service, mockBackend) => {

      const mockError = {
        errors: {
          message: 'some error'
        }
      };

      mockBackend.connections.subscribe((conn) => {
        conn.mockError(
            new Response(new ResponseOptions({ body: JSON.stringify(mockError) })));
      });

      const result = service.viewCheck(url, `123`);

      result.subscribe((res) => {
        expect(res).toBeUndefined();
      },
      (err) => {
        expect(err).toBeDefined();
      });
    })));

  });

});
