import { Routes } from '@angular/router';

import { SiteComponent } from './components';

import { SiteSettingsService, PermissionGuard } from '@webui/core';

import { AuthGuard } from '@webui/core';
import { ConsentComponent } from './components/consent/consent.component';

export const routes: Routes = [
  {
    path: 'candidate/candidatecontacts/consent',
    component: ConsentComponent,
    canActivate: [AuthGuard, PermissionGuard],
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
