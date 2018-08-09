import moment from 'moment-timezone';

const today = moment().tz('Australia/Sydney');

export const todayFormatDate = today.format();
export const yesterdayFormatDate = today.clone().add(-1, 'day').format();
export const tomorrowFormatDate = today.clone().add(1, 'day').format();
