import { async, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { LocalStorageService } from 'ng2-webstorage';
import { CookieService } from 'angular2-cookie/core';
import { GenericFormService } from '../dynamic-form/services/generic-form.service';

import { NavigationService } from './navigation.service';

import { Observable } from 'rxjs/Observable';

import { UserService } from './user.service';

describe('UserService', () => {

  let response;
  let user = {
    title: 'Mr.',
    first_name: 'Tom',
    last_name: 'Smith',
    __str__: 'Mr. Tom Smith'
  };
  let mockRouter = {
    navigate() {
      return true;
    }
  };
  let mockGenericFormService = {
    getAll() {
      return Observable.of(response);
    },
    submitForm() {
      return Observable.of(response);
    }
  };

  const mockNavigationService = {
    navigationList: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        LocalStorageService,
        CookieService,
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: GenericFormService, useValue: mockGenericFormService },
        { provide: Router, useValue: mockRouter }
      ],
      imports: []
    });
  });

  it('should be defined', async(inject([UserService], (service) => {
    expect(service).toBeDefined();
  })));

  describe('getUserData method', () => {
    it('should return user data if first request',
      async(inject([UserService], (userService: UserService) => {
        response = user;
        userService.getUserData().subscribe(
          (userData: any) => {
            expect(userData).toEqual(response);
            expect(userService.user).toEqual(response);
          }
        );
    })));

    it('should return user data if is not fisrt request',
      async(inject([UserService], (userService: UserService) => {
        userService.user = user;
        userService.getUserData().subscribe(
          (userData: any) => {
            expect(userData).toEqual(user);
          }
        );
    })));
  });

  describe('logout method', () => {
    it('should delete information about user',
      async(inject([UserService, CookieService, Router, NavigationService],
      (userService: UserService, cookie: CookieService, router: Router, nav: NavigationService) => {
        response = {
          status: 'success',
          message: 'You are logged out'
        };
        userService.user = user;
        nav.navigationList = [];
        spyOn(router, 'navigate');
        userService.logout();
        expect(userService.user).toBeNull();
        expect(cookie.get('sessionid')).toBeUndefined();
        expect(router.navigate).toHaveBeenCalledWith(['/home']);
        expect(nav.navigationList).toBeNull();
    })));
  });

});
