import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class GeoService {

  public countriesUrl: string;
  public regionsUrl: string;
  public citiesUrl: string;

  constructor(
    private http: Http
  ) {
    this.countriesUrl = '/ecore/api/v2/endless_core/countries';
    this.regionsUrl = '/ecore/api/v2/endless_core/regions';
    this.citiesUrl = '/ecore/api/v2/endless_core/cities';
   }

  public getCountries() {
    return this.http.get(this.countriesUrl)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  public getRegions() {
    return this.http.get(this.regionsUrl)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  public getCities() {
    return this.http.get(this.citiesUrl)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

}
