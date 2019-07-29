import { Routes } from '@angular/router';

import {
  SiteComponent,
} from './components';
import { RedirectComponent } from './redirect.component';

import { SiteSettingsService } from '@webui/core';

import { AuthGuard, PermissionGuard } from '@webui/core';

export const ROUTES: Routes = [
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
