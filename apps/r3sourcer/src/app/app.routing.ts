import { Routes } from '@angular/router';

import {
  VerifyEmailComponent,
  RedirectComponent,
  LoginAsComponent,
} from './components';

import {
  AuthGuard,
  NotAuthorizedGuard,
  SubdomainGuard,
  PermissionGuard,
  UserService,
  NavigationService,
  ClientGuard,
  CandidateGuard,
  ManagerGuard,
} from '@webui/core';

export const routes: Routes = [
  {
    path: 'myob/oauth2_redirect_uri',
    component: RedirectComponent,
  },
  {
    path: 'contacts/verify_email',
    component: VerifyEmailComponent,
  },
  {
    path: 'login-as/:id',
    component: LoginAsComponent,
    canActivate: [NotAuthorizedGuard],
  },
  {
    path: 'login/:token',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
    canActivate: [NotAuthorizedGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
    canActivate: [NotAuthorizedGuard],
  },
  {
    path: 'registration',
    loadChildren: () =>
      import('./register/register.module').then((m) => m.RegisterModule),
    canActivate: [NotAuthorizedGuard, SubdomainGuard],
  },
  {
    path: 'billing',
    loadChildren: () =>
      import('./billing/billing.module').then((m) => m.BillingModule),
    resolve: {
      user: UserService,
      pagesList: NavigationService,
    },
    canActivate: [AuthGuard, PermissionGuard, ManagerGuard],
  },
  {
    path: 'cl',
    loadChildren: () =>
      import('./client/client.module').then((m) => m.ClientModule),
    canLoad: [AuthGuard, ClientGuard],
    canActivate: [AuthGuard, ClientGuard],
  },
  {
    path: 'cd',
    loadChildren: () =>
      import('./candidate/candidate.module').then((m) => m.CandidateModule),
    canLoad: [AuthGuard, CandidateGuard],
    canActivate: [AuthGuard, CandidateGuard],
  },
  {
    path: 'mn',
    loadChildren: () =>
      import('./manager/manager.module').then((m) => m.ManagerModule),
    canLoad: [AuthGuard, ManagerGuard],
    canActivate: [AuthGuard, ManagerGuard],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'login',
  },
];
