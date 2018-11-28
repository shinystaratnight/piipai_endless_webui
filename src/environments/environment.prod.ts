import { environmentShared } from './environment.shared';

export const environment = {
  ...environmentShared,
  production: true,
  api: 'http://api.r3sourcer.com',
};
