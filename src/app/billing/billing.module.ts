import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BillingComponent } from './billing.component';
import { components } from './components';

import { routes } from './billing.routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    BillingComponent,
    ...components
  ],
  providers: []
})
export class BillingModule { }
