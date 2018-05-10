import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { SharedModule } from '../shared/shared.module';

import { BillingComponent } from './billing.component';
import { components } from './components';

import { services } from './services';

import { routes } from './billing.routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpModule,

    SharedModule
  ],
  declarations: [
    BillingComponent,
    ...components
  ],
  providers: [
    ...services
  ]
})
export class BillingModule { }
