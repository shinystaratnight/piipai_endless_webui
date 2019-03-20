import { FilterModel } from './filter.model';

import * as moment from 'moment-timezone';

const todayDate = moment().tz('Australia/Sydney');

export const todayFormatDate = todayDate.format();
export const yesterdayFormatDate = todayDate
  .clone()
  .add(-1, 'day')
  .format();
export const tomorrowFormatDate = todayDate
  .clone()
  .add(1, 'day')
  .format();


export interface DateFilterOptions {
  key: string;
  label: string;
  yesterday?: boolean;
  today?: boolean;
  tomorrow?: boolean;
}

export const Date = 'date';

export class DateFilter implements FilterModel {
  public type = Date;

  public key: string;
  public label: string;
  public list: { label: string, query: string }[];
  public input: { label: string, query: string }[];

  constructor(options: DateFilterOptions) {
    const { key, label, yesterday = false, today = false, tomorrow = false } = options;

    this.key = key;
    this.label = label;
    this.input = [
      {
        label: 'From',
        query: `${key}_0`
      },
      {
        label: 'To',
        query: `${key}_1`
      }
    ];

    this.list = [];
    if (yesterday) {
      this.list.push({
        label: 'Yesterday',
        query: `${key}_0=${yesterdayFormatDate}&${key}_1=${yesterdayFormatDate}`
      });
    }

    if (today) {
      this.list.push({
        label: 'Today',
        query: `${key}_0=${todayFormatDate}&${key}_1=${todayFormatDate}`
      });
    }

    if (tomorrow) {
      this.list.push({
        label: 'Tomorrow',
        query: `${key}_0=${tomorrowFormatDate}&${key}_1=${tomorrowFormatDate}`
      });
    }
  }
}