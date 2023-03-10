import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Observable, of } from 'rxjs';

@Injectable()
export class SubdomainGuard implements CanActivate {

  constructor(
    private router: Router
  ) {}

  public canActivate(): Observable<boolean> {
    const subdomen = location.host.split('.').length > 2;

    if (subdomen) {
      return of(true);
    } else {
      this.router.navigate(['']);
      return of (false);
    }
  }
}
