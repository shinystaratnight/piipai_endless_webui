import { async, inject, TestBed } from '@angular/core/testing';

import { GenericFormService } from '../dynamic-form/services/generic-form.service';
import { NavigationService, Page } from './navigation.service';

import { Observable } from 'rxjs/Observable';

describe('NaviagationService', () => {

  let response;
  let mockGenericFormService = {
    getAll() {
      return Observable.of(response);
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NavigationService,
        { provide: GenericFormService, useValue: mockGenericFormService }
      ],
      imports: []
    });
  });

  it('should be defined', async(inject([NavigationService], (service) => {
    expect(service).toBeDefined();
  })));

  describe('getPages method', () => {
    it('should return observable of navigation list',
      async(inject([NavigationService], (service: NavigationService) => {
        let results;
        service.navigationList = <Page[]> [];
        service.navigationList.push({
          name: 'Contact',
          url: '/contact/',
          endpoint: '/ecore/api/v2/contacts',
          __str__: 'Contact',
          childrens: []
        });
        service.getPages().subscribe(
          (list: Page[]) => results = list
        );
        expect(results).toEqual(service.navigationList);
    })));

    it('should return observible of response',
      async(inject([NavigationService], (service: NavigationService) => {
        let results;
        response = {
          status: 'success',
          results: [
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
          ]
        };
        service.getPages().subscribe(
          (list: Page[]) => results = list
        );
        expect(results).toEqual(response.results);
        expect(service.navigationList).toEqual(response.results);
    })));
  });

});
