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

});
