import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { routes } from './settings.routing';
import { SettingsComponent } from './settings.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { CompanyComponent } from './company/company.component';
import { PermissionsService } from './permissions/permissions.service';
import { MyobComponent } from './myob/myob.component';

import { SharedModule } from '../shared/shared.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { DynamicFormModule } from '../dynamic-form/dynamic-form.module';
import { SettingsService } from './settings.service';

import { MyobResolver } from './myob/myob.resolver';

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    NgbModule.forRoot(),
    CommonModule,
    FormsModule,
    Angular2FontawesomeModule,
    InfiniteScrollModule,
    DynamicFormModule
  ],
  declarations: [
    PermissionsComponent,
    SettingsComponent,
    CompanyComponent,
    MyobComponent
  ],
  providers: [
    PermissionsService,
    SettingsService,
    MyobResolver
  ]
})
export class SettingsModule { }
