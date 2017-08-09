import { LoginService } from './../../services/login.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Injector, NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { ComponentFixtureAutoDetect, async, fakeAsync } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {

  let comp: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let content: string;
  let response: any;
  let metadata: any;

  beforeEach(async(() => {

    const mockLoginService = {
      loginWithToken(token) {
        if (response.status === 'error') {
          return Observable.throw(response);
        }
        return Observable.of(response);
      }
    };

    const mockRouter = {
      navigate() {
        return true;
      }
    };

    TestBed.configureTestingModule({
      declarations: [LoginFormComponent],
      providers: [
        FormBuilder,
        LocalStorageService,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: {
            params: Observable.of({ token: 123 })
          }
        },
        { provide: LoginService, useValue: mockLoginService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(LoginFormComponent);
        comp = fixture.componentInstance;
      });
  }));

  it('should be defined', () => {
    expect(comp).toBeDefined();
  });

  describe('ngOnInit method', () => {

    it('should be defined', () => {
      expect(comp.ngOnInit).toBeDefined();
    });

    it('should be call tokenAuth method', () => {
      spyOn(comp, 'tokenAuth');
      comp.ngOnInit();
      expect(comp.tokenAuth).toHaveBeenCalled();
    });

  });

  describe('tokenAuth method', () => {

    it('should be defined', () => {
      expect(comp.tokenAuth).toBeDefined();
    });

    it('should save user data', inject([LocalStorageService], (storage: LocalStorageService) => {
      spyOn(storage, 'store');
      response = {
        status: 'success',
        data: 'user data',
        redirect_to: '/'
      };
      comp.tokenAuth(5);
      expect(storage.store).toHaveBeenCalled();
    }));

    it('should redirect to register form', inject([Router], (router: Router) => {
      spyOn(router, 'navigate');
      response = {
        status: 'success',
        data: 'user data',
        redirect_to: '/'
      };
      comp.tokenAuth(5);
      expect(router.navigate).toHaveBeenCalled();
    }));

    it('should redirect to login form', inject([Router], (router: Router) => {
      spyOn(router, 'navigate');
      response = {
        status: 'error',
        errors: 'error message',
      };
      comp.tokenAuth(5);
      expect(router.navigate).toHaveBeenCalled();
    }));

  });

  describe('responseHandler method', () => {

    it('should be defined', () => {
      expect(comp.responseHandler).toBeDefined();
    });

    it('should save user data', inject([LocalStorageService], (storage: LocalStorageService) => {
      spyOn(storage, 'store');
      response = {
        status: 'success',
        data: 'user data'
      };
      comp.responseHandler(response);
      expect(storage.store).toHaveBeenCalled();
    }));

    it('should redirect to "/"', inject([Router], (router: Router) => {
      spyOn(router, 'navigate');
      response = {
        status: 'success',
        data: 'user data'
      };
      comp.responseHandler(response);
      expect(router.navigate).toHaveBeenCalled();
    }));

    it('should update error property', () => {
      response = {
        status: 'success',
      };
      comp.responseHandler(response);
      expect(comp.error).toEqual({});
    });

  });

  describe('redirectHandler method', () => {

    it('should be defined', () => {
      expect(comp.redirectHandler).toBeDefined();
    });

    it('should save data for register form',
      inject([LoginService], (loginService: LoginService) => {
      let data = {
        field: 'email',
        data: 'test@test.com'
      };
      comp.redirectHandler(data);
      expect(loginService.username).toEqual(data);
    }));

    it('should redirect to "/register"', inject([Router], (router: Router) => {
      spyOn(router, 'navigate');
      let data = {
        field: 'email',
        data: 'test@test.com'
      };
      comp.responseHandler(data);
      expect(router.navigate).toHaveBeenCalled();
    }));

  });

});
