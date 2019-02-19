import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError } from 'rxjs/operators';

import { ErrorsService } from '../../shared/services/errors.service';
import { Plan } from '../models';

@Injectable()
export class BillingService {

  private cardInfoEndpoint = '/billing/stripe_customer/';
  private subscriptionInfoEndpoint = '/billing/subscription/list/';
  private subscriptionStatusEndpoint = '/billing/subscription/status/';
  private planEndpoint = '/billing/subscription/create/';
  private checkPaymentInformationEndpoint = '/billing/check_payment_information/';
  private cancelSubscriptionEndpoint = '/billing/subscription/cancel/';
  private paymentsEndpoint = '/billing/payments/';
  private autoChargeEndpoint = '/billing/auto_charge_twilio/';
  private fundEndpoint = '/billing/add_funds_twilio/';

  constructor(
    private http: HttpClient,
    private errorService: ErrorsService,
  ) {}

  public setCardInfo(body) {
    return this.http
      .post(this.cardInfoEndpoint, body)
      .pipe(
        catchError((err: any) => this.errorService.parseErrors(err))
      );
  }

  public getSubscriptionInfo() {
    return this.http
      .get(this.subscriptionInfoEndpoint)
      .pipe(
        catchError((err: any) => this.errorService.parseErrors(err))
      );
  }

  public getSubscriptionStatus() {
    return this.http
      .get(this.subscriptionStatusEndpoint)
      .pipe(
        catchError((err: any) => this.errorService.parseErrors(err))
      );
  }

  public setPlan(body: Plan) {
    return this.http
      .post(this.planEndpoint, body)
      .pipe(
        catchError((err: any) => this.errorService.parseErrors(err))
      );
  }

  public checkPaymentInformation() {
    return this.http
      .get(this.checkPaymentInformationEndpoint)
      .pipe(
        catchError((err: any) => this.errorService.parseErrors(err))
      );
  }

  public cancelSubscription() {
    return this.http
      .get(this.cancelSubscriptionEndpoint)
      .pipe(
        catchError((err: any) => this.errorService.parseErrors(err, true))
      );
  }

  public payments() {
    return this.http
      .get(this.paymentsEndpoint)
      .pipe(
        catchError((err: any) => this.errorService.parseErrors(err))
      );
  }

  public getCreditDetails() {
    return this.http
      .get(this.autoChargeEndpoint)
      .pipe(
        catchError((err: any) => this.errorService.parseErrors(err))
      );
  }

  public setCreditDetails(body) {
    return this.http
      .post(this.autoChargeEndpoint, body)
      .pipe(
        catchError((err: any) => this.errorService.parseErrors(err))
      );
  }

  public addFunds(body) {
    return this.http
      .post(this.fundEndpoint, body)
      .pipe(
        catchError((err: any) => this.errorService.parseErrors(err))
      );
  }
}
