import { Routes } from '@angular/router';

import { SiteComponent } from './components';

import { SiteSettingsService, PermissionGuard } from '@webui/core';

import { AuthGuard } from '@webui/core';

export const routes: Routes = [
  {
    path: '**',
    component: SiteComponent,
    canActivate: [AuthGuard, PermissionGuard],
    resolve: {
      settings: SiteSettingsService
    }
  }
];
