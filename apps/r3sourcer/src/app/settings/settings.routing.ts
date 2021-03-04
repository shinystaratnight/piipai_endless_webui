import { Routes } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { CompanyComponent } from './company/company.component';
import { MyobComponent } from './myob/myob.component';

import { MyobResolver } from './myob/myob.resolver';
import { AuthGuard, ManagerGuard, NavigationService, PermissionGuard, SiteSettingsService, UserService } from '@webui/core';

export const routes: Routes = [
  {
    path: 'settings',
    component: SettingsComponent,
    resolve: {
      user: UserService,
      pagesList: NavigationService,
      settings: SiteSettingsService,
    },
    canActivate: [AuthGuard, PermissionGuard, ManagerGuard],
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
  // {
  //   path: '**',
  //   pathMatch: 'full',
  //   redirectTo: ''
  // }
];
