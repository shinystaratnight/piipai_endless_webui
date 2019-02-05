export enum DateRange { Year = 'year', Month = 'month', Week = 'week', Day = 'day' }

export const filterDateFormat = 'YYYY-MM-DD';

export const weekStart = 0;
export const weekEnd = 6;

export const rangeFormats = {
  [DateRange.Year]: 'YYYY',
  [DateRange.Month]: 'MMMM YYYY',
  [DateRange.Week]: 'MMM D',
  [DateRange.Day]: 'D MMMM YYYY',
};
