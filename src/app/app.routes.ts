import { Routes } from '@angular/router';

import {
  SiteComponent,
  LoginFormComponent,
  ContactRegistrationFormComponent,
  VerifyEmailComponent,
} from './components';

import { UserService, NavigationService, SiteSettingsService } from './services';

import { AuthGuard, NotAuthorizedGuard } from './guards';

import { DataResolver } from './app.resolver';

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
    component: ContactRegistrationFormComponent,
    canActivate: [AuthGuard],
    resolve: {
      settings: SiteSettingsService
    }
  },
  {
    path: 'registration/password',
    component: ContactRegistrationFormComponent,
    canActivate: [AuthGuard],
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
    path: '**',
    component: SiteComponent,
    canActivate: [AuthGuard],
    resolve: {
      settings: SiteSettingsService
    }
  }
];
