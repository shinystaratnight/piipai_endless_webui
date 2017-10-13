import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UserService } from './user.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NotAuthorizedGuard implements CanActivate {

  constructor(
    private router: Router,
    private UserService: UserService
  ) {}

  public canActivate(): Observable<boolean> {
    return this.UserService.getUserData()
      .map((user: any) => {
        this.router.navigate(['/']);
        return false;
      })
      .catch((err: any) => {
        return Observable.of(true);
      });
  }
}
