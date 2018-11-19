import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { map, catchError } from 'rxjs/operators';

import { CookieService } from 'ngx-cookie';

import { ErrorsService } from '../../shared/services/errors.service';

export interface Marker {
  latitude: number;
  longitude: number;
  contact: {
    phone_mobile: string;
    name: string;
  };
  name: string;
  type: string;
}

@Injectable()
export class MapService {

  public endpoint = '/hr/jobsites/jobsite_map/';

  constructor(
    private http: Http,
    private cookie: CookieService,
    private errors: ErrorsService
  ) {}

  public getPositions(query: string = '') {
    const headers = new Headers();
    this.updateHeaders(headers);

    return this.http
      .get(this.endpoint + query, { headers })
      .pipe(
        map((response: any) => response.json()),
        catchError((error: any) => this.errors.parseErrors(error))
      );
  }

  public updateHeaders(headers) {
    headers.append('X-CSRFToken', this.cookie.get('csrftoken'));
  }
}
