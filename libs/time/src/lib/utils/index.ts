import { Time } from '@webui/time';

export const getYesterday = () => {
  return Time.now().add(-1, 'day');
};

export const getTomorrow = () => {
  return Time.now().add(1, 'day');
};
