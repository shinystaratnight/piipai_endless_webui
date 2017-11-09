import { Routes } from '@angular/router';

import { PermissionsComponent } from './permissions/permissions.component';
import { CompanyComponent } from './company/company.component';
import { SettingsComponent } from './settings.component';

export const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'company',
        component: CompanyComponent
      },
      {
        path: 'permissions',
        component: PermissionsComponent,
      }
    ]
  }
];
