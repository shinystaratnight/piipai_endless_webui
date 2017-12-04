import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { ErrorsService } from './errors.service';
import { CookieService } from 'angular2-cookie/core';

@Injectable()
export class CheckPermissionService {

  constructor(
    private http: Http,
    private error: ErrorsService,
    private cookie: CookieService
  ) { }

  public viewCheck(endpoint, id) {
    if (id) {
      endpoint += `${id}/`;
    }
    let headers = new Headers();
    this.updateHeaders(headers);
    return this.http.get(endpoint, { headers })
      .map((res: Response) => res.json())
      .catch((err: Response) => this.error.parseErrors(err, true));
  }

  public createCheck(endpoint) {
    let headers = new Headers();
    this.updateHeaders(headers);
    return this.http.post(endpoint, {}, { headers })
      .map((res: Response) => res.json())
      .catch((err: Response) => this.error.parseErrors(err, true));
  }

  public updateCheck(endpoint, id) {
    if (id) {
      endpoint += `${id}/`;
    }
    let headers = new Headers();
    this.updateHeaders(headers);
    return this.http.put(endpoint, {}, { headers })
      .map((res: Response) => res.json())
      .catch((err: Response) => this.error.parseErrors(err, true));
  }

  public deleteCheck(endpoint, id) {
    if (id) {
      endpoint += `${id}/`;
    }
    let headers = new Headers();
    this.updateHeaders(headers);
    return this.http.delete(endpoint, { headers })
      .map((res: Response) => res.json())
      .catch((err: Response) => this.error.parseErrors(err, true));
  }

  public updateHeaders(headers) {
    headers.append('X-CSRFToken', this.cookie.get('csrftoken'));
  }

}
