import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { routes } from './settings.routing';
import { SettingsComponent } from './settings.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { PermissionsService } from './permissions/permissions.service';

import { SharedModule } from '../shared/shared.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    NgbModule.forRoot(),
    CommonModule,
    FormsModule,
    Angular2FontawesomeModule,
    InfiniteScrollModule
  ],
  declarations: [PermissionsComponent, SettingsComponent],
  providers: [PermissionsService]
})
export class SettingsModule { }
