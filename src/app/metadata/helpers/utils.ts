import { TimeService } from '../../shared/services/time.service';

const today = TimeService.instance();

export const todayFormatDate = today.format();
export const yesterdayFormatDate = today
  .clone()
  .add(-1, 'day')
  .format();
export const tomorrowFormatDate = today
  .clone()
  .add(1, 'day')
  .format();
export const timeZoneOffset = today
  .format('Z')
  .slice(1);
export const weekStart = today
  .startOf('isoWeek')
  .format();
export const weekEnd = today
  .endOf('isoWeek')
  .format();
export const monthStart = today
  .startOf('month')
  .format();
export const monthEnd = today
  .endOf('month')
  .format();

export enum Colors {
  Success = 'success',
  Warning = 'warning',
  Danger = 'danger'
}
