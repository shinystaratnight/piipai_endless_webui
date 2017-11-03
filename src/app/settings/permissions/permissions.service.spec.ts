import { async, inject, TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  BaseRequestOptions,
  Http,
  HttpModule,
  Response,
  ResponseOptions,
  RequestOptions,
  ConnectionBackend,
  Headers
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';

import { CookieService } from 'angular2-cookie/core';
import { PermissionsService } from './permissions.service';

describe('PermissionsService', () => {

  const response: any = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CookieService,
        PermissionsService,
        BaseRequestOptions,
        MockBackend,
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

  describe('getAllPermissions method', () => {

    beforeEach(() => {
      delete response.status;
      delete response.data;
      delete response.errors;
    });

    it('should parse response',
      async(inject([PermissionsService, MockBackend], (service, mockBackend) => {
        response.status = 'success';
        response.data = {
          count: 0,
          results: []
        };
        mockBackend.connections.subscribe((conn) => {
          let responseObject = new ResponseOptions({
            body: JSON.stringify(response)
          });
          let mockResponse = new Response(responseObject);
          conn.mockRespond(mockResponse);
        });
        let result;
        spyOn(service, 'updateHeaders').and.returnValue({});
        service.getAllPermissions().subscribe(
          (res: any) => result = res
        );
        expect(result).toEqual(response);
        expect(service.updateHeaders).toHaveBeenCalled();
    })));

    it('should parse errors',
      async(inject([PermissionsService, MockBackend], (service, mockBackend) => {
        response.status = 'error';
        response.errors = {
          detail: 'some detail'
        };
        mockBackend.connections.subscribe((conn) => {
          let responseObject = new ResponseOptions({
            body: JSON.stringify(response)
          });
          let mockError = new Response(responseObject);
          conn.mockError(mockError);
        });
        let result;
        spyOn(service, 'updateHeaders').and.returnValue({});
        service.getAllPermissions().subscribe(null,
          (err: any) => result = err
        );
        expect(result).toEqual(response);
        expect(service.updateHeaders).toHaveBeenCalled();
    })));

  });

  describe('getAllUsers method', () => {

    beforeEach(() => {
      delete response.status;
      delete response.data;
      delete response.errors;
    });

    it('should parse response',
      async(inject([PermissionsService, MockBackend], (service, mockBackend) => {
        response.status = 'success';
        response.data = {
          count: 0,
          results: []
        };
        mockBackend.connections.subscribe((conn) => {
          let responseObject = new ResponseOptions({
            body: JSON.stringify(response)
          });
          let mockResponse = new Response(responseObject);
          conn.mockRespond(mockResponse);
        });
        let result;
        spyOn(service, 'updateHeaders').and.returnValue({});
        service.getAllUsers().subscribe(
          (res: any) => result = res
        );
        expect(result).toEqual(response);
        expect(service.updateHeaders).toHaveBeenCalled();
    })));

    it('should parse errors',
      async(inject([PermissionsService, MockBackend], (service, mockBackend) => {
        response.status = 'error';
        response.errors = {
          detail: 'some detail'
        };
        mockBackend.connections.subscribe((conn) => {
          let responseObject = new ResponseOptions({
            body: JSON.stringify(response)
          });
          let mockError = new Response(responseObject);
          conn.mockError(mockError);
        });
        let result;
        spyOn(service, 'updateHeaders').and.returnValue({});
        service.getAllUsers().subscribe(null,
          (err: any) => result = err
        );
        expect(result).toEqual(response);
        expect(service.updateHeaders).toHaveBeenCalled();
    })));

  });

  describe('addPermissionsOnTheUser method', () => {

    beforeEach(() => {
      delete response.status;
      delete response.data;
      delete response.errors;
    });

    it('should parse response',
      async(inject([PermissionsService, MockBackend], (service, mockBackend) => {
        response.status = 'success';
        response.data = {
          count: 0,
          results: []
        };
        mockBackend.connections.subscribe((conn) => {
          let responseObject = new ResponseOptions({
            body: JSON.stringify(response)
          });
          let mockResponse = new Response(responseObject);
          conn.mockRespond(mockResponse);
        });
        let result;
        let id = '123';
        let permissions = [];
        spyOn(service, 'updateHeaders').and.returnValue({});
        service.addPermissionsOnTheUser(id, permissions).subscribe(
          (res: any) => result = res
        );
        expect(result).toEqual(response);
        expect(service.updateHeaders).toHaveBeenCalled();
    })));

    it('should parse errors',
      async(inject([PermissionsService, MockBackend], (service, mockBackend) => {
        response.status = 'error';
        response.errors = {
          detail: 'some detail'
        };
        mockBackend.connections.subscribe((conn) => {
          let responseObject = new ResponseOptions({
            body: JSON.stringify(response)
          });
          let mockError = new Response(responseObject);
          conn.mockError(mockError);
        });
        let result;
        let id = '123';
        let permissions = [];
        spyOn(service, 'updateHeaders').and.returnValue({});
        service.addPermissionsOnTheUser(id, permissions).subscribe(null,
          (err: any) => result = err
        );
        expect(result).toEqual(response);
        expect(service.updateHeaders).toHaveBeenCalled();
    })));

  });

  describe('revokePermissionsOfTheUser method', () => {

    beforeEach(() => {
      delete response.status;
      delete response.data;
      delete response.errors;
    });

    it('should parse response',
      async(inject([PermissionsService, MockBackend], (service, mockBackend) => {
        response.status = 'success';
        response.data = {
          count: 0,
          results: []
        };
        mockBackend.connections.subscribe((conn) => {
          let responseObject = new ResponseOptions({
            body: JSON.stringify(response)
          });
          let mockResponse = new Response(responseObject);
          conn.mockRespond(mockResponse);
        });
        let result;
        spyOn(service, 'updateHeaders').and.returnValue({});
        service.revokePermissionsOfTheUser().subscribe(
          (res: any) => result = res
        );
        expect(result).toEqual(response);
        expect(service.updateHeaders).toHaveBeenCalled();
    })));

    it('should parse errors',
      async(inject([PermissionsService, MockBackend], (service, mockBackend) => {
        response.status = 'error';
        response.errors = {
          detail: 'some detail'
        };
        mockBackend.connections.subscribe((conn) => {
          let responseObject = new ResponseOptions({
            body: JSON.stringify(response)
          });
          let mockError = new Response(responseObject);
          conn.mockError(mockError);
        });
        let result;
        spyOn(service, 'updateHeaders').and.returnValue({});
        service.revokePermissionsOfTheUser().subscribe(null,
          (err: any) => result = err
        );
        expect(result).toEqual(response);
        expect(service.updateHeaders).toHaveBeenCalled();
    })));

  });

  describe('getAllGroups method', () => {

    beforeEach(() => {
      delete response.status;
      delete response.data;
      delete response.errors;
    });

    it('should parse response',
      async(inject([PermissionsService, MockBackend], (service, mockBackend) => {
        response.status = 'success';
        response.data = {
          count: 0,
          results: []
        };
        mockBackend.connections.subscribe((conn) => {
          let responseObject = new ResponseOptions({
            body: JSON.stringify(response)
          });
          let mockResponse = new Response(responseObject);
          conn.mockRespond(mockResponse);
        });
        let result;
        spyOn(service, 'updateHeaders').and.returnValue({});
        service.getAllGroups().subscribe(
          (res: any) => result = res
        );
        expect(result).toEqual(response);
        expect(service.updateHeaders).toHaveBeenCalled();
    })));

    it('should parse errors',
      async(inject([PermissionsService, MockBackend], (service, mockBackend) => {
        response.status = 'error';
        response.errors = {
          detail: 'some detail'
        };
        mockBackend.connections.subscribe((conn) => {
          let responseObject = new ResponseOptions({
            body: JSON.stringify(response)
          });
          let mockError = new Response(responseObject);
          conn.mockError(mockError);
        });
        let result;
        spyOn(service, 'updateHeaders').and.returnValue({});
        service.getAllGroups().subscribe(null,
          (err: any) => result = err
        );
        expect(result).toEqual(response);
        expect(service.updateHeaders).toHaveBeenCalled();
    })));

  });

  describe('getAllPermissionsOfTheGroup method', () => {

    beforeEach(() => {
      delete response.status;
      delete response.data;
      delete response.errors;
    });

    it('should parse response',
      async(inject([PermissionsService, MockBackend], (service, mockBackend) => {
        response.status = 'success';
        response.data = {
          count: 0,
          results: []
        };
        mockBackend.connections.subscribe((conn) => {
          let responseObject = new ResponseOptions({
            body: JSON.stringify(response)
          });
          let mockResponse = new Response(responseObject);
          conn.mockRespond(mockResponse);
        });
        let result;
        spyOn(service, 'updateHeaders').and.returnValue({});
        service.getAllPermissionsOfTheGroup().subscribe(
          (res: any) => result = res
        );
        expect(result).toEqual(response);
        expect(service.updateHeaders).toHaveBeenCalled();
    })));

    it('should parse errors',
      async(inject([PermissionsService, MockBackend], (service, mockBackend) => {
        response.status = 'error';
        response.errors = {
          detail: 'some detail'
        };
        mockBackend.connections.subscribe((conn) => {
          let responseObject = new ResponseOptions({
            body: JSON.stringify(response)
          });
          let mockError = new Response(responseObject);
          conn.mockError(mockError);
        });
        let result;
        spyOn(service, 'updateHeaders').and.returnValue({});
        service.getAllPermissionsOfTheGroup().subscribe(null,
          (err: any) => result = err
        );
        expect(result).toEqual(response);
        expect(service.updateHeaders).toHaveBeenCalled();
    })));

  });

  describe('createGroup method', () => {

    beforeEach(() => {
      delete response.status;
      delete response.data;
      delete response.errors;
    });

    it('should parse response',
      async(inject([PermissionsService, MockBackend], (service, mockBackend) => {
        response.status = 'success';
        response.data = {
          count: 0,
          results: []
        };
        mockBackend.connections.subscribe((conn) => {
          let responseObject = new ResponseOptions({
            body: JSON.stringify(response)
          });
          let mockResponse = new Response(responseObject);
          conn.mockRespond(mockResponse);
        });
        let result;
        let name = 'Manager';
        spyOn(service, 'updateHeaders').and.returnValue({});
        service.createGroup(name).subscribe(
          (res: any) => result = res
        );
        expect(result).toEqual(response);
        expect(service.updateHeaders).toHaveBeenCalled();
    })));

    it('should parse errors',
      async(inject([PermissionsService, MockBackend], (service, mockBackend) => {
        response.status = 'error';
        response.errors = {
          detail: 'some detail'
        };
        mockBackend.connections.subscribe((conn) => {
          let responseObject = new ResponseOptions({
            body: JSON.stringify(response)
          });
          let mockError = new Response(responseObject);
          conn.mockError(mockError);
        });
        let result;
        let name = 'Manager';
        spyOn(service, 'updateHeaders').and.returnValue({});
        service.createGroup(name).subscribe(null,
          (err: any) => result = err
        );
        expect(result).toEqual(response);
        expect(service.updateHeaders).toHaveBeenCalled();
    })));

  });

  describe('deleteGroup method', () => {

    beforeEach(() => {
      delete response.status;
      delete response.data;
      delete response.errors;
    });

    it('should parse response',
      async(inject([PermissionsService, MockBackend], (service, mockBackend) => {
        response.status = 'success';
        response.data = {
          count: 0,
          results: []
        };
        mockBackend.connections.subscribe((conn) => {
          let responseObject = new ResponseOptions({
            body: JSON.stringify(response)
          });
          let mockResponse = new Response(responseObject);
          conn.mockRespond(mockResponse);
        });
        let result;
        spyOn(service, 'updateHeaders').and.returnValue({});
        service.deleteGroup().subscribe(
          (res: any) => result = res
        );
        expect(result).toEqual(response);
        expect(service.updateHeaders).toHaveBeenCalled();
    })));

    it('should parse errors',
      async(inject([PermissionsService, MockBackend], (service, mockBackend) => {
        response.status = 'error';
        response.errors = {
          detail: 'some detail'
        };
        mockBackend.connections.subscribe((conn) => {
          let responseObject = new ResponseOptions({
            body: JSON.stringify(response)
          });
          let mockError = new Response(responseObject);
          conn.mockError(mockError);
        });
        let result;
        spyOn(service, 'updateHeaders').and.returnValue({});
        service.deleteGroup().subscribe(null,
          (err: any) => result = err
        );
        expect(result).toEqual(response);
        expect(service.updateHeaders).toHaveBeenCalled();
    })));

  });

  describe('addPermissionsOnTheGroup method', () => {

    beforeEach(() => {
      delete response.status;
      delete response.data;
      delete response.errors;
    });

    it('should parse response',
      async(inject([PermissionsService, MockBackend], (service, mockBackend) => {
        response.status = 'success';
        response.data = {
          count: 0,
          results: []
        };
        mockBackend.connections.subscribe((conn) => {
          let responseObject = new ResponseOptions({
            body: JSON.stringify(response)
          });
          let mockResponse = new Response(responseObject);
          conn.mockRespond(mockResponse);
        });
        let result;
        let id = '123';
        let permissions = [];
        spyOn(service, 'updateHeaders').and.returnValue({});
        service.addPermissionsOnTheGroup(id, permissions).subscribe(
          (res: any) => result = res
        );
        expect(result).toEqual(response);
        expect(service.updateHeaders).toHaveBeenCalled();
    })));

    it('should parse errors',
      async(inject([PermissionsService, MockBackend], (service, mockBackend) => {
        response.status = 'error';
        response.errors = {
          detail: 'some detail'
        };
        mockBackend.connections.subscribe((conn) => {
          let responseObject = new ResponseOptions({
            body: JSON.stringify(response)
          });
          let mockError = new Response(responseObject);
          conn.mockError(mockError);
        });
        let result;
        let id = '123';
        let permissions = [];
        spyOn(service, 'updateHeaders').and.returnValue({});
        service.addPermissionsOnTheGroup(id, permissions).subscribe(null,
          (err: any) => result = err
        );
        expect(result).toEqual(response);
        expect(service.updateHeaders).toHaveBeenCalled();
    })));

  });

  describe('addUserOnTheGroup method', () => {

    beforeEach(() => {
      delete response.status;
      delete response.data;
      delete response.errors;
    });

    it('should parse response',
      async(inject([PermissionsService, MockBackend], (service, mockBackend) => {
        response.status = 'success';
        response.data = {
          count: 0,
          results: []
        };
        mockBackend.connections.subscribe((conn) => {
          let responseObject = new ResponseOptions({
            body: JSON.stringify(response)
          });
          let mockResponse = new Response(responseObject);
          conn.mockRespond(mockResponse);
        });
        let result;
        let groupId = '123';
        let userId = '124';
        spyOn(service, 'updateHeaders').and.returnValue({});
        service.addUserOnTheGroup(groupId, userId).subscribe(
          (res: any) => result = res
        );
        expect(result).toEqual(response);
        expect(service.updateHeaders).toHaveBeenCalled();
    })));

    it('should parse errors',
      async(inject([PermissionsService, MockBackend], (service, mockBackend) => {
        response.status = 'error';
        response.errors = {
          detail: 'some detail'
        };
        mockBackend.connections.subscribe((conn) => {
          let responseObject = new ResponseOptions({
            body: JSON.stringify(response)
          });
          let mockError = new Response(responseObject);
          conn.mockError(mockError);
        });
        let result;
        let groupId = '123';
        let userId = '124';
        spyOn(service, 'updateHeaders').and.returnValue({});
        service.addUserOnTheGroup(groupId, userId).subscribe(null,
          (err: any) => result = err
        );
        expect(result).toEqual(response);
        expect(service.updateHeaders).toHaveBeenCalled();
    })));

  });

  describe('revokePermissionsOfTheGroup method', () => {

    beforeEach(() => {
      delete response.status;
      delete response.data;
      delete response.errors;
    });

    it('should parse response',
      async(inject([PermissionsService, MockBackend], (service, mockBackend) => {
        response.status = 'success';
        response.data = {
          count: 0,
          results: []
        };
        mockBackend.connections.subscribe((conn) => {
          let responseObject = new ResponseOptions({
            body: JSON.stringify(response)
          });
          let mockResponse = new Response(responseObject);
          conn.mockRespond(mockResponse);
        });
        let result;
        let id = '123';
        let permissions = [];
        spyOn(service, 'updateHeaders').and.returnValue({});
        service.revokePermissionsOfTheGroup(id, permissions).subscribe(
          (res: any) => result = res
        );
        expect(result).toEqual(response);
        expect(service.updateHeaders).toHaveBeenCalled();
    })));

    it('should parse errors',
      async(inject([PermissionsService, MockBackend], (service, mockBackend) => {
        response.status = 'error';
        response.errors = {
          detail: 'some detail'
        };
        mockBackend.connections.subscribe((conn) => {
          let responseObject = new ResponseOptions({
            body: JSON.stringify(response)
          });
          let mockError = new Response(responseObject);
          conn.mockError(mockError);
        });
        let result;
        let id = '123';
        let permissions = [];
        spyOn(service, 'updateHeaders').and.returnValue({});
        service.revokePermissionsOfTheGroup(id, permissions).subscribe(null,
          (err: any) => result = err
        );
        expect(result).toEqual(response);
        expect(service.updateHeaders).toHaveBeenCalled();
    })));

  });

  describe('updateHeaders method', () => {
    it('should return header settings',
      async(inject([PermissionsService, CookieService],
        (service: PermissionsService, cookie: CookieService) => {
          cookie.put('csrftoken', '123');
          let headers = new Headers();
          headers.append('X-CSRFToken', '123');
          let result = service.updateHeaders();
          expect(result).toEqual(headers);
    })));
  });

  describe('errorHandler method', () => {

    beforeEach(() => {
      delete response.status;
      delete response.data;
      delete response.errors;
    });

    it('should return observable of error',
      async(inject([PermissionsService], (service: PermissionsService) => {
        response.status = 'error';
        response.errors = {
          detail: 'some detail'
        };
        let result;
        let responseObject = new ResponseOptions({
          body: JSON.stringify(response)
        });
        service.errorHandler(new Response(responseObject)).subscribe(null,
          (err: Response) => result = err
        );
        expect(result).toEqual(response);
    })));
  });

});
