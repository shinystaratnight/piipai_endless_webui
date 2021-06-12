import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  UserService,
  DateRangeService,
  DateRange,
  dateRangeLabel,
  Label,
  SiteSettingsService
} from '@webui/core';
import { checkAndReturnTranslation } from '@webui/utilities';
import { LocalStorageService } from 'ngx-webstorage';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { debounceTime, switchMap, tap, map } from 'rxjs/operators';
import { WidgetService } from '../../services';

type DateParams = {
  started_at_0: string;
  started_at_1: string;
};

@Component({
  selector: 'app-counter-widget',
  templateUrl: './counter-widget.component.html',
  styleUrls: ['./counter-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterWidgetComponent implements OnInit, OnDestroy {
  data$: Observable<any>;
  dateParams$: BehaviorSubject<DateParams> = new BehaviorSubject(
    {} as DateParams
  );
  dateRangeTypeControl: FormControl = new FormControl(DateRange.ThisMonth);
  dateRange = DateRange;
  dateRangeList = [
    DateRange.ThisMonth,
    DateRange.ThisWeek,
    DateRange.ThisYear,
    DateRange.Today,
    DateRange.Custom
  ];
  widgetLabel: Label = {
    key: 'counter',
    value: 'Counter'
  };
  get loading$() {
    return this.loading.asObservable();
  }

  private loading: BehaviorSubject<boolean> = new BehaviorSubject(true);
  private controlSubscription: Subscription;

  constructor(
    private widgetService: WidgetService,
    private userService: UserService,
    private dateRangeService: DateRangeService,
    private settingsService: SiteSettingsService,
    private storage: LocalStorageService
  ) {}

  ngOnInit() {
    const candidateId = this.userService.user.data.contact.candidate_contact;

    this.data$ = this.dateParams$.pipe(
      switchMap((params: DateParams) =>
        this.widgetService.getCounterWidgetData(candidateId, params).pipe(
          tap(() => this.loading.next(false)),
          map((data) => {
            const { currency, activities } = data;

            return {
              currency,
              activities: activities.map((activity) =>
                this.translateActivity(activity)
              )
            };
          })
        )
      )
    );

    this.controlSubscription = this.dateRangeTypeControl.valueChanges
      .pipe(debounceTime(400))
      .subscribe((value) => {
        this.loading.next(true);
        this.changeDateRange(value);
      });
  }

  ngOnDestroy() {
    this.controlSubscription.unsubscribe();
  }

  changeDateRange(type: DateRange) {
    if (type === DateRange.Custom) {
      // TODO: add cutom range
      return;
    }

    this.dateParams$.next(
      this.getDateParams(this.dateRangeService.getDatesByRange(type))
    );
  }

  isRange(type: DateRange) {
    this.dateRangeTypeControl.value === type;
  }

  getLabel(type: DateRange): Label {
    return dateRangeLabel[type];
  }

  private getDateParams(config: { from: string; to: string }): DateParams {
    return {
      started_at_0: config.from,
      started_at_1: config.to
    };
  }

  private translateActivity(activity: { label: string; translations: any[] }) {
    const { label, translations } = activity;
    const { country_code } = this.settingsService.settings;
    const lang = this.storage.retrieve('lang');

    const trans = checkAndReturnTranslation(
      { __str__: label, translations },
      country_code,
      lang
    );

    return {
      ...activity,
      label: trans
    };
  }
}
