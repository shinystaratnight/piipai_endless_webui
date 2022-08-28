import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

import { routes } from './settings.routing';
import { SettingsComponent } from './settings.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { CompanyComponent } from './company/company.component';
import { PermissionsService } from './permissions/permissions.service';
import { MyobComponent } from './myob/myob.component';

import { SharedModule } from '@webui/shared';
import { MasterGuideModule } from '../master-guide/master-guide.module';

import { NgbCollapseModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SettingsService } from './settings.service';

import { MyobResolver } from './myob/myob.resolver';
import { SharedModule as Shared } from '../shared/shared.module';
import { DynamicFormModule } from '@webui/dynamic-form';
import { Metadata } from './metadata.config';
import { UiModule } from '@webui/ui';

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    NgbNavModule,
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    InfiniteScrollModule,
    MasterGuideModule,
    QuillModule.forRoot(),
    Shared,
    DynamicFormModule.forChild({ metadata: Metadata }),
    UiModule,
    NgbCollapseModule
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
