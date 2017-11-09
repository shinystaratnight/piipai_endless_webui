import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ContactRegistrationService {

  public contactUrl: string;
  public companyUrl: string;
  public companyLocUrl: string;
  public companyAddress: string;

  constructor(private http: Http) {
    this.contactUrl = `/ecore/api/v2/core/contacts/`;
    this.companyUrl = `/ecore/api/v2/core/companies/`;
    this.companyLocUrl = `/ecore/api/v2/core/companylocalizations/`;
    this.companyAddress = `/ecore/api/v2/core/companyaddresses/`;
  }

  public getCompaniesOfCountry(code2) {
    return this.http.get(`${this.companyUrl}?country=${code2}&limit=-1&fields=name`)
      .map((res: any) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  public getCompany(name, businessId) {
    return this.http.get(`${this.companyUrl}?name=${name}&business_id=${businessId}`)
      .map((res: any) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  public getCompanyLocalization(code2) {
    return this.http.get(`${this.companyLocUrl}?country=${code2}`)
      .map((res: any) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  public getAddressOfCompany(id) {
    return this.http.get(`${this.companyAddress}?company=${id}`)
      .map((res: any) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  public fieldValidation(field, value) {
    if (field === 'phone_mobile') {
      field = 'phone';
    }
    return this.http.get(`${this.contactUrl}validate/?${field}=${value}`)
      .map((res: any) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

}
