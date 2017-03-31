import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ContactRegistrationService {

  public companyContactUrl: string;
  public tagsUrl: string;

  constructor(private http: Http) {
    this.companyContactUrl = `/ecore/api/v2/endless_core/company_contacts/`;
    this.tagsUrl = `/ecore/api/v2/endless_core/tags/`;
  }

  public getMetaData() {
    return this.http.get(`${this.companyContactUrl}metadata/?type=change`)
      .map((res: any) => res.json())
      .catch((error) => Observable.throw(error.json() || 'Server error'));
  }

  public getTags() {
    return this.http.get(`${this.tagsUrl}`)
      .map((res: any) => res.json())
      .catch((error) => Observable.throw(error.json() || 'Server error'));
  }

}
