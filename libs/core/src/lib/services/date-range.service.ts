import { Injectable } from '@angular/core';
import { Moment } from 'moment-timezone';
import { DateService, FormatApi } from './date.service';

export enum DateRange {
  Today,
  ThisWeek,
  ThisMonth,
  ThisYear,
  Custom
}

enum DateRangeMoment {
  Year = 'year',
  Month = 'month',
  Week = 'week',
  Day = 'day'
}

export type Range = {
  from: string;
  to: string;
};

export type Label = {
  key: string;
  value: string;
};

type LabelMap = {
  [key in DateRange]: Label;
};

export const dateRangeLabel: LabelMap = {
  [DateRange.Today]: { key: 'today', value: 'Today' },
  [DateRange.ThisWeek]: { key: 'this_week', value: 'This Week' },
  [DateRange.ThisMonth]: { key: 'this_month', value: 'This Month' },
  [DateRange.ThisYear]: { key: 'this_year', value: 'This Year' },
  [DateRange.Custom]: { key: 'custom', value: 'Custom' }
};

const mapRangeDateToMoment = {
  [DateRange.Today]: DateRangeMoment.Day,
  [DateRange.ThisWeek]: DateRangeMoment.Week,
  [DateRange.ThisMonth]: DateRangeMoment.Month,
  [DateRange.ThisYear]: DateRangeMoment.Year,
}

@Injectable({
  providedIn: 'root'
})
export class DateRangeService {
  constructor(private dateService: DateService) {}

  getDatesByRange(type: DateRange): Range {
    const rangeInstance = this.getRangeInstance(mapRangeDateToMoment[type]);

    return this.formatDates(rangeInstance, FormatApi.Date);
  }

  private getTodayInstance(): Moment {
    return this.dateService.instance().clone();
  }

  private getRangeInstance(type: DateRangeMoment): { from: Moment, to: Moment } {
    return {
      from: this.getTodayInstance().startOf(type),
      to: this.getTodayInstance().endOf(type)
    }
  }

  private formatDates(range: { from: Moment, to: Moment }, format: FormatApi): Range {
    return {
      from: this.dateService.format(range.from, format),
      to: this.dateService.format(range.to, format)
    }
  }
}
