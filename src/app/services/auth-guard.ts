import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { LocalStorageService } from 'ng2-webstorage';
import { CookieService } from 'angular2-cookie/core';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private storage: LocalStorageService,
    private cookie: CookieService,
    private router: Router
  ) {}

  public canActivate(): boolean {
    return this.isLoggedIn();
  }

  public isLoggedIn() {
    let storageData = this.storage.retrieve('contact');
    let sessionID = this.cookie.get('sessionid');
    if (storageData && sessionID) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
