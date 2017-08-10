import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  inject,
  async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { LocalStorageService } from 'ng2-webstorage';
import { NavigationService, Page } from './../../services/navigation.service';
import { GenericFormService } from '../../dynamic-form/services/generic-form.service';

import { NavigationComponent } from './navigation.component';

describe('NavigationComponent', () => {

  let comp: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let pages: Page[];
  let response: any;

  let mockNavigationService = {
    getPages() {
      return Observable.of(pages);
    }
  };
  let mockGenericFormService = {
    getAll() {
      return Observable.of(response);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavigationComponent],
      providers: [
        LocalStorageService,
        { provide: GenericFormService, useValue: mockGenericFormService },
        { provide: NavigationService, useValue: mockNavigationService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(NavigationComponent);
        comp = fixture.componentInstance;
      });
  }));

  it('should be defined', () => {
    expect(comp).toBeDefined();
  });

  describe('ngOnInit method', () => {
    it('should call getUserInformation method', () => {
      spyOn(comp, 'getUserInformation');
      comp.ngOnInit();
      expect(comp.getUserInformation).toHaveBeenCalled();
    });
  });

  describe('getPagesList method', () => {
    it('should get list of pages',
      async(inject([NavigationService], (navidationService: NavigationService) => {
        pages = [
          {
            name: 'Contact',
            url: '/contact/',
            endpoint: '/ecore/api/v2/contacts',
            __str__: 'Contact',
            childrens: []
          },
          {
            name: 'Login',
            url: '/login/',
            endpoint: '/ecore/api/v2/login',
            __str__: 'Login',
            childrens: []
          }
        ];
        comp.getPagesList();
        expect(comp.pages).toEqual(pages);
    })));
  });

  describe('ngAfterContentChecked', () => {
    it('should get height of page header', () => {
      comp.header = {
        nativeElement: {
          clientHeight: 40
        }
      };
      comp.ngAfterContentChecked();
      expect(comp.headerHeight).toEqual(40);
    });
  });

  describe('getUserInformation method', () => {
    it('should update greeting property',
      async(inject([LocalStorageService], (storage: LocalStorageService) => {
        comp.getUserInformation();
        expect(comp.greeting).toEqual('Welcome, Anonymous User');
    })));

    it('should udate user information',
      async(inject([LocalStorageService, GenericFormService],
        (storage: LocalStorageService, service: GenericFormService) => {
          let userInfo = {
            id: 123
          };
          response = {
            __str__: 'Mr. Tom Smith',
            picture: {
              thumb: 'avatar.jpeg'
            }
          };
          comp.contactEndpoint = '/ecore/api/v2/contacts/';
          storage.store('contact', userInfo);
          spyOn(comp, 'getPagesList');
          comp.getUserInformation();
          expect(comp.greeting).toEqual(`Welcome, ${response.__str__}`);
          expect(comp.userPicture).toEqual(response.picture.thumb);
          expect(comp.user).toEqual(response);
          expect(comp.getPagesList).toHaveBeenCalled();
    })));
  });

  describe('hideUserBlock', () => {
    it('should hide user block', () => {
      let event = {
        preventDefault() {
          return true;
        },
        stopPropagation() {
          return true;
        }
      };
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');
      comp.hideUserMenu = false;
      comp.hideUserBlock(event);
      expect(comp.isCollapsed).toBeFalsy();
      expect(comp.hideUserMenu).toBeTruthy();
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('showNavigation', () => {
    it('should show navigation', () => {
      let event = {
        preventDefault() {
          return true;
        },
        stopPropagation() {
          return true;
        }
      };
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');
      comp.isCollapsed = true;
      comp.showNavigation(event);
      expect(comp.isCollapsed).toBeFalsy();
      expect(comp.hideUserMenu).toBeTruthy();
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('handleClick method', () => {
    it('should do not change proerty', () => {
      let component = {};
      let event = {
        target: component
      };
      comp.nav = {
        nativeElement: component
      };
      comp.isCollapsed = true;
      comp.hideUserMenu = true;
      comp.handleClick(event);
      expect(comp.isCollapsed).toBeTruthy();
      expect(comp.hideUserMenu).toBeTruthy();
    });

    it('should change isCollapsed property', () => {
      let component = {};
      let event = {
        target: component
      };
      comp.nav = {
        nativeElement: {}
      };
      comp.isCollapsed = true;
      comp.handleClick(event);
      expect(comp.isCollapsed).toBeFalsy();
    });

    it('should change hideUserMenu property', () => {
      let component = {};
      let event = {
        target: component
      };
      comp.userBlock = {
        nativeElement: {}
      };
      comp.hideUserMenu = false;
      comp.handleClick(event);
      expect(comp.hideUserMenu).toBeTruthy();
    });
  });

});
