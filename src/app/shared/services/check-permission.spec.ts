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

import { CheckPermissionService, PermissionResponse } from './check-permission';
import { ErrorsService } from './errors.service';
import { Observable } from 'rxjs/Observable';
import { SiteService } from '../../services/site.service';
import { NavigationService } from '../../services/navigation.service';
import { Permission } from '../../settings/permissions/permissions.component';

describe('CheckPermissionService', () => {

  const url: string = `/ecore/api/v2/login/`;

  const mockErrorsService = {
    parseErrors() {
      return Observable.throw('err');
    }
  };

  const mockSiteService = {
    getDataOfPage() {
      return {};
    }
  };

  const mockNavigationService = {
    parsedByPermissions: false,
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
        { provide: SiteService, useValue: mockSiteService },
        { provide: NavigationService, useValue: mockNavigationService }
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

  describe('getPermissions method', () => {

    it('should return permissions from api',
      async(inject([CheckPermissionService, MockBackend],
        (service: CheckPermissionService, mockBackend: MockBackend) => {
          const mockResponse: PermissionResponse = {
            permission_list: [],
            group_permission_list: []
          };

          const body = JSON.stringify(mockResponse);

          mockBackend.connections.subscribe((conn) => {
            conn.mockRespond(new Response(new ResponseOptions({ body })));
          });
          const result = service.getPermissions('123');

          result.subscribe((res) => {
            expect(res).toEqual([]);
          });
    })));

    it('should return permissions from cash',
      async(inject([CheckPermissionService], (service: CheckPermissionService) => {
        service.permissions = [{
          name: 'Name',
          id: 1,
          codename: 'Codename'
        }];

        const permissions = service.getPermissions('123');
    })));
  });

});
