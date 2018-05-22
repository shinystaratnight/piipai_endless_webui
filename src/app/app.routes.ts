import { Routes } from '@angular/router';

import {
  SiteComponent,
  LoginFormComponent,
  ContactRegistrationFormComponent
} from './components';

import { UserService, NavigationService, SettingsService } from './services';

import { AuthGuard, NotAuthorizedGuard } from './guards';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
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
      settings: SettingsService
    }
  },
  {
    path: 'login/:token',
    component: LoginFormComponent,
    canActivate: [NotAuthorizedGuard]
  },
  // {
  //   path: 'registration',
  //   component: ContactRegistrationFormComponent,
  //   canActivate: [NotAuthorizedGuard]
  // },
  {
    path: 'registration/password',
    component: ContactRegistrationFormComponent,
    canActivate: [AuthGuard],
    resolve: {
      settings: SettingsService
    }
  },
  {
    path: 'settings',
    loadChildren: './settings/settings.module#SettingsModule',
    resolve: {
      user: UserService,
      pagesList: NavigationService,
      settings: SettingsService
    },
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: SiteComponent,
    canActivate: [AuthGuard],
    resolve: {
      settings: SettingsService
    }
  }
];
