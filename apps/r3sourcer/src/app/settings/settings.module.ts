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

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DynamicFormModule } from '@webui/dynamic-form';
import { SettingsService } from './settings.service';

import { MyobResolver } from './myob/myob.resolver';

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    NgbModule,
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    InfiniteScrollModule,
    DynamicFormModule,
    MasterGuideModule,
    QuillModule.forRoot(),
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
