import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  inject,
  async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { NavigationService, Page } from './../../services/navigation.service';
import { UserService } from '../../services/user.service';

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
  let mockUserService = {
    getUserData() {
      return Observable.of(response);
    },
    logout() {
      return true;
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavigationComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
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

  describe('ngAfterViewInit method', () => {
    it('should get height of page header', () => {
      comp.header = {
        nativeElement: {
          offsetHeight: 40
        }
      };
      comp.ngAfterViewInit();
      expect(comp.headerHeight).toEqual(39);
    });
  });

  describe('getUserInformation method', () => {
    it('should update greeting property', () => {
        comp.getUserInformation();
        expect(comp.greeting).toEqual('Welcome, Anonymous User');
    });

    it('should udate user information', () => {
          comp.user = {
            contact: {
              __str__: 'Mr. Tom Smith'
            }
          };
          comp.getUserInformation();
          expect(comp.greeting).toEqual(`Welcome, ${comp.user.contact.__str__}`);
    });
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

  describe('logout method', () => {
    it('should call logout method of UserService',
      async(inject([UserService], (userService: UserService) => {
        spyOn(userService, 'logout');
        comp.logOut();
        expect(userService.logout).toHaveBeenCalled();
    })));
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
