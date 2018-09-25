import { Routes } from '@angular/router';

import {
  SiteComponent,
  LoginFormComponent,
  VerifyEmailComponent,
  RegistrationFormComponent
} from './components';
import { RedirectComponent } from './redirect.component';

import { UserService, NavigationService, SiteSettingsService } from './services';

import { AuthGuard, NotAuthorizedGuard, SubdomainGuard } from './guards';

export const ROUTES: Routes = [
  {
    path: 'core/contacts/:id/verify_email',
    component: VerifyEmailComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/'
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
    canActivate: [NotAuthorizedGuard]
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
    canActivate: [AuthGuard]
  },
  {
    path: 'billing',
    loadChildren: './billing/billing.module#BillingModule',
    resolve: {
      user: UserService,
      pagesList: NavigationService
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'myob/oauth2_redirect_uri',
    component: RedirectComponent
  },
  {
    path: '**',
    component: SiteComponent,
    canActivate: [AuthGuard],
    resolve: {
      settings: SiteSettingsService
    }
  }
];
