import { async, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { LocalStorageService } from 'ng2-webstorage';
import { CookieService } from 'angular2-cookie/core';
import { GenericFormService } from '../dynamic-form/services/generic-form.service';

import { Observable } from 'rxjs/Observable';

import { UserService } from './user.service';

describe('UserService', () => {

  let response;
  let mockRouter = {
    navigate() {
      return true;
    }
  };
  let mockGenericFormService = {
    getAll() {
      return true;
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        LocalStorageService,
        CookieService,
        { provide: GenericFormService, useValue: mockGenericFormService },
        { provide: Router, useValue: mockRouter }
      ],
      imports: []
    });
  });

  it('should be defined', async(inject([UserService], (service) => {
    expect(service).toBeDefined();
  })));

});
