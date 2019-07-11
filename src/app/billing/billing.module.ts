import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../shared/shared.module';
import { DynamicFormModule } from '../dynamic-form/dynamic-form.module';
import { MasterGuideModule } from '../master-guide/master-guide.module';

import { BillingComponent } from './billing.component';
import { components } from './components';

import { services } from './services';

import { routes } from './billing.routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,

    Angular2FontawesomeModule,
    NgbModule,

    SharedModule,
    DynamicFormModule,
    MasterGuideModule
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
