import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home';
import { NoContentComponent } from './pages/no-content';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'crm',   loadChildren: './+crm#CrmModule'},
  { path: 'extranet',   loadChildren: './+extranet#ExtranetModule'},
  { path: '**',    component: NoContentComponent },
];
