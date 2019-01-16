import { NavigationService } from './navigation.service';
import { UserService } from './user.service';
import { SiteService } from './site.service';
import { SiteSettingsService } from './site-settings.service';
import { VerifyService } from './verify.service';
import { AuthService } from './auth.service';
import { TimeService } from './time.service';

export * from './navigation.service';
export * from './user.service';
export * from './site.service';
export * from './site-settings.service';
export * from './verify.service';
export * from './auth.service';

export const services = [
  NavigationService,
  UserService,
  SiteService,
  SiteSettingsService,
  VerifyService,
  AuthService,
  TimeService,
];
