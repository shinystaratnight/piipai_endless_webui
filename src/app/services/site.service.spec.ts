import { async, inject, TestBed } from '@angular/core/testing';

import { NavigationService, Page } from './navigation.service';

import { Observable } from 'rxjs/Observable';

import { SiteService, PageData } from './site.service';

describe('UserService', () => {

  let response;

  let mockNavigationService = {
    getPages() {
      return Observable.of(response);
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SiteService,
        { provide: NavigationService, useValue: mockNavigationService }
      ],
      imports: []
    });
  });

  it('should be defined', async(inject([SiteService], (service) => {
    expect(service).toBeDefined();
  })));

  describe('getDataOfPage method', () => {
    it('should create new request',
      async(inject([SiteService, NavigationService],
        (siteService: SiteService, navigationService: NavigationService) => {
          response = [
            {
              name: 'Contact',
              url: '/contact/',
              endpoint: '/ecore/api/v2/contacts',
              __str__: 'Contact',
              childrens: []
            }
          ];
          siteService.list = null;
          spyOn(siteService, 'generateData').and.returnValue(response);
          let result = siteService.getDataOfPage('some url');
          result.subscribe((list) => {
            expect(siteService.list).toEqual(response);
            expect(list).toEqual(response);
          });
    })));

    it('should return exist data',
      async(inject([SiteService, NavigationService],
        (siteService: SiteService, navigationService: NavigationService) => {
          response = [
            {
              name: 'Contact',
              url: '/contact/',
              endpoint: '/ecore/api/v2/contacts',
              __str__: 'Contact',
              childrens: []
            }
          ];
          siteService.list = response;
          spyOn(siteService, 'generateData').and.returnValue(response);
          let result = siteService.getDataOfPage('some url');
          result.subscribe((list) => {
            expect(list).toEqual(response);
          });
    })));
  });

  describe('generateData method', () => {
    it('should generate data of page', async(inject([SiteService], (siteService: SiteService) => {
      let list = [
        {
          name: 'Contact',
          url: '/contact/',
          endpoint: '/ecore/api/v2/contacts',
          __str__: 'Contact',
          childrens: []
        }
      ];
      let url = ['contact'];
      let pathData = {
        type: 'list',
        path: list[0].url
      };
      spyOn(siteService, 'getTypeOfPage').and.returnValue(pathData);
      spyOn(siteService, 'getElementFromList').and.returnValue(list[0]);
      let result = siteService.generateData(list, url);
      expect(siteService.getTypeOfPage).toHaveBeenCalledWith(url);
      expect(siteService.getElementFromList).toHaveBeenCalledWith(list, list[0].url);
      expect(result).toEqual({
        endpoint: list[0].endpoint,
        pathData
      });
    })));
  });

  describe('generatePath method', () => {
    it('should generate path of url', async(inject([SiteService], (siteService: SiteService) => {
      let url = ['contact'];
      let result = siteService.generatePath(url);
      expect(result).toEqual('/contact/');
    })));
  });

  describe('getTypeOfPage method', () => {
    it('should return form type of page',
      async(inject([SiteService], (siteService: SiteService) => {
        let url = [
          {
            path: 'contact'
          },
          {
            path: 'add'
          }
        ];
        spyOn(siteService, 'generatePath').and.returnValue('/contact/');
        let result = siteService.getTypeOfPage(url);
        expect(result).toEqual({
          type: 'form',
          path: '/contact/'
        });
    })));

    it('should return form type of page for edit',
      async(inject([SiteService], (siteService: SiteService) => {
        let url = [
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
        spyOn(siteService, 'generatePath').and.returnValue('/contact/');
        let result = siteService.getTypeOfPage(url);
        expect(result).toEqual({
          type: 'form',
          path: '/contact/',
          id: '123'
        });
    })));

    it('should return profile type of page',
      async(inject([SiteService], (siteService: SiteService) => {
        let url = [
          {
            path: 'profile'
          }
        ];
        spyOn(siteService, 'generatePath').and.returnValue('/profile/');
        let result = siteService.getTypeOfPage(url);
        expect(result).toEqual({
          type: 'profile',
          path: '/profile/'
        });
    })));

    it('should return list type of page',
      async(inject([SiteService], (siteService: SiteService) => {
        let url = [
          {
            path: 'contact'
          }
        ];
        spyOn(siteService, 'generatePath').and.returnValue('/contact/');
        let result = siteService.getTypeOfPage(url);
        expect(result).toEqual({
          type: 'list',
          path: '/contact/'
        });
    })));
  });

  describe('getElementFromList method', () => {
    it('should return some element from list of pages',
      async(inject([SiteService], (siteService: SiteService) => {
      let list = [
        {
          name: 'Contact',
          url: '/contact/',
          endpoint: '/ecore/api/v2/contacts',
          __str__: 'Contact',
          childrens: [
            {
              name: 'Candidate Contact',
              url: '/contact/candidate/',
              endpoint: '/ecore/api/v2/candidatecontact',
              __str__: 'Candidate Contact',
              childrens: []
            }
          ]
        }
      ];
      let path = list[0].childrens[0].url;
      let result = siteService.getElementFromList(list, path);
      expect(result).toEqual(list[0].childrens[0]);
    })));
  });

});
