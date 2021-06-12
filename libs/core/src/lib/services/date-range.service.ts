import { Injectable } from '@angular/core';
import { Moment } from 'moment-timezone';
import { DateService, FormatApi } from './date.service';

export enum DateRange {
  Today,
  ThisWeek,
  ThisMonth,
  LastMonth,
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
  [DateRange.Custom]: { key: 'custom', value: 'Custom' },
  [DateRange.LastMonth]: { key: 'last_month', value: 'Last Month' }
};

const mapRangeDateToMoment = {
  [DateRange.Today]: DateRangeMoment.Day,
  [DateRange.ThisWeek]: DateRangeMoment.Week,
  [DateRange.ThisMonth]: DateRangeMoment.Month,
  [DateRange.ThisYear]: DateRangeMoment.Year,
  [DateRange.LastMonth]: DateRangeMoment.Month
};

const mapRangeDateOffset = {
  [DateRange.LastMonth]: -1
};

@Injectable({
  providedIn: 'root'
})
export class DateRangeService {
  constructor(private dateService: DateService) {}

  getDatesByRange(type: DateRange): Range {
    const rangeInstance = this.getRangeInstance(
      mapRangeDateToMoment[type],
      mapRangeDateOffset[type]
    );

    return this.formatDates(rangeInstance, FormatApi.Date);
  }

  private getTodayInstance(): Moment {
    return this.dateService.instance().clone();
  }

  private getRangeInstance(
    type: DateRangeMoment,
    offset = 0
  ): { from: Moment; to: Moment } {
    return {
      from: this.getTodayInstance().add(offset, type).startOf(type),
      to: this.getTodayInstance().add(offset, type).endOf(type)
    };
  }

  private formatDates(
    range: { from: Moment; to: Moment },
    format: FormatApi
  ): Range {
    return {
      from: this.dateService.format(range.from, format),
      to: this.dateService.format(range.to, format)
    };
  }
}
