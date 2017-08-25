import { async, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { LocalStorageService } from 'ng2-webstorage';
import { CookieService } from 'angular2-cookie/core';

import { NotAuthorizedGuard } from './not-authorized-guard';

describe('NotAuthorizedGuard', () => {

  let response;
  let mockRouter = {
    navigate() {
      return true;
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotAuthorizedGuard,
        LocalStorageService,
        CookieService,
        { provide: Router, useValue: mockRouter }
      ],
      imports: []
    });
  });

  it('should be defined', async(inject([NotAuthorizedGuard], (service) => {
    expect(service).toBeDefined();
  })));

  describe('canActivate method', () => {
    it('should call isLoggedIn method', async(inject([NotAuthorizedGuard],
      (notAuthorizedGuard: NotAuthorizedGuard) => {
        spyOn(notAuthorizedGuard, 'isLoggedOut');
        notAuthorizedGuard.canActivate();
        expect(notAuthorizedGuard.isLoggedOut).toHaveBeenCalled();
    })));
  });

  describe('isLoggedIn method', () => {
    it('should return true',
      async(inject([NotAuthorizedGuard, LocalStorageService, CookieService, Router],
        (notAuthorizedGuard: NotAuthorizedGuard,
          storage: LocalStorageService, cookie: CookieService) => {
            storage.clear('contact');
            cookie.remove('sessionid');
            let result = notAuthorizedGuard.isLoggedOut();
            expect(result).toBeTruthy();
      })));

    it('should return false',
      async(inject([NotAuthorizedGuard, LocalStorageService, CookieService, Router],
        (notAuthorizedGuard: NotAuthorizedGuard, storage: LocalStorageService,
          cookie: CookieService, router: Router) => {
            storage.store('contact', {});
            cookie.put('sessionid', '123456');
            spyOn(router, 'navigate');
            let result = notAuthorizedGuard.isLoggedOut();
            expect(router.navigate).toHaveBeenCalledWith(['/']);
            expect(result).toBeFalsy();
    })));
  });

});
