import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class GeoService {

  constructor(
    private http: Http
  ) {}

  public getRegions(endpoint, id) {
    return this.http.get(`${endpoint}${id}/regions`)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  public getCities(endpoint, id) {
    return this.http.get(`${endpoint}${id}/cities`)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

}
