import { DateRangeService } from './date-range.service';
import { DatepickerService } from './datepicker.service';
import { TimeService } from './time.service';

export * from './date-range.service';
export * from './datepicker.service';
export * from './time.service';

export const services = [
  DateRangeService,
  DatepickerService,
  TimeService
];
