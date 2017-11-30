import { Routes } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { CompanyComponent } from './company/company.component';
import { MyobComponent } from './myob/myob.component';

export const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: '',
        redirectTo: 'permissions',
        pathMatch: 'full'
      },
      {
        path: 'permissions',
        component: PermissionsComponent
      },
      {
        path: 'company',
        component: CompanyComponent
      },
      {
        path: 'myob',
        component: MyobComponent
      }
    ]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];
