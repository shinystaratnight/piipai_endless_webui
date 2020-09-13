import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule as OldSharedModule } from '@webui/shared';
import { DynamicFormModule } from '@webui/dynamic-form';
import { MasterGuideModule } from '../master-guide/master-guide.module';

import { BillingComponent } from './billing.component';
import { components } from './components';

import { services } from './services';

import { routes } from './billing.routing';
import { Metadata } from './metadata.config';
import { SharedModule } from '../shared/shared.module';
import { UiModule } from '@webui/ui';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,

    FontAwesomeModule,
    NgbModule,

    OldSharedModule,
    DynamicFormModule.forChild({ metadata: Metadata }),
    MasterGuideModule,
    SharedModule,
    UiModule
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
