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
    it('should return observible of response',
      async(inject([NavigationService], (service: NavigationService) => {
        let results;
        response = {
          status: 'success',
          results: [
            {
              name: 'Contact',
              url: '/contact/',
              endpoint: '/contacts',
              __str__: 'Contact',
              childrens: []
            },
            {
              name: 'Login',
              url: '/login/',
              endpoint: '/login',
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

  describe('getUserModules method', () => {
    it('should return observible of response',
      async(inject([NavigationService], (service: NavigationService) => {
        let results;
        response = {
          status: 'success',
          results: [
            {
              id: '69cbd45b-6a32-49c3-b139-460019d10917',
              company_contact: {
                id: '67fa53b9-b6a1-4c77-aa98-e32613aafc09',
                name: 'Director Mr. Tom Smith'
              },
              dashboard_module: {
                id: '23f8b02c-7f78-4a47-8921-c3b784fc7e92',
                name: 'City'
              },
              position: 3,
              ui_config: {},
              __str__: 'Director Mr. Tom Smith: City'
            }
          ]
        };
        service.getUserModules().subscribe(
          (userModels: any) => results = userModels
        );
        expect(results).toEqual(response.results);
        expect(service.userModels).toEqual(response.results);
    })));
  });

  describe('getModules method', () => {
    it('should return observible of response',
      async(inject([NavigationService], (service: NavigationService) => {
        let results;
        response = {
          status: 'success',
          results: [
            {
              id: '23f8b02c-7f78-4a47-8921-c3b784fc7e92',
              content_type: {
                id: 24,
                name: 'City'
              },
              module_data: {
                app: 'endless_core',
                model: 'city'
              },
              is_active: true,
              __str__: 'City'
            }
          ]
        };
        service.getModules().subscribe(
          (models: any) => results = models
        );
        expect(results).toEqual(response.results);
        expect(service.models).toEqual(response.results);
    })));
  });

});
