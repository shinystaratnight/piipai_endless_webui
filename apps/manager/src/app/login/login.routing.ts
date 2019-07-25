import { Routes } from '@angular/router';

import { LoginComponent } from './login.component';
import { SiteSettingsService } from '@webui/core';
import { LogoutGuard } from '../guards';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    resolve: {
      settings: SiteSettingsService
    }
  },
  {
    path: ':token',
    component: LoginComponent,
    canActivate: [LogoutGuard]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];
