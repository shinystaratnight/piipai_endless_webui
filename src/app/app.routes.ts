import { Routes } from '@angular/router';

import {
  SiteComponent,
  LoginFormComponent,
  VerifyEmailComponent,
  RegistrationFormComponent
} from './components';
import { RedirectComponent } from './redirect.component';

import { UserService, NavigationService, SiteSettingsService } from './services';

import { AuthGuard, NotAuthorizedGuard, SubdomainGuard, PermissionGuard, LogoutGuard } from './guards';

export const ROUTES: Routes = [
  {
    path: 'contacts/verify_email/',
    component: VerifyEmailComponent
  },
  {
    path: 'login',
    component: LoginFormComponent,
    canActivate: [NotAuthorizedGuard],
    resolve: {
      settings: SiteSettingsService
    }
  },
  {
    path: 'login/:token',
    component: LoginFormComponent,
    canActivate: [LogoutGuard, NotAuthorizedGuard]
  },
  {
    path: 'registration',
    component: RegistrationFormComponent,
    canActivate: [NotAuthorizedGuard, SubdomainGuard],
    resolve: {
      settings: SiteSettingsService
    }
  },
  {
    path: 'settings',
    loadChildren: './settings/settings.module#SettingsModule',
    resolve: {
      user: UserService,
      pagesList: NavigationService,
      settings: SiteSettingsService
    },
    canActivate: [AuthGuard, PermissionGuard]
  },
  {
    path: 'billing',
    loadChildren: './billing/billing.module#BillingModule',
    resolve: {
      user: UserService,
      pagesList: NavigationService
    },
    canActivate: [AuthGuard, PermissionGuard]
  },
  {
    path: 'myob/oauth2_redirect_uri',
    component: RedirectComponent
  },
  {
    path: '**',
    component: SiteComponent,
    canActivate: [AuthGuard, PermissionGuard],
    resolve: {
      settings: SiteSettingsService
    }
  }
];
