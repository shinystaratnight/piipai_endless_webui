import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { ComponentFixtureAutoDetect, async } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let comp: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [NgbModule.forRoot()],
      declarations: [HomeComponent],
      providers: [],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        comp = fixture.componentInstance;
      });
  }));

  it('should be defined', () => {
    expect(comp).toBeDefined();
  });

  describe('ngOnDestroy method', () => {
    it('should close modal', () => {
      comp.modalRef = {
        close() {
          return true;
        }
      };
      spyOn(comp.modalRef, 'close');
      comp.ngOnDestroy();
      expect(comp.modalRef.close).toHaveBeenCalled();
    });
  });

  describe('mobileLogin method', () => {
    it('should open modal window for login by phone number', () => {
      comp.modalInfo = {};
      comp.mobileLogin();
      expect(comp.modalInfo).toEqual({
        label: 'Please, enter a mobile phone',
        endpoint: '/ecore/api/v2/auth/login/',
        data: {
          password: {
            action: 'add',
            data: {
              hide: true,
              templateOptions: {
                label: ''
              }
            }
          },
          username: {
            action: 'add',
            data: {
              templateOptions: {
                label: '',
                placeholder: 'Enter your phone',
                max: 255,
                required: true,
                type: 'text'
              }
            }
          }
        }
      });
    });
  });

  describe('formEvent method', () => {
    it('should close modal window after form success', () => {
      let event = {
        type: 'sendForm',
        status: 'success'
      };
      let test = {
        closeModal() {
          return true;
        }
      };
      spyOn(test, 'closeModal');
      comp.formEvent(event, test.closeModal);
      expect(test.closeModal).toHaveBeenCalled();
    });
  });

});
