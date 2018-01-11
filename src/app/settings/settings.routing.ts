import { Routes } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { CompanyComponent } from './company/company.component';
import { MyobComponent } from './myob/myob.component';

import { MyobResolver } from './myob/myob.resolver';

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
        component: MyobComponent,
        resolve: {
          myobSettings: MyobResolver
        }
      }
    ]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];
