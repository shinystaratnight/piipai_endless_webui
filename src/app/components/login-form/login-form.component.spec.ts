import { LoginService } from './../../services/login.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Injector, NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { ComponentFixtureAutoDetect, async, fakeAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
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

  beforeEach(async(() => {

    const mockLoginService = {
      login() {
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

    it('should redirect to register form', inject([Router], (router: Router) => {
      spyOn(router, 'navigate');
      response = {
        status: 'success',
        data: 'user data'
      };
      comp.login();
      expect(router.navigate).toHaveBeenCalled();
    }));

  });

});
