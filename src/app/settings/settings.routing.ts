import { Routes } from '@angular/router';

import { PermissionsComponent } from './permissions/permissions.component';
import { SettingsComponent } from './settings.component';

export const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'permissions',
        component: PermissionsComponent,
      },
      {
        path: 'permissions/:id',
        component: PermissionsComponent
      }
    ]
  }
];
