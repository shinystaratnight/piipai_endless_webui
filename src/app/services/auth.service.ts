import { Injectable } from '@angular/core';

import { LocalStorageService } from 'ngx-webstorage';

@Injectable()
export class AuthService {

  constructor(
    private storage: LocalStorageService
  ) {}

  get isAuthorized() {
    return !!this.storage.retrieve('user');
  }
}
