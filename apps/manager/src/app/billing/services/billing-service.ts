import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError } from 'rxjs/operators';

import { ErrorsService } from '../../shared/services/errors.service';
import { Plan } from '../models';

@Injectable()
export class BillingService {

  private endpoints = {
    cardInfo: '/billing/stripe_customer/',
    plan: '/billing/subscription/create/',
    subscriptionInfo: '/billing/subscription/list/',
    subscriptionStatus: '/billing/subscription/status/',
    cancelSubscription: '/billing/subscription/cancel/',
    subscriptionTypes: '/billing/subscription_type/',
    checkPaymentInformation: '/billing/check_payment_information/',
    payments: '/billing/payments/',
    autoCharge: '/billing/auto_charge_twilio/',
    fund: '/billing/add_funds_twilio/',
    countryAccount: '/billing/country_account/',
  };

  constructor(
    private http: HttpClient,
    private errorService: ErrorsService,
  ) {}

  public getStripeKey() {
    return this.http
      .get(this.endpoints.countryAccount)
      .pipe(
        catchError((err: any) => this.errorService.parseErrors(err))
      );
  }

  public setCardInfo(body) {
    return this.http
      .post(this.endpoints.cardInfo, body)
      .pipe(
        catchError((err: any) => this.errorService.parseErrors(err))
      );
  }

  public changeCard(body) {
    return this.http
      .put(this.endpoints.cardInfo, body)
      .pipe(
        catchError((err: any) => this.errorService.parseErrors(err))
      );
  }

  public getSubscriptionInfo() {
    return this.http
      .get(this.endpoints.subscriptionInfo)
      .pipe(
        catchError((err: any) => this.errorService.parseErrors(err))
      );
  }

  public getSubscriptionStatus() {
    return this.http
      .get(this.endpoints.subscriptionStatus)
      .pipe(
        catchError((err: any) => this.errorService.parseErrors(err))
      );
  }

  public setPlan(body: Plan) {
    return this.http
      .post(this.endpoints.plan, body)
      .pipe(
        catchError((err: any) => this.errorService.parseErrors(err))
      );
  }

  public checkPaymentInformation() {
    return this.http
      .get(this.endpoints.checkPaymentInformation)
      .pipe(
        catchError((err: any) => this.errorService.parseErrors(err))
      );
  }

  public cancelSubscription() {
    return this.http
      .get(this.endpoints.cancelSubscription)
      .pipe(
        catchError((err: any) => this.errorService.parseErrors(err, true))
      );
  }

  public payments() {
    return this.http
      .get(this.endpoints.payments)
      .pipe(
        catchError((err: any) => this.errorService.parseErrors(err))
      );
  }

  public getCreditDetails() {
    return this.http
      .get(this.endpoints.autoCharge)
      .pipe(
        catchError((err: any) => this.errorService.parseErrors(err))
      );
  }

  public setCreditDetails(body) {
    return this.http
      .post(this.endpoints.autoCharge, body)
      .pipe(
        catchError((err: any) => this.errorService.parseErrors(err))
      );
  }

  public addFunds(body) {
    return this.http
      .post(this.endpoints.fund, body)
      .pipe(
        catchError((err: any) => this.errorService.parseErrors(err))
      );
  }

  public getSubscriptionTypes() {
    return this.http
      .get(this.endpoints.subscriptionTypes)
      .pipe(
        catchError((err: any) => this.errorService.parseErrors(err))
       );
  }
}
