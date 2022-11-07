import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BillingSubscription } from '@webui/models';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorsService } from './errors.service';

type Payload = {
  subscriptions: Array<BillingSubscription>
};

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private _endpoint = '/billing/subscription/list/';
  private _subscription: BehaviorSubject<BillingSubscription | null> = new BehaviorSubject<BillingSubscription | null>(null);

  public get activePlan$(): Observable<BillingSubscription | null> {
    return this._subscription.asObservable();
  }

  constructor(
    private http: HttpClient,
    private errorService: ErrorsService,
  ) {}

  public update() {
    if (this._subscription.value) {
      return;
    }

    this.getActiveSubscription()
      .subscribe((subscription) => {
        this._subscription.next(subscription);
      })
  }

  public useTrialPermissions(): void {
    this._subscription.next({} as BillingSubscription);
  }

  public useClientPermissions(): void {
    this._subscription.next({} as BillingSubscription);
  }

  public clean() {
    this._subscription.next(null);
  }

  private getActiveSubscription(): Observable<BillingSubscription | null> {
    return this.http
      .get<Payload>(this._endpoint)
      .pipe(
        map((payload) => {
          const subscription: BillingSubscription | undefined = payload.subscriptions.find((el) => el.active);

          if (subscription) {
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
