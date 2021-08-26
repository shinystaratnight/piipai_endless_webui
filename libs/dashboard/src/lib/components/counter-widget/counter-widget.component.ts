import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
    DateRange.LastMonth,
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
  rangeForm: FormGroup;
  hasForm$: BehaviorSubject<boolean> = new BehaviorSubject(false);
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
    private storage: LocalStorageService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    const candidateId = this.userService.user.data.contact.candidate_contact;

    this.data$ = this.dateParams$.pipe(
      switchMap((params: DateParams) =>
        this.widgetService.getCounterWidgetData(candidateId, params).pipe(
          tap(() => this.loading.next(false)),
          map((data) => {
            const { activities } = data;

            return {
              ...data,
              activities: activities.map((activity) =>
                this.translateActivity(activity)
              )
            };
          })
        )
      )
    );

    this.rangeForm = this.fb.group(
      this.dateRangeService.getFormDatesByRange(DateRange.ThisMonth)
    );
    this.controlSubscription = this.dateRangeTypeControl.valueChanges
      .pipe(debounceTime(400))
      .subscribe((value) => {
        this.changeDateRange(value);
      });
  }

  ngOnDestroy() {
    this.controlSubscription.unsubscribe();
  }

  changeDateRange(type: DateRange) {
    if (type === DateRange.Custom) {
      this.hasForm$.next(true);
      return;
    }

    this.hasForm$.next(false);
    this.loading.next(true);
    this.rangeForm.patchValue(this.dateRangeService.getFormDatesByRange(type));

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

  onRangeFormSubmit() {
    const formValue = this.rangeForm.value;

    this.loading.next(true);
    this.dateParams$.next(
      this.getDateParams(this.dateRangeService.parseRange(formValue))
    );
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
