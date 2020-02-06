import { Routes } from '@angular/router';

import {
  // SiteComponent,
  VerifyEmailComponent
} from './components';
import { RedirectComponent } from './redirect.component';

// import { UserService, NavigationService, SiteSettingsService } from '@webui/core';

import {
  AuthGuard,
  NotAuthorizedGuard,
  SubdomainGuard,
  PermissionGuard,
  // LogoutGuard,
  UserService,
  NavigationService,
  SiteSettingsService,
  ClientGuard,
  CandidateGuard,
  ManagerGuard
} from '@webui/core';

export const routes: Routes = [
  {
    path: 'myob/oauth2_redirect_uri',
    component: RedirectComponent
  },
  {
    path: 'contacts/verify_email',
    component: VerifyEmailComponent
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule',
    canActivate: [NotAuthorizedGuard]
  },
  {
    path: 'registration',
    loadChildren: './register/register.module#RegisterModule',
    canActivate: [NotAuthorizedGuard, SubdomainGuard]
  },
  {
    path: 'settings',
    loadChildren: './settings/settings.module#SettingsModule',
    resolve: {
      user: UserService,
      pagesList: NavigationService,
      settings: SiteSettingsService
    },
    canActivate: [AuthGuard, PermissionGuard, ManagerGuard]
  },
  {
    path: 'billing',
    loadChildren: './billing/billing.module#BillingModule',
    resolve: {
      user: UserService,
      pagesList: NavigationService
    },
    canActivate: [AuthGuard, PermissionGuard, ManagerGuard]
  },
  {
    path: 'cl',
    loadChildren: './client/client.module#ClientModule',
    canLoad: [AuthGuard, ClientGuard],
    canActivate: [AuthGuard, ClientGuard]
  },
  {
    path: 'cd',
    loadChildren: './candidate/candidate.module#CandidateModule',
    canLoad: [AuthGuard, CandidateGuard],
    canActivate: [AuthGuard, CandidateGuard]
  },
  {
    path: 'mn',
    loadChildren: './manager/manager.module#ManagerModule',
    canLoad: [AuthGuard, ManagerGuard],
    canActivate: [AuthGuard, ManagerGuard]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'mn'
  }
];
