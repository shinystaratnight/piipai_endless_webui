export enum DateRange { Year = 'year', Month = 'month', Week = 'week', Day = 'day' }

export const rangeFormats = {
  [DateRange.Year]: 'YYYY',
  [DateRange.Month]: 'MMMM YYYY',
  [DateRange.Week]: 'MMM D',
  [DateRange.Day]: 'D MMMM YYYY',
};
