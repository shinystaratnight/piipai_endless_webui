import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '@webui/core';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  public canActivate() {
    const isAuthorized = this.authService.isAuthorized;

    if (isAuthorized) {
      return isAuthorized;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
