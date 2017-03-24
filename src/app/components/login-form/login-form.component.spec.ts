import { FormBuilder, FormControl } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Injector, NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { ComponentFixtureAutoDetect, async, fakeAsync } from '@angular/core/testing';

import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {

  let comp: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let content: string;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginFormComponent],
      providers: [
        FormBuilder
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

});
