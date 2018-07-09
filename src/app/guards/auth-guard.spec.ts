import { async, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { UserService, NavigationService } from '../services';
import { Observable } from 'rxjs/Observable';

import { AuthGuard } from './auth-guard';
import { CheckPermissionService } from '../shared/services/check-permission';

describe('AuthGuard', () => {

  let response;
  let mockRouter = {
    navigate() {
      return true;
    }
  };

  let mockUserService = {
    getUserData() {
      if (response.status === 'success') {
        return Observable.of(response);
      } else {
        return Observable.throw(response);
      }
    }
  };

  const mockCheckPermissionService = {
    CheckPermissionService() {
      return Observable.of(true);
    }
  };

  const mockNavigationService = {
    getPages() {
      return [];
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: mockUserService },
        { provide: CheckPermissionService, useValue: mockCheckPermissionService },
        { provide: NavigationService, useValue: mockNavigationService }
      ],
      imports: []
    });
  });

  it('should be defined', async(inject([AuthGuard], (service) => {
    expect(service).toBeDefined();
  })));

  describe('canActivate method', () => {
    it('should return observable of true',
      async(inject([AuthGuard], (authGuard: AuthGuard) => {
        response = {
          status: 'success'
        };
        authGuard.canActivate().subscribe((res: boolean) => {
          expect(res).toBeTruthy();
        });
    })));

    it('should return observable of false',
      async(inject([AuthGuard, Router], (authGuard: AuthGuard, router: Router) => {
        response = {
          status: 'error'
        };
        spyOn(router, 'navigate');
        authGuard.canActivate().subscribe((res: boolean) => {
          expect(res).toBeFalsy();
          expect(router.navigate).toHaveBeenCalledWith(['/home']);
        });
    })));
  });

});
