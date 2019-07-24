import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { AuthService } from '@webui/core';

@Injectable()
export class LogoutGuard implements CanActivate {

  constructor(
    private authService: AuthService
  ) {}

  public canActivate(): boolean {
    this.authService.logoutWithoutRedirect();

    return true;
  }
}
