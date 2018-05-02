import { Routes } from '@angular/router';

import { BillingComponent } from './billing.component';

export const routes: Routes = [
  {
    path: '',
    component: BillingComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];
