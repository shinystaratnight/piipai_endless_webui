import { Routes } from '@angular/router';

import { BillingComponent } from './billing.component';
import { SubscriptionResolver } from './services/subscription.resolver';
import { SiteSettingsService } from '@webui/core';

export const routes: Routes = [
  {
    path: '',
    component: BillingComponent,
    resolve: {
      subscriptions: SubscriptionResolver,
      settings: SiteSettingsService
    }
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];
