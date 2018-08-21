import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UserService } from '../services';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SubdomainGuard implements CanActivate {

  constructor(
    private router: Router,
    private UserService: UserService
  ) {}

  public canActivate(): Observable<boolean> {
    const subdomen = location.host.split('.').length > 2;

    if (subdomen) {
      return Observable.of(true);
    } else {
      this.router.navigate(['']);
    }
  }
}
