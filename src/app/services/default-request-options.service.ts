import { Injectable } from '@angular/core';
import { Http, BaseRequestOptions, Headers } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';

@Injectable()
export class DefaultRequestOptions extends BaseRequestOptions {
  public headers;

  constructor(private cookie: CookieService) {
    super();

    if (this.cookie.get('csrftoken')) {
      this.headers = new Headers({
        'X-CSRFToken': this.cookie.get('csrftoken')
      });
    }
  }
}
