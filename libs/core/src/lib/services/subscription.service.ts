import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Billing } from '@webui/data';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorsService } from './errors.service';

type Payload = {
  subscriptions: Array<Billing.Subscription>
};

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private _endpoint = '/billing/subscription/list/';
  private _subscription: BehaviorSubject<Billing.Subscription | null> = new BehaviorSubject(null);

  public get activePlan$(): Observable<Billing.Subscription | null> {
    return this._subscription.asObservable();
  }

  constructor(
    private http: HttpClient,
    private errorService: ErrorsService,
  ) {}

  public update() {
    this.getActiveSubscription()
      .subscribe((subscription) => {
        this._subscription.next(subscription);
      })
  }

  public useTrialPermissions(): void {
    this._subscription.next({} as Billing.Subscription);
  }

  public useClientPermissions(): void {
    this._subscription.next({} as Billing.Subscription);
  }

  private getActiveSubscription(): Observable<Billing.Subscription | null> {
    return this.http
      .get<Payload>(this._endpoint)
      .pipe(
        map((payload) => {
          const subscription: Billing.Subscription = payload.subscriptions.find((el) => el.active);

          if (!!subscription) {
            return subscription;
          }

          return null;
        }),
        catchError((err: any) => {
          this.errorService.handleError(err);

          return of(null);
        })
      );
  }
}
