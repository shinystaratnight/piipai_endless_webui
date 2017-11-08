import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';
import { SiteService, PageData } from '../../services/site.service';
import { GenericFormService } from '../../dynamic-form/services/generic-form.service';
import { NavigationService } from '../../services/navigation.service';
import { UserService } from '../../services/user.service';

import { SiteComponent } from './site.component';

import { Observable } from 'rxjs/Observable';

describe('SiteComponent', () => {

  let comp: SiteComponent;
  let fixture: ComponentFixture<SiteComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let mockUrl: any = ['contact', 'add'];
  let pageData: PageData;
  let modulesList: any;
  let userModules: any;
  let pages: any;

  beforeEach(async(() => {

    const mockSiteService = {
      getDataOfPage() {
        return Observable.of(pageData);
      }
    };

    const mockActivatedRoute = {
      url: Observable.of(mockUrl)
    };

    const mockRouter = {
      navigate() {
        return true;
      }
    };

    const mockGenericFormService = {
      delete() {
        return Observable.of(true);
      },
      getAll() {
        return Observable.of(true);
      }
    };

    const mockNavigationService = {
      getModules() {
        return Observable.of(modulesList);
      },
      getUserModules() {
        return Observable.of(userModules);
      },
      getPages() {
        return Observable.of(pages);
      }
    };

    const mockUserService = {
      getUserData() {
        return Observable.of({ data: {} });
      }
    };

    TestBed.configureTestingModule({
      declarations: [SiteComponent],
      providers: [
        LocalStorageService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: SiteService, useValue: mockSiteService },
        { provide: GenericFormService, useValue: mockGenericFormService },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: UserService, useValue: mockUserService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SiteComponent);
        comp = fixture.componentInstance;
      });
  }));

  it('should be defined', () => {
    expect(comp).toBeDefined();
  });

  describe('ngOnInit method', () => {
    it('should call getPageNavigation method and set user property', () => {
      spyOn(comp, 'getPageNavigation');
      comp.ngOnInit();
      expect(comp.user).toEqual({});
      expect(comp.dashboard).toBeFalsy();
      expect(comp.getPageNavigation).toHaveBeenCalledWith(mockUrl);
    });
  });

  describe('checkPermissions method', () => {
    it('should update pageData property', () => {
      let data = {
        endpoint: 'some endpoint',
        pathData: {
          type: 'list',
          path: 'path'
        }
      };
      comp.checkPermissions(data);
      expect(comp.pageData).toEqual(data);
    });
  });

  describe('changeFormLabel method', () => {
    it('should change formLabel proeprty', () => {
      let event = {
        str: 'Add'
      };
      comp.changeFormLabel(event);
      expect(comp.formLabel).toEqual('Add');
    });
  });

  describe('getPageData method', () => {
    it('should update pageData property',
      fakeAsync(inject([SiteService], (siteService: SiteService) => {
        comp.pagesList = [
          {
            childrens: [],
            endpoint: '/ecore/api/v2/endless-core/contacts/',
            name: 'Contact',
            url: '/contacts/',
            __str__: 'Contact'
          }
        ];
        pageData = {
          endpoint: '/ecore/api/v2/contacts/',
          pathData: {
            type: 'form',
            path: '/contact/',
            id: '123'
          }
        };
        comp.getPageData(['contact']);
        tick(100);
        expect(comp.pageData).toEqual(pageData);
    })));

    it('should navigate to dashboard',
      async(inject([SiteService, Router], (siteService: SiteService, router: Router) => {
        comp.pagesList = [];
        pageData = {
          endpoint: null,
          pathData: {
            type: 'form',
            path: '/',
            id: '123'
          }
        };
        spyOn(router, 'navigate');
        comp.getPageData(['contact']);
        expect(router.navigate).toHaveBeenCalledWith(['/']);
    })));
  });

  describe('getPageNavigation method', () => {
    it('should call methods', () => {
      let url = [];
      spyOn(comp, 'getModelsList');
      spyOn(comp, 'getPages');
      spyOn(comp, 'getUserModules');
      comp.getPageNavigation(url);
      expect(comp.getModelsList).toHaveBeenCalledWith(url);
      expect(comp.getPages).toHaveBeenCalledWith(url);
      expect(comp.getUserModules).toHaveBeenCalledWith(url);
    });
  });

  describe('getModelsList method', () => {
    it('should update modlelsList property',
      async(inject([NavigationService], (navigationService: NavigationService) => {
        modulesList = [];
        let pagesList = [
          {
            childrens: [],
            endpoint: '/ecore/api/v2/endless-core/contacts/',
            name: 'Contact',
            url: '/contacts/',
            __str__: 'Contact'
          }
        ];
        let url = ['contacts'];
        comp.pages = [];
        comp.userModules = [];
        spyOn(comp, 'filterNavigation').and.returnValue(pagesList);
        spyOn(comp, 'getPageData');
        comp.getModelsList(url);
        expect(comp.filterNavigation)
          .toHaveBeenCalledWith(comp.pages, comp.userModules, comp.modulesList);
        expect(comp.getPageData).toHaveBeenCalledWith(url);
        expect(comp.modulesList).toEqual(modulesList);
        expect(comp.pagesList).toEqual(pagesList);
    })));
  });

  describe('getUserModules method', () => {
    it('should update userModules property',
      async(inject([NavigationService], (navigationService: NavigationService) => {
        userModules = [];
        let pagesList = [
          {
            childrens: [],
            endpoint: '/ecore/api/v2/endless-core/contacts/',
            name: 'Contact',
            url: '/contacts/',
            __str__: 'Contact'
          }
        ];
        let url = ['contacts'];
        comp.pages = [];
        comp.modulesList = [];
        spyOn(comp, 'filterNavigation').and.returnValue(pagesList);
        spyOn(comp, 'getPageData');
        comp.getUserModules(url);
        expect(comp.filterNavigation)
          .toHaveBeenCalledWith(comp.pages, comp.userModules, comp.modulesList);
        expect(comp.getPageData).toHaveBeenCalledWith(url);
        expect(comp.userModules).toEqual(modulesList);
        expect(comp.pagesList).toEqual(pagesList);
    })));
  });

  describe('getPages method', () => {
    it('should update pages property',
      async(inject([NavigationService], (navigationService: NavigationService) => {
        pages = [];
        let pagesList = [
          {
            childrens: [],
            endpoint: '/ecore/api/v2/endless-core/contacts/',
            name: 'Contact',
            url: '/contacts/',
            __str__: 'Contact'
          }
        ];
        let url = ['contacts'];
        comp.userModules = [];
        comp.modulesList = [];
        spyOn(comp, 'filterNavigation').and.returnValue(pagesList);
        spyOn(comp, 'getPageData');
        comp.getPages(url);
        expect(comp.filterNavigation)
          .toHaveBeenCalledWith(comp.pages, comp.userModules, comp.modulesList);
        expect(comp.getPageData).toHaveBeenCalledWith(url);
        expect(comp.pages).toEqual(modulesList);
        expect(comp.pagesList).toEqual(pagesList);
    })));
  });

  describe('formEvent method', () => {
    it('should redirect to list page', async(inject([Router], (router: Router) => {
      let event = {
        type: 'sendForm',
        status: 'success'
      };
      comp.pageData = {
        endpoint: '/ecore/api/v2/contacts/',
        pathData: {
          type: 'form',
          path: '/contact/',
          id: '123'
        }
      };
      spyOn(router, 'navigate');
      comp.formEvent(event);
      expect(router.navigate).toHaveBeenCalledWith([comp.pageData.pathData.path]);
    })));
  });

  describe('deleteElement method', () => {
    it('should delete widget of form', async(inject([Router], (router: Router) => {
      spyOn(router, 'navigate');
      let element = {
        endpoint: 'some endpoint',
        pathData: {
          path: 'some path',
          id: '123'
        }
      };
      comp.deleteElement(element);
      expect(router.navigate).toHaveBeenCalledWith([element.pathData.path]);
    })));
  });

  describe('filterNavigation method', () => {
    it('should call removePages method and return filtered methods', () => {
      comp.userModules = [
        {
          id: '668d308f-ee32-4bdb-ae44-57b5c83431bf',
          company_contact: {
            id: '67fa53b9-b6a1-4c77-aa98-e32613aafc09',
            name: 'Director Mr. Tom Smith'
          },
          dashboard_module: {
            id: '54f6bc1e-aec1-49f2-9f4e-8791326a2750',
            name: 'Candidate Contact'
          },
          position: 1,
          ui_config: {
            display_on_navbar: true
          },
          __str__: 'Director Mr. Tom Smith: Candidate Contact'
        }
      ];
      comp.modulesList = [
        {
          id: '54f6bc1e-aec1-49f2-9f4e-8791326a2750',
          content_type: {
            id: 114,
            name: 'Candidate Contact'
          },
          module_data: {
            app: 'endless_candidate',
            model: 'candidatecontact',
            plural_name: 'Candidate Contacts'
          },
          is_active: true,
          __str__: 'Candidate Contact'
        },
      ];
      comp.pages = [
        {
          childrens: [],
          endpoint: '/ecore/api/v2/endless-candidate/candidatecontacts/',
          name: 'Candidate Contact',
          url: '/candidatecontacts/',
          __str__: 'Candidate Contact'
        }
      ];
      spyOn(comp, 'removePages').and.returnValue(comp.pages);
      let result = comp.filterNavigation(comp.pages, comp.userModules, comp.modulesList);
      expect(result).toEqual(comp.pages);
    });
  });

  describe('removePages method', () => {
    it('should remove pages', () => {
      let endpoints = ['first', 'second', 'third'];
      let pagesList = [
        {
          endpoint: 'four',
          childrens: [
            {
              endpoint: 'first',
              childrens: []
            }
          ]
        },
        {
          endpoint: 'five',
          childrens: [
            {
              endpoint: 'six',
              childrens: [
                {
                  endpoint: 'seven',
                  childrens: []
                }
              ]
            }
          ]
        },
        {
          endpoint: 'second',
          childrens: [
            {
              endpoint: 'third',
              childrens: []
            }
          ]
        }
      ];
      let result = comp.removePages(pagesList, endpoints);
      expect(result).toEqual([
        {
          endpoint: 'four',
          childrens: []
        },
        {
          endpoint: 'five',
          childrens: [
            {
              endpoint: 'six',
              childrens: [
                {
                  endpoint: 'seven',
                  childrens: []
                }
              ]
            }
          ]
        }
      ]);
    });
  });

  describe('updateNavigation method', () => {
    it('should update navigation', () => {
      let event = {
        changed: true
      };
      spyOn(comp, 'getPageNavigation');
      comp.updateNavigation(event);
      expect(comp.pages).toBeNull();
      expect(comp.userModules).toBeNull();
      expect(comp.modulesList).toBeNull();
      expect(comp.getPageNavigation).toHaveBeenCalledWith([]);
    });
  });

});
