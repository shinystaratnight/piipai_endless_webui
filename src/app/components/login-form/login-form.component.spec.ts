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
      login() {
        if (response.status === 'error') {
          return Observable.throw(response);
        }
        return Observable.of(response);
      },
      loginWithToken(token) {
        if (response.status === 'error') {
          return Observable.throw(response);
        }
        return Observable.of(response);
      },
      getMetaData() {
        if (metadata.status === 'error') {
          return Observable.throw(metadata);
        }
        return Observable.of(metadata);
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

  it('should have loginForm property', () => {
    expect(comp.loginForm).toBeDefined();
  });

  describe('ngOnInit method', () => {

    it('should be defined', () => {
      expect(comp.ngOnInit).toBeDefined();
    });

    it('should be call tokenAuth method', () => {
      spyOn(comp, 'tokenAuth');
      spyOn(comp, 'getMetaData');
      comp.ngOnInit();
      expect(comp.getMetaData).toHaveBeenCalled();
      expect(comp.tokenAuth).toHaveBeenCalled();
    });

  });

  describe('validateEmail method', () => {

    it('should be defined', () => {
      expect(comp.validateEmail).toBeDefined();
    });

    it('validate email with positive result', () => {
      let validEmail = 'example@test.com';
      let input = new FormControl();
      input.setValue(validEmail);
      expect(comp.validateEmail(input)).toBeNull();
    });

    it('validate email with negative result', () => {
      let invalidEmail = 'exampltest.com';
      let input = new FormControl();
      let result = {
        validateEmail: {
          valid: false
        }
      };
      input.setValue(invalidEmail);
      expect(comp.validateEmail(input)).toEqual(result);
    });

  });

  describe('validatePhone method', () => {

    it('should be defined', () => {
      expect(comp.validatePhone).toBeDefined();
    });

    it('validate phone with positive result', () => {
      let validPhone = '+380978118569';
      let input = new FormControl();
      input.setValue(validPhone);
      expect(comp.validatePhone(input)).toBeNull();
    });

    it('validate phone with negative result', () => {
      let invalidPhone = '36987425';
      let input = new FormControl();
      let result = {
        validatePhone: {
          valid: false
        }
      };
      input.setValue(invalidPhone);
      expect(comp.validatePhone(input)).toEqual(result);
    });
  });

  describe('login method', () => {

    it('should be defined', () => {
      expect(comp.login).toBeDefined();
    });

    it('should update response property', () => {
      response = {
        message: 'sent message'
      };
      comp.login();
      expect(comp.response).toEqual(response.message);
    });

    it('should save user data', inject([LocalStorageService], (storage: LocalStorageService) => {
      spyOn(storage, 'store');
      response = {
        status: 'success',
        data: 'user data'
      };
      comp.login();
      expect(storage.store).toHaveBeenCalled();
    }));

    it('should redirect to "/"', inject([Router], (router: Router) => {
      spyOn(router, 'navigate');
      response = {
        status: 'success',
        data: 'user data'
      };
      comp.login();
      expect(router.navigate).toHaveBeenCalled();
    }));

    it('should parse errors', inject([Router], (router: Router) => {
      spyOn(router, 'navigate');
      response = {
        status: 'error',
        errors: {
          register: 'email'
        }
      };
      comp.login();
      expect(router.navigate).toHaveBeenCalled();
    }));

    it('should redirect to "/"', inject([Router], (router: Router) => {
      response = {
        status: 'error',
        errors: {
          error: 'error message'
        }
      };
      comp.login();
      expect(comp.error).toEqual(response);
    }));

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

  describe('getMetaData method', () => {

    it('should be defined', () => {
      expect(comp.getMetaData).toBeDefined();
    });

    it('should save fields data', () => {
      metadata = {
        fields: {
          username: {
            label: 'username'
          },
          password: {
            label: 'password'
          }
        }
      };
      comp.getMetaData();
      expect(comp.usernameField.label).toEqual('username');
      expect(comp.passwordField.label).toEqual('password');
    });

    it('should parse error', () => {
      metadata = {
        status: 'error',
        message: 'error message'
      };
      comp.getMetaData();
      expect(comp.error).toEqual(metadata);
    });

  });

});
