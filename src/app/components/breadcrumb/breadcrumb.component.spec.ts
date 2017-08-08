import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  inject,
  async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { NavigationService, Page } from './../../services/navigation.service';
import { BreadcrumbComponent, Breadcrumb } from './breadcrumb.component';

describe('BreadcrumbComponent', () => {

  let comp: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;
  let response: Page[];
  let url = [
    {
      path: 'core'
    }
  ];

  let mockNavigationService = {
    getPages() {
      return Observable.of(response);
    }
  };
  let mockActivatedRoute = {
    url: Observable.of(url)
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BreadcrumbComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute},
        { provide: NavigationService, useValue: mockNavigationService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(BreadcrumbComponent);
        comp = fixture.componentInstance;
      });
  }));

  it('should be defined', () => {
    expect(comp).toBeDefined();
  });

  describe('ngOnInit', () => {
    it('should call getList method', () => {
      spyOn(comp, 'getList');
      comp.ngOnInit();
      expect(comp.getList).toHaveBeenCalled();
    });
  });

  describe('getList method', () => {
    it('should get list and call generateData method',
      async(inject([NavigationService, ActivatedRoute],
        (navigationService: NavigationService, route: ActivatedRoute) => {
          response = [
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
          spyOn(comp, 'generateData');
          comp.getList();
          expect(comp.navigationList).toEqual(response);
          expect(comp.list).toEqual([]);
          expect(comp.generateData).toHaveBeenCalledWith(url);
    })));
  });

  describe('generateData method', () => {
    it('should call generateBreadcrumb method if last element of url is "add"', () => {
      let urlArray = [
        {
          path: 'contact'
        },
        {
          path: 'add'
        }
      ];
      spyOn(comp, 'generateBreadcrumb');
      comp.generateData(urlArray);
      expect(comp.generateBreadcrumb).toHaveBeenCalledWith(['contact']);
    });

    it('should call generateBreadcrumb method if last element of url is "change"', () => {
      let urlArray = [
        {
          path: 'contact'
        },
        {
          path: '123'
        },
        {
          path: 'change'
        }
      ];
      spyOn(comp, 'generateBreadcrumb');
      comp.generateData(urlArray);
      expect(comp.generateBreadcrumb).toHaveBeenCalledWith(['contact']);
    });

    it('should call generateBreadcrumb method', () => {
      let urlArray = [
        {
          path: 'contact'
        }
      ];
      spyOn(comp, 'generateBreadcrumb');
      comp.generateData(urlArray);
      expect(comp.generateBreadcrumb).toHaveBeenCalledWith(['contact']);
    });
  });

  describe('generateBreadcrumb method', () => {
    it('should generate data for displaying breadcrumb', () => {
      let urlArray = ['contact'];
      comp.navigationList = [
        {
          name: 'Contact',
          url: '/contact/',
          endpoint: '/ecore/api/v2/contact',
          __str__: 'Contact',
          childrens: []
        }
      ];
      comp.list = [];
      spyOn(comp, 'getElement').and.returnValue(comp.navigationList[0]);
      comp.generateBreadcrumb(urlArray);
      expect(comp.list).toEqual([
        {
          path: '/contact/',
          label: 'Contact',
          active: true
        }
      ]);
    });
  });

  describe('getElement', () => {
    it('should return element from navigationList by path property', () => {
      let path = '/core/contact/';
      let result;
      comp.navigationList = [
        {
          name: 'Core',
          url: '/core/',
          endpoint: '/ecore/api/v2/core/',
          __str__: 'Core',
          childrens: [
            {
              name: 'Contact',
              url: '/core/contact/',
              endpoint: '/ecore/api/v2/contacts/',
              __str__: 'Contact',
              childrens: []
            }
          ]
        }
      ];
      result = comp.getElement(path, comp.navigationList);
      expect(result).toEqual(comp.navigationList[0].childrens[0]);
    });
  });

});
