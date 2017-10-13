import { async, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { LocalStorageService } from 'ng2-webstorage';
import { CookieService } from 'angular2-cookie/core';

import { AuthGuard } from './auth-guard';

describe('AuthGuard', () => {

  let response;
  let mockRouter = {
    navigate() {
      return true;
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        LocalStorageService,
        CookieService,
        { provide: Router, useValue: mockRouter }
      ],
      imports: []
    });
  });

  it('should be defined', async(inject([AuthGuard], (service) => {
    expect(service).toBeDefined();
  })));

  describe('canActivate method', () => {
    it('should call isLoggedIn method', async(inject([AuthGuard], (authGuard: AuthGuard) => {
      spyOn(authGuard, 'isLoggedIn');
      authGuard.canActivate();
      expect(authGuard.isLoggedIn).toHaveBeenCalled();
    })));
  });

  describe('isLoggedIn method', () => {
    it('should return false',
      async(inject([AuthGuard, LocalStorageService, CookieService, Router],
        (authGuard: AuthGuard, storage: LocalStorageService,
          cookie: CookieService, router: Router) => {
            storage.clear('contact');
            cookie.remove('sessionid');
            spyOn(router, 'navigate');
            let result = authGuard.isLoggedIn();
            expect(result).toBeFalsy();
            expect(router.navigate).toHaveBeenCalledWith(['/home']);
      })));

    it('should return true',
      async(inject([AuthGuard, LocalStorageService, CookieService, Router],
        (authGuard: AuthGuard, storage: LocalStorageService,
          cookie: CookieService, router: Router) => {
            storage.store('contact', {});
            cookie.put('sessionid', '123456');
            let result = authGuard.isLoggedIn();
            expect(result).toBeTruthy();
    })));
  });

});
