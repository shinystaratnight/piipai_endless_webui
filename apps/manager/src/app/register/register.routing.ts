import { Routes } from '@angular/router';

import { RegisterComponent } from './register.component';
import { SiteSettingsService } from '@webui/core';

export const routes: Routes = [
  {
    path: '',
    component: RegisterComponent,
    resolve: {
      settings: SiteSettingsService
    }
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];
