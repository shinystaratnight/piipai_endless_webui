import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '@webui/core';

@Injectable()
export class NotAuthorizedGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  public canActivate(): boolean {
    const isAuthorized = this.authService.isAuthorized;

    if (!isAuthorized) {
      return true;
    }

    this.router.navigate(['']);
    return false;
  }
}
