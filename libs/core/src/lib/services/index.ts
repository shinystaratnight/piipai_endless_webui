import { NavigationService } from './navigation.service';
import { UserService } from './user.service';
import { SiteService } from './site.service';
import { SiteSettingsService } from './site-settings.service';
import { VerifyService } from './verify.service';
import { AuthService } from './auth.service';
import { CompanyPurposeService } from './company-purpose.service';
import { CheckPermissionService } from './check-permission.service';
import { ErrorsService } from './errors.service';
import { ToastService } from './toast.service';
import { EventService } from './event.service';

export * from './navigation.service';
export * from './user.service';
export * from './site.service';
export * from './site-settings.service';
export * from './verify.service';
export * from './auth.service';
export * from './company-purpose.service';
export * from './check-permission.service';
export * from './errors.service';
export * from './toast.service';
export * from './env.service';
export * from './event.service';

export const services = [
  NavigationService,
  UserService,
  SiteService,
  SiteSettingsService,
  VerifyService,
  AuthService,
  CompanyPurposeService,
  CheckPermissionService,
  ErrorsService,
  ToastService,
  EventService
];
