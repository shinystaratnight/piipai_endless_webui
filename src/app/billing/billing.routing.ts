import { Routes } from '@angular/router';

import { BillingComponent } from './billing.component';
import { SubscriptionResolver } from './services/subscription.resolver';

export const routes: Routes = [
  {
    path: '',
    component: BillingComponent,
    resolve: {
      subscription: SubscriptionResolver
    }
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];
