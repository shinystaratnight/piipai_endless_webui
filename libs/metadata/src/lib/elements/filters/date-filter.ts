import { FilterModel } from './filter.model';
import { getYesterday, getToday, getTommorrow } from '@webui/utilities';

// import * as moment from 'moment-timezone';

// const todayDate = moment().tz('Australia/Sydney');

// export const todayFormatDate = todayDate.format();
// export const yesterdayFormatDate = todayDate
//   .clone()
//   .add(-1, 'day')
//   .format();
// export const tomorrowFormatDate = todayDate
//   .clone()
//   .add(1, 'day')
//   .format();

export interface DateFilterOptions {
  key: string;
  label: string;
  yesterday?: boolean;
  today?: boolean;
  tomorrow?: boolean;
}

export enum DateTypes {
  Yesterday,
  Today,
  Tomorrow
}

export const Date = 'date';

export class DateFilter implements FilterModel {
  public type = Date;

  public key: string;
  public label: string;
  public list: { label: string; query: DateTypes }[];
  public input: { label: string; query: string }[];

  constructor(options: DateFilterOptions) {
    const {
      key,
      label,
      yesterday = false,
      today = false,
      tomorrow = false
    } = options;

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
      this.list.push({ label: 'Yesterday', query: DateTypes.Yesterday });
    }

    if (today) {
      this.list.push({
        label: 'Today',
        query: DateTypes.Today
      });
    }

    if (tomorrow) {
      this.list.push({
        label: 'Tomorrow',
        query: DateTypes.Tomorrow
      });
    }
  }

  static getQuery = (key: string, type: DateTypes) => {
    switch (type) {
      case DateTypes.Yesterday:
        return `${key}_0=${getYesterday()}&${key}_1=${getYesterday()}`;

      case DateTypes.Today:
        return `${key}_0=${getToday().format()}&${key}_1=${getToday().format()}`;

      case DateTypes.Tomorrow:
        return `${key}_0=${getTommorrow()}&${key}_1=${getTommorrow()}`;
    }
  };
}
