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

import { LoginService } from './login.service';

describe('LoginService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoginService,
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
    [LoginService, MockBackend], (service, mockBackend) => {

    expect(service).toBeDefined();
  })));

  describe('loginWithToken method', () => {

    it('should parse response', async(inject(
      [LoginService, MockBackend], (service, mockBackend) => {

      const mockResponse = {
        status: 'ok'
      };

      mockBackend.connections.subscribe((conn) => {
        conn.mockRespond(
            new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
      });

      const result = service.loginWithToken();

      result.subscribe((res) => {
        expect(res).toEqual({
          status: 'ok'
        });
      });
    })));

    it('should parse error', async(inject(
      [LoginService, MockBackend], (service, mockBackend) => {

      const mockError = {
        register: 'email'
      };

      mockBackend.connections.subscribe((conn) => {
        conn.mockError(
            new Response(new ResponseOptions({ body: JSON.stringify(mockError) })));
      });

      const result = service.loginWithToken();

      result.subscribe((res) => {
        expect(res).toBeUndefined();
      },
      (err) => {
        expect(err).toBeDefined();
        expect(service.username).toBeDefined();
      });
    })));

  });

});
