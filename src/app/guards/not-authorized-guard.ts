import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UserService } from '../services';
import { of, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class NotAuthorizedGuard implements CanActivate {

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  public canActivate(): Observable<boolean> {
    return this.userService
      .getUserData()
      .pipe(
        map(() => {
          this.router.navigate(['']);
          return false;
        }),
        catchError(() => {
          return of(true);
        })
      );
  }
}
