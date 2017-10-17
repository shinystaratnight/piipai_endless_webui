import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UserService } from './user.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private userServise: UserService
  ) {}

  public canActivate(): Observable<boolean> {
    return this.userServise.getUserData()
      .map((user: any) => true)
      .catch((err: any) => {
        this.router.navigate(['/home']);
        return Observable.of(false);
      });
  }
}
