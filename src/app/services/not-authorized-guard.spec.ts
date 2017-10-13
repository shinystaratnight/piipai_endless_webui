import { async, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { UserService } from './user.service';
import { Observable } from 'rxjs/Observable';

import { NotAuthorizedGuard } from './not-authorized-guard';

describe('NotAuthorizedGuard', () => {

  let response;
  let mockRouter = {
    navigate() {
      return true;
    }
  };

  let mockUserService = {
    getUserData() {
      if (response.status === 'success') {
        return Observable.of(response);
      } else {
        return Observable.throw(response);
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotAuthorizedGuard,
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: mockUserService }
      ],
      imports: []
    });
  });

  it('should be defined', async(inject([NotAuthorizedGuard], (service) => {
    expect(service).toBeDefined();
  })));

  describe('canActivate method', () => {
    it('should return observable of true',
      async(inject([NotAuthorizedGuard, Router],
        (notAuthorizedGuard: NotAuthorizedGuard, router: Router) => {
          response = {
            status: 'success'
          };
          spyOn(router, 'navigate');
          notAuthorizedGuard.canActivate().subscribe((res: boolean) => {
            expect(res).toBeFalsy();
            expect(router.navigate).toHaveBeenCalledWith(['/']);
          });
    })));

    it('should return observable of false',
      async(inject([NotAuthorizedGuard, Router], (notAuthorizedGuard: NotAuthorizedGuard) => {
        response = {
          status: 'error'
        };
        notAuthorizedGuard.canActivate().subscribe((res: boolean) => {
          expect(res).toBeTruthy();
        });
    })));
  });

});
