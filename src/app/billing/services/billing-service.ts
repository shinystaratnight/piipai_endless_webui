import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { CookieService } from 'ngx-cookie';

import { map, catchError } from 'rxjs/operators';

import { ErrorsService } from '../../shared/services/errors.service';
import { Plan } from '../models';

@Injectable()
export class BillingService {

  private cardInfoEndpoint = '/ecore/api/v2/billing/stripe_customer/';
  private subscriptionInfoEndpoint = '/ecore/api/v2/billing/subscription/list/';
  private subscriptionStatusEndpoint = '/ecore/api/v2/billing/subscription/status/';
  private planEndpoint = '/ecore/api/v2/billing/subscription/create/';
  private checkPaymentInformationEndpoint = '/ecore/api/v2/billing/check_payment_information/'; //tslint:disable-line
  private cancelSubscriptionEndpoint = '/ecore/api/v2/billing/subscription/cancel/';
  private paymentsEndpoint = '/ecore/api/v2/billing/payments/';

  constructor(
    private http: Http,
    private cookie: CookieService,
    private errorService: ErrorsService,
  ) {}

  public setCardInfo(body) {
    const headers = this.updateHeaders();
    return this.http
      .post(this.cardInfoEndpoint, body, {headers})
      .pipe(
        map((res: any) => res.json && res.json()),
        catchError((err: any) => this.errorService.parseErrors(err))
      );
  }

  public getSubscriptionInfo() {
    const headers = this.updateHeaders();
    return this.http
      .get(this.subscriptionInfoEndpoint, {headers})
      .pipe(
        map((res: any) => res.json && res.json()),
        catchError((err: any) => this.errorService.parseErrors(err))
      );
  }

  public getSubscriptionStatus() {
    const headers = this.updateHeaders();
    return this.http
      .get(this.subscriptionStatusEndpoint, {headers})
      .pipe(
        map((res: any) => res.json && res.json()),
        catchError((err: any) => this.errorService.parseErrors(err))
      );
  }

  public setPlan(body: Plan) {
    const headers = this.updateHeaders();
    return this.http
      .post(this.planEndpoint, body, {headers})
      .pipe(
        map((res: any) => res.json && res.json()),
        catchError((err: any) => this.errorService.parseErrors(err))
      );
  }

  public checkPaymentInformation() {
    const headers = this.updateHeaders();
    return this.http
      .get(this.checkPaymentInformationEndpoint, {headers})
      .pipe(
        map((res: any) => res.json && res.json()),
        catchError((err: any) => this.errorService.parseErrors(err))
      );
  }

  public cancelSubscription() {
    const headers = this.updateHeaders();
    return this.http
      .get(this.cancelSubscriptionEndpoint, {headers})
      .pipe(
        map((res: any) => res.json && res.json()),
        catchError((err: any) => this.errorService.parseErrors(err, true))
      );
  }

  public payments() {
    const headers = this.updateHeaders();
    return this.http
      .get(this.paymentsEndpoint, {headers})
      .pipe(
        map((res: any) => res.json && res.json()),
        catchError((err: any) => this.errorService.parseErrors(err))
      );
  }

  public updateHeaders() {
    const headers = new Headers();
    headers.append('X-CSRFToken', this.cookie.get('csrftoken'));
    return headers;
  }
}
