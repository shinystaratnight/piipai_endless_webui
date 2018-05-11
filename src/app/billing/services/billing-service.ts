import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { CookieService } from 'angular2-cookie/core';

import { Observable } from 'rxjs/Observable';

import { Plan } from '../models';

@Injectable()
export class BillingService {

  private cardInfoEndpoint = '/ecore/billing/stripe_customer/';
  private subscriptionInfoEndpoint = '/ecore/billing/subscription/list/';
  private subscriptionStatusEndpoint = '/ecore/billing/subscription/status/';
  private planEndpoint = '/ecore/billing/subscription/create/';

  constructor(
    private http: Http,
    private cookie: CookieService
  ) {}

  public setCardInfo(body) {
    const headers = this.updateHeaders();
    return this.http.post(this.cardInfoEndpoint, body, {headers})
      .map((res: any) => res.json && res.json());
  }

  public getSubscriptionInfo() {
    const headers = this.updateHeaders();
    return this.http.get(this.subscriptionInfoEndpoint, {headers})
      .map((res: any) => res.json && res.json());
  }

  public getSubscriptionStatus() {
    const headers = this.updateHeaders();
    return this.http.get(this.subscriptionStatusEndpoint, {headers})
      .map((res: any) => res.json && res.json());
  }

  public setPlan(body: Plan) {
    const headers = this.updateHeaders();
    return this.http.post(this.planEndpoint, body, {headers})
      .map((res: any) => res.json && res.json());
  }

  public updateHeaders() {
    let headers = new Headers();
    headers.append('X-CSRFToken', this.cookie.get('csrftoken'));
    return headers;
  }

  public errorHandler(error) {
    return Observable.throw(error.json && error.json() || 'Server error.');
  }
}
